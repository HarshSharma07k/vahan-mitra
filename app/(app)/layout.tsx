"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Sidebar } from "@/components/shell/Sidebar";
import { MobileNav } from "@/components/shell/MobileNav";
import { TopBar } from "@/components/shell/TopBar";
import { useAppStore } from "@/store/useAppStore";
import { useHydrated } from "@/hooks/useHydrated";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const citizenId = useAppStore((state) => state.session.citizenId);

  useEffect(() => {
    if (hydrated && !citizenId) router.replace("/");
  }, [hydrated, citizenId, router]);

  if (!hydrated || !citizenId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
        <div className="flex w-full max-w-md flex-col gap-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />
      <div className="flex flex-col lg:pl-[248px]">
        <TopBar />
        <main className="flex-1 px-4 pb-24 pt-6 sm:px-8 lg:pb-10">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
