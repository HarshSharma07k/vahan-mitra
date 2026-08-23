import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { t } from "@/lib/i18n";
import type { Application, ApplicationStage, Lang } from "@/lib/mockData";

export interface ApplicationRowProps {
  application: Application;
  lang: Lang;
}

function pickCurrentStage(stages: ApplicationStage[]): ApplicationStage {
  return (
    stages.find((stage) => stage.state === "BLOCKED") ??
    stages.find((stage) => stage.state === "ACTIVE") ??
    [...stages].reverse().find((stage) => stage.state === "DONE") ??
    stages[0]
  );
}

export function ApplicationRow({ application, lang }: ApplicationRowProps) {
  const currentStage = pickCurrentStage(application.stages);
  const doneCount = application.stages.filter((stage) => stage.state === "DONE").length;
  const filledDots = Math.round((doneCount / application.stages.length) * 4);
  const dotTone = application.blocker ? "bg-warn" : "bg-brand";

  return (
    <Link
      href={`/track?app=${application.id}`}
      className="flex min-h-11 items-center gap-4 rounded-xl border border-line bg-surface px-4 py-3 transition-colors duration-150 hover:border-brand"
    >
      <div className="flex shrink-0 gap-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <span
            key={index}
            className={cn("size-2 rounded-full", index < filledDots ? dotTone : "bg-line")}
          />
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium text-ink">{application.title}</p>
        <p className="truncate text-[13px] text-muted">
          {lang === "hi" ? currentStage.labelHi : currentStage.label}
        </p>
      </div>
      {application.expectedBy && (
        <p className="shrink-0 text-[13px] text-muted">
          {t("dashboard.expectedBy", lang, { date: formatDate(application.expectedBy) })}
        </p>
      )}
    </Link>
  );
}
