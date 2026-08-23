// lib/dashboardSelectors.ts
// Pure derivations for the dashboard — never stored, always recomputed from
// the store's own wallet/vehicles/applications/challans.

import { t } from "@/lib/i18n";
import { formatINR, relativeDays } from "@/lib/utils";
import type { Application, Challan, Lang, Vehicle, WalletDocument } from "@/lib/mockData";

const TERMINAL_APPLICATION_STATUSES = new Set(["APPROVED", "DISPATCHED", "REJECTED"]);

export function isApplicationInProgress(application: Application): boolean {
  return !TERMINAL_APPLICATION_STATUSES.has(application.status);
}

export function isDocNeedingAttention(doc: WalletDocument): boolean {
  return doc.health === "NEEDS_FIX" || doc.health === "EXPIRED" || doc.health === "EXPIRING";
}

export interface ActionItem {
  id: string;
  reason: string;
  ctaLabel: string;
  ctaHref: string;
}

export function buildActionItems(
  lang: Lang,
  wallet: WalletDocument[],
  vehicles: Vehicle[],
  applications: Application[],
  challans: Challan[]
): ActionItem[] {
  const items: ActionItem[] = [];

  for (const doc of wallet) {
    if (doc.health === "EXPIRED" && doc.expiresOn) {
      items.push({
        id: `doc_${doc.id}`,
        reason: t("dashboard.actionDocExpired", lang, {
          title: doc.title,
          when: relativeDays(doc.expiresOn),
        }),
        ctaLabel: t("dashboard.actionFix", lang),
        ctaHref: `/wallet?doc=${doc.id}`,
      });
    } else if (doc.health === "EXPIRING" && doc.expiresOn) {
      items.push({
        id: `doc_${doc.id}`,
        reason: t("dashboard.actionDocExpiring", lang, {
          title: doc.title,
          when: relativeDays(doc.expiresOn),
        }),
        ctaLabel: t("dashboard.actionFix", lang),
        ctaHref: `/wallet?doc=${doc.id}`,
      });
    } else if (doc.health === "NEEDS_FIX") {
      items.push({
        id: `doc_${doc.id}`,
        reason: doc.issues[0]?.message ?? doc.title,
        ctaLabel: t("dashboard.actionFix", lang),
        ctaHref: `/wallet?doc=${doc.id}`,
      });
    }
  }

  for (const vehicle of vehicles) {
    if (vehicle.ownershipPending) {
      items.push({
        id: `own_${vehicle.id}`,
        reason: t("dashboard.actionOwnershipPending", lang, {
          name: vehicle.previousOwner ?? "",
        }),
        ctaLabel: t("dashboard.actionReview", lang),
        ctaHref: `/vehicles?focus=${vehicle.id}`,
      });
    }
  }

  for (const application of applications) {
    const blockedStage = application.stages.find((stage) => stage.state === "BLOCKED");
    if (application.blocker || blockedStage) {
      items.push({
        id: `app_${application.id}`,
        reason: application.blocker
          ? application.blocker.detail
          : t("dashboard.actionBlocked", lang, { stage: blockedStage?.label ?? "" }),
        ctaLabel: t("dashboard.actionFix", lang),
        ctaHref: application.blocker?.actionHref ?? `/track?app=${application.id}`,
      });
    }
  }

  const unpaidChallans = challans.filter((challan) => challan.status === "PENDING");
  if (unpaidChallans.length > 0) {
    const total = unpaidChallans.reduce((sum, challan) => sum + challan.amount, 0);
    items.push({
      id: "challans_unpaid",
      reason: t("dashboard.actionChallans", lang, {
        amount: formatINR(total),
        count: unpaidChallans.length,
        s: unpaidChallans.length === 1 ? "" : "s",
      }),
      ctaLabel: t("dashboard.actionPay", lang),
      ctaHref: "/challans",
    });
  }

  return items;
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
