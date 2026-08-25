// lib/ocrEngine.ts
// Simulated document scan. Every upload — real, camera, or a sample file —
// goes through here so the citizen sees the same 1200ms sweep-and-extract
// beat every time.

import { wait } from "@/lib/mockApi";
import { mockOcrFixtures, type DocKind, type OcrFixture } from "@/lib/mockData";

const OCR_MS = 1200;

function variantFromFileName(fileName: string): OcrFixture["variant"] {
  const lower = fileName.toLowerCase();
  if (lower.includes("blur")) return "blur";
  if (lower.includes("mismatch")) return "mismatch";
  if (lower.includes("expired")) return "expired";
  return "clean";
}

export async function runOcr(kind: DocKind, fileName: string): Promise<OcrFixture> {
  await wait(OCR_MS);

  const variant = variantFromFileName(fileName);
  const exact = mockOcrFixtures.find((f) => f.kind === kind && f.variant === variant);
  if (exact) return exact;

  const clean = mockOcrFixtures.find((f) => f.kind === kind && f.variant === "clean");
  if (clean) return clean;

  const rcClean = mockOcrFixtures.find((f) => f.kind === "RC" && f.variant === "clean");
  if (rcClean) return rcClean;

  throw new Error("No RC clean fixture seeded — mockOcrFixtures is misconfigured");
}

const VARIANT_LABELS: Record<OcrFixture["variant"], string> = {
  clean: "Clean scan",
  blur: "Blurry scan",
  mismatch: "Name mismatch",
  expired: "Expired document",
};

export interface SampleDoc {
  fileName: string;
  label: string;
}

/** Up to three real sample files a judge can use when they have no camera or files of their own. */
export function getSampleDocsFor(kind: DocKind): SampleDoc[] {
  const fixtures = mockOcrFixtures.filter((f) => f.kind === kind).slice(0, 3);
  if (fixtures.length > 0) {
    return fixtures.map((f) => ({
      fileName: `${kind.toLowerCase()}-sample-${f.variant}.jpg`,
      label: VARIANT_LABELS[f.variant],
    }));
  }
  const rcClean = mockOcrFixtures.find((f) => f.kind === "RC" && f.variant === "clean");
  return rcClean ? [{ fileName: "rc-sample-clean.jpg", label: "Use sample document" }] : [];
}
