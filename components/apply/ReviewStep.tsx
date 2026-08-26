"use client";

// The receipt: what you answered versus what the old portal asks, and a
// plain statement of what's still owed — never a wall of red asterisks.

import { Button } from "@/components/ui/button";
import { ComplexityMeter } from "@/components/common/ComplexityMeter";
import { docLabel, etaDaysLabel, t } from "@/lib/i18n";
import { addDaysToToday, formatDate, formatINR } from "@/lib/utils";
import { PARTIAL_FILE_GRACE_DAYS, type DocKind, type Lang, type ServiceTask, type WalletDocument } from "@/lib/mockData";

export interface ReviewStepProps {
  task: ServiceTask;
  blocking: DocKind[];
  nonBlocking: DocKind[];
  providedDocs: Partial<Record<DocKind, WalletDocument>>;
  lang: Lang;
  submitting: boolean;
  onSubmit: () => void;
}

export function ReviewStep({
  task,
  blocking,
  nonBlocking,
  providedDocs,
  lang,
  submitting,
  onSubmit,
}: ReviewStepProps) {
  const missingBlocking = blocking.filter((kind) => !providedDocs[kind]);
  const missingNonBlocking = nonBlocking.filter((kind) => !providedDocs[kind]);
  const dueDate = formatDate(addDaysToToday(PARTIAL_FILE_GRACE_DAYS));

  const statusLine =
    missingBlocking.length > 0
      ? t("apply.blockingMissing", lang, { n: missingBlocking.length, s: missingBlocking.length === 1 ? "" : "s" })
      : missingNonBlocking.length === 0
        ? t("apply.allDocsReady", lang)
        : missingNonBlocking.length === 1
          ? t("apply.canFileNowSingular", lang, { date: dueDate })
          : t("apply.canFileNowPlural", lang, { n: missingNonBlocking.length, date: dueDate });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-[24px] font-bold text-ink">{t("apply.reviewHeading", lang)}</h1>
        <p className="text-[11px] text-muted">
          {t("apply.legalNameNote", lang)}: {task.legalName}
        </p>
      </div>

      <ComplexityMeter serviceId={task.serviceId} variant="receipt" lang={lang} />

      {[...blocking, ...nonBlocking].length > 0 && (
        <div className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
          {[...blocking, ...nonBlocking].map((kind) => {
            const doc = providedDocs[kind];
            return (
              <div key={kind} className="flex items-center justify-between gap-3 text-[15px]">
                <span className="text-ink">{docLabel(kind, lang)}</span>
                <span className={doc ? "text-ok" : "text-muted"}>
                  {doc ? doc.title : t(missingBlocking.includes(kind) ? "apply.docBlockingNote" : "apply.docOptionalNote", lang)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[15px] text-ink">{statusLine}</p>

      <div className="flex items-center justify-between rounded-2xl border border-line bg-canvas px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] text-muted">{t("apply.feeLabel", lang)}</span>
          <span className="font-data text-[15px] text-ink">{formatINR(task.feeInr)}</span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[13px] text-muted">{t("apply.etaLabel", lang)}</span>
          <span className="text-[15px] text-ink">{etaDaysLabel(task.estimatedDays, lang)}</span>
        </div>
      </div>

      <Button
        type="button"
        className="rounded-xl bg-brand hover:bg-brand/90"
        disabled={missingBlocking.length > 0 || submitting}
        onClick={onSubmit}
      >
        {t("apply.submitCta", lang)}
      </Button>
    </div>
  );
}
