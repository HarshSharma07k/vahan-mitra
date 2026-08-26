"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DocScanDialog } from "@/components/apply/DocScanDialog";
import { useAppStore } from "@/store/useAppStore";
import { docLabel, t } from "@/lib/i18n";
import type { Lang, WalletDocument } from "@/lib/mockData";

export interface WalletSheetProps {
  doc: WalletDocument | null;
  lang: Lang;
  onOpenChange: (open: boolean) => void;
}

export function WalletSheet({ doc, lang, onOpenChange }: WalletSheetProps) {
  const citizenId = useAppStore((state) => state.session.citizenId);
  const addDocument = useAppStore((state) => state.addDocument);
  const [replacing, setReplacing] = useState(false);

  if (!doc) return null;

  function handleReplaceConfirm(nextDoc: WalletDocument) {
    if (!doc) return;
    addDocument({ ...nextDoc, id: doc.id });
    setReplacing(false);
    onOpenChange(false);
    toast.success(t("wallet.replaceToast", lang));
  }

  return (
    <>
      <Sheet open onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="mx-auto max-h-[90vh] w-full rounded-t-2xl sm:max-w-lg">
          <div className="mx-auto mt-2 h-1.5 w-10 shrink-0 rounded-full bg-line" aria-hidden="true" />
          <SheetHeader>
            <SheetTitle className="font-display text-[19px] font-bold text-ink">
              {docLabel(doc.kind, lang)}
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-2">
            {doc.fields.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[13px] font-medium text-ink">{t("wallet.fieldsHeading", lang)}</span>
                <div className="flex flex-col gap-1.5 rounded-xl border border-line p-3">
                  {doc.fields.map((field) => (
                    <div key={field.key} className="flex items-center justify-between gap-3 text-[13px]">
                      <span className="text-muted">{field.label}</span>
                      <span className="font-data text-ink">{field.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              {doc.issues.length > 0 ? (
                doc.issues.map((issue) => (
                  <p
                    key={issue.code}
                    className={issue.severity === "BLOCKING" ? "text-[13px] text-danger" : "text-[13px] text-warn"}
                  >
                    {issue.message}
                  </p>
                ))
              ) : (
                <p className="text-[13px] text-muted">{t("wallet.noIssues", lang)}</p>
              )}
            </div>
          </div>

          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setReplacing(true)}
              className="h-11 w-full rounded-xl"
            >
              {t("wallet.replaceCta", lang)}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {citizenId && (
        <DocScanDialog
          open={replacing}
          docKind={doc.kind}
          citizenId={citizenId}
          lang={lang}
          onOpenChange={setReplacing}
          onConfirm={handleReplaceConfirm}
        />
      )}
    </>
  );
}
