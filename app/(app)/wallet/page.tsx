"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FolderOpen, Plus } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { StaggerList } from "@/components/common/StaggerList";
import { WalletDocRow } from "@/components/wallet/WalletDocRow";
import { WalletSheet } from "@/components/wallet/WalletSheet";
import { DocScanDialog } from "@/components/apply/DocScanDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/store/useAppStore";
import { docLabel, t } from "@/lib/i18n";
import type { DocKind, WalletDocument } from "@/lib/mockData";

const ADDABLE_KINDS: DocKind[] = ["AADHAAR", "PAN", "DL", "RC", "INSURANCE", "PUC", "ADDRESS_PROOF"];

export default function WalletPage() {
  const lang = useAppStore((state) => state.session.lang);
  const citizenId = useAppStore((state) => state.session.citizenId);
  const wallet = useAppStore((state) => state.wallet);
  const addDocument = useAppStore((state) => state.addDocument);
  const [activeDoc, setActiveDoc] = useState<WalletDocument | null>(null);
  const [addKind, setAddKind] = useState<DocKind | null>(null);

  const missingKinds = ADDABLE_KINDS.filter((kind) => !wallet.some((doc) => doc.kind === kind));

  function handleAddConfirm(doc: WalletDocument) {
    addDocument(doc);
    setAddKind(null);
    toast.success(t("wallet.addToast", lang));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-[24px] font-bold text-ink">{t("wallet.heading", lang)}</h1>
        {wallet.length > 0 && missingKinds.length > 0 && (
          <Select value={addKind ?? undefined} onValueChange={(value) => setAddKind(value as DocKind)}>
            <SelectTrigger className="h-11 rounded-xl">
              <Plus size={16} strokeWidth={1.75} />
              <SelectValue placeholder={t("wallet.addCta", lang)} />
            </SelectTrigger>
            <SelectContent>
              {missingKinds.map((kind) => (
                <SelectItem key={kind} value={kind}>
                  {docLabel(kind, lang)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {wallet.length > 0 ? (
        <StaggerList className="flex flex-col gap-3">
          {wallet.map((doc) => (
            <WalletDocRow key={doc.id} doc={doc} lang={lang} onOpen={setActiveDoc} />
          ))}
        </StaggerList>
      ) : (
        <EmptyState
          icon={FolderOpen}
          heading={t("wallet.emptyHeading", lang)}
          direction={t("wallet.emptyDirection", lang)}
          ctaLabel={t("wallet.emptyCta", lang)}
          onCtaClick={() => setAddKind(missingKinds[0] ?? "AADHAAR")}
        />
      )}

      <WalletSheet
        doc={activeDoc}
        lang={lang}
        onOpenChange={(open) => {
          if (!open) setActiveDoc(null);
        }}
      />

      {citizenId && addKind && (
        <DocScanDialog
          open={Boolean(addKind)}
          docKind={addKind}
          citizenId={citizenId}
          lang={lang}
          onOpenChange={(open) => {
            if (!open) setAddKind(null);
          }}
          onConfirm={handleAddConfirm}
        />
      )}
    </div>
  );
}
