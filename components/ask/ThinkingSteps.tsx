"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ThinkingStepsProps {
  /** Exactly three lines, streamed 500ms apart. */
  lines: string[];
  onDone: () => void;
}

const STEP_MS = 500;

export function ThinkingSteps({ lines, onDone }: ThinkingStepsProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const linesRef = useRef(lines);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const currentLines = linesRef.current;
    const timers = currentLines.map((_, i) =>
      window.setTimeout(() => setVisibleCount(i + 1), (i + 1) * STEP_MS)
    );
    const doneTimer = window.setTimeout(() => onDoneRef.current(), currentLines.length * STEP_MS + 100);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(doneTimer);
    };
  }, []);

  return (
    <div aria-live="polite" className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-6">
      {linesRef.current.map((line, i) => {
        const shown = i < visibleCount;
        return (
          <div
            key={line}
            className={cn(
              "flex items-center gap-3 text-[15px] transition-opacity duration-150",
              shown ? "text-ink opacity-100" : "text-muted opacity-40"
            )}
          >
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-150",
                shown ? "border-ok bg-ok text-white" : "border-line"
              )}
            >
              {shown && <Check size={12} strokeWidth={2.5} />}
            </span>
            {line}
          </div>
        );
      })}
    </div>
  );
}
