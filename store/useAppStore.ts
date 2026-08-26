// store/useAppStore.ts
// Single source of client state. Holds the current citizen's working copy of
// their data — populated from lib/mockApi.ts on login, mutated locally by
// actions like payChallan/disputeChallan, and wiped by resetDemo.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import {
  getCitizen,
  getVehiclesFor,
  getWalletFor,
  getChallansFor,
  getApplicationsFor,
  getPendingVerificationsForCitizen,
  getRemindersForCitizen,
} from "@/lib/mockApi";
import {
  MOCK_TODAY,
  type Application,
  type ApplicationStatus,
  type Challan,
  type ChallanStatus,
  type Lang,
  type PendingVerification,
  type Reminder,
  type TaskPlan,
  type Vehicle,
  type WalletDocument,
} from "@/lib/mockData";
import { addDaysToToday, formatINR } from "@/lib/utils";

const DELAY_QUERY_REPLY_DAYS = 4;

export interface DisputePayload {
  reason: string;
  statement: string;
  evidenceDocId?: string;
}

const DISPUTE_RESOLUTION_MS = 8000;

/** Kept outside persisted state — setTimeout handles are not serializable. */
const disputeTimers = new Map<string, ReturnType<typeof setTimeout>>();

function clearDisputeTimers() {
  disputeTimers.forEach((timer) => clearTimeout(timer));
  disputeTimers.clear();
}

interface Session {
  citizenId: string | null;
  lang: Lang;
}

interface AppData {
  session: Session;
  wallet: WalletDocument[];
  vehicles: Vehicle[];
  challans: Challan[];
  applications: Application[];
  plans: TaskPlan[];
  pendingVerifications: PendingVerification[];
  reminders: Reminder[];
}

interface AppActions {
  login: (citizenId: string) => Promise<void>;
  logout: () => void;
  setLang: (lang: Lang) => void;
  addDocument: (doc: WalletDocument) => void;
  resolveIntent: (plan: TaskPlan) => void;
  startApplication: (application: Application) => void;
  /** Filing with every blocking doc but gaps left over marks the application SUBMITTED_PARTIAL and records what's still owed. */
  submitApplication: (applicationId: string, pendingDocs?: PendingVerification[]) => void;
  resolvePendingVerification: (applicationId: string, pendingVerificationId: string, doc: WalletDocument) => void;
  toggleReminderMute: (reminderId: string) => void;
  raiseDelayQuery: (applicationId: string) => void;
  payChallan: (challanId: string) => void;
  disputeChallan: (challanId: string, payload: DisputePayload) => void;
  resetDemo: () => void;
}

type AppState = AppData & AppActions;

