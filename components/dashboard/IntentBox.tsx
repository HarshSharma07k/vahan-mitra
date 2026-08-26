"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Mic, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/mockData";

const ROTATING_PLACEHOLDERS = [
  "I bought a used bike",
  "licence kho gaya",
  "moving to Bangalore with my car",
];

const ROTATE_MS = 3500;

export interface IntentBoxProps {
  lang: Lang;
}

export function IntentBox({ lang }: IntentBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showEmptyHint, setShowEmptyHint] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % ROTATING_PLACEHOLDERS.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, []);

  function goToAsk(value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      setShowEmptyHint(true);
      return;
    }
    setShowEmptyHint(false);
    router.push(`/ask?q=${encodeURIComponent(trimmed)}`);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    goToAsk(query);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-2xl border border-line bg-surface p-2 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.12)] transition-colors duration-150 focus-within:border-brand"
      >
        <Sparkles size={20} strokeWidth={1.75} className="ml-2 shrink-0 text-brand" />
        <Label htmlFor="intent-input" className="sr-only">
          {t("dashboard.intentSubmitLabel", lang)}
        </Label>
        <Input
          id="intent-input"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            if (showEmptyHint && event.target.value.trim()) setShowEmptyHint(false);
          }}
          placeholder={ROTATING_PLACEHOLDERS[placeholderIndex]}
          aria-describedby={showEmptyHint ? "intent-empty-hint" : undefined}
          className="h-14 flex-1 border-0 bg-transparent px-1 text-[19px] shadow-none focus-visible:ring-0"
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label={t("dashboard.intentSubmitLabel", lang)}
          onClick={() => goToAsk(query)}
          className="size-11 shrink-0 rounded-xl text-brand hover:bg-brand-soft"
        >
          <Mic size={20} strokeWidth={1.75} />
        </Button>
      </form>
      {showEmptyHint && (
        <p id="intent-empty-hint" role="alert" className="px-2 text-[13px] text-warn">
          {t("dashboard.intentEmptyHint", lang)}
        </p>
      )}
    </div>
  );
}
