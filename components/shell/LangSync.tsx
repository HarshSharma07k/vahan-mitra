"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

/** Keeps <html lang> in sync with session.lang so :lang(hi) selectors fire correctly. */
export function LangSync() {
  const lang = useAppStore((state) => state.session.lang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
