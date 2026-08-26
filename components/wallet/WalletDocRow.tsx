"use client";

import { Chip, type ChipProps } from "@/components/common/Chip";
import { formatDate } from "@/lib/utils";
import { docLabel, t } from "@/lib/i18n";
import type { Lang, WalletDocument } from "@/lib/mockData";

export interface WalletDocRowProps {
  doc: WalletDocument;
  lang: Lang;
  onOpen: (doc: WalletDocument) => void;
}

const HEALTH_TONE: Record<WalletDocument["health"], NonNullable<ChipProps["tone"]>> = {
  VERIFIED: "ok",
  NEEDS_FIX: "danger",
  EXPIRING: "warn",
  EXPIRED: "danger",
  MISSING: "neutral",
};

export function WalletDocRow({ doc, lang, onOpen }: WalletDocRowProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(doc)}
      className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 text-left shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.12)] transition-colors duration-150 hover:border-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <div className="flex flex-col gap-1">
        <p className="text-[15px] font-medium text-ink">{docLabel(doc.kind, lang)}</p>
        <p className="text-[13px] text-muted">
          {doc.expiresOn
            ? t("wallet.expiresOn", lang, { date: formatDate(doc.expiresOn) })
            : t("wallet.addedOn", lang, { date: formatDate(doc.addedOn) })}
        </p>
      </div>
      <Chip tone={HEALTH_TONE[doc.health]}>{t(`wallet.health.${doc.health}`, lang)}</Chip>
    </button>
  );
}
