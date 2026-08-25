import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChipProps {
  icon?: LucideIcon;
  tone?: "neutral" | "brand" | "ok" | "warn" | "danger" | "mono";
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}

const TONE_CLASSES: Record<NonNullable<ChipProps["tone"]>, string> = {
  neutral: "border-line bg-canvas text-ink",
  brand: "border-brand/20 bg-brand-soft text-brand",
  ok: "border-ok/20 bg-ok/10 text-ok",
  warn: "border-warn/30 bg-warn/10 text-warn",
  danger: "border-danger/20 bg-danger/10 text-danger",
  mono: "border-line bg-surface text-ink font-data",
};

const SIZE_CLASSES: Record<NonNullable<ChipProps["size"]>, string> = {
  sm: "h-6 gap-1 px-2 text-[11px]",
  md: "h-7 gap-1.5 px-2.5 text-[13px]",
};

export function Chip({ icon: Icon, tone = "neutral", size = "md", className, children }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border font-medium",
        TONE_CLASSES[tone],
        SIZE_CLASSES[size],
        className
      )}
    >
      {Icon && <Icon size={size === "sm" ? 12 : 14} strokeWidth={1.75} />}
      {children}
    </span>
  );
}
