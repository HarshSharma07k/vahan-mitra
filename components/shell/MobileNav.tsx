"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { MOBILE_NAV_ITEMS } from "@/lib/navItems";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const lang = useAppStore((state) => state.session.lang);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-surface lg:hidden">
      {MOBILE_NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-h-11 flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors duration-150",
              active ? "text-brand" : "text-muted"
            )}
          >
            <Icon size={20} strokeWidth={1.75} />
            <span className="text-[11px] font-medium">{t(item.labelKey, lang)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
