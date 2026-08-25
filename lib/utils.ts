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

/** Whole days between MOCK_TODAY and the given date (negative if in the past). */
export function daysUntil(iso: string): number {
  const dayMs = 24 * 60 * 60 * 1000
  const toUtcDate = (value: string) => {
    const [year, month, day] = value.slice(0, 10).split("-").map(Number)
    return Date.UTC(year, month - 1, day)
  }
  return Math.round((toUtcDate(iso) - toUtcDate(MOCK_TODAY)) / dayMs)
}

/** Diffs the YYYY-MM-DD portion only, against MOCK_TODAY — never real time. */
export function relativeDays(iso: string): string {
  const diff = daysUntil(iso)
  if (diff === 0) return "today"
  if (diff > 0) return `in ${diff} day${diff === 1 ? "" : "s"}`
  return `${-diff} day${diff === -1 ? "" : "s"} ago`
}

/** Traffic-light tone for a validity date: overdue, expiring inside two weeks, or fine. */
export function expiryTone(iso: string): "ok" | "warn" | "danger" {
  const diff = daysUntil(iso)
  if (diff < 0) return "danger"
  if (diff <= 14) return "warn"
  return "ok"
}

/** Whole-years age as of MOCK_TODAY, computed by string comparison — never real time. */
export function getAge(dob: string): number {
  const [birthYear, birthMonth, birthDay] = dob.slice(0, 10).split("-").map(Number)
  const [todayYear, todayMonth, todayDay] = MOCK_TODAY.slice(0, 10).split("-").map(Number)
  let age = todayYear - birthYear
  if (todayMonth < birthMonth || (todayMonth === birthMonth && todayDay < birthDay)) age -= 1
  return age
}

/** Deterministic mock transaction / application ID — no Math.random, stable per seed. */
export function formatMockId(prefix: string, seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return `${prefix}${String(hash).padStart(10, "0").slice(-10)}`
}

export type DayPeriod = "morning" | "afternoon" | "evening"

/** Derived from MOCK_TODAY's fixed hour, not the wall clock. */
export function getDayPeriod(): DayPeriod {
  const hour = Number(MOCK_TODAY.slice(11, 13))
  if (hour < 12) return "morning"
  if (hour < 17) return "afternoon"
  return "evening"
}
