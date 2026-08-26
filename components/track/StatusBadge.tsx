import { Chip, type ChipProps } from "@/components/common/Chip";
import { statusLabel } from "@/lib/i18n";
import type { ApplicationStatus, Lang } from "@/lib/mockData";

export interface StatusBadgeProps {
  status: ApplicationStatus;
  lang: Lang;
}

const TONE: Record<ApplicationStatus, NonNullable<ChipProps["tone"]>> = {
  DRAFT: "neutral",
  SUBMITTED: "brand",
  SUBMITTED_PARTIAL: "warn",
  UNDER_REVIEW: "brand",
  QUERY_RAISED: "warn",
  APPROVED: "ok",
  DISPATCHED: "ok",
  REJECTED: "danger",
};

export function StatusBadge({ status, lang }: StatusBadgeProps) {
  return <Chip tone={TONE[status]}>{statusLabel(status, lang)}</Chip>;
}
