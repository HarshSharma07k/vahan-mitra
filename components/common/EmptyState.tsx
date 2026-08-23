import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  heading: string;
  direction: string;
  ctaLabel: string;
  ctaHref: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  heading,
  direction,
  ctaLabel,
  ctaHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface px-6 py-10 text-center",
        className
      )}
    >
      {Icon && (
        <div className="flex size-10 items-center justify-center rounded-full bg-brand-soft text-brand">
          <Icon size={20} strokeWidth={1.75} />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <p className="font-display text-[19px] font-bold text-ink">{heading}</p>
        <p className="text-[13px] text-muted">{direction}</p>
      </div>
      <Button asChild size="sm" className="mt-1 rounded-xl bg-brand hover:bg-brand/90">
        <Link href={ctaHref}>{ctaLabel}</Link>
      </Button>
    </div>
  );
}
