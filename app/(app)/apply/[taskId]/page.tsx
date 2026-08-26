"use client";

// "Aadha Bhar Do" — one document per screen. Enable filing the moment every
// blocking slot is full; anything else owed gets a deadline, not a blocker.

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { DocStep } from "@/components/apply/DocStep";
import { ReviewStep } from "@/components/apply/ReviewStep";
import { useAppStore } from "@/store/useAppStore";
import { wait, WRITE_MS } from "@/lib/mockApi";
import { t } from "@/lib/i18n";
import { addDaysToToday, formatDate, formatINR, formatMockId } from "@/lib/utils";
import {
  MOCK_TODAY,
  PARTIAL_FILE_GRACE_DAYS,
  getServiceTaskById,
  splitRequiredDocs,
  type Application,
  type ApplicationStage,
  type DocKind,
  type PendingVerification,
  type ServiceId,
  type WalletDocument,
} from "@/lib/mockData";

const VEHICLE_SERVICES: ServiceId[] = [
  "RC_TRANSFER",
  "INSURANCE_UPDATE",
  "ADDRESS_CHANGE",
  "NOC_ISSUE",
  "HYPOTHECATION_TERMINATION",
  "PUC_RENEWAL",
];

export default function ApplyTaskPage() {
  const params = useParams<{ taskId: string }>();
  const router = useRouter();

  const lang = useAppStore((state) => state.session.lang);
  const citizenId = useAppStore((state) => state.session.citizenId) as string;
  const wallet = useAppStore((state) => state.wallet);
  const vehicles = useAppStore((state) => state.vehicles);
  const applications = useAppStore((state) => state.applications);
  const startApplication = useAppStore((state) => state.startApplication);
  const submitApplication = useAppStore((state) => state.submitApplication);

  const task = getServiceTaskById(params.taskId);
  const [stepIndex, setStepIndex] = useState(0);
  const [providedDocs, setProvidedDocs] = useState<Partial<Record<DocKind, WalletDocument>>>(() => {
    if (!task) return {};
    const initial: Partial<Record<DocKind, WalletDocument>> = {};
    for (const kind of task.requiredDocs) {
      const existing = wallet.find((doc) => doc.citizenId === citizenId && doc.kind === kind);
      if (existing) initial[kind] = existing;
    }
    return initial;
  });
  const [submitting, setSubmitting] = useState(false);

  const { blocking, nonBlocking } = useMemo(
    () => (task ? splitRequiredDocs(task) : { blocking: [], nonBlocking: [] }),
    [task]
  );
  const steps = useMemo(() => [...blocking, ...nonBlocking], [blocking, nonBlocking]);

  if (!task) {
    return (
      <div className="mx-auto max-w-2xl py-10">
        <EmptyState
          icon={FileQuestion}
          heading={t("apply.notFoundHeading", lang)}
          direction={t("apply.notFoundDirection", lang)}
          ctaLabel={t("track.emptyCta", lang)}
          ctaHref="/ask"
        />
      </div>
    );
  }

  const isReview = stepIndex === steps.length;
  const currentKind = steps[stepIndex];
  const currentIsBlocking = currentKind ? blocking.includes(currentKind) : false;
  const canAdvance = !currentIsBlocking || Boolean(providedDocs[currentKind]);

  async function handleSubmit() {
    if (!task) return;
    setSubmitting(true);
    await wait(WRITE_MS);

    const missingNonBlocking = nonBlocking.filter((kind) => !providedDocs[kind]);
    const dueBy = addDaysToToday(PARTIAL_FILE_GRACE_DAYS);
    const consequenceDate = formatDate(dueBy);

    const existingDraft = applications.find(
      (application) => application.citizenId === citizenId && application.serviceId === task.serviceId && application.status === "DRAFT"
    );

    let applicationId = existingDraft?.id;

    if (!existingDraft) {
      const isVehicleService = VEHICLE_SERVICES.includes(task.serviceId);
      const vehicle = isVehicleService ? vehicles.find((v) => v.citizenId === citizenId) : undefined;
      const hasGaps = missingNonBlocking.length > 0;

      const stages: ApplicationStage[] = [
        { key: "docs", label: "Documents", labelHi: "दस्तावेज़", state: "DONE", completedOn: MOCK_TODAY.slice(0, 10), office: "Online" },
        { key: "fee", label: "Fee payment", labelHi: "शुल्क भुगतान", state: "DONE", completedOn: MOCK_TODAY.slice(0, 10), office: "Online" },
        { key: "verify", label: "RTO verification", labelHi: "आरटीओ जाँच", state: hasGaps ? "BLOCKED" : "ACTIVE" },
        { key: "approve", label: "Approval", labelHi: "मंज़ूरी", state: "PENDING" },
        { key: "dispatch", label: "Dispatched", labelHi: "भेजा गया", state: "PENDING" },
      ];

      const newApplication: Application = {
        id: formatMockId("app_", `${citizenId}_${task.id}_${MOCK_TODAY}`),
        citizenId,
        serviceId: task.serviceId,
        title: vehicle ? `${task.title} — ${vehicle.regNumber}` : task.title,
        vehicleId: vehicle?.id,
        status: "DRAFT",
        feePaidInr: task.feeInr,
        rtoOfficeId: vehicle?.registeredRto ?? "rto_hr26",
        stages,
        timeline: [],
      };

      startApplication(newApplication);
      applicationId = newApplication.id;
    }

    const pendingDocs: PendingVerification[] = missingNonBlocking.map((kind) => ({
      id: formatMockId("pv_", `${applicationId}_${kind}`),
      applicationId: applicationId as string,
      docKind: kind,
      label: t("apply.docOptionalNote", "en"),
      blocking: false,
      dueBy,
      consequence: `After ${consequenceDate} this application closes and the ${formatINR(task.feeInr)} fee has to be paid again.`,
    }));

    submitApplication(applicationId as string, pendingDocs.length > 0 ? pendingDocs : undefined);
    toast.success(t("apply.submitToast", lang));
    router.push(`/track/${applicationId}`);
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 py-6">
      <Link
        href="/home"
        className="flex w-fit items-center gap-1.5 text-[13px] text-muted transition-colors duration-150 hover:text-ink"
      >
        <ArrowLeft size={16} strokeWidth={1.75} />
        {t("apply.back", lang)}
      </Link>

      {!isReview && (
        <p className="text-[13px] text-muted">{t("apply.stepOf", lang, { n: stepIndex + 1, total: steps.length + 1 })}</p>
      )}

      {isReview ? (
        <ReviewStep
          task={task}
          blocking={blocking}
          nonBlocking={nonBlocking}
          providedDocs={providedDocs}
          lang={lang}
          submitting={submitting}
          onSubmit={handleSubmit}
        />
      ) : (
        <>
          <DocStep
            docKind={currentKind}
            isBlocking={currentIsBlocking}
            citizenId={citizenId}
            lang={lang}
            provided={providedDocs[currentKind]}
            onProvide={(doc) => setProvidedDocs((prev) => ({ ...prev, [currentKind]: doc }))}
          />
          <div className="flex items-center justify-between">
            <button
              type="button"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((index) => Math.max(index - 1, 0))}
              className="min-h-11 rounded-xl px-3 text-[15px] text-muted transition-colors duration-150 hover:text-ink disabled:opacity-40"
            >
              {t("apply.back", lang)}
            </button>
            <button
              type="button"
              disabled={!canAdvance}
              onClick={() => setStepIndex((index) => Math.min(index + 1, steps.length))}
              className="min-h-11 rounded-xl bg-brand px-5 text-[15px] font-medium text-white transition-colors duration-150 hover:bg-brand/90 disabled:opacity-40"
            >
              {t("apply.next", lang)}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
