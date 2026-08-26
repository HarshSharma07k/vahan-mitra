"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const COUNT_UP_MS = 600;

/** Counts a number up over 600ms easeOut on mount/when target changes. Skips straight to target under reduced motion. */
export function useCountUp(target: number): number {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(reduceMotion ? target : 0);

  // Render-time sync, not an effect: under reduced motion there is no
  // animation to run, so jump straight to the target the moment it changes.
  if (reduceMotion && value !== target) {
    setValue(target);
  }

  useEffect(() => {
    if (reduceMotion) return;
    let raf: number;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / COUNT_UP_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 2);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduceMotion]);

  return value;
}
