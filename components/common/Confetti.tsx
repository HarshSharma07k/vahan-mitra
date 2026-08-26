"use client";

// One 1.2s burst, brand + plate colours only, fixed-position overlay so it
// never shifts layout. Particle placement is a fixed deterministic formula,
// not randomised, so the demo looks the same every run.

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface ConfettiProps {
  /** Increment this number to fire a new burst. 0 means "never fired". */
  trigger: number;
}

const COUNT = 18;
const COLORS = ["var(--brand)", "var(--plate)"];
const BURST_MS = 1200;

function particle(i: number) {
  const left = (i * 53) % 100;
  const delay = (i % 6) * 0.03;
  const rotate = 90 + ((i * 47) % 180);
  const drift = ((i * 29) % 40) - 20;
  const color = COLORS[i % COLORS.length];
  return { left, delay, rotate, drift, color };
}

export function Confetti({ trigger }: ConfettiProps) {
  const reduceMotion = useReducedMotion();
  const [seenTrigger, setSeenTrigger] = useState(trigger);
  const [active, setActive] = useState(false);

  // Render-time sync, not an effect: a new trigger value starts the burst
  // immediately, matching React's sanctioned "adjusting state" pattern.
  if (trigger !== seenTrigger) {
    setSeenTrigger(trigger);
    if (trigger !== 0 && !reduceMotion) setActive(true);
  }

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => setActive(false), BURST_MS);
    return () => clearTimeout(timer);
  }, [active]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {Array.from({ length: COUNT }).map((_, i) => {
        const { left, delay, rotate, drift, color } = particle(i);
        return (
          <motion.span
            key={i}
            initial={{ y: "-8vh", x: 0, opacity: 1, rotate: 0 }}
            animate={{ y: "70vh", x: drift, opacity: [1, 1, 0], rotate }}
            transition={{ duration: 1.2, ease: "easeOut", delay }}
            style={{ left: `${left}%`, backgroundColor: color }}
            className="absolute top-0 h-2.5 w-1.5 rounded-[2px]"
          />
        );
      })}
    </div>
  );
}
