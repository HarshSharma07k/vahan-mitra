"use client";

// "Kitna Kam?" — same forms, same fees, same law, fewer questions. The
// footer line is non-negotiable: it is the entire argument in one sentence.

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { getBenchmark, type Lang, type ServiceId } from "@/lib/mockData";

export interface ComplexityMeterProps {
  serviceId: ServiceId;
  variant: "hero" | "strip" | "receipt";
  lang: Lang;
  className?: string;
}

const COUNT_UP_MS = 600;

function useCountUp(target: number, active: boolean, skip: boolean): number {
  const [value, setValue] = useState(skip ? target : 0);

  useEffect(() => {
    if (skip) {
      setValue(target);
      return;
    }
    if (!active) return;
    let raf: number;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / COUNT_UP_MS, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, skip]);

  return value;
}

interface HeroFigureProps {
  legacy: number;
  target: number;
  label: string;
  active: boolean;
  skip: boolean;
}

function HeroFigure({ legacy, target, label, active, skip }: HeroFigureProps) {
  const value = useCountUp(target, active, skip);
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="font-data text-[19px] font-medium text-muted line-through">{legacy}</span>
      <span className="font-data text-[32px] font-medium text-brand">{value}</span>
      <span className="font-display text-[11px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </span>
    </div>
  );
}

export function ComplexityMeter({ serviceId, variant, lang, className }: ComplexityMeterProps) {
  const benchmark = getBenchmark(serviceId);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (variant !== "hero" || inView) return;
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [variant, inView]);

  if (!benchmark) return null;

  const footer = <p className="text-[13px] text-muted">{t("complexity.footer", lang)}</p>;

  if (variant === "hero") {
    return (
      <div ref={sectionRef} className={cn("flex flex-col gap-5", className)}>
        <div className="grid grid-cols-3 gap-4">
          <HeroFigure
            legacy={benchmark.legacyQuestions}
            target={benchmark.ourQuestions}
            label={t("complexity.heroQuestionsLabel", lang)}
            active={inView}
            skip={!!reduceMotion}
          />
          <HeroFigure
            legacy={benchmark.legacyPortals}
            target={benchmark.ourScreens}
            label={t("complexity.heroPortalsLabel", lang)}
            active={inView}
            skip={!!reduceMotion}
          />
          <HeroFigure
            legacy={benchmark.legacyMinutes}
            target={benchmark.ourMinutes}
            label={t("complexity.heroMinutesLabel", lang)}
            active={inView}
            skip={!!reduceMotion}
          />
        </div>
        {footer}
      </div>
    );
  }

  if (variant === "strip") {
    return (
      <div className={cn("flex flex-col gap-1.5 rounded-xl border border-line bg-canvas px-3 py-2", className)}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
          <span className="text-muted line-through">
            {t("complexity.legacyPrefix", lang)}: {benchmark.legacyQuestions} {t("complexity.questions", lang)} · {benchmark.legacyPortals} {t("complexity.portals", lang)} · {benchmark.legacyMinutes} {t("complexity.minutes", lang)}
          </span>
          <span className="font-medium text-brand">
            {t("complexity.oursPrefix", lang)}: {benchmark.ourQuestions} {t("complexity.questions", lang)} · {benchmark.ourScreens} {t("complexity.screen", lang)} · {benchmark.ourMinutes} {t("complexity.minutes", lang)}
          </span>
        </div>
        {footer}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <p className="text-[15px] text-ink">
        {t("complexity.receiptLine", lang, {
          ours: benchmark.ourQuestions,
          legacy: benchmark.legacyQuestions,
        })}
      </p>
      {footer}
    </div>
  );
}
