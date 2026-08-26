"use client";

// One thing per screen: exactly one document, its reason, and a way to
// provide it — plus, for anything not legally required to file, a way to move on without it.

import { useState } from "react";
import { CircleCheck, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocScanDialog } from "@/components/apply/DocScanDialog";
import { docLabel, t } from "@/lib/i18n";
import type { DocKind, Lang, WalletDocument } from "@/lib/mockData";

export interface DocStepProps {
  docKind: DocKind;
  isBlocking: boolean;
  citizenId: string;
  lang: Lang;
  provided?: WalletDocument;
  onProvide: (doc: WalletDocument) => void;
}

export function DocStep({ docKind, isBlocking, citizenId, lang, provided, onProvide }: DocStepProps) {
  const [scanOpen, setScanOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-[24px] font-bold text-ink">{docLabel(docKind, lang)}</h1>
        <p className="text-[13px] text-muted">
          {isBlocking ? t("apply.docBlockingNote", lang) : t("apply.docOptionalNote", lang)}
        </p>
      </div>

      {provided ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
          <div className="flex items-center gap-2 text-ok">
            <CircleCheck size={18} strokeWidth={1.75} />
            <p className="text-[13px]">{t("apply.docAlready", lang)}</p>
          </div>
          <p className="text-[15px] text-ink">{provided.title}</p>
          <Button
            type="button"
            variant="outline"
            className="w-fit rounded-xl"
            onClick={() => setScanOpen(true)}
          >
            {t("apply.docReplace", lang)}
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          className="h-24 w-full flex-col gap-2 rounded-2xl bg-brand text-white hover:bg-brand/90"
          onClick={() => setScanOpen(true)}
        >
          <ScanLine size={22} strokeWidth={1.75} />
          {t("apply.uploadPrompt", lang)}
        </Button>
      )}

      <DocScanDialog
        open={scanOpen}
        docKind={docKind}
        citizenId={citizenId}
        lang={lang}
        onOpenChange={setScanOpen}
        onConfirm={(doc) => {
          onProvide(doc);
          setScanOpen(false);
        }}
      />
    </div>
  );
}
