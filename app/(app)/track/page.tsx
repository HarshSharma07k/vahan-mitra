"use client";

import { Sparkles } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { StaggerList } from "@/components/common/StaggerList";
import { ApplicationRow } from "@/components/dashboard/ApplicationRow";
import { useAppStore } from "@/store/useAppStore";
import { t } from "@/lib/i18n";

export default function TrackPage() {
  const lang = useAppStore((state) => state.session.lang);
  const applications = useAppStore((state) => state.applications);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-[24px] font-bold text-ink">{t("track.heading", lang)}</h1>

      {applications.length > 0 ? (
        <StaggerList className="flex flex-col gap-2">
          {applications.map((application) => (
            <ApplicationRow key={application.id} application={application} lang={lang} />
          ))}
        </StaggerList>
      ) : (
        <EmptyState
          icon={Sparkles}
          heading={t("track.emptyHeading", lang)}
          direction={t("track.emptyDirection", lang)}
          ctaLabel={t("track.emptyCta", lang)}
          ctaHref="/ask"
        />
      )}
    </div>
  );
}
