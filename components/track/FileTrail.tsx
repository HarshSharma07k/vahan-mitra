"use client";

// "Kisne Dekha?" — every desk that touched the file, timestamped. State the
// facts flatly: no red banners, no exclamation marks, no "DELAYED".

import { useState } from "react";
import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { cn, formatDate } from "@/lib/utils";
import { t, trailActionLabel } from "@/lib/i18n";
import { getAgeingFor, getFileAccessFor, type Lang } from "@/lib/mockData";

export interface FileTrailProps {
  applicationId: string;
  lang: Lang;
}

const COLLAPSED_COUNT = 5;

function formatTimestamp(iso: string): string {
  return `${formatDate(iso)}, ${iso.slice(11, 16)}`;
}

export function FileTrail({ applicationId, lang }: FileTrailProps) {
  const raiseDelayQuery = useAppStore((state) => state.raiseDelayQuery);
  const [expanded, setExpanded] = useState(false);
  const [queried, setQueried] = useState(false);

  const ageing = getAgeingFor(applicationId);
  const events = getFileAccessFor(applicationId);
  const showAgeing = ageing && ageing.daysAtCurrentDesk > ageing.officeAverageDays;
  const visibleEvents = expanded ? events : events.slice(0, COLLAPSED_COUNT);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4">
      <h2 className="font-display text-[19px] font-bold text-ink">{t("trail.heading", lang)}</h2>

      {showAgeing && ageing && (
        <div className="flex flex-col gap-2 border-b border-line pb-4">
          <p className="text-[15px] text-ink">
            {t("trail.ageing", lang, {
              desk: ageing.currentDesk,
              days: ageing.daysAtCurrentDesk,
              avg: ageing.officeAverageDays,
            })}
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="w-fit rounded-xl"
            disabled={queried}
            onClick={() => {
              raiseDelayQuery(applicationId);
              setQueried(true);
            }}
          >
            <CircleHelp size={16} strokeWidth={1.75} />
            {t("trail.askWhy", lang)}
          </Button>
        </div>
      )}

      {events.length === 0 ? (
        <p className="text-[13px] text-muted">{t("trail.empty", lang)}</p>
      ) : (
        <ul className="flex flex-col">
          {visibleEvents.map((event, index) => (
            <li key={event.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="size-2 shrink-0 rounded-full bg-line" />
                {index < visibleEvents.length - 1 && <span className="w-px flex-1 bg-line" />}
              </div>
              <div
                className={cn(
                  "flex flex-1 flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5",
                  index < visibleEvents.length - 1 && "pb-4"
                )}
              >
                <div className="flex flex-col gap-0.5">
                  <p className="text-[15px] text-ink">
                    {event.accessedBy} {trailActionLabel(event.action, lang)}
                  </p>
                  <p className="text-[13px] text-muted">{event.office}</p>
                </div>
                <span className="shrink-0 font-data text-[13px] text-muted">
                  {formatTimestamp(event.at)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {events.length > COLLAPSED_COUNT && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-fit rounded-xl text-brand hover:text-brand"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? t("trail.showLess", lang) : t("trail.showAll", lang)}
        </Button>
      )}
    </div>
  );
}
