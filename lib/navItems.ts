// lib/navItems.ts
// Shared nav config for the desktop sidebar and mobile bottom bar. The mobile
// bar shows only the first five — Vehicles drops off on small screens.

import {
  Car,
  FolderLock,
  LayoutGrid,
  ReceiptIndianRupee,
  Route,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { TranslationKey } from "@/lib/i18n";

export interface NavItem {
  href: string;
  icon: LucideIcon;
  labelKey: TranslationKey;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/home", icon: LayoutGrid, labelKey: "nav.home" },
  { href: "/ask", icon: Sparkles, labelKey: "nav.ask" },
  { href: "/track", icon: Route, labelKey: "nav.track" },
  { href: "/challans", icon: ReceiptIndianRupee, labelKey: "nav.fines" },
  { href: "/wallet", icon: FolderLock, labelKey: "nav.documents" },
  { href: "/vehicles", icon: Car, labelKey: "nav.vehicles" },
];

export const MOBILE_NAV_ITEMS = NAV_ITEMS.slice(0, 5);
