"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Chip, type ChipProps } from "@/components/common/Chip";
import { PlateChip } from "@/components/common/PlateChip";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { wait, WRITE_MS } from "@/lib/mockApi";
import { formatINR, formatDate, relativeDays } from "@/lib/utils";
import { t } from "@/lib/i18n";
import type { Challan, Lang, Vehicle } from "@/lib/mockData";

export interface ChallanCardProps {
  challan: Challan;
  vehicle: Vehicle;
  lang: Lang;
  onDispute: (challan: Challan) => void;
}

const STATUS_TONE: Record<Challan["status"], NonNullable<ChipProps["tone"]>> = {
  PENDING: "danger",
  PAID: "ok",
  DISPUTED: "warn",
  WAIVED: "ok",
  IN_LOK_ADALAT: "neutral",
};

export function ChallanCard({ challan, vehicle, lang, onDispute }: ChallanCardProps) {
  const payChallan = useAppStore((state) => state.payChallan);
  const [paying, setPaying] = useState(false);

  async function handlePay() {
    setPaying(true);
    await wait(WRITE_MS);
    payChallan(challan.id);
    setPaying(false);
    toast.success(t("challans.paid", lang));
  }

  const isPending = challan.status === "PENDING";
  const hasSignals = challan.disputeSignals.length > 0 && isPending;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.12)]">
      <div className="flex items-start justify-between gap-3">
        <PlateChip regNumber={vehicle.regNumber} vehicleClass={vehicle.vehicleClass} size="sm" />
        <Chip tone={STATUS_TONE[challan.status]}>{t(`challan.status.${challan.status}`, lang)}</Chip>
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-canvas">
        <Image src={challan.evidenceUrl} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-[15px] font-medium text-ink">{challan.offenceHuman}</p>
        <p className="text-[11px] text-muted">{challan.mvActSection}</p>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
        <div className="flex flex-col gap-0.5">
          <span className="font-data text-[19px] font-medium text-ink">{formatINR(challan.amount)}</span>
          <span className="text-[13px] text-muted">{challan.location}</span>
        </div>
        <div className="flex flex-col items-end gap-0.5 text-[13px]">
          <span className="text-muted">{t("challans.issuedOn", lang, { date: formatDate(challan.issuedOn) })}</span>
          {isPending && (
            <span className="font-medium text-ink">{t("challans.dueBy", lang, { when: relativeDays(challan.dueOn) })}</span>
          )}
        </div>
      </div>

      {hasSignals && <Chip tone="warn">{t("challans.signalHint", lang)}</Chip>}

      {isPending && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            disabled={paying}
            onClick={handlePay}
            className="h-11 flex-1 rounded-xl bg-brand hover:bg-brand/90"
          >
            {paying ? t("challans.paying", lang) : t("challans.pay", lang, { amount: formatINR(challan.amount) })}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onDispute(challan)}
            className="h-11 flex-1 rounded-xl"
          >
            {t("challans.dispute", lang)}
          </Button>
        </div>
      )}
    </div>
  );
}
