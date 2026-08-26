// lib/proactive.ts
// "Aage Kya?" — the system reads the citizen's own data and opens tasks
// nobody asked for. Pure derivation over the store's current state, merged
// with the curated mockProactiveTriggers so hand-written copy always wins.

import { useAppStore } from "@/store/useAppStore";
import { daysUntil, relativeDays, formatINR } from "@/lib/utils";
import {
  mockProactiveTriggers,
  type Lang,
  type ProactiveTrigger,
  type TriggerKind,
} from "@/lib/mockData";

const DL_WINDOW_DAYS = 45;
const INSURANCE_PUC_WINDOW_DAYS = 30;
const CHALLAN_WINDOW_DAYS = 15;
const TERMINAL_APPLICATION_STATUSES = new Set(["APPROVED", "DISPATCHED", "REJECTED"]);

function computeDynamicTriggers(citizenId: string): ProactiveTrigger[] {
  const { vehicles, wallet, challans } = useAppStore.getState();
  const triggers: ProactiveTrigger[] = [];

  for (const doc of wallet) {
    if (doc.kind === "DL" && doc.expiresOn) {
      const days = daysUntil(doc.expiresOn);
      if (days <= DL_WINDOW_DAYS) {
        triggers.push({
          id: `dyn_dl_${doc.id}`,
          citizenId,
          kind: "DL_EXPIRING" as TriggerKind,
          subjectId: doc.id,
          serviceId: "DL_RENEWAL",
          headline: `Your licence expires ${relativeDays(doc.expiresOn)}`,
          headlineHi: `आपका लाइसेंस ${relativeDays(doc.expiresOn, "hi")} समाप्त हो जाएगा`,
          costOfInaction: "Renewing after expiry adds ₹1,000 and can mean taking the driving test again.",
          costOfInactionHi: "समय बीतने के बाद नवीनीकरण में ₹1,000 अतिरिक्त लगते हैं और दोबारा ड्राइविंग टेस्ट देना पड़ सकता है।",
          urgencyDays: days,
        });
      }
    }
    if (doc.kind === "INSURANCE" && doc.expiresOn) {
      const days = daysUntil(doc.expiresOn);
      if (days <= INSURANCE_PUC_WINDOW_DAYS) {
        triggers.push({
          id: `dyn_ins_${doc.id}`,
          citizenId,
          kind: "INSURANCE_EXPIRING" as TriggerKind,
          subjectId: doc.id,
          serviceId: "INSURANCE_UPDATE",
          headline: `Your insurance ${days < 0 ? "expired" : "expires"} ${relativeDays(doc.expiresOn)}`,
          headlineHi: `आपका बीमा ${relativeDays(doc.expiresOn, "hi")} ${days < 0 ? "समाप्त हो गया" : "समाप्त होगा"}`,
          costOfInaction: "Ownership transfer will be rejected, and any claim can be denied outright.",
          costOfInactionHi: "स्वामित्व हस्तांतरण अस्वीकार हो जाएगा, और कोई भी दावा पूरी तरह ख़ारिज किया जा सकता है।",
          urgencyDays: days,
        });
      }
    }
  }

  for (const vehicle of vehicles) {
    const pucDays = daysUntil(vehicle.pucValidTill);
    if (pucDays <= INSURANCE_PUC_WINDOW_DAYS) {
      triggers.push({
        id: `dyn_puc_${vehicle.id}`,
        citizenId,
        kind: "PUC_EXPIRING" as TriggerKind,
        subjectId: vehicle.id,
        serviceId: "PUC_RENEWAL",
        headline: `PUC on ${vehicle.regNumber} ${pucDays < 0 ? "expired" : "expires"} ${relativeDays(vehicle.pucValidTill)}`,
        headlineHi: `${vehicle.regNumber} का पीयूसी ${relativeDays(vehicle.pucValidTill, "hi")} ${pucDays < 0 ? "समाप्त हो गया" : "समाप्त होगा"}`,
        costOfInaction: "Driving without a valid PUC is a ₹2,000 fine on the spot.",
        costOfInactionHi: "वैध पीयूसी के बिना गाड़ी चलाने पर मौके पर ₹2,000 का जुर्माना लगता है।",
        urgencyDays: pucDays,
      });
    }

    if (vehicle.ownershipPending) {
      triggers.push({
        id: `dyn_own_${vehicle.id}`,
        citizenId,
        kind: "OWNERSHIP_PENDING" as TriggerKind,
        subjectId: vehicle.id,
        serviceId: "RC_TRANSFER",
        headline: `This vehicle is still registered to ${vehicle.previousOwner ?? "the previous owner"}`,
        headlineHi: `यह गाड़ी अभी भी ${vehicle.previousOwner ?? "पिछले मालिक"} के नाम पर पंजीकृत है`,
        costOfInaction: "Every fine on it goes to them, and insurance claims can be refused.",
        costOfInactionHi: "इस पर लगने वाला हर जुर्माना उन्हीं के नाम जाता है, और बीमा दावे अस्वीकार किए जा सकते हैं।",
        urgencyDays: 0,
      });
    }

    if (vehicle.hypothecatedTo) {
      triggers.push({
        id: `dyn_hypo_${vehicle.id}`,
        citizenId,
        kind: "HYPOTHECATION_STALE" as TriggerKind,
        subjectId: vehicle.id,
        serviceId: "HYPOTHECATION_TERMINATION",
        headline: `Your loan is closed but ${vehicle.hypothecatedTo} is still on your RC`,
        headlineHi: `आपका लोन बंद हो चुका है लेकिन ${vehicle.hypothecatedTo} अभी भी आपकी आरसी पर दर्ज है`,
        costOfInaction: "You cannot sell this vehicle until the bank comes off the registration.",
        costOfInactionHi: "जब तक बैंक का नाम पंजीकरण से नहीं हटता, आप यह गाड़ी बेच नहीं सकते।",
        urgencyDays: 0,
      });
    }
  }

  for (const challan of challans) {
    if (challan.status !== "PENDING") continue;
    const days = daysUntil(challan.dueOn);
    if (days <= CHALLAN_WINDOW_DAYS) {
      triggers.push({
        id: `dyn_chl_${challan.id}`,
        citizenId,
        kind: "CHALLAN_DUE_SOON" as TriggerKind,
        subjectId: challan.id,
        serviceId: "CHALLAN_CLEAR",
        headline: `${formatINR(challan.amount)} fine due ${relativeDays(challan.dueOn)}`,
        headlineHi: `${formatINR(challan.amount)} का जुर्माना ${relativeDays(challan.dueOn, "hi")} देय है`,
        costOfInaction: "Ownership transfer and other paperwork on this vehicle stay blocked until it's paid or disputed.",
        costOfInactionHi: "जब तक यह भरा या विवादित नहीं होता, इस गाड़ी पर स्वामित्व हस्तांतरण और अन्य कागज़ी काम रुके रहेंगे।",
        urgencyDays: days,
      });
    }
  }

  return triggers;
}

