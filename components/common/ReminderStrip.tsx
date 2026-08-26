"use client";

// Reminders are opt-out and visible: the real schedule, the real message
// text on tap, and a mute toggle — never a settings checkbox three screens deep.

import { useState } from "react";
import { MessageCircle, MessageSquare, Bell, BellOff } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { t, type TranslationKey } from "@/lib/i18n";
import { useAppStore } from "@/store/useAppStore";
import type { Lang, Reminder } from "@/lib/mockData";

export interface ReminderStripProps {
  reminders: Reminder[];
  lang: Lang;
  className?: string;
}

const CHANNEL_ICON = { WHATSAPP: MessageCircle, SMS: MessageSquare } as const;
const CHANNEL_LABEL_KEY: Record<Reminder["channel"], TranslationKey> = {
  WHATSAPP: "reminders.channelWhatsapp",
  SMS: "reminders.channelSms",
};

function shortDate(iso: string): string {
  return formatDate(iso).replace(/ \d{4}$/, "");
}

export function ReminderStrip({ reminders, lang, className }: ReminderStripProps) {
  const toggleMute = useAppStore((state) => state.toggleReminderMute);
  const [openId, setOpenId] = useState<string | null>(null);

  if (reminders.length === 0) {
    return <p className={cn("text-[13px] text-muted", className)}>{t("reminders.none", lang)}</p>;
  }

  const dates = reminders.map((reminder) => shortDate(reminder.sendOn)).join(", ");
  const channelLabels = Array.from(
    new Set(reminders.map((reminder) => t(CHANNEL_LABEL_KEY[reminder.channel], lang)))
  ).join(lang === "hi" ? " और " : " and ");

  return (
    <div className={cn("flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4", className)}>
      <div className="flex flex-col gap-1">
        <p className="text-[15px] text-ink">
          {t("reminders.schedule", lang, { dates, channel: channelLabels })}
        </p>
        <p className="text-[13px] text-muted">{t("reminders.footer", lang)}</p>
      </div>

      <div className="flex flex-col gap-2">
        {reminders.map((reminder) => {
          const Icon = CHANNEL_ICON[reminder.channel];
          const isOpen = openId === reminder.id;
          return (
            <div key={reminder.id} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : reminder.id)}
                  aria-expanded={isOpen}
                  className={cn(
                    "flex min-h-9 flex-1 items-center gap-2 rounded-full border px-3 text-[13px] transition-colors duration-150",
                    reminder.muted
                      ? "border-line bg-canvas text-muted"
                      : "border-brand/20 bg-brand-soft text-brand"
                  )}
                >
                  <Icon size={14} strokeWidth={1.75} />
                  <span>{shortDate(reminder.sendOn)}</span>
                  {reminder.muted && <span className="text-[11px]">· {t("reminders.muted", lang)}</span>}
                </button>
                <button
                  type="button"
                  onClick={() => toggleMute(reminder.id)}
                  aria-label={reminder.muted ? t("reminders.unmute", lang) : t("reminders.mute", lang)}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors duration-150 hover:text-ink"
                >
                  {reminder.muted ? (
                    <BellOff size={16} strokeWidth={1.75} />
                  ) : (
                    <Bell size={16} strokeWidth={1.75} />
                  )}
                </button>
              </div>
              {isOpen && (
                <p className="rounded-xl bg-canvas px-3 py-2 text-[13px] text-ink">{reminder.message}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
