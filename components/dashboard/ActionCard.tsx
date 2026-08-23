import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ActionCardProps {
  reason: string;
  noticedLabel: string;
  ctaLabel: string;
  ctaHref: string;
  className?: string;
}

export function ActionCard({
  reason,
  noticedLabel,
  ctaLabel,
  ctaHref,
  className,
}: ActionCardProps) {
  return (
    <div
      className={cn(
        "flex w-72 shrink-0 snap-start flex-col gap-3 rounded-2xl border border-line border-l-[3px] border-l-plate bg-surface p-4",
        "shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.12)]",
        className
      )}
    >
      <p className="text-[11px] text-muted">{noticedLabel}</p>
      <p className="flex-1 text-[15px] leading-[1.55] text-ink">{reason}</p>
      <Button asChild size="sm" className="self-start rounded-xl bg-brand hover:bg-brand/90">
        <Link href={ctaHref}>{ctaLabel}</Link>
      </Button>
    </div>
  );
}
