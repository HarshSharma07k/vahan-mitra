import Link from "next/link";
import { PlateChip } from "@/components/common/PlateChip";
import { Chip } from "@/components/common/Chip";
import { cn, expiryTone, relativeDays } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { getRto, mockServices } from "@/lib/mockData";
import type { Lang, Vehicle } from "@/lib/mockData";

const TONE_CLASSES = {
  ok: "text-ok",
  warn: "text-warn",
  danger: "text-danger",
} as const;

export interface VehicleGarageCardProps {
  vehicle: Vehicle;
  openFineCount: number;
  lang: Lang;
}

export function VehicleGarageCard({ vehicle, openFineCount, lang }: VehicleGarageCardProps) {
  const insuranceTone = expiryTone(vehicle.insuranceValidTill);
  const pucTone = expiryTone(vehicle.pucValidTill);
  const rto = getRto(vehicle.registeredRto);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <PlateChip regNumber={vehicle.regNumber} vehicleClass={vehicle.vehicleClass} size="md" />
          <p className="text-[15px] font-medium text-ink">{vehicle.makeModel}</p>
          {rto && (
            <p className="text-[13px] text-muted">{t("vehicles.registeredAt", lang, { rto: rto.name })}</p>
          )}
        </div>
        <Chip tone={openFineCount > 0 ? "danger" : "ok"}>
          {openFineCount > 0
            ? openFineCount === 1
              ? t("vehicles.openFines", lang)
              : t("vehicles.openFinesPlural", lang, { n: openFineCount })
            : t("vehicles.noFines", lang)}
        </Chip>
      </div>

      <div className="flex items-center gap-4 border-t border-line pt-3 text-[13px]">
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="text-muted">{t("dashboard.insuranceLabel", lang)}</span>
          <span className={cn("font-medium", TONE_CLASSES[insuranceTone])}>
            {relativeDays(vehicle.insuranceValidTill, lang)}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="text-muted">{t("dashboard.pucLabel", lang)}</span>
          <span className={cn("font-medium", TONE_CLASSES[pucTone])}>{relativeDays(vehicle.pucValidTill, lang)}</span>
        </div>
      </div>

      {vehicle.ownershipPending && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-warn/30 bg-warn/10 px-3 py-2">
          <span className="text-[13px] text-ink">
            {t("vehicles.ownershipPending", lang, { name: vehicle.previousOwner ?? "—" })}
          </span>
          <Link
            href={`/apply/${mockServices.RC_TRANSFER.id}`}
            className="-my-2 flex min-h-11 shrink-0 items-center rounded-md px-1 text-[13px] font-medium text-brand underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {t("vehicles.fixCta", lang)}
          </Link>
        </div>
      )}

      {vehicle.hypothecatedTo && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-warn/30 bg-warn/10 px-3 py-2">
          <span className="text-[13px] text-ink">
            {t("vehicles.hypothecated", lang, { bank: vehicle.hypothecatedTo })}
          </span>
          <Link
            href={`/apply/${mockServices.HYPOTHECATION_TERMINATION.id}`}
            className="-my-2 flex min-h-11 shrink-0 items-center rounded-md px-1 text-[13px] font-medium text-brand underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {t("vehicles.fixCta", lang)}
          </Link>
        </div>
      )}
    </div>
  );
}
