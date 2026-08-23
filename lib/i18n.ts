// lib/i18n.ts
// Every user-facing string goes through t(). Both en and hi are required for
// every key — Hindi is a real path here, not a toggle that half-works.

import type { Lang } from "@/lib/mockData";

const strings = {
  "nav.home": { en: "Home", hi: "होम" },
  "nav.fines": { en: "Fines", hi: "चालान" },
  "nav.documents": { en: "Documents", hi: "दस्तावेज़" },
  "nav.vehicles": { en: "Vehicles", hi: "गाड़ियाँ" },
  "nav.applications": { en: "Applications", hi: "आवेदन" },

  "persona.title": { en: "Who's using Vahan Mitra?", hi: "वाहन मित्र किसके लिए खोलें?" },
  "persona.subtitle": {
    en: "Pick a demo profile to continue.",
    hi: "जारी रखने के लिए एक डेमो प्रोफ़ाइल चुनें।",
  },
  "persona.continue": { en: "Continue as", hi: "इस रूप में जारी रखें" },

  "common.resetDemo": { en: "Reset demo", hi: "डेमो रीसेट करें" },
} as const;

export type TranslationKey = keyof typeof strings;

export function t(key: TranslationKey, lang: Lang): string {
  return strings[key][lang];
}
