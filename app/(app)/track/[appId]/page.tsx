"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/track/StatusBadge";
import { StatusRail } from "@/components/track/StatusRail";
import { PendingDocsCard } from "@/components/track/PendingDocsCard";
import { FileTrail } from "@/components/track/FileTrail";
import { ReminderStrip } from "@/components/common/ReminderStrip";
import { useAppStore } from "@/store/useAppStore";
import { t } from "@/lib/i18n";
import { formatDate, formatINR } from "@/lib/utils";

export default function TrackApplicationPage() {
  const params = useParams<{ appId: string }>();
  const lang = useAppStore((state) => state.session.lang);
  const citizenId = useAppStore((state) => state.session.citizenId) as string;
  const applications = useAppStore((state) => state.applications);
  const pendingVerifications = useAppStore((state) => state.pendingVerifications);
  const reminders = useAppStore((state) => state.reminders);

  const application = applications.find((a) => a.id === params.appId);

  if (!application) {
    return (
      <div className="mx-auto max-w-2xl py-10">
        <EmptyState
          icon={FileSearch}
          heading={t("track.notFoundHeading", lang)}
          direction={t("track.notFoundDirection", lang)}
          ctaLabel={t("track.emptyCta", lang)}
          ctaHref="/track"
        />
      </div>
    );
  }

  const pendingDocs = pendingVerifications.filter((p) => p.applicationId === application.id);
  const appReminders = reminders.filter((r) => r.applicationId === application.id);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 py-6">
      <Link
        href="/track"
        className="flex w-fit items-center gap-1.5 text-[13px] text-muted transition-colors duration-150 hover:text-ink"
      >
        <ArrowLeft size={16} strokeWidth={1.75} />
        {t("apply.back", lang)}
      </Link>

      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-display text-[24px] font-bold text-ink">{application.title}</h1>
          <StatusBadge status={application.status} lang={lang} />
        </div>
        <div className="flex gap-4 text-[13px] text-muted">
          <span className="font-data text-ink">{formatINR(application.feePaidInr)}</span>
          {application.expectedBy && (
            <span>{t("dashboard.expectedBy", lang, { date: formatDate(application.expectedBy) })}</span>
          )}
        </div>
      </div>

      {application.blocker && !(application.status === "SUBMITTED_PARTIAL" && pendingDocs.length > 0) && (
        <div className="flex flex-col gap-3 rounded-2xl border border-line border-l-[3px] border-l-plate bg-surface p-4">
          <div className="flex flex-col gap-1">
            <p className="text-[15px] font-medium text-ink">{application.blocker.title}</p>
            <p className="text-[13px] text-muted">{application.blocker.detail}</p>
          </div>
          <Button asChild size="sm" className="w-fit rounded-xl bg-brand hover:bg-brand/90">
            <Link href={application.blocker.actionHref}>{application.blocker.actionLabel}</Link>
          </Button>
        </div>
      )}

      {application.status === "SUBMITTED_PARTIAL" && pendingDocs.length > 0 && (
        <PendingDocsCard application={application} pendingDocs={pendingDocs} citizenId={citizenId} lang={lang} />
      )}

      <div className="rounded-2xl border border-line bg-surface p-4">
        <StatusRail stages={application.stages} lang={lang} />
      </div>

      {appReminders.length > 0 && <ReminderStrip reminders={appReminders} lang={lang} />}

      <FileTrail applicationId={application.id} lang={lang} />
    </div>
  );
}
