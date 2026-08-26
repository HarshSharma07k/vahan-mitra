"use client";

// "Aadha Bhar Do" — filed with the legal minimum. States what's still owed
// plainly, no red, no threat, just a deadline and an Upload button per slot.

import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocScanDialog } from "@/components/apply/DocScanDialog";
import { useAppStore } from "@/store/useAppStore";
import { relativeDays } from "@/lib/utils";
import { docLabel, t } from "@/lib/i18n";
import {
  mockServices,
  pendingDocLabelOverride,
  type Application,
  type Lang,
  type PendingVerification,
} from "@/lib/mockData";

export interface PendingDocsCardProps {
  application: Application;
  pendingDocs: PendingVerification[];
  citizenId: string;
  lang: Lang;
}

const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function PendingDocsCard({ application, pendingDocs, citizenId, lang }: PendingDocsCardProps) {
  const resolvePendingVerification = useAppStore((state) => state.resolvePendingVerification);
  const [scanningFor, setScanningFor] = useState<PendingVerification | null>(null);

  const task = mockServices[application.serviceId];
  const total = task.requiredDocs.length;
  const done = Math.max(total - pendingDocs.length, 0);
  const pct = total === 0 ? 100 : Math.round((done / total) * 100);
  const offset = CIRCUMFERENCE * (1 - pct / 100);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-center gap-4">
        <svg width="56" height="56" viewBox="0 0 56 56" className="shrink-0 -rotate-90">
          <circle cx="28" cy="28" r={RADIUS} fill="none" stroke="var(--line)" strokeWidth="5" />
          <circle
            cx="28"
            cy="28"
            r={RADIUS}
            fill="none"
            stroke="var(--brand)"
            strokeWidth="5"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="flex flex-col gap-0.5">
          <p className="font-display text-[19px] font-bold text-ink">{t("pending.heading", lang)}</p>
          <p className="text-[13px] text-muted">{t("pending.complete", lang, { done, total })}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {pendingDocs.map((doc) => {
          const label =
            pendingDocLabelOverride(application.serviceId, doc.docKind, lang) ?? docLabel(doc.docKind, lang);
          return (
            <div
              key={doc.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2.5"
            >
              <div className="flex flex-col gap-0.5">
                <p className="text-[15px] text-ink">{label}</p>
                <p className="text-[13px] text-muted">
                  {t("pending.dueBy", lang, { date: relativeDays(doc.dueBy) })}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-xl"
                onClick={() => setScanningFor(doc)}
              >
                <Upload size={16} strokeWidth={1.75} />
                {t("pending.upload", lang)}
              </Button>
            </div>
          );
        })}
      </div>

      {pendingDocs[0] && <p className="text-[13px] text-muted">{pendingDocs[0].consequence}</p>}

      {scanningFor && (
        <DocScanDialog
          open
          docKind={scanningFor.docKind}
          citizenId={citizenId}
          lang={lang}
          titleOverride={
            pendingDocLabelOverride(application.serviceId, scanningFor.docKind, lang) ?? undefined
          }
          onOpenChange={(open) => !open && setScanningFor(null)}
          onConfirm={(doc) => {
            resolvePendingVerification(application.id, scanningFor.id, doc);
            setScanningFor(null);
          }}
        />
      )}
    </div>
  );
}
