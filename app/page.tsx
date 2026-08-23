"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PersonaCard } from "@/components/landing/PersonaCard";
import { MobileOtpDialog } from "@/components/landing/MobileOtpDialog";
import { useAppStore } from "@/store/useAppStore";
import { useHydrated } from "@/hooks/useHydrated";
import { t, type TranslationKey } from "@/lib/i18n";
import { getCitizen, getVehiclesFor, mockCitizens, type Citizen } from "@/lib/mockData";

const STAT_ROWS: { number: string; labelKey: TranslationKey }[] = [
  { number: "104", labelKey: "landing.stat1Label" },
  { number: "4", labelKey: "landing.stat2Label" },
  { number: "₹2,000", labelKey: "landing.stat3Label" },
];

const OTP_DIALOG_CITIZEN_ID = "cit_ananya";

export default function LandingPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const login = useAppStore((state) => state.login);
  const lang = useAppStore((state) => state.session.lang);
  const citizenId = useAppStore((state) => state.session.citizenId);

  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);

  useEffect(() => {
    if (hydrated && citizenId) router.replace("/home");
  }, [hydrated, citizenId, router]);

  async function handleSelect(citizen: Citizen) {
    if (selectingId) return;
    setSelectingId(citizen.id);
    await login(citizen.id);
    toast.success(t("landing.signedInAs", citizen.preferredLang, { name: citizen.fullName }));
    router.push("/home");
  }

  if (!hydrated || citizenId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="flex w-full max-w-6xl flex-col gap-6 px-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </main>
    );
  }

  const otpCitizen = getCitizen(OTP_DIALOG_CITIZEN_ID)!;

  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-16 lg:py-20">
        {/* Pitch */}
        <div className="flex flex-col gap-6">
          <p className="font-data text-[11px] font-medium uppercase tracking-widest text-muted">
            {t("landing.eyebrow", lang)}
          </p>
          <h1 className="max-w-lg font-display text-[32px] font-extrabold tracking-tight text-ink lg:text-[48px]">
            {t("landing.headline", lang)}
          </h1>
          <p className="max-w-[38ch] text-[15px] leading-[1.55] text-muted">
            {t("landing.paragraph", lang)}
          </p>

          <div className="mt-2 flex flex-col gap-4 border-t border-line pt-6">
            {STAT_ROWS.map((row) => (
              <div key={row.labelKey} className="flex items-baseline gap-3">
                <span className="font-data text-[19px] font-medium text-brand">{row.number}</span>
                <span className="text-[13px] text-muted">{t(row.labelKey, lang)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Persona picker */}
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-display text-[19px] font-bold text-ink">{t("persona.title", lang)}</h2>
            <p className="text-[13px] text-muted">{t("persona.subtitle", lang)}</p>
          </div>

          <div className="flex flex-col gap-3">
            {mockCitizens.map((citizen) => (
              <PersonaCard
                key={citizen.id}
                citizen={citizen}
                vehicles={getVehiclesFor(citizen.id)}
                lang={lang}
                loading={selectingId === citizen.id}
                disabled={selectingId !== null && selectingId !== citizen.id}
                onSelect={handleSelect}
              />
            ))}
          </div>

          <div className="flex flex-col items-start gap-2 pt-1">
            <p className="text-[13px] text-muted">{t("landing.demoAccountsNote", lang)}</p>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-[13px] text-brand"
              onClick={() => setOtpDialogOpen(true)}
              disabled={selectingId !== null}
            >
              {t("landing.useMobileOtp", lang)}
            </Button>
          </div>
        </div>
      </div>

      <MobileOtpDialog
        open={otpDialogOpen}
        onOpenChange={setOtpDialogOpen}
        citizen={otpCitizen}
        lang={lang}
        onVerified={(citizen) => {
          setOtpDialogOpen(false);
          void handleSelect(citizen);
        }}
      />
    </main>
  );
}
