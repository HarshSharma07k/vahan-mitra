"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/store/useAppStore";
import { NAV_ITEMS } from "@/lib/navItems";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { getCitizen } from "@/lib/mockData";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const lang = useAppStore((state) => state.session.lang);
  const citizenId = useAppStore((state) => state.session.citizenId);
  const challans = useAppStore((state) => state.challans);
  const logout = useAppStore((state) => state.logout);
  const resetDemo = useAppStore((state) => state.resetDemo);

  const citizen = citizenId ? getCitizen(citizenId) : undefined;
  const unpaidCount = challans.filter((c) => c.status === "PENDING").length;

  function handleSwitchUser() {
    logout();
    router.push("/");
  }

  function handleResetDemo() {
    resetDemo();
    toast.success(t("common.demoReset", lang));
  }

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-[248px] flex-col border-r border-line bg-surface lg:flex">
      <div className="flex flex-col gap-0.5 px-5 pt-6 pb-5">
        <span lang="hi" className="font-hindi text-[19px] font-semibold text-ink">
          वाहन मित्र
        </span>
        <span className="font-display text-[11px] font-extrabold tracking-[0.2em] text-muted">
          VAHAN MITRA
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-medium transition-colors duration-150",
                active ? "bg-brand-soft text-brand" : "text-muted hover:bg-canvas hover:text-ink"
              )}
            >
              {active && <span className="absolute inset-y-1 left-0 w-[3px] rounded-full bg-brand" />}
              <Icon size={20} strokeWidth={1.75} />
              <span className="flex-1">{t(item.labelKey, lang)}</span>
              {item.href === "/challans" && unpaidCount > 0 && (
                <Badge className="bg-plate text-ink" variant="secondary">
                  {unpaidCount}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {citizen && (
        <div className="border-t border-line px-3 py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left transition-colors duration-150 hover:bg-canvas"
              >
                <Avatar size="sm">
                  <AvatarFallback className="bg-brand-soft font-display text-[11px] font-bold text-brand">
                    {citizen.avatarInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1 truncate text-[13px] font-medium text-ink">
                  {citizen.fullName}
                </span>
                <ChevronsUpDown size={16} strokeWidth={1.75} className="text-muted" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onSelect={handleSwitchUser}>
                {t("shell.switchUser", lang)}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleResetDemo}>
                {t("common.resetDemo", lang)}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </aside>
  );
}
