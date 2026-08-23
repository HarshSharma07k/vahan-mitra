"use client";

import { Car, CircleCheck, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { IntentBox } from "@/components/dashboard/IntentBox";
import { ActionCard } from "@/components/dashboard/ActionCard";
import { VehicleCard } from "@/components/dashboard/VehicleCard";
import { ApplicationRow } from "@/components/dashboard/ApplicationRow";
import { useAppStore } from "@/store/useAppStore";
import { t } from "@/lib/i18n";
import { getCitizen } from "@/lib/mockData";
import { getDayPeriod } from "@/lib/utils";
import {
  buildActionItems,
  buildSummaryLine,
  isApplicationInProgress,
  isDocNeedingAttention,
} from "@/lib/dashboardSelectors";

const GREETING_KEYS = {
  morning: "dashboard.greetingMorning",
  afternoon: "dashboard.greetingAfternoon",
  evening: "dashboard.greetingEvening",
} as const;

export default function HomePage() {
  const lang = useAppStore((state) => state.session.lang);
  const citizenId = useAppStore((state) => state.session.citizenId);
  const wallet = useAppStore((state) => state.wallet);
  const vehicles = useAppStore((state) => state.vehicles);
  const challans = useAppStore((state) => state.challans);
  const applications = useAppStore((state) => state.applications);

  const citizen = citizenId ? getCitizen(citizenId) : undefined;
  if (!citizen) return null;

  const firstName = citizen.fullName.split(" ")[0];
  const unpaidChallans = challans.filter((challan) => challan.status === "PENDING");
  const inProgressApplications = applications.filter(isApplicationInProgress);
  const docsNeedingAttention = wallet.filter(isDocNeedingAttention);

  const summary = buildSummaryLine(
    lang,
    unpaidChallans.length,
    inProgressApplications.length,
    docsNeedingAttention.length
  );
  const actionItems = buildActionItems(lang, wallet, vehicles, applications, challans);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-[24px] font-bold text-ink">
          {t(GREETING_KEYS[getDayPeriod()], lang, { name: firstName })}
        </h1>
        <p className="text-[15px] text-muted">{summary}</p>
      </div>

      <IntentBox lang={lang} />

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-[19px] font-bold text-ink">
          {t("dashboard.actionHeading", lang)}
        </h2>
        {actionItems.length > 0 ? (
          <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            {actionItems.map((item) => (
              <ActionCard
                key={item.id}
                reason={item.reason}
                noticedLabel={t("dashboard.noticedLabel", lang)}
                ctaLabel={item.ctaLabel}
                ctaHref={item.ctaHref}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CircleCheck}
            heading={t("dashboard.actionEmptyHeading", lang)}
            direction={t("dashboard.actionEmptyDirection", lang)}
            ctaLabel={t("dashboard.actionEmptyCta", lang)}
            ctaHref="/ask"
          />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-[19px] font-bold text-ink">
          {t("dashboard.vehiclesHeading", lang)}
        </h2>
        {vehicles.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} lang={lang} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Car}
            heading={t("dashboard.vehiclesEmptyHeading", lang)}
            direction={t("dashboard.vehiclesEmptyDirection", lang)}
            ctaLabel={t("dashboard.vehiclesEmptyCta", lang)}
            ctaHref="/vehicles"
          />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-[19px] font-bold text-ink">
          {t("dashboard.applicationsHeading", lang)}
        </h2>
        {inProgressApplications.length > 0 ? (
          <div className="flex flex-col gap-2">
            {inProgressApplications.map((application) => (
              <ApplicationRow key={application.id} application={application} lang={lang} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Sparkles}
            heading={t("dashboard.applicationsEmptyHeading", lang)}
            direction={t("dashboard.applicationsEmptyDirection", lang)}
            ctaLabel={t("dashboard.applicationsEmptyCta", lang)}
            ctaHref="/ask"
          />
        )}
      </section>
    </div>
  );
}
