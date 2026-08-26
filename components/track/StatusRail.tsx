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

  return (
    <ol className="flex flex-col">
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
  );
}