const seedState: AppData = {
  session: { citizenId: null, lang: "en" },
  wallet: [],
  vehicles: [],
  challans: [],
  applications: [],
  plans: [],
  pendingVerifications: [],
  reminders: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...seedState,

      login: async (citizenId) => {
        const citizen = await getCitizen(citizenId);
        const [vehicles, wallet, challans, applications, pendingVerifications, reminders] = await Promise.all([
          getVehiclesFor(citizenId),
          getWalletFor(citizenId),
          getChallansFor(citizenId),
          getApplicationsFor(citizenId),
          getPendingVerificationsForCitizen(citizenId),
          getRemindersForCitizen(citizenId),
        ]);
        set({
          session: { citizenId, lang: citizen?.preferredLang ?? get().session.lang },
          vehicles,
          wallet,
          challans,
          applications,
          plans: [],
          pendingVerifications,
          reminders,
        });
      },

      logout: () => {
        clearDisputeTimers();
        set({ ...seedState, session: { citizenId: null, lang: get().session.lang } });
      },

      setLang: (lang) => set((state) => ({ session: { ...state.session, lang } })),

      addDocument: (doc) =>
        set((state) => ({
          wallet: [...state.wallet.filter((existing) => existing.id !== doc.id), doc],
        })),

      resolveIntent: (plan) =>
        set((state) => ({
          plans: [...state.plans.filter((existing) => existing.id !== plan.id), plan],
        })),

      startApplication: (application) =>
        set((state) => ({
          applications: [
            ...state.applications.filter((existing) => existing.id !== application.id),
            application,
          ],
        })),

      submitApplication: (applicationId, pendingDocs) =>
        set((state) => ({
          applications: state.applications.map((application) =>
            application.id === applicationId
              ? {
                  ...application,
                  status: (pendingDocs && pendingDocs.length > 0
                    ? "SUBMITTED_PARTIAL"
                    : "SUBMITTED") satisfies ApplicationStatus,
                  submittedOn: MOCK_TODAY.slice(0, 10),
                  timeline: [
                    ...application.timeline,
                    {
                      id: `ev_${applicationId}_submit_${application.timeline.length}`,
                      at: MOCK_TODAY,
                      title: "You submitted this application",
                      detail:
                        pendingDocs && pendingDocs.length > 0
                          ? `Filed with the legal minimum. ${pendingDocs.length} document${pendingDocs.length === 1 ? "" : "s"} still owed.`
                          : undefined,
                      actor: "CITIZEN" as const,
                    },
                  ],
                }
              : application
          ),
          pendingVerifications: [
            ...state.pendingVerifications.filter((p) => p.applicationId !== applicationId),
            ...(pendingDocs ?? []),
          ],
        })),

      resolvePendingVerification: (applicationId, pendingVerificationId, doc) =>
        set((state) => {
          const remaining = state.pendingVerifications.filter(
            (p) => !(p.applicationId === applicationId && p.id === pendingVerificationId)
          );
          const resolved = state.pendingVerifications.find((p) => p.id === pendingVerificationId);
          const stillPending = remaining.some((p) => p.applicationId === applicationId);

          return {
            wallet: [...state.wallet.filter((existing) => existing.id !== doc.id), doc],
            pendingVerifications: remaining,
            applications: state.applications.map((application) => {
              if (application.id !== applicationId) return application;
              const clearsPartialStatus = !stillPending && application.status === "SUBMITTED_PARTIAL";
              return {
                ...application,
                status: (clearsPartialStatus ? "SUBMITTED" : application.status) satisfies ApplicationStatus,
                blocker: clearsPartialStatus ? undefined : application.blocker,
                timeline: [
                  ...application.timeline,
                  {
                    id: `ev_${applicationId}_doc_${application.timeline.length}`,
                    at: MOCK_TODAY,
                    title: `You added ${resolved?.label ?? doc.title}`,
                    actor: "CITIZEN" as const,
                  },
                ],
              };
            }),
          };
        }),

      toggleReminderMute: (reminderId) =>
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === reminderId ? { ...reminder, muted: !reminder.muted } : reminder
          ),
        })),

      raiseDelayQuery: (applicationId) => {
        const expectedReply = addDaysToToday(DELAY_QUERY_REPLY_DAYS);
        set((state) => ({
          applications: state.applications.map((application) =>
            application.id === applicationId
              ? {
                  ...application,
                  timeline: [
                    ...application.timeline,
                    {
                      id: `ev_${applicationId}_query_${application.timeline.length}`,
                      at: MOCK_TODAY,
                      title: "You asked why this is taking longer",
                      detail: `Expect a reply by ${expectedReply}`,
                      actor: "CITIZEN" as const,
                    },
                  ],
                }
              : application
          ),
        }));
        toast.success("Query filed");
      },

      payChallan: (challanId) =>
        set((state) => ({
          challans: state.challans.map((challan) =>
            challan.id === challanId
              ? { ...challan, status: "PAID" satisfies ChallanStatus }
              : challan
          ),
        })),

      disputeChallan: (challanId, payload) => {
        set((state) => ({
          challans: state.challans.map((challan) =>
            challan.id === challanId
              ? {
                  ...challan,
                  status: "DISPUTED" satisfies ChallanStatus,
                  disputeTimeline: [
                    {
                      id: `dsp_${challanId}_filed`,
                      at: MOCK_TODAY,
                      title: `You disputed this fine: ${payload.reason}`,
                      detail: payload.statement,
                      actor: "CITIZEN" as const,
                    },
                  ],
                }
              : challan
          ),
        }));

        const pending = disputeTimers.get(challanId);
        if (pending) clearTimeout(pending);

        const timer = setTimeout(() => {
          let waivedAmount = 0;
          set((state) => ({
            challans: state.challans.map((challan) => {
              if (challan.id !== challanId) return challan;
              waivedAmount = challan.amount;
              return {
                ...challan,
                status: "WAIVED" satisfies ChallanStatus,
                disputeTimeline: [
                  ...(challan.disputeTimeline ?? []),
                  {
                    id: `dsp_${challanId}_waived`,
                    at: MOCK_TODAY,
                    title: "Fine waived",
                    detail: "Your dispute was accepted and this fine has been withdrawn.",
                    actor: "SYSTEM" as const,
                  },
                ],
              };
            }),
          }));
          disputeTimers.delete(challanId);
          toast.success(`Fine waived — ${formatINR(waivedAmount)} back in your pocket`);
        }, DISPUTE_RESOLUTION_MS);

        disputeTimers.set(challanId, timer);
      },

      resetDemo: () => {
        clearDisputeTimers();
        set(seedState);
        useAppStore.persist.clearStorage();
      },
    }),
    {
      name: "vahan-mitra-v1",
    }
  )
);
