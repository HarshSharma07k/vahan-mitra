"use client";

import { ChevronRight, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PlateChip } from "@/components/common/PlateChip";
import { cn, getAge } from "@/lib/utils";
import { t } from "@/lib/i18n";
import type { Citizen, Lang, Vehicle } from "@/lib/mockData";

export interface PersonaCardProps {
  citizen: Citizen;
  vehicles: Vehicle[];
  lang: Lang;
  loading?: boolean;
  disabled?: boolean;
  onSelect: (citizen: Citizen) => void;
}

export function PersonaCard({
  citizen,
  vehicles,
  lang,
  loading = false,
  disabled = false,
  onSelect,
}: PersonaCardProps) {
  const age = getAge(citizen.dob);
  const firstName = citizen.fullName.split(" ")[0];

  return (
    <button
      type="button"
      onClick={() => onSelect(citizen)}
      disabled={disabled}
      className={cn(
        "group flex w-full flex-col gap-3 rounded-2xl border border-line bg-surface p-5 text-left",
        "shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.12)]",
        "transition-all duration-150 hover:-translate-y-0.5 hover:border-brand",
        "focus-visible:-translate-y-0.5 focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:border-line"
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar size="lg">
          <AvatarFallback className="bg-brand-soft font-display font-bold text-brand">
            {citizen.avatarInitials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-display text-[19px] font-bold text-ink">{citizen.fullName}</p>
          <p className="text-[13px] text-muted">
            {age} yrs · {citizen.city}
          </p>
        </div>
      </div>

      <p className="text-[13px] text-muted">{citizen.demoNote}</p>

      <div className="flex flex-wrap items-center gap-2">
        {vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
            <PlateChip
              key={vehicle.id}
              regNumber={vehicle.regNumber}
              vehicleClass={vehicle.vehicleClass}
              size="sm"
            />
          ))
        ) : (
          <span className="text-[13px] text-muted">{t("landing.noVehicles", lang)}</span>
        )}
      </div>

      <div className="flex items-center justify-end gap-1 pt-1 text-[13px] font-medium text-brand">
        {loading ? (
          <>
            {t("landing.signingIn", lang)}
            <Loader2 size={16} strokeWidth={1.75} className="animate-spin" />
          </>
        ) : (
          <>
            {t("landing.enterAs", lang, { name: firstName })}
            <ChevronRight
              size={16}
              strokeWidth={1.75}
              className="transition-transform duration-150 group-hover:translate-x-0.5"
            />
          </>
        )}
      </div>
    </button>
  );
}
