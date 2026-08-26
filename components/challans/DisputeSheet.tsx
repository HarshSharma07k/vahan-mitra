"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/common/Chip";
import { useAppStore } from "@/store/useAppStore";
import { wait, WRITE_MS } from "@/lib/mockApi";
import {
  DISPUTE_REASONS,
  inferDisputeReason,
  findSupportingDoc,
  buildDisputeStatement,
  type DisputeReason,
} from "@/lib/challanEngine";
import { t } from "@/lib/i18n";
import type { Challan, Lang, Vehicle } from "@/lib/mockData";

const REASON_LABEL_KEY: Record<
  DisputeReason,
  "dispute.reasonSold" | "dispute.reasonPlateMisread" | "dispute.reasonNotDriving" | "dispute.reasonWrongVehicle"
> = {
  "Vehicle already sold": "dispute.reasonSold",
  "Number plate misread": "dispute.reasonPlateMisread",
  "I wasn't driving": "dispute.reasonNotDriving",
  "Wrong vehicle in the photo": "dispute.reasonWrongVehicle",
};

export interface DisputeSheetProps {
  challan: Challan | null;
  vehicle: Vehicle | undefined;
  lang: Lang;
  onOpenChange: (open: boolean) => void;
}

export function DisputeSheet({ challan, vehicle, lang, onOpenChange }: DisputeSheetProps) {
  return (
    <Sheet open={Boolean(challan && vehicle)} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-h-[90vh] w-full rounded-t-2xl sm:max-w-lg">
        <div className="mx-auto mt-2 h-1.5 w-10 shrink-0 rounded-full bg-line" aria-hidden="true" />
        <SheetHeader>
          <SheetTitle className="font-display text-[19px] font-bold text-ink">
            {t("dispute.title", lang)}
          </SheetTitle>
        </SheetHeader>
        {challan && vehicle && (
          <DisputeSheetForm
            key={challan.id}
            challan={challan}
            vehicle={vehicle}
            lang={lang}
            onDone={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

interface DisputeSheetFormProps {
  challan: Challan;
  vehicle: Vehicle;
  lang: Lang;
  onDone: () => void;
}

function DisputeSheetForm({ challan, vehicle, lang, onDone }: DisputeSheetFormProps) {
  const citizenId = useAppStore((state) => state.session.citizenId);
  const wallet = useAppStore((state) => state.wallet);
  const disputeChallan = useAppStore((state) => state.disputeChallan);
  const [reason, setReason] = useState<DisputeReason>(() => inferDisputeReason(challan.disputeSignals));
  const [statement, setStatement] = useState(() =>
    buildDisputeStatement(inferDisputeReason(challan.disputeSignals), challan, vehicle, citizenId ?? "")
  );
  const [submitting, setSubmitting] = useState(false);

  const supportingDoc = findSupportingDoc(vehicle, wallet);

  function handleReasonChange(value: string) {
    const nextReason = value as DisputeReason;
    setReason(nextReason);
    setStatement(buildDisputeStatement(nextReason, challan, vehicle, citizenId ?? ""));
  }

  async function handleSubmit() {
    setSubmitting(true);
    await wait(WRITE_MS);
    disputeChallan(challan.id, {
      reason,
      statement,
      evidenceDocId: supportingDoc?.id,
    });
    setSubmitting(false);
    toast.success(t("dispute.submitToast", lang));
    onDone();
  }

  return (
    <>
      <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dispute-reason" className="text-[13px] font-medium text-ink">
            {t("dispute.reasonLabel", lang)}
          </Label>
          <Select value={reason} onValueChange={handleReasonChange}>
            <SelectTrigger id="dispute-reason" className="h-11 w-full rounded-xl">
              <SelectValue placeholder={t("dispute.reasonPlaceholder", lang)} />
            </SelectTrigger>
            <SelectContent>
              {DISPUTE_REASONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {t(REASON_LABEL_KEY[option], lang)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dispute-statement" className="text-[13px] font-medium text-ink">
            {t("dispute.statementLabel", lang)}
          </Label>
          <p className="text-[11px] text-muted">{t("dispute.statementNote", lang)}</p>
          <Textarea
            id="dispute-statement"
            value={statement}
            onChange={(event) => setStatement(event.target.value)}
            rows={6}
            className="rounded-xl text-[15px]"
          />
        </div>

        {supportingDoc && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-ink">{t("dispute.evidenceLabel", lang)}</span>
            <Chip tone="brand">{t("dispute.attachedDoc", lang, { title: supportingDoc.title })}</Chip>
          </div>
        )}

        <p className="text-[13px] text-muted">{t("dispute.pendingNote", lang)}</p>
      </div>

      <SheetFooter>
        <Button
          type="button"
          disabled={submitting || !statement.trim()}
          onClick={handleSubmit}
          className="h-11 w-full rounded-xl bg-brand hover:bg-brand/90"
        >
          {submitting ? t("dispute.submitting", lang) : t("dispute.submitCta", lang)}
        </Button>
      </SheetFooter>
    </>
  );
}
