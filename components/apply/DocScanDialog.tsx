"use client";

// Every upload — camera, file, or sample — goes through the same 1200ms
// runOcr() sweep so the demo behaves identically with no camera in the room.

import { useEffect, useState, type ChangeEvent } from "react";
import { Camera, Check, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { runOcr, getSampleDocsFor } from "@/lib/ocrEngine";
import { formatMockId } from "@/lib/utils";
import { docLabel, t } from "@/lib/i18n";
import { MOCK_TODAY, type DocKind, type Lang, type OcrFixture, type WalletDocument } from "@/lib/mockData";

export interface DocScanDialogProps {
  open: boolean;
  docKind: DocKind;
  citizenId: string;
  lang: Lang;
  titleOverride?: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (doc: WalletDocument) => void;
}

type Stage = "pick" | "scanning" | "confirm";

const ISSUE_TONE: Record<"BLOCKING" | "WARNING", string> = {
  BLOCKING: "text-danger",
  WARNING: "text-warn",
};

export function DocScanDialog({
  open,
  docKind,
  citizenId,
  lang,
  titleOverride,
  onOpenChange,
  onConfirm,
}: DocScanDialogProps) {
  const [stage, setStage] = useState<Stage>("pick");
  const [fixture, setFixture] = useState<OcrFixture | null>(null);
  const [fileName, setFileName] = useState("");
  const samples = getSampleDocsFor(docKind);
  const title = titleOverride ?? docLabel(docKind, lang);

  useEffect(() => {
    if (!open) return;
    setStage("pick");
    setFixture(null);
    setFileName("");
  }, [open]);

  async function scan(name: string) {
    setFileName(name);
    setStage("scanning");
    const result = await runOcr(docKind, name);
    setFixture(result);
    setStage("confirm");
  }

  function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void scan(file.name);
  }

  function handleConfirm() {
    if (!fixture) return;
    const doc: WalletDocument = {
      id: formatMockId("doc_", `${citizenId}_${docKind}_${fileName}_${MOCK_TODAY}`),
      citizenId,
      kind: docKind,
      title,
      fileName: fileName || `${docKind.toLowerCase()}.jpg`,
      previewUrl: fixture.previewUrl,
      health: fixture.issues.some((issue) => issue.severity === "BLOCKING") ? "NEEDS_FIX" : "VERIFIED",
      addedOn: MOCK_TODAY.slice(0, 10),
      fields: fixture.fields,
      issues: fixture.issues,
    };
    onConfirm(doc);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-[19px] font-bold text-ink">{title}</DialogTitle>
          <DialogDescription className="sr-only">{title}</DialogDescription>
        </DialogHeader>

        {stage === "pick" && (
          <div className="flex flex-col gap-3">
            <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line text-[13px] text-muted transition-colors duration-150 hover:border-brand hover:text-brand">
              <Camera size={20} strokeWidth={1.75} />
              <span>{t("apply.uploadPrompt", lang)}</span>
              <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileInput} />
            </label>
            {samples.length > 0 && (
              <div className="flex flex-col gap-2">
                {samples.map((sample) => (
                  <Button
                    key={sample.fileName}
                    type="button"
                    variant="outline"
                    className="justify-start gap-2 rounded-xl"
                    onClick={() => void scan(sample.fileName)}
                  >
                    <FileText size={16} strokeWidth={1.75} />
                    {t("apply.useSample", lang)} — {sample.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}

        {stage === "scanning" && (
          <div aria-live="polite" className="flex flex-col items-center gap-3 py-6">
            <Skeleton className="h-40 w-full rounded-xl" />
            <p className="text-[13px] text-muted">{t("apply.scanning", lang)}</p>
          </div>
        )}

        {stage === "confirm" && fixture && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5 rounded-xl border border-line p-3">
              {fixture.fields.map((field) => (
                <div key={field.key} className="flex items-center justify-between gap-3 text-[13px]">
                  <span className="text-muted">{field.label}</span>
                  <span className="font-data text-ink">{field.value}</span>
                </div>
              ))}
            </div>
            {fixture.issues.map((issue) => (
              <p key={issue.code} className={`text-[13px] ${ISSUE_TONE[issue.severity]}`}>
                {issue.message}
              </p>
            ))}
            <Button type="button" className="rounded-xl bg-brand hover:bg-brand/90" onClick={handleConfirm}>
              <Check size={16} strokeWidth={1.75} />
              {t("apply.confirmDoc", lang)}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
