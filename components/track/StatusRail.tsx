"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { ApplicationStage, Lang, StageState } from "@/lib/mockData";

export interface StatusRailProps {
  stages: ApplicationStage[];
  lang: Lang;
}

const DOT_CLASSES: Record<StageState, string> = {
  DONE: "bg-brand text-white",
  ACTIVE: "bg-brand text-white",
  BLOCKED: "bg-warn text-white",
  PENDING: "bg-line text-muted",
};

export function StatusRail({ stages, lang }: StatusRailProps) {
  const reduceMotion = useReducedMotion();
  const currentStage =
    stages.find((stage) => stage.state === "ACTIVE" || stage.state === "BLOCKED") ??
    [...stages].reverse().find((stage) => stage.state === "DONE") ??
    stages[0];

  return (
    <div aria-live="polite">
      {/* Under 640px: a compact horizontal stepper, current stage detail below it. */}
      <ol className="flex items-center gap-1.5 sm:hidden">
        {stages.map((stage, index) => (
          <li key={stage.key} className="flex flex-1 items-center gap-1.5">
            <motion.span
              initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={
                reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 24 }
              }
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full",
                DOT_CLASSES[stage.state]
              )}
            >
              {stage.state === "DONE" && <Check size={14} strokeWidth={2} />}
              {stage.state === "BLOCKED" && <X size={12} strokeWidth={2} />}
            </motion.span>
            {index < stages.length - 1 && <span className="h-px flex-1 bg-line" />}
          </li>
        ))}
      </ol>
      {currentStage && (
        <div className="mt-3 flex flex-col gap-0.5 sm:hidden">
          <p className="text-[15px] font-medium text-ink">
            {lang === "hi" ? currentStage.labelHi : currentStage.label}
          </p>
          {currentStage.office && <p className="text-[13px] text-muted">{currentStage.office}</p>}
          {currentStage.completedOn && (
            <p className="text-[13px] text-muted">{formatDate(currentStage.completedOn)}</p>
          )}
        </div>
      )}

      {/* 640px and up: the full vertical timeline. */}
      <ol className="hidden flex-col sm:flex">
        {stages.map((stage, index) => (
          <li key={stage.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <motion.span
                initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={
                  reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 24 }
                }
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full",
                  DOT_CLASSES[stage.state]
                )}
              >
                {stage.state === "DONE" && <Check size={14} strokeWidth={2} />}
                {stage.state === "BLOCKED" && <X size={12} strokeWidth={2} />}
              </motion.span>
              {index < stages.length - 1 && <span className="w-px flex-1 bg-line" />}
            </div>
            <div className={cn("flex flex-1 flex-col gap-0.5", index < stages.length - 1 && "pb-6")}>
              <p
                className={cn(
                  "text-[15px] font-medium",
                  stage.state === "PENDING" ? "text-muted" : "text-ink"
                )}
              >
                {lang === "hi" ? stage.labelHi : stage.label}
              </p>
              {stage.office && <p className="text-[13px] text-muted">{stage.office}</p>}
              {stage.completedOn && (
                <p className="text-[13px] text-muted">{formatDate(stage.completedOn)}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
