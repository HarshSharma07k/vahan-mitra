import { cn } from "@/lib/utils";
import type { VehicleClass } from "@/lib/mockData";

export interface PlateChipProps {
  regNumber: string;
  vehicleClass: VehicleClass;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES: Record<NonNullable<PlateChipProps["size"]>, string> = {
  sm: "px-2 py-1 text-[11px]",
  md: "px-3 py-1.5 text-[15px]",
  lg: "px-4 py-2 text-[19px]",
};

const COMMERCIAL_CLASSES: VehicleClass[] = ["GOODS", "TRANSPORT"];

export function PlateChip({ regNumber, vehicleClass, size = "md" }: PlateChipProps) {
  const isCommercial = COMMERCIAL_CLASSES.includes(vehicleClass);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[4px] font-display font-extrabold uppercase tracking-[0.15em] text-ink",
        isCommercial ? "bg-plate" : "bg-white border-2 border-ink",
        SIZE_CLASSES[size]
      )}
    >
      {regNumber}
    </span>
  );
}
