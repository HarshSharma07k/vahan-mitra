"use client";

// Wrap any list of cards/rows to stagger their entrance 40ms apart, capped at
// 8 items so long lists don't crawl in one at a time.

import { Children } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface StaggerListProps {
  children: React.ReactNode;
  className?: string;
  itemClassName?: string;
}

const STAGGER_S = 0.04;
const MAX_STAGGER_ITEMS = 8;

export function StaggerList({ children, className, itemClassName }: StaggerListProps) {
  const reduceMotion = useReducedMotion();
  const items = Children.toArray(children);

  return (
    <div className={className}>
      {items.map((child, index) => (
        <motion.div
          key={(child as { key?: string }).key ?? index}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.24,
            ease: "easeOut",
            delay: Math.min(index, MAX_STAGGER_ITEMS - 1) * STAGGER_S,
          }}
          className={itemClassName}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
