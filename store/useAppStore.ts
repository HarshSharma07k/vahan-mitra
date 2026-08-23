// store/useAppStore.ts
// Single source of client state. Holds the current citizen's working copy of
// their data — populated from lib/mockApi.ts on login, mutated locally by
// actions like payChallan/disputeChallan, and wiped by resetDemo.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getCitizen,
  getVehiclesFor,
  getWalletFor,
  getChallansFor,
  getApplicationsFor,
} from "@/lib/mockApi";
import {
  MOCK_TODAY,
  type Application,
  type ApplicationStatus,
  type Challan,
  type ChallanStatus,
  type Lang,
  type TaskPlan,
  type Vehicle,
  type WalletDocument,
} from "@/lib/mockData";

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
}

interface AppActions {
  login: (citizenId: string) => Promise<void>;
  logout: () => void;
  setLang: (lang: Lang) => void;
  addDocument: (doc: WalletDocument) => void;
  resolveIntent: (plan: TaskPlan) => void;
  startApplication: (application: Application) => void;
  submitApplication: (applicationId: string) => void;
  payChallan: (challanId: string) => void;
  disputeChallan: (challanId: string) => void;
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
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...seedState,

      login: async (citizenId) => {
        const citizen = await getCitizen(citizenId);
        const [vehicles, wallet, challans, applications] = await Promise.all([
          getVehiclesFor(citizenId),
          getWalletFor(citizenId),
          getChallansFor(citizenId),
          getApplicationsFor(citizenId),
        ]);
        set({
          session: { citizenId, lang: citizen?.preferredLang ?? get().session.lang },
          vehicles,
          wallet,
          challans,
          applications,
          plans: [],
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

      submitApplication: (applicationId) =>
        set((state) => ({
          applications: state.applications.map((application) =>
            application.id === applicationId
              ? {
                  ...application,
                  status: "SUBMITTED" satisfies ApplicationStatus,
                  submittedOn: MOCK_TODAY.slice(0, 10),
                  timeline: [
                    ...application.timeline,
                    {
                      id: `ev_${applicationId}_submit_${application.timeline.length}`,
                      at: MOCK_TODAY,
                      title: "You submitted this application",
                      actor: "CITIZEN" as const,
                    },
                  ],
                }
              : application
          ),
        })),

      payChallan: (challanId) =>
        set((state) => ({
          challans: state.challans.map((challan) =>
            challan.id === challanId
              ? { ...challan, status: "PAID" satisfies ChallanStatus }
              : challan
          ),
        })),

      disputeChallan: (challanId) => {
        set((state) => ({
          challans: state.challans.map((challan) =>
            challan.id === challanId
              ? { ...challan, status: "DISPUTED" satisfies ChallanStatus }
              : challan
          ),
        }));

        const pending = disputeTimers.get(challanId);
        if (pending) clearTimeout(pending);

        const timer = setTimeout(() => {
          set((state) => ({
            challans: state.challans.map((challan) =>
              challan.id === challanId
                ? { ...challan, status: "WAIVED" satisfies ChallanStatus }
                : challan
            ),
          }));
          disputeTimers.delete(challanId);
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
