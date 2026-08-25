"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MicButton } from "@/components/ask/MicButton";
import { ThinkingSteps } from "@/components/ask/ThinkingSteps";
import { ClarifyState } from "@/components/ask/ClarifyState";
import { NoMatchState } from "@/components/ask/NoMatchState";
import { useAppStore } from "@/store/useAppStore";
import { resolveIntent, resolveIntentDirect, type IntentResolution } from "@/lib/intentEngine";
import { formatMockId } from "@/lib/utils";
import { MOCK_TODAY, type TaskPlan } from "@/lib/mockData";

type Stage = "idle" | "thinking" | "clarify" | "noMatch";

export default function AskPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = useAppStore((s) => s.session.lang);
  const citizenId = useAppStore((s) => s.session.citizenId);
  const vehicles = useAppStore((s) => s.vehicles);
  const challans = useAppStore((s) => s.challans);
  const savePlan = useAppStore((s) => s.resolveIntent);

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [stage, setStage] = useState<Stage>("idle");
  const [pendingQuery, setPendingQuery] = useState("");
  const [resolution, setResolution] = useState<IntentResolution | null>(null);

  const unpaidCount = challans.filter((c) => c.status === "PENDING").length;

  const thinkingLines = useMemo(
    () => [
      "Reading your request",
      `Checking your ${vehicles.length} vehicle${vehicles.length === 1 ? "" : "s"} and ${unpaidCount} open fine${unpaidCount === 1 ? "" : "s"}`,
      `Found ${resolution?.tasks.length ?? 0} thing${(resolution?.tasks.length ?? 0) === 1 ? "" : "s"} to do`,
    ],
    [vehicles.length, unpaidCount, resolution]
  );

  function routeToPlan(rawQuery: string, result: IntentResolution) {
    if (!citizenId || !result.intentId) return;
    const totalFeeInr = result.tasks.reduce((sum, task) => sum + task.feeInr, 0);
    const totalDays = result.tasks.reduce((max, task) => Math.max(max, task.estimatedDays), 0);
    const plan: TaskPlan = {
      id: formatMockId("plan_", `${citizenId}_${result.intentId}_${rawQuery}`),
      citizenId,
      rawQuery,
      intentId: result.intentId,
      confidence: result.confidence,
      createdOn: MOCK_TODAY,
      tasks: result.tasks,
      totalFeeInr,
      totalDays,
    };
    savePlan(plan);
    router.push(`/plan/${plan.id}`);
  }

  function beginResolve(text: string) {
    if (!citizenId || !text.trim()) return;
    const result = resolveIntent(text, lang, citizenId);
    setPendingQuery(text.trim());
    setQuery(text);
    setResolution(result);
    setStage("thinking");
  }

  function handleThinkingDone() {
    if (!resolution) return;
    if (resolution.needsClarification) {
      setStage("clarify");
      return;
    }
    if (!resolution.intentId) {
      setStage("noMatch");
      return;
    }
    routeToPlan(pendingQuery, resolution);
  }

  function handleClarifyPick(option: string) {
    if (!citizenId || !resolution?.intentId) return;
    const direct = resolveIntentDirect(resolution.intentId, citizenId);
    const combinedQuery = `${pendingQuery} — ${option}`;
    if (direct.tasks.length === 0) {
      setPendingQuery(combinedQuery);
      setResolution({ ...direct, intentId: null, suggestions: direct.tasks.length === 0 ? resolution.clarifierOptions : undefined });
      setStage("noMatch");
      return;
    }
    routeToPlan(combinedQuery, direct);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    beginResolve(query);
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 py-6">
      <div className="flex flex-col gap-2 text-center">
        <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-brand-soft text-brand">
          <Sparkles size={20} strokeWidth={1.75} />
        </span>
        <h1 className="font-display text-[24px] font-bold text-ink">What do you need?</h1>
        <p className="text-[15px] text-muted">Tell us in your own words. No form names, no jargon.</p>
      </div>

      {stage === "idle" && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface p-2 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.12)] transition-colors duration-150 focus-within:border-brand">
            <Label htmlFor="ask-input" className="sr-only">
              What do you need?
            </Label>
            <Input
              id="ask-input"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="I bought a used bike"
              className="h-16 flex-1 border-0 bg-transparent px-3 text-[19px] shadow-none focus-visible:ring-0"
            />
            <Button type="submit" size="lg" className="h-12 shrink-0 rounded-xl bg-brand hover:bg-brand/90">
              Ask
            </Button>
          </div>
          <div className="flex justify-center">
            <MicButton lang={lang} onResult={beginResolve} />
          </div>
        </form>
      )}

      {stage === "thinking" && <ThinkingSteps lines={thinkingLines} onDone={handleThinkingDone} />}

      {stage === "clarify" && resolution?.clarifier && resolution.clarifierOptions && (
        <ClarifyState
          rawQuery={pendingQuery}
          clarifier={resolution.clarifier}
          options={resolution.clarifierOptions}
          onPick={handleClarifyPick}
        />
      )}

      {stage === "noMatch" && (
        <NoMatchState
          rawQuery={pendingQuery}
          suggestions={resolution?.suggestions ?? []}
          onPick={beginResolve}
        />
      )}
    </div>
  );
}
