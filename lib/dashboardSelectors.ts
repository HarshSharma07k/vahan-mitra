// lib/dashboardSelectors.ts
// Pure derivations for the dashboard — never stored, always recomputed from
// the store's own wallet/vehicles/applications/challans.

import { t } from "@/lib/i18n";
import type { Application, Lang, WalletDocument } from "@/lib/mockData";

const TERMINAL_APPLICATION_STATUSES = new Set(["APPROVED", "DISPATCHED", "REJECTED"]);

export function isApplicationInProgress(application: Application): boolean {
  return !TERMINAL_APPLICATION_STATUSES.has(application.status);
}

export function isDocNeedingAttention(doc: WalletDocument): boolean {
  return doc.health === "NEEDS_FIX" || doc.health === "EXPIRED" || doc.health === "EXPIRING";
}

export function buildSummaryLine(
  lang: Lang,
  fineCount: number,
  appCount: number,
  docCount: number
): string {
  const parts: string[] = [];

  if (fineCount === 1) parts.push(t("dashboard.summaryFineSingular", lang));
  else if (fineCount > 1) parts.push(t("dashboard.summaryFinePlural", lang, { n: fineCount }));

  if (appCount === 1) parts.push(t("dashboard.summaryAppSingular", lang));
  else if (appCount > 1) parts.push(t("dashboard.summaryAppPlural", lang, { n: appCount }));

  if (docCount === 1) parts.push(t("dashboard.summaryDocSingular", lang));
  else if (docCount > 1) parts.push(t("dashboard.summaryDocPlural", lang, { n: docCount }));

  if (parts.length === 0) return t("dashboard.summaryAllClear", lang);
  return `${parts.join(", ")}.`;
}
