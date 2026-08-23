"use client";

import { useSyncExternalStore } from "react";
import { useAppStore } from "@/store/useAppStore";

// useAppStore.persist is undefined during SSR — persist middleware skips
// attaching it when `window`/localStorage aren't available.
function subscribe(callback: () => void) {
  const unsubscribe = useAppStore.persist?.onFinishHydration(callback);
  return () => unsubscribe?.();
}

function getSnapshot() {
  return useAppStore.persist?.hasHydrated() ?? false;
}

function getServerSnapshot() {
  return false;
}

/**
 * True once the zustand `persist` middleware has read localStorage. Gates the
 * app shell's auth check so a returning citizen isn't bounced to "/" during
 * the one tick before their session rehydrates.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