/** Merges curated + computed triggers, dedupes by (kind, subjectId) — curated copy wins — drops triggers for services the citizen already has an open application for, and sorts challans first, then by urgencyDays ascending. Headline/costOfInaction are returned in the requested language. */
export function computeTriggers(citizenId: string, lang: Lang = "en"): ProactiveTrigger[] {
  const curated = mockProactiveTriggers.filter((trigger) => trigger.citizenId === citizenId);
  const dynamic = computeDynamicTriggers(citizenId);
  const { applications } = useAppStore.getState();

  const openServiceIds = new Set(
    applications
      .filter((app) => app.citizenId === citizenId && !TERMINAL_APPLICATION_STATUSES.has(app.status))
      .map((app) => app.serviceId)
  );

  const byKey = new Map<string, ProactiveTrigger>();
  for (const trigger of curated) byKey.set(`${trigger.kind}:${trigger.subjectId}`, trigger);
  for (const trigger of dynamic) {
    const key = `${trigger.kind}:${trigger.subjectId}`;
    if (!byKey.has(key)) byKey.set(key, trigger);
  }

  return Array.from(byKey.values())
    .filter((trigger) => !openServiceIds.has(trigger.serviceId))
    .sort((a, b) => {
      const aChallan = a.kind === "CHALLAN_DUE_SOON" ? 0 : 1;
      const bChallan = b.kind === "CHALLAN_DUE_SOON" ? 0 : 1;
      if (aChallan !== bChallan) return aChallan - bChallan;
      return a.urgencyDays - b.urgencyDays;
    })
    .map((trigger) =>
      lang === "hi"
        ? { ...trigger, headline: trigger.headlineHi, costOfInaction: trigger.costOfInactionHi }
        : trigger
    );
}
