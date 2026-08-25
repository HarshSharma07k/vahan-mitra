"use client";

import { useEffect, useRef, useState } from "react";
import { Mic } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/mockData";

export interface MicButtonProps {
  lang: Lang;
  onResult: (transcript: string) => void;
  disabled?: boolean;
}

const SCRIPTED_TRANSCRIPT: Record<Lang, string> = {
  en: "I bought a used bike",
  hi: "मैंने पुरानी बाइक खरीदी है",
};

const TYPE_MS = 45;

interface MinimalSpeechRecognitionEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface MinimalSpeechRecognition {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: MinimalSpeechRecognitionEvent) => void) | null;
}

interface SpeechRecognitionWindow {
  SpeechRecognition?: new () => MinimalSpeechRecognition;
  webkitSpeechRecognition?: new () => MinimalSpeechRecognition;
}

export function MicButton({ lang, onResult, disabled }: MicButtonProps) {
  const [listening, setListening] = useState(false);
  const [liveText, setLiveText] = useState("");
  const recognitionRef = useRef<MinimalSpeechRecognition | null>(null);
  const transcriptRef = useRef("");
  const reduceMotion = useReducedMotion();

  function startFallbackTyping() {
    setListening(true);
    setLiveText("");
    const script = SCRIPTED_TRANSCRIPT[lang];
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setLiveText(script.slice(0, i));
      if (i >= script.length) {
        clearInterval(timer);
        window.setTimeout(() => {
          setListening(false);
          onResult(script);
        }, 300);
      }
    }, TYPE_MS);
  }

  function handleClick() {
    if (listening || disabled) return;
    const w = window as unknown as SpeechRecognitionWindow;
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;

    if (!Ctor) {
      startFallbackTyping();
      return;
    }

    try {
      const recognition = new Ctor();
      recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;
      transcriptRef.current = "";

      recognition.onstart = () => {
        setListening(true);
        setLiveText("");
      };
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join(" ");
        transcriptRef.current = transcript;
        setLiveText(transcript);
      };
      recognition.onerror = () => {
        setListening(false);
        startFallbackTyping();
      };
      recognition.onend = () => {
        setListening(false);
        if (transcriptRef.current.trim()) onResult(transcriptRef.current.trim());
      };

      recognition.start();
    } catch {
      startFallbackTyping();
    }
  }

  useEffect(() => () => recognitionRef.current?.abort(), []);

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        aria-label={listening ? "Listening" : "Speak your request"}
        className={cn(
          "relative flex size-16 items-center justify-center rounded-full bg-brand text-white transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          disabled && "opacity-50"
        )}
      >
        {listening && !reduceMotion && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-brand"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <Mic size={24} strokeWidth={1.75} />
      </button>
      <p aria-live="polite" className="min-h-[24px] text-center text-[15px] text-ink">
        {listening ? liveText || "Listening…" : ""}
      </p>
    </div>
  );
}
