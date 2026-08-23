// lib/i18n.ts
// Every user-facing string goes through t(). Both en and hi are required for
// every key — Hindi is a real path here, not a toggle that half-works.

import type { Lang } from "@/lib/mockData";

const strings = {
  "nav.home": { en: "Home", hi: "होम" },
  "nav.ask": { en: "Ask", hi: "पूछें" },
  "nav.track": { en: "Track", hi: "ट्रैक करें" },
  "nav.fines": { en: "Fines", hi: "चालान" },
  "nav.documents": { en: "Documents", hi: "दस्तावेज़" },
  "nav.vehicles": { en: "Vehicles", hi: "गाड़ियाँ" },

  "persona.title": { en: "Who's using Vahan Mitra?", hi: "वाहन मित्र किसके लिए खोलें?" },
  "persona.subtitle": {
    en: "Pick a demo profile to continue.",
    hi: "जारी रखने के लिए एक डेमो प्रोफ़ाइल चुनें।",
  },
  "persona.continue": { en: "Continue as", hi: "इस रूप में जारी रखें" },

  "common.resetDemo": { en: "Reset demo", hi: "डेमो रीसेट करें" },
  "common.demoReset": { en: "Demo reset", hi: "डेमो रीसेट हो गया" },
  "common.cancel": { en: "Cancel", hi: "रद्द करें" },

  // Landing
  "landing.eyebrow": { en: "PARIVAHAN SEWA, REBUILT", hi: "परिवहन सेवा, नए सिरे से" },
  "landing.headline": {
    en: "Zero trips. Zero jargon. Zero agents.",
    hi: "न चक्कर, न शब्दजाल, न एजेंट।",
  },
  "landing.paragraph": {
    en: "Parivahan splits one life event — buying a bike, losing a licence — across four separate portals and a hundred-plus links named after internal government forms. This replaces the directory with a single box you talk to in plain words.",
    hi: "परिवहन एक ही ज़रूरी काम — जैसे बाइक खरीदना या लाइसेंस खोना — को चार अलग पोर्टलों और सौ से ज़्यादा लिंकों में बाँट देता है, हर लिंक किसी सरकारी फॉर्म के नाम पर। यहाँ बस एक बॉक्स है, जिससे आप अपनी भाषा में बात करते हैं।",
  },
  "landing.stat1Label": {
    en: "links on the current landing page",
    hi: "मौजूदा लैंडिंग पेज पर लिंक",
  },
  "landing.stat2Label": {
    en: "separate portals for one vehicle",
    hi: "एक गाड़ी के लिए अलग-अलग पोर्टल",
  },
  "landing.stat3Label": {
    en: "the going rate for an agent to do a ₹530 job",
    hi: "₹530 के काम के लिए एजेंट की दर",
  },
  "landing.enterAs": { en: "Enter as {{name}}", hi: "{{name}} के रूप में प्रवेश करें" },
  "landing.noVehicles": { en: "No vehicles yet", hi: "अभी कोई गाड़ी नहीं" },
  "landing.demoAccountsNote": {
    en: "Demo accounts. Any OTP works — the field prefills with 1234.",
    hi: "डेमो खाते। कोई भी OTP चलेगा — फ़ील्ड में पहले से 1234 भरा है।",
  },
  "landing.useMobileOtp": { en: "Use mobile + OTP instead", hi: "इसके बजाय मोबाइल + OTP आज़माएँ" },
  "landing.signedInAs": { en: "Signed in as {{name}}", hi: "{{name}} के रूप में साइन इन हुआ" },
  "landing.otpDialogTitle": { en: "Sign in with mobile", hi: "मोबाइल से साइन इन करें" },
  "landing.otpDialogDesc": {
    en: "Enter your mobile number. We'll send a one-time code.",
    hi: "अपना मोबाइल नंबर डालें। हम एक बार का कोड भेजेंगे।",
  },
  "landing.mobileLabel": { en: "Mobile number", hi: "मोबाइल नंबर" },
  "landing.otpLabel": { en: "OTP", hi: "OTP" },
  "landing.verifying": { en: "Verifying...", hi: "सत्यापित हो रहा है..." },
  "landing.signingIn": { en: "Signing in...", hi: "साइन इन हो रहा है..." },

  // App shell
  "shell.switchUser": { en: "Switch demo user", hi: "डेमो यूज़र बदलें" },

  // Dashboard
  "dashboard.greetingMorning": { en: "Good morning, {{name}}", hi: "सुप्रभात, {{name}}" },
  "dashboard.greetingAfternoon": { en: "Good afternoon, {{name}}", hi: "नमस्ते, {{name}}" },
  "dashboard.greetingEvening": { en: "Good evening, {{name}}", hi: "शुभ संध्या, {{name}}" },
  "dashboard.summaryFineSingular": { en: "1 fine open", hi: "1 चालान बकाया" },
  "dashboard.summaryFinePlural": { en: "{{n}} fines open", hi: "{{n}} चालान बकाया" },
  "dashboard.summaryAppSingular": { en: "1 application in progress", hi: "1 आवेदन प्रक्रिया में" },
  "dashboard.summaryAppPlural": { en: "{{n}} applications in progress", hi: "{{n}} आवेदन प्रक्रिया में" },
  "dashboard.summaryDocSingular": { en: "1 document needs attention", hi: "1 दस्तावेज़ पर ध्यान चाहिए" },
  "dashboard.summaryDocPlural": { en: "{{n}} documents need attention", hi: "{{n}} दस्तावेज़ों पर ध्यान चाहिए" },
  "dashboard.summaryAllClear": {
    en: "Everything's in order — nothing needs your attention right now.",
    hi: "सब कुछ ठीक है — अभी किसी चीज़ पर ध्यान देने की ज़रूरत नहीं।",
  },
  "dashboard.intentSubmitLabel": { en: "Ask Vahan Mitra", hi: "वाहन मित्र से पूछें" },
  "dashboard.actionHeading": { en: "Needs your action", hi: "आपकी कार्रवाई ज़रूरी है" },
  "dashboard.noticedLabel": {
    en: "You didn't ask for this. We noticed.",
    hi: "आपने यह नहीं माँगा। हमने खुद देखा।",
  },
  "dashboard.actionEmptyHeading": {
    en: "Nothing needs your attention",
    hi: "अभी किसी चीज़ पर ध्यान देने की ज़रूरत नहीं",
  },
  "dashboard.actionEmptyDirection": {
    en: "We'll surface anything that needs a fix here, as soon as it comes up.",
    hi: "यहाँ वही दिखेगा जिसे ठीक करना ज़रूरी होगा, जैसे ही वह सामने आएगा।",
  },
  "dashboard.actionEmptyCta": { en: "Ask Vahan Mitra", hi: "वाहन मित्र से पूछें" },
  "dashboard.actionOwnershipPending": {
    en: "Still registered to {{name}}",
    hi: "अभी भी {{name}} के नाम दर्ज है",
  },
  "dashboard.actionDocExpired": { en: "{{title}} expired {{when}}", hi: "{{title}} की मियाद {{when}} खत्म हुई" },
  "dashboard.actionDocExpiring": { en: "{{title}} expires {{when}}", hi: "{{title}} की मियाद {{when}} खत्म होगी" },
  "dashboard.actionBlocked": { en: "Stuck at {{stage}}", hi: "{{stage}} पर अटका है" },
  "dashboard.actionChallans": {
    en: "{{amount}} in unpaid fines across {{count}} challan{{s}}",
    hi: "{{count}} चालान में {{amount}} बकाया",
  },
  "dashboard.actionFix": { en: "Fix this", hi: "ठीक करें" },
  "dashboard.actionPay": { en: "Pay now", hi: "अभी भुगतान करें" },
  "dashboard.actionReview": { en: "Review", hi: "देखें" },
  "dashboard.vehiclesHeading": { en: "Your vehicles", hi: "आपकी गाड़ियाँ" },
  "dashboard.vehiclesEmptyHeading": { en: "No vehicles yet", hi: "अभी कोई गाड़ी नहीं" },
  "dashboard.vehiclesEmptyDirection": {
    en: "Add a vehicle to track its documents, fines and paperwork in one place.",
    hi: "दस्तावेज़, चालान और कागज़ी काम एक जगह ट्रैक करने के लिए गाड़ी जोड़ें।",
  },
  "dashboard.vehiclesEmptyCta": { en: "Add a vehicle", hi: "गाड़ी जोड़ें" },
  "dashboard.insuranceLabel": { en: "Insurance", hi: "बीमा" },
  "dashboard.pucLabel": { en: "PUC", hi: "पीयूसी" },
  "dashboard.applicationsHeading": { en: "In progress", hi: "प्रक्रिया में" },
  "dashboard.applicationsEmptyHeading": {
    en: "No applications in progress",
    hi: "कोई आवेदन प्रक्रिया में नहीं",
  },
  "dashboard.applicationsEmptyDirection": {
    en: "Start one from the box above — describe what you need in your own words.",
    hi: "ऊपर दिए गए बॉक्स से शुरू करें — अपने शब्दों में बताएं कि आपको क्या चाहिए।",
  },
  "dashboard.applicationsEmptyCta": { en: "Ask Vahan Mitra", hi: "वाहन मित्र से पूछें" },
  "dashboard.expectedBy": { en: "Expected by {{date}}", hi: "{{date}} तक अपेक्षित" },
} as const;

export type TranslationKey = keyof typeof strings;

export function t(
  key: TranslationKey,
  lang: Lang,
  vars?: Record<string, string | number>
): string {
  const raw = strings[key][lang];
  if (!vars) return raw;
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replaceAll(`{{${k}}}`, String(v)),
    raw as string
  );
}
