import { cn } from "@/lib/utils";

export interface ClarifyStateProps {
  rawQuery: string;
  clarifier: string;
  options: string[];
  onPick: (option: string) => void;
}

export function ClarifyState({ rawQuery, clarifier, options, onPick }: ClarifyStateProps) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6">
      <div className="flex flex-col gap-1">
        <p className="text-[13px] text-muted">You said</p>
        <p className="font-display text-[19px] font-bold text-ink">&ldquo;{rawQuery}&rdquo;</p>
      </div>
      <p className="text-[15px] text-ink">{clarifier}</p>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onPick(option)}
            className={cn(
              "min-h-[44px] rounded-xl border border-line bg-canvas px-5 py-3 text-[15px] font-medium text-ink",
              "transition-colors duration-150 hover:border-brand hover:bg-brand-soft hover:text-brand",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
