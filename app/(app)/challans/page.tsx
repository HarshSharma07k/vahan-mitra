"use client";

import { useState } from "react";
import { Receipt } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { StaggerList } from "@/components/common/StaggerList";
import { Confetti } from "@/components/common/Confetti";
import { ChallanCard } from "@/components/challans/ChallanCard";
import { DisputeSheet } from "@/components/challans/DisputeSheet";
import { useAppStore } from "@/store/useAppStore";
import { useCountUp } from "@/hooks/useCountUp";
import { formatINR } from "@/lib/utils";
import { t } from "@/lib/i18n";
import type { Challan } from "@/lib/mockData";

const STATUS_ORDER: Record<Challan["status"], number> = {
  PENDING: 0,
  DISPUTED: 1,
  IN_LOK_ADALAT: 2,
  WAIVED: 3,
  PAID: 4,
};

export default function ChallansPage() {
  const lang = useAppStore((state) => state.session.lang);
  const challans = useAppStore((state) => state.challans);
  const vehicles = useAppStore((state) => state.vehicles);
  const [activeChallan, setActiveChallan] = useState<Challan | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [prevChallans, setPrevChallans] = useState(challans);

  // Render-time sync, not an effect: compare against the last-seen list to
  // catch the 8-second-later WAIVED flip and fire confetti for it.
  if (challans !== prevChallans) {
    const waivedJustNow = challans.some((challan) => {
      const before = prevChallans.find((p) => p.id === challan.id);
      return before && before.status !== "WAIVED" && challan.status === "WAIVED";
    });
    setPrevChallans(challans);
    if (waivedJustNow) setConfettiTrigger((n) => n + 1);
  }

  const sorted = [...challans].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
  const unpaidTotal = challans
    .filter((challan) => challan.status === "PENDING")
    .reduce((sum, challan) => sum + challan.amount, 0);
  const unpaidCount = challans.filter((challan) => challan.status === "PENDING").length;
  const animatedTotal = useCountUp(unpaidTotal);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-[24px] font-bold text-ink">{t("challans.heading", lang)}</h1>
        {unpaidCount > 0 && (
          <p className="font-data text-[15px] text-muted">
            {t("challans.summary", lang, {
              amount: formatINR(animatedTotal),
              count: unpaidCount,
              s: unpaidCount === 1 ? "" : "s",
            })}
          </p>
        )}
      </div>

      {sorted.length > 0 ? (
        <StaggerList className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4">
          {sorted.map((challan) => {
            const vehicle = vehicles.find((v) => v.id === challan.vehicleId);
            if (!vehicle) return null;
            return (
              <ChallanCard
                key={challan.id}
                challan={challan}
                vehicle={vehicle}
                lang={lang}
                onDispute={setActiveChallan}
              />
            );
          })}
        </StaggerList>
      ) : (
        <EmptyState
          icon={Receipt}
          heading={t("challans.emptyHeading", lang)}
          direction={t("challans.emptyDirection", lang)}
          ctaLabel={t("challans.emptyCta", lang)}
          ctaHref="/home"
        />
      )}

      <DisputeSheet
        challan={activeChallan}
        vehicle={activeChallan ? vehicles.find((v) => v.id === activeChallan.vehicleId) : undefined}
        lang={lang}
        onOpenChange={(open) => {
          if (!open) setActiveChallan(null);
        }}
      />

      <Confetti trigger={confettiTrigger} />
    </div>
  );
}
