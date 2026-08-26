"use client";

import { Car } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { StaggerList } from "@/components/common/StaggerList";
import { VehicleGarageCard } from "@/components/vehicles/VehicleGarageCard";
import { useAppStore } from "@/store/useAppStore";
import { t } from "@/lib/i18n";

export default function VehiclesPage() {
  const lang = useAppStore((state) => state.session.lang);
  const vehicles = useAppStore((state) => state.vehicles);
  const challans = useAppStore((state) => state.challans);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-[24px] font-bold text-ink">{t("vehicles.heading", lang)}</h1>

      {vehicles.length > 0 ? (
        <StaggerList className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4">
          {vehicles.map((vehicle) => (
            <VehicleGarageCard
              key={vehicle.id}
              vehicle={vehicle}
              openFineCount={
                challans.filter((c) => c.vehicleId === vehicle.id && c.status === "PENDING").length
              }
              lang={lang}
            />
          ))}
        </StaggerList>
      ) : (
        <EmptyState
          icon={Car}
          heading={t("vehicles.emptyHeading", lang)}
          direction={t("vehicles.emptyDirection", lang)}
          ctaLabel={t("vehicles.emptyCta", lang)}
          ctaHref="/ask"
        />
      )}
    </div>
  );
}
