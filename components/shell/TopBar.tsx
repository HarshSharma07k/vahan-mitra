"use client";

import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { NAV_ITEMS } from "@/lib/navItems";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/mockData";

const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "hi", label: "हिं" },
];

export function TopBar() {
  const pathname = usePathname();
  const lang = useAppStore((state) => state.session.lang);
  const setLang = useAppStore((state) => state.setLang);
  const resetDemo = useAppStore((state) => state.resetDemo);

  const activeItem = NAV_ITEMS.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  function handleResetDemo() {
    resetDemo();
    toast.success(t("common.demoReset", lang));
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-surface/95 px-4 backdrop-blur sm:px-8">
      <h1 className="font-display text-[19px] font-bold text-ink">
        {activeItem ? t(activeItem.labelKey, lang) : ""}
      </h1>

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-line bg-canvas p-0.5">
          {LANG_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setLang(option.value)}
              aria-pressed={lang === option.value}
              className={cn(
                "min-h-8 rounded-full px-3 text-[13px] font-medium transition-colors duration-150",
                lang === option.value ? "bg-brand text-white" : "text-muted hover:text-ink"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl"
          onClick={handleResetDemo}
        >
          {t("common.resetDemo", lang)}
        </Button>
      </div>
    </header>
  );
}
