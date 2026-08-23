import { PlateChip } from "@/components/common/PlateChip";
import { cn, expiryTone, relativeDays } from "@/lib/utils";
import { t } from "@/lib/i18n";
import type { Lang, Vehicle } from "@/lib/mockData";

const TONE_CLASSES = {
  ok: "text-ok",
  warn: "text-warn",
  danger: "text-danger",
} as const;

export interface VehicleCardProps {
  vehicle: Vehicle;
  lang: Lang;
}

export function VehicleCard({ vehicle, lang }: VehicleCardProps) {
  const insuranceTone = expiryTone(vehicle.insuranceValidTill);
  const pucTone = expiryTone(vehicle.pucValidTill);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.12)]">
      <div className="flex flex-col gap-2">
        <PlateChip regNumber={vehicle.regNumber} vehicleClass={vehicle.vehicleClass} size="md" />
        <p className="text-[15px] font-medium text-ink">{vehicle.makeModel}</p>
      </div>
      <div className="flex items-center gap-4 border-t border-line pt-3 text-[13px]">
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="text-muted">{t("dashboard.insuranceLabel", lang)}</span>
          <span className={cn("font-medium", TONE_CLASSES[insuranceTone])}>
            {relativeDays(vehicle.insuranceValidTill)}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="text-muted">{t("dashboard.pucLabel", lang)}</span>
          <span className={cn("font-medium", TONE_CLASSES[pucTone])}>
            {relativeDays(vehicle.pucValidTill)}
          </span>
        </div>
      </div>
    </div>
  );
}
