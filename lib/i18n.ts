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
  "dashboard.actionStart": { en: "Start", hi: "शुरू करें" },

  // Complexity meter — "Kitna Kam?"
  "complexity.heroHeading": { en: "How much less work?", hi: "कितना कम काम?" },
  "complexity.heroQuestionsLabel": { en: "questions asked", hi: "सवाल पूछे गए" },
  "complexity.heroPortalsLabel": { en: "portals visited", hi: "पोर्टल खोलने पड़े" },
  "complexity.heroMinutesLabel": { en: "minutes spent", hi: "मिनट लगे" },
  "complexity.legacyPrefix": { en: "Parivahan", hi: "परिवहन" },
  "complexity.oursPrefix": { en: "Vahan Mitra", hi: "वाहन मित्र" },
  "complexity.questions": { en: "questions", hi: "सवाल" },
  "complexity.portals": { en: "portals", hi: "पोर्टल" },
  "complexity.screen": { en: "screen", hi: "स्क्रीन" },
  "complexity.minutes": { en: "min", hi: "मिनट" },
  "complexity.footer": {
    en: "Same forms. Same fees. Same law. Zero regulations changed.",
    hi: "वही फॉर्म। वही फीस। वही कानून। कोई नियम नहीं बदला।",
  },
  "complexity.receiptLine": {
    en: "You answered {{ours}} questions. The current portal asks {{legacy}} for the same thing.",
    hi: "आपने {{ours}} सवालों के जवाब दिए। मौजूदा पोर्टल इसी काम के लिए {{legacy}} सवाल पूछता है।",
  },

  // Proactive engine — "Aage Kya?"
  "reminders.schedule": {
    en: "We'll remind you on {{dates}} by {{channel}}.",
    hi: "हम आपको {{dates}} को {{channel}} पर याद दिलाएँगे।",
  },
  "reminders.footer": {
    en: "Reminders nearly double the chance a missing document actually arrives.",
    hi: "याद दिलाने से किसी गुम दस्तावेज़ के पहुँचने की संभावना लगभग दोगुनी हो जाती है।",
  },
  "reminders.mute": { en: "Mute", hi: "म्यूट करें" },
  "reminders.unmute": { en: "Unmute", hi: "अनम्यूट करें" },
  "reminders.muted": { en: "Muted", hi: "म्यूट है" },
  "reminders.channelWhatsapp": { en: "WhatsApp", hi: "व्हाट्सऐप" },
  "reminders.channelSms": { en: "SMS", hi: "एसएमएस" },
  "reminders.none": { en: "No reminders set for this application.", hi: "इस आवेदन के लिए कोई रिमाइंडर नहीं है।" },

  // Partial submission — "Aadha Bhar Do"
  "apply.canFileNowSingular": {
    en: "You can file now. 1 document is still needed by {{date}}.",
    hi: "आप अभी दर्ज कर सकते हैं। {{date}} तक 1 दस्तावेज़ और चाहिए।",
  },
  "apply.canFileNowPlural": {
    en: "You can file now. {{n}} documents are still needed by {{date}}.",
    hi: "आप अभी दर्ज कर सकते हैं। {{date}} तक {{n}} दस्तावेज़ और चाहिए।",
  },
  "apply.allDocsReady": { en: "Every document is in. Nothing owed.", hi: "सभी दस्तावेज़ आ गए हैं। कुछ बकाया नहीं है।" },
  "apply.blockingMissing": {
    en: "{{n}} document{{s}} still needed before you can file.",
    hi: "दर्ज करने से पहले {{n}} दस्तावेज़ और चाहिए।",
  },
  "apply.submitCta": { en: "File now", hi: "अभी दर्ज करें" },
  "apply.submitToast": { en: "Filed", hi: "दर्ज हो गया" },
  "apply.back": { en: "Back", hi: "पीछे" },
  "apply.next": { en: "Next", hi: "आगे" },
  "apply.stepOf": { en: "Step {{n}} of {{total}}", hi: "चरण {{n}} / {{total}}" },
  "apply.reviewHeading": { en: "Review before you file", hi: "दर्ज करने से पहले जाँच लें" },
  "apply.docAlready": { en: "Already in your wallet", hi: "पहले से आपके वॉलेट में है" },
  "apply.docReplace": { en: "Replace", hi: "बदलें" },
  "apply.docBlockingNote": { en: "Needed to file at all.", hi: "दर्ज करने के लिए ज़रूरी है।" },
  "apply.docOptionalNote": { en: "Needed before approval, not to file.", hi: "मंज़ूरी से पहले चाहिए, दर्ज करने के लिए नहीं।" },
  "apply.useSample": { en: "Use sample document", hi: "नमूना दस्तावेज़ इस्तेमाल करें" },
  "apply.uploadPrompt": { en: "Take a photo or choose a file", hi: "फोटो लें या फ़ाइल चुनें" },
  "apply.scanning": { en: "Reading your document…", hi: "आपका दस्तावेज़ पढ़ा जा रहा है…" },
  "apply.confirmDoc": { en: "Use this", hi: "इसे इस्तेमाल करें" },
  "apply.taskHeading": { en: "Documents needed", hi: "ज़रूरी दस्तावेज़" },
  "apply.feeLabel": { en: "Fee", hi: "शुल्क" },
  "apply.etaLabel": { en: "Usually takes", hi: "आम तौर पर लगता है" },
  "apply.etaDays": { en: "{{n}} days", hi: "{{n}} दिन" },
  "apply.legalNameNote": { en: "Legally this is", hi: "कानूनी नाम है" },

  // Pending docs card
  "pending.heading": { en: "Still needed", hi: "अभी और चाहिए" },
  "pending.dueBy": { en: "Due by {{date}}", hi: "{{date}} तक ज़रूरी" },
  "pending.upload": { en: "Upload", hi: "अपलोड करें" },
  "pending.complete": { en: "{{done}} of {{total}} documents in", hi: "{{total}} में से {{done}} दस्तावेज़ आ गए" },

  // File trail — "Kisne Dekha?"
  "trail.heading": { en: "Who has touched this file", hi: "इस फ़ाइल को किसने देखा" },
  "trail.ageing": {
    en: "Sitting at {{desk}} for {{days}} days. This office usually takes {{avg}}.",
    hi: "{{desk}} पर {{days}} दिनों से है। यह दफ़्तर आम तौर पर {{avg}} लेता है।",
  },
  "trail.askWhy": { en: "Ask why it's delayed", hi: "देरी की वजह पूछें" },
  "trail.queryFiled": { en: "Query filed", hi: "सवाल भेज दिया गया" },
  "trail.queryPushedTitle": { en: "You asked why this is taking longer", hi: "आपने पूछा कि इसमें देर क्यों हो रही है" },
  "trail.queryExpected": { en: "Expect a reply by {{date}}", hi: "{{date}} तक जवाब मिलने की उम्मीद" },
  "trail.showAll": { en: "Show all", hi: "सभी दिखाएँ" },
  "trail.showLess": { en: "Show less", hi: "कम दिखाएँ" },
  "trail.empty": { en: "No desk has opened your file yet.", hi: "अभी तक किसी डेस्क ने आपकी फ़ाइल नहीं खोली।" },
  "trail.action.RECEIVED": { en: "received your file", hi: "ने आपकी फ़ाइल प्राप्त की" },
  "trail.action.OPENED": { en: "opened your file", hi: "ने आपकी फ़ाइल खोली" },
  "trail.action.READ_RECORD": { en: "read your record", hi: "ने आपका रिकॉर्ड देखा" },
  "trail.action.FORWARDED": { en: "forwarded your file", hi: "ने आपकी फ़ाइल आगे भेजी" },
  "trail.action.QUERY_RAISED": { en: "raised a query", hi: "ने सवाल उठाया" },
  "trail.action.APPROVED": { en: "approved your file", hi: "ने आपकी फ़ाइल मंज़ूर की" },

  // Application status
  "status.DRAFT": { en: "Draft", hi: "मसौदा" },
  "status.SUBMITTED": { en: "Submitted", hi: "जमा किया गया" },
  "status.SUBMITTED_PARTIAL": { en: "Filed — some pending", hi: "दर्ज — कुछ बाकी" },
  "status.UNDER_REVIEW": { en: "Under review", hi: "समीक्षा में" },
  "status.QUERY_RAISED": { en: "Query raised", hi: "सवाल उठाया गया" },
  "status.APPROVED": { en: "Approved", hi: "मंज़ूर" },
  "status.DISPATCHED": { en: "Dispatched", hi: "भेजा गया" },
  "status.REJECTED": { en: "Rejected", hi: "अस्वीकृत" },

  // Document kind labels
  "doc.AADHAAR": { en: "Aadhaar card", hi: "आधार कार्ड" },
  "doc.PAN": { en: "PAN card", hi: "पैन कार्ड" },
  "doc.DL": { en: "Driving licence", hi: "ड्राइविंग लाइसेंस" },
  "doc.RC": { en: "Registration certificate", hi: "पंजीकरण प्रमाणपत्र" },
  "doc.INSURANCE": { en: "Insurance policy", hi: "बीमा पॉलिसी" },
  "doc.PUC": { en: "Pollution certificate", hi: "प्रदूषण प्रमाणपत्र" },
  "doc.ADDRESS_PROOF": { en: "Address proof", hi: "पते का प्रमाण" },
  "doc.SALE_DEED": { en: "Sale deed", hi: "बिक्री विलेख" },
  "doc.FORM_29": { en: "Form 29", hi: "फॉर्म 29" },
  "doc.FORM_30": { en: "Form 30", hi: "फॉर्म 30" },
  "doc.NOC": { en: "No objection certificate", hi: "अनापत्ति प्रमाणपत्र" },
  "doc.PHOTO": { en: "Photograph", hi: "फोटो" },
  "doc.SIGNATURE": { en: "Signature", hi: "हस्ताक्षर" },

  // Plan page
  "plan.heading": { en: "Here's what needs to happen", hi: "यह करना होगा" },
  "plan.subheading": { en: "In the order it needs to happen.", hi: "जिस क्रम में यह होना है।" },
  "plan.startCta": { en: "Start", hi: "शुरू करें" },
  "plan.dependsOn": { en: "After: {{title}}", hi: "पहले यह: {{title}}" },
  "plan.totalFee": { en: "Total fee", hi: "कुल शुल्क" },
  "plan.totalDays": { en: "Usually takes", hi: "आम तौर पर लगता है" },
  "plan.notFoundHeading": { en: "This plan isn't here anymore", hi: "यह योजना अब यहाँ नहीं है" },
  "plan.notFoundDirection": {
    en: "Tell us again what you need and we'll build a fresh one.",
    hi: "फिर से बताएं कि आपको क्या चाहिए, हम नई योजना बनाएंगे।",
  },
  "apply.notFoundHeading": { en: "This task isn't here anymore", hi: "यह काम अब यहाँ नहीं है" },
  "apply.notFoundDirection": {
    en: "Tell us again what you need and we'll build a fresh plan.",
    hi: "फिर से बताएं कि आपको क्या चाहिए, हम नई योजना बनाएंगे।",
  },
  "track.notFoundHeading": { en: "This application isn't here", hi: "यह आवेदन यहाँ नहीं है" },
  "track.notFoundDirection": {
    en: "It may have been reset. Here's everything you have in progress.",
    hi: "हो सकता है यह रीसेट हो गया हो। यहाँ आपके सभी चालू आवेदन हैं।",
  },

  // Track list
  "track.heading": { en: "Your applications", hi: "आपके आवेदन" },
  "track.emptyHeading": { en: "Nothing to track yet", hi: "अभी ट्रैक करने के लिए कुछ नहीं" },
  "track.emptyDirection": {
    en: "Once you start something, it shows up here with every step in the open.",
    hi: "जैसे ही आप कुछ शुरू करेंगे, वह हर कदम के साथ यहाँ दिखेगा।",
  },
  "track.emptyCta": { en: "Ask Vahan Mitra", hi: "वाहन मित्र से पूछें" },
  "track.filterAll": { en: "All", hi: "सभी" },

  // Landing precedents
  "landing.comparisonHeading": { en: "How this compares", hi: "यह कैसे अलग है" },
  "landing.precedent1Title": { en: "Michigan", hi: "मिशिगन" },
  "landing.precedent1Body": {
    en: "Cut its benefits application 80% — fewer questions, same eligibility rules, zero regulations changed.",
    hi: "अपने लाभ आवेदन को 80% छोटा किया — कम सवाल, वही पात्रता नियम, कोई नियम नहीं बदला।",
  },
  "landing.precedent2Title": { en: "Singapore", hi: "सिंगापुर" },
  "landing.precedent2Body": {
    en: "Cut birth registration from 60 minutes to 15 by bundling every service around the life event, not the department.",
    hi: "जन्म पंजीकरण को 60 मिनट से घटाकर 15 मिनट किया, हर सेवा को विभाग की जगह जीवन की घटना के इर्द-गिर्द जोड़कर।",
  },
  "landing.precedent3Title": { en: "Estonia", hi: "एस्टोनिया" },
  "landing.precedent3Body": {
    en: "Made asking a citizen for the same information twice illegal — once the state has it, no form may ask again.",
    hi: "नागरिक से एक ही जानकारी दोबारा माँगना गैरकानूनी बना दिया — एक बार राज्य के पास जानकारी आने पर, कोई फॉर्म फिर नहीं माँग सकता।",
  },
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

export function docLabel(kind: string, lang: Lang): string {
  const key = `doc.${kind}` as TranslationKey;
  return key in strings ? t(key, lang) : kind;
}

export function statusLabel(status: string, lang: Lang): string {
  const key = `status.${status}` as TranslationKey;
  return key in strings ? t(key, lang) : status;
}

export function trailActionLabel(action: string, lang: Lang): string {
  const key = `trail.action.${action}` as TranslationKey;
  return key in strings ? t(key, lang) : action;
}
