// lib/intentEngine.ts
// Turns whatever the citizen typed or said into a ranked list of tasks.
// Pure, synchronous, and deterministic — the 1600ms "thinking" delay it
// looks like it takes is simulated by the caller, not by this function.

import {
  mockIntents,
  mockServices,
  getChallansFor,
  getVehiclesFor,
  type IntentEntry,
  type Lang,
  type ServiceTask,
} from "@/lib/mockData";

export const CLARIFY_THRESHOLD = 0.45;

export interface IntentResolution {
  intentId: string | null;
  confidence: number;
  tasks: ServiceTask[];
  needsClarification: boolean;
  clarifier?: string;
  clarifierOptions?: string[];
  /** Only set when confidence is exactly 0 — three common starting points. */
  suggestions?: string[];
}

// Multi-word phrases are rewritten before tokenising; single-word aliases are
// added alongside (not instead of) the original token so nothing is lost.
const PHRASE_ALIASES: [string, string][] = [
  ["kho gaya", "lost"],
  ["kho diya", "lost"],
  ["gum ho gaya", "lost"],
];

const WORD_ALIASES: Record<string, string> = {
  gaadi: "vehicle",
  gadi: "vehicle",
  bike: "two-wheeler",
  scooty: "two-wheeler",
  lisens: "licence",
  license: "licence",
  dl: "licence",
  chalan: "challan",
  challans: "challan",
  naam: "name",
  kho: "lost",
  khogaya: "lost",
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function expandTokens(text: string): Set<string> {
  let expanded = normalize(text);
  for (const [phrase, canon] of PHRASE_ALIASES) {
    expanded = expanded.replaceAll(phrase, canon);
  }
  const tokens = expanded.split(" ").filter(Boolean);
  const out = new Set<string>();
  for (const token of tokens) {
    out.add(token);
    if (WORD_ALIASES[token]) out.add(WORD_ALIASES[token]);
  }
  return out;
}

/** Fraction of the pattern's own tokens that appear in the query's token set. */
function scorePattern(queryTokens: Set<string>, pattern: string): number {
  const patternTokens = expandTokens(pattern);
  if (patternTokens.size === 0) return 0;
  let hits = 0;
  for (const token of patternTokens) if (queryTokens.has(token)) hits++;
  return hits / patternTokens.size;
}

function scoreIntent(queryTokens: Set<string>, intent: IntentEntry): number {
  let best = 0;
  for (const pattern of [...intent.patternsEn, ...intent.patternsHi]) {
    const score = scorePattern(queryTokens, pattern);
    if (score > best) best = score;
  }
  return best;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Drops tasks that do not apply to this citizen's actual data. */
function applicableTasks(intent: IntentEntry, citizenId: string): ServiceTask[] {
  const hasUnpaidChallan = getChallansFor(citizenId).some((c) => c.status === "PENDING");
  const hasOwnershipPending = getVehiclesFor(citizenId).some((v) => v.ownershipPending);

  return intent.taskIds
    .filter((serviceId) => {
      if (serviceId === "CHALLAN_CLEAR" && !hasUnpaidChallan) return false;
      if (serviceId === "RC_TRANSFER" && !hasOwnershipPending) return false;
      return true;
    })
    .map((serviceId) => mockServices[serviceId]);
}

export function resolveIntent(query: string, lang: Lang, citizenId: string): IntentResolution {
  void lang; // patternsEn and patternsHi are both scored regardless of session language
  const queryTokens = expandTokens(query);

  let best: { intent: IntentEntry; score: number } | null = null;
  for (const intent of mockIntents) {
    const score = scoreIntent(queryTokens, intent);
    if (!best || score > best.score) best = { intent, score };
  }

  if (!best || best.score === 0) {
    return {
      intentId: null,
      confidence: 0,
      tasks: [],
      needsClarification: false,
      suggestions: mockIntents.slice(0, 3).map((intent) => capitalize(intent.patternsEn[0])),
    };
  }

  if (best.score < CLARIFY_THRESHOLD) {
    return {
      intentId: best.intent.id,
      confidence: best.score,
      tasks: [],
      needsClarification: true,
      clarifier: best.intent.clarifier,
      clarifierOptions: best.intent.clarifierOptions,
    };
  }

  return {
    intentId: best.intent.id,
    confidence: best.score,
    tasks: applicableTasks(best.intent, citizenId),
    needsClarification: false,
  };
}

/**
 * Used once the citizen has picked a clarifier chip: skips re-scoring free
 * text (which the chip label may not match well) and resolves the intent
 * that was already identified as the best fuzzy match, at full confidence.
 */
export function resolveIntentDirect(intentId: string, citizenId: string): IntentResolution {
  const intent = mockIntents.find((i) => i.id === intentId);
  if (!intent) {
    return {
      intentId: null,
      confidence: 0,
      tasks: [],
      needsClarification: false,
      suggestions: mockIntents.slice(0, 3).map((i) => capitalize(i.patternsEn[0])),
    };
  }
  return {
    intentId: intent.id,
    confidence: 1,
    tasks: applicableTasks(intent, citizenId),
    needsClarification: false,
  };
}
