"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { ComplexityMeter } from "@/components/common/ComplexityMeter";
import { useAppStore } from "@/store/useAppStore";
import { t } from "@/lib/i18n";
import { formatINR } from "@/lib/utils";
import { getBenchmark, type ServiceTask } from "@/lib/mockData";

function topoSort(tasks: ServiceTask[]): ServiceTask[] {
  const byId = new Map(tasks.map((task) => [task.id, task]));
  const visited = new Set<string>();
  const ordered: ServiceTask[] = [];

  function visit(task: ServiceTask) {
    if (visited.has(task.id)) return;
    visited.add(task.id);
    for (const depId of task.dependsOn) {
      const dep = byId.get(depId);
      if (dep) visit(dep);
    }
    ordered.push(task);
  }

  tasks.forEach(visit);
  return ordered;
}

export default function PlanPage() {
  const params = useParams<{ planId: string }>();
  const lang = useAppStore((state) => state.session.lang);
  const plans = useAppStore((state) => state.plans);

  const plan = plans.find((p) => p.id === params.planId);

  if (!plan) {
    return (
      <div className="mx-auto max-w-2xl py-10">
        <EmptyState
          icon={Sparkles}
          heading={t("plan.notFoundHeading", lang)}
          direction={t("plan.notFoundDirection", lang)}
          ctaLabel={t("track.emptyCta", lang)}
          ctaHref="/ask"
        />
      </div>
    );
  }

  const orderedTasks = topoSort(plan.tasks);
  const stripServiceId = orderedTasks.find((task) => getBenchmark(task.serviceId))?.serviceId;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 py-6">
      <Link
        href="/home"
        className="flex w-fit items-center gap-1.5 text-[13px] text-muted transition-colors duration-150 hover:text-ink"
      >
        <ArrowLeft size={16} strokeWidth={1.75} />
        {t("apply.back", lang)}
      </Link>

      <div className="flex flex-col gap-1">
        <h1 className="font-display text-[24px] font-bold text-ink">{t("plan.heading", lang)}</h1>
        <p className="text-[15px] text-muted">{t("plan.subheading", lang)}</p>
      </div>

      {stripServiceId && <ComplexityMeter serviceId={stripServiceId} variant="strip" lang={lang} />}

      <div className="flex flex-col gap-3">
        {orderedTasks.map((task) => {
          const dependencyId = task.dependsOn[0];
          const dependency = dependencyId ? orderedTasks.find((t) => t.id === dependencyId) : undefined;

          return (
            <div key={task.id} className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
              <div className="flex flex-col gap-1">
                <p className="font-display text-[19px] font-bold text-ink">
                  {lang === "hi" ? task.titleHi : task.title}
                </p>
                <p className="text-[11px] text-muted">{task.legalName}</p>
              </div>
              <p className="text-[15px] leading-[1.55] text-ink">{task.reason}</p>
              {dependency && (
                <p className="text-[13px] text-muted">
                  {t("plan.dependsOn", lang, {
                    title: lang === "hi" ? dependency.titleHi : dependency.title,
                  })}
                </p>
              )}
              <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
                <div className="flex gap-4 text-[13px] text-muted">
                  <span className="font-data text-ink">{formatINR(task.feeInr)}</span>
                  <span>{t("apply.etaDays", lang, { n: task.estimatedDays })}</span>
                </div>
                <Button asChild size="sm" className="rounded-xl bg-brand hover:bg-brand/90">
                  <Link href={`/apply/${task.id}`}>{t("plan.startCta", lang)}</Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-line bg-canvas px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] text-muted">{t("plan.totalFee", lang)}</span>
          <span className="font-data text-[15px] text-ink">{formatINR(plan.totalFeeInr)}</span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[13px] text-muted">{t("plan.totalDays", lang)}</span>
          <span className="text-[15px] text-ink">{t("apply.etaDays", lang, { n: plan.totalDays })}</span>
        </div>
      </div>
    </div>
  );
}
