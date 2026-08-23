import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { MOCK_TODAY } from "@/lib/mockData"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** mockData amounts (amount, feeInr, feePaidInr, totalFeeInr) are whole rupees, not paise. */
export function formatINR(amount: number): string {
  return `₹${new Intl.NumberFormat("en-IN").format(amount)}`
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

export function formatDate(iso: string): string {
  const date = new Date(iso)
  const day = String(date.getUTCDate()).padStart(2, "0")
  const month = MONTHS[date.getUTCMonth()]
  const year = date.getUTCFullYear()
  return `${day} ${month} ${year}`
}

/** Diffs the YYYY-MM-DD portion only, against MOCK_TODAY — never real time. */
export function relativeDays(iso: string): string {
  const dayMs = 24 * 60 * 60 * 1000
  const toUtcDate = (value: string) => {
    const [year, month, day] = value.slice(0, 10).split("-").map(Number)
    return Date.UTC(year, month - 1, day)
  }
  const diff = Math.round((toUtcDate(iso) - toUtcDate(MOCK_TODAY)) / dayMs)
  if (diff === 0) return "today"
  if (diff > 0) return `in ${diff} day${diff === 1 ? "" : "s"}`
  return `${-diff} day${diff === -1 ? "" : "s"} ago`
}
