// lib/challanEngine.ts
// Pure helpers behind the dispute flow: which of the four fixed reasons the
// signals imply, which wallet document backs it, and the first-person
// statement text the citizen edits before submitting.

import { formatDate } from "@/lib/utils";
import type { Challan, Vehicle, WalletDocument } from "@/lib/mockData";

export const DISPUTE_REASONS = [
  "Vehicle already sold",
  "Number plate misread",
  "I wasn't driving",
  "Wrong vehicle in the photo",
] as const;

export type DisputeReason = (typeof DISPUTE_REASONS)[number];

export function inferDisputeReason(signals: string[]): DisputeReason {
  const text = signals.join(" ").toLowerCase();
  if (text.includes("sold")) return "Vehicle already sold";
  if (text.includes("duplicate")) return "Wrong vehicle in the photo";
  if (text.includes("previous owner") || text.includes("before you bought")) return "I wasn't driving";
  if (text.includes("misread") || text.includes("plate")) return "Number plate misread";
  return "Vehicle already sold";
}

function normReg(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase();
}

/** Best matching document already in the wallet — sale deed first, then RC, then any identity doc. */
export function findSupportingDoc(vehicle: Vehicle, wallet: WalletDocument[]): WalletDocument | undefined {
  const target = normReg(vehicle.regNumber);
  const matchesVehicle = (doc: WalletDocument) =>
    normReg(doc.title).includes(target) ||
    doc.fields.some((f) => f.key === "regNumber" && normReg(f.value) === target);

  return (
    wallet.find((doc) => doc.kind === "SALE_DEED" && matchesVehicle(doc)) ??
    wallet.find((doc) => doc.kind === "RC" && matchesVehicle(doc)) ??
    wallet.find((doc) => doc.kind === "AADHAAR")
  );
}

export function buildDisputeStatement(
  reason: DisputeReason,
  challan: Challan,
  vehicle: Vehicle,
  citizenName: string
): string {
  const issued = formatDate(challan.issuedOn);

  switch (reason) {
    case "Vehicle already sold":
      return `I, ${citizenName}, sold ${vehicle.regNumber} on ${formatDate(vehicle.soldOn ?? challan.issuedOn)}. This challan (${challan.challanNumber}) was issued on ${issued}, after the sale was complete. I have attached the sale deed as proof and request that this fine be transferred to the new owner or waived.`;
    case "I wasn't driving":
      return `I, ${citizenName}, bought ${vehicle.regNumber} on ${formatDate(vehicle.boughtOn ?? challan.issuedOn)}. This challan (${challan.challanNumber}) was issued on ${issued}, before I owned this vehicle. I was not the driver or the registered owner at the time and request that this fine be reassigned to the previous owner.`;
    case "Number plate misread":
      return `I, ${citizenName}, believe the automated camera at ${challan.location} misread the number plate on ${issued}. My vehicle ${vehicle.regNumber} does not match the offence recorded, and I request a manual review of the captured image.`;
    case "Wrong vehicle in the photo":
      return `I, ${citizenName}, reviewed the evidence for challan ${challan.challanNumber}, issued on ${issued} at ${challan.location}, and the vehicle shown does not match ${vehicle.regNumber}. I request this fine be withdrawn.`;
  }
}
