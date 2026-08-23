"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { t } from "@/lib/i18n";
import type { Citizen, Lang } from "@/lib/mockData";

const AUTO_SUBMIT_MS = 800;

export interface MobileOtpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  citizen: Citizen;
  lang: Lang;
  onVerified: (citizen: Citizen) => void;
}

export function MobileOtpDialog({
  open,
  onOpenChange,
  citizen,
  lang,
  onVerified,
}: MobileOtpDialogProps) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => onVerified(citizen), AUTO_SUBMIT_MS);
    return () => clearTimeout(timer);
  }, [open, citizen, onVerified]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display">{t("landing.otpDialogTitle", lang)}</DialogTitle>
          <DialogDescription>{t("landing.otpDialogDesc", lang)}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="otp-dialog-mobile">{t("landing.mobileLabel", lang)}</Label>
            <Input
              id="otp-dialog-mobile"
              readOnly
              value={citizen.mobile}
              className="rounded-xl font-data"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="otp-dialog-otp">{t("landing.otpLabel", lang)}</Label>
            <Input
              id="otp-dialog-otp"
              readOnly
              value={citizen.demoOtp}
              className="rounded-xl font-data tracking-[0.3em]"
            />
          </div>
          {open && (
            <p aria-live="polite" className="text-[13px] text-muted">
              {t("landing.verifying", lang)}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
