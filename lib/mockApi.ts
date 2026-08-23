// lib/mockApi.ts
// The only door between the UI and lib/mockData.ts. No fetch, no randomness —
// every export awaits a fixed delay before returning data that already exists
// in mockData.ts.

import {
  mockCitizens,
  mockApplications,
  getCitizen as findCitizen,
  getVehiclesFor as findVehiclesFor,
  getWalletFor as findWalletFor,
  getChallansFor as findChallansFor,
  getApplicationsFor as findApplicationsFor,
  type Citizen,
  type Vehicle,
  type WalletDocument,
  type Challan,
  type Application,
} from "@/lib/mockData";

export const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const READ_MS = 320;

export async function getCitizens(): Promise<Citizen[]> {
  await wait(READ_MS);
  return mockCitizens;
}

export async function getCitizen(citizenId: string): Promise<Citizen | undefined> {
  await wait(READ_MS);
  return findCitizen(citizenId);
}

export async function getVehiclesFor(citizenId: string): Promise<Vehicle[]> {
  await wait(READ_MS);
  return findVehiclesFor(citizenId);
}

export async function getWalletFor(citizenId: string): Promise<WalletDocument[]> {
  await wait(READ_MS);
  return findWalletFor(citizenId);
}

export async function getChallansFor(citizenId: string): Promise<Challan[]> {
  await wait(READ_MS);
  return findChallansFor(citizenId);
}

export async function getApplicationsFor(citizenId: string): Promise<Application[]> {
  await wait(READ_MS);
  return findApplicationsFor(citizenId);
}

export async function getApplication(applicationId: string): Promise<Application | undefined> {
  await wait(READ_MS);
  return mockApplications.find((application) => application.id === applicationId);
}

/** Signals are precomputed per persona in mockData.ts — this just simulates the round trip. */
export async function getDisputeSignals(challan: Challan, vehicle: Vehicle): Promise<string[]> {
  await wait(READ_MS);
  void vehicle;
  return challan.disputeSignals;
}
