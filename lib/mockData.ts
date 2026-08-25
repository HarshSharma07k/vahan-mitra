// lib/mockData.ts
// Vahan Mitra — the single source of truth for every screen in this demo.
// Nothing in this app talks to a network. If a screen needs data, it comes from here.
// Rules: no Math.random(), no bare new Date(). Relative dates derive from MOCK_TODAY.

/* ------------------------------------------------------------------ *
 * 0. Clock
 * ------------------------------------------------------------------ */

/** Frozen "now" so relative copy ("expires in 11 days") never drifts. */
export const MOCK_TODAY = "2026-08-23T09:30:00+05:30";

/* ------------------------------------------------------------------ *
 * 1. Enums
 * ------------------------------------------------------------------ */

export type Lang = "en" | "hi";

export type DocKind =
  | "AADHAAR"
  | "PAN"
  | "DL"
  | "RC"
  | "INSURANCE"
  | "PUC"
  | "ADDRESS_PROOF"
  | "SALE_DEED"
  | "FORM_29"
  | "FORM_30"
  | "NOC"
  | "PHOTO"
  | "SIGNATURE";

export type DocHealth = "VERIFIED" | "NEEDS_FIX" | "EXPIRING" | "EXPIRED" | "MISSING";

export type VehicleClass = "TWO_WHEELER" | "LMV" | "GOODS" | "TRANSPORT";

export type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  /** Filed with the legal minimum; some documents still owed by a deadline. */
  | "SUBMITTED_PARTIAL"
  | "UNDER_REVIEW"
  | "QUERY_RAISED"
  | "APPROVED"
  | "DISPATCHED"
  | "REJECTED";

export type StageState = "DONE" | "ACTIVE" | "BLOCKED" | "PENDING";

export type ChallanStatus = "PENDING" | "PAID" | "DISPUTED" | "WAIVED" | "IN_LOK_ADALAT";

export type ServiceId =
  | "RC_TRANSFER"
  | "CHALLAN_CLEAR"
  | "INSURANCE_UPDATE"
  | "DL_RENEWAL"
  | "DL_DUPLICATE"
  | "LL_APPLY"
  | "ADDRESS_CHANGE"
  | "NOC_ISSUE"
  | "HYPOTHECATION_TERMINATION"
  | "PUC_RENEWAL";

/* ------------------------------------------------------------------ *
 * 2. Interfaces
 * ------------------------------------------------------------------ */

export interface Citizen {
  id: string;
  fullName: string;
  /** Name exactly as printed on Aadhaar. Mismatches against this are the #1 rejection cause. */
  aadhaarName: string;
  mobile: string;
  /** Any OTP is accepted; this is what the field prefills with. */
  demoOtp: string;
  dob: string;
  city: string;
  state: string;
  preferredLang: Lang;
  avatarInitials: string;
  /** Shown on the landing card so a judge knows which story this persona tells. */
  demoNote: string;
}

export interface Vehicle {
  id: string;
  citizenId: string;
  /** Formatted for display: "HR 26 DK 8337" */
  regNumber: string;
  makeModel: string;
  vehicleClass: VehicleClass;
  fuel: "PETROL" | "DIESEL" | "EV" | "CNG";
  registeredAt: string;
  registeredRto: string;
  /** True while the RC is still in the seller's name. Drives the "action needed" card. */
  ownershipPending: boolean;
  previousOwner?: string;
  /** Set when the citizen bought it used. Challans dated before this are the previous owner's. */
  boughtOn?: string;
  /** Set when the citizen has sold it. Challans dated after this are disputable. */
  soldOn?: string;
  insuranceValidTill: string;
  pucValidTill: string;
  hypothecatedTo?: string;
}

export interface OcrField {
  key: string;
  /** Human label shown in the field table. */
  label: string;
  value: string;
  confidence: number; // 0..1
  /** Percentage rectangle so boxes scale with any image size. */
  box: { x: number; y: number; w: number; h: number };
}

export interface DocIssue {
  code: "BLUR" | "NAME_MISMATCH" | "EXPIRED" | "WRONG_TYPE" | "CROPPED" | "DUPLICATE";
  severity: "BLOCKING" | "WARNING";
  /** Written for the citizen, not the developer. Names the field and the fix. */
  message: string;
  fixLabel: string;
}

export interface WalletDocument {
  id: string;
  citizenId: string;
  kind: DocKind;
  title: string;
  fileName: string;
  previewUrl: string;
  health: DocHealth;
  addedOn: string;
  expiresOn?: string;
  fields: OcrField[];
  issues: DocIssue[];
}

export interface Challan {
  id: string;
  citizenId: string;
  vehicleId: string;
  challanNumber: string;
  offence: string;
  /** Plain sentence shown large. The section below it in small grey type. */
  offenceHuman: string;
  mvActSection: string;
  amount: number;
  issuedOn: string;
  dueOn: string;
  location: string;
  state: string;
  status: ChallanStatus;
  evidenceUrl: string;
  cameraId: string;
  /** Populated by getDisputeSignals(); seeded here for the demo personas. */
  disputeSignals: string[];
  /** Populated once a dispute is filed — the citizen's statement plus the wait for a verdict. */
  disputeTimeline?: TimelineEvent[];
}

export interface ServiceTask {
  id: string;
  serviceId: ServiceId;
  /** What the citizen calls it. */
  title: string;
  titleHi: string;
  /** The legal form name. Shown small and grey underneath, never hidden. */
  legalName: string;
  feeInr: number;
  estimatedDays: number;
  requiredDocs: DocKind[];
  /** Task ids that must finish first. Rendered as dependency arrows. */
  dependsOn: string[];
  /** Copy explaining why this task is in the plan at all. */
  reason: string;
}

export interface TaskPlan {
  id: string;
  citizenId: string;
  /** Exactly what the citizen typed or said. */
  rawQuery: string;
  intentId: string;
  confidence: number;
  createdOn: string;
  tasks: ServiceTask[];
  totalFeeInr: number;
  totalDays: number;
}

export interface TimelineEvent {
  id: string;
  at: string;
  /** Written as a person would write it. */
  title: string;
  detail?: string;
  actor: "CITIZEN" | "SYSTEM" | "RTO";
}

export interface ApplicationStage {
  key: string;
  label: string;
  labelHi: string;
  state: StageState;
  completedOn?: string;
  office?: string;
}

export interface Application {
  id: string;
  citizenId: string;
  serviceId: ServiceId;
  title: string;
  vehicleId?: string;
  status: ApplicationStatus;
  submittedOn?: string;
  expectedBy?: string;
  feePaidInr: number;
  rtoOfficeId: string;
  stages: ApplicationStage[];
  timeline: TimelineEvent[];
  /** The one thing standing in the way. Rendered as a red card above the rail. */
  blocker?: {
    title: string;
    detail: string;
    actionLabel: string;
    actionHref: string;
  };
}

export interface RtoOffice {
  id: string;
  code: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

export interface IntentEntry {
  id: string;
  patternsEn: string[];
  patternsHi: string[];
  taskIds: ServiceId[];
  /** Asked when confidence < 0.45 instead of guessing wrong. */
  clarifier: string;
  clarifierOptions: string[];
}

export interface OcrFixture {
  kind: DocKind;
  /** "clean" plus one variant per scripted failure path. */
  variant: "clean" | "blur" | "mismatch" | "expired";
  previewUrl: string;
  fields: OcrField[];
  issues: DocIssue[];
}

/* ------------------------------------------------------------------ *
 * 3. Citizens — three demo personas
 * ------------------------------------------------------------------ */

export const mockCitizens: Citizen[] = [
  {
    id: "cit_ananya",
    fullName: "Ananya Verma",
    aadhaarName: "ANANYA VERMA",
    mobile: "9876500001",
    demoOtp: "1234",
    dob: "1999-02-14",
    city: "Gurugram",
    state: "Haryana",
    preferredLang: "en",
    avatarInitials: "AV",
    demoNote: "Bought a used bike. 2 challans. The clean run — use this for the main demo.",
  },
  {
    id: "cit_rakesh",
    fullName: "Rakesh Yadav",
    aadhaarName: "RAKESH KUMAR YADAV",
    mobile: "9876500002",
    demoOtp: "1234",
    dob: "1980-07-03",
    city: "Jaipur",
    state: "Rajasthan",
    preferredLang: "en",
    avatarInitials: "RY",
    demoNote: "Commercial vehicle, 6 challans across 3 states, licence expiring, one file stuck.",
  },
  {
    id: "cit_sunita",
    fullName: "Sunita Devi",
    aadhaarName: "SUNITA DEVI",
    mobile: "9876500003",
    demoOtp: "1234",
    dob: "1992-11-20",
    city: "Patna",
    state: "Bihar",
    preferredLang: "hi",
    avatarInitials: "SD",
    demoNote: "Zero state, Hindi first. No vehicles, no documents, applying by voice.",
  },
];

/* ------------------------------------------------------------------ *
 * 4. Vehicles
 * ------------------------------------------------------------------ */

export const mockVehicles: Vehicle[] = [
  {
    id: "veh_hr26dk8337",
    citizenId: "cit_ananya",
    regNumber: "HR 26 DK 8337",
    makeModel: "Royal Enfield Classic 350",
    vehicleClass: "TWO_WHEELER",
    fuel: "PETROL",
    registeredAt: "2021-06-18",
    registeredRto: "rto_hr26",
    ownershipPending: true,
    previousOwner: "Vikram Singh Rathore",
    boughtOn: "2026-06-09",
    insuranceValidTill: "2026-08-12", // already expired vs MOCK_TODAY — drives the DocScan beat
    pucValidTill: "2026-11-30",
  },
  {
    id: "veh_dl3cbf1129",
    citizenId: "cit_ananya",
    regNumber: "DL 3C BF 1129",
    makeModel: "Maruti Suzuki Swift VXi",
    vehicleClass: "LMV",
    fuel: "PETROL",
    registeredAt: "2018-03-09",
    registeredRto: "rto_dl03",
    ownershipPending: false,
    soldOn: "2026-05-30", // challans after this date are disputable
    insuranceValidTill: "2027-03-09",
    pucValidTill: "2026-09-14",
  },
  {
    id: "veh_rj14gc4402",
    citizenId: "cit_rakesh",
    regNumber: "RJ 14 GC 4402",
    makeModel: "Tata Ace Gold",
    vehicleClass: "GOODS",
    fuel: "DIESEL",
    registeredAt: "2019-09-27",
    registeredRto: "rto_rj14",
    ownershipPending: false,
    insuranceValidTill: "2026-12-01",
    pucValidTill: "2026-08-29",
    hypothecatedTo: "HDFC Bank Ltd",
  },
  {
    id: "veh_rj14pa7781",
    citizenId: "cit_rakesh",
    regNumber: "RJ 14 PA 7781",
    makeModel: "Mahindra Bolero Pik-Up",
    vehicleClass: "TRANSPORT",
    fuel: "DIESEL",
    registeredAt: "2022-01-11",
    registeredRto: "rto_rj14",
    ownershipPending: false,
    insuranceValidTill: "2026-10-04",
    pucValidTill: "2026-09-02",
  },
];

/* ------------------------------------------------------------------ *
 * 5. RTO offices
 * ------------------------------------------------------------------ */

export const mockRtoOffices: RtoOffice[] = [
  { id: "rto_hr26", code: "HR-26", name: "RTO Gurugram", city: "Gurugram", state: "Haryana", lat: 28.4595, lng: 77.0266 },
  { id: "rto_dl03", code: "DL-03", name: "RTO Sheikh Sarai", city: "New Delhi", state: "Delhi", lat: 28.5355, lng: 77.2287 },
  { id: "rto_rj14", code: "RJ-14", name: "RTO Jaipur South", city: "Jaipur", state: "Rajasthan", lat: 26.8467, lng: 75.8006 },
  { id: "rto_br01", code: "BR-01", name: "DTO Patna", city: "Patna", state: "Bihar", lat: 25.5941, lng: 85.1376 },
];

/* ------------------------------------------------------------------ *
 * 6. Document wallet
 * ------------------------------------------------------------------ */

export const mockWallet: WalletDocument[] = [
  {
    id: "doc_ana_aadhaar",
    citizenId: "cit_ananya",
    kind: "AADHAAR",
    title: "Aadhaar card",
    fileName: "aadhaar-ananya.jpg",
    previewUrl: "/mock/aadhaar-clean.png",
    health: "VERIFIED",
    addedOn: "2026-07-02",
    fields: [
      { key: "name", label: "Name", value: "ANANYA VERMA", confidence: 0.98, box: { x: 26.8, y: 23.9, w: 7, h: 2.2 } },
      { key: "dob", label: "Date of birth", value: "14/02/1999", confidence: 0.97, box: { x: 26.7, y: 31.9, w: 4.8, h: 1.8 } },
      { key: "uid", label: "Aadhaar number", value: "XXXX XXXX 4471", confidence: 0.99, box: { x: 26.4, y: 48.8, w: 8.6, h: 2.5 } },
    ],
    issues: [],
  },
  {
    id: "doc_ana_dl",
    citizenId: "cit_ananya",
    kind: "DL",
    title: "Driving licence",
    fileName: "dl-ananya.jpg",
    previewUrl: "/mock/dl-clean.png",
    health: "VERIFIED",
    addedOn: "2026-07-02",
    expiresOn: "2039-02-13",
    fields: [
      { key: "dlNumber", label: "Licence number", value: "HR-2620190004471", confidence: 0.96, box: { x: 10.6, y: 24.9, w: 9, h: 2.1 } },
      { key: "name", label: "Name", value: "ANANYA VERMA", confidence: 0.97, box: { x: 10.7, y: 32.1, w: 5.9, h: 1.8 } },
      { key: "validTill", label: "Valid till", value: "13/02/2039", confidence: 0.94, box: { x: 11, y: 53.3, w: 4.9, h: 1.8 } },
    ],
    issues: [],
  },
  {
    id: "doc_ana_insurance",
    citizenId: "cit_ananya",
    kind: "INSURANCE",
    title: "Two-wheeler insurance",
    fileName: "insurance-re350.pdf",
    previewUrl: "/mock/insurance-expired.png",
    health: "EXPIRED",
    addedOn: "2026-07-04",
    expiresOn: "2026-08-12",
    fields: [
      { key: "policyNo", label: "Policy number", value: "OG-26-1102-1847-00021873", confidence: 0.93, box: { x: 13.1, y: 20.4, w: 15.7, h: 1.3 } },
      { key: "regNumber", label: "Vehicle", value: "HR26DK8337", confidence: 0.95, box: { x: 13.2, y: 24.1, w: 6.1, h: 1.1 } },
      { key: "validTill", label: "Valid till", value: "12/08/2026", confidence: 0.96, box: { x: 13.3, y: 56.4, w: 7, h: 1.2 } },
    ],
    issues: [
      {
        code: "EXPIRED",
        severity: "BLOCKING",
        message:
          "This policy expired on 12 Aug 2026. Ownership transfer needs valid insurance on the day you apply. Renew it, or upload the new policy.",
        fixLabel: "Upload new policy",
      },
    ],
  },
  {
    id: "doc_ana_saledeed",
    citizenId: "cit_ananya",
    kind: "SALE_DEED",
    title: "Sale deed — DL 3C BF 1129",
    fileName: "sale-deed-dl3cbf1129.jpg",
    previewUrl: "/mock/sale-deed-dl3cbf1129.svg",
    health: "VERIFIED",
    addedOn: "2026-06-02",
    fields: [
      { key: "seller", label: "Seller", value: "VIKRAM SINGH RATHORE", confidence: 0.94, box: { x: 9, y: 17, w: 36, h: 2.5 } },
      { key: "buyer", label: "Buyer", value: "ANANYA VERMA", confidence: 0.96, box: { x: 9, y: 25, w: 27, h: 2.5 } },
      { key: "regNumber", label: "Vehicle", value: "DL3CBF1129", confidence: 0.97, box: { x: 9, y: 33, w: 25, h: 2.5 } },
      { key: "saleDate", label: "Date of sale", value: "30/05/2026", confidence: 0.98, box: { x: 9, y: 41, w: 17, h: 2.5 } },
    ],
    issues: [],
  },
  {
    id: "doc_rak_dl",
    citizenId: "cit_rakesh",
    kind: "DL",
    title: "Driving licence (commercial)",
    fileName: "dl-rakesh.jpg",
    previewUrl: "/mock/dl-clean.png",
    health: "EXPIRING",
    addedOn: "2026-06-11",
    expiresOn: "2026-09-03", // 11 days from MOCK_TODAY
    fields: [
      { key: "dlNumber", label: "Licence number", value: "RJ-1420030018822", confidence: 0.95, box: { x: 10.6, y: 24.9, w: 9, h: 2.1 } },
      { key: "name", label: "Name", value: "RAKESH KUMAR YADAV", confidence: 0.92, box: { x: 10.7, y: 32.1, w: 5.9, h: 1.8 } },
      { key: "validTill", label: "Valid till", value: "03/09/2026", confidence: 0.97, box: { x: 11, y: 53.3, w: 4.9, h: 1.8 } },
    ],
    issues: [],
  },
  {
    id: "doc_rak_rc",
    citizenId: "cit_rakesh",
    kind: "RC",
    title: "Registration certificate — RJ 14 GC 4402",
    fileName: "rc-ace-gold.jpg",
    previewUrl: "/mock/rc-mismatch.png",
    health: "NEEDS_FIX",
    addedOn: "2026-08-01",
    fields: [
      { key: "regNumber", label: "Registration number", value: "RJ14GC4402", confidence: 0.97, box: { x: 10.7, y: 26.6, w: 5.4, h: 2 } },
      { key: "owner", label: "Owner name", value: "RAKESH YADAV", confidence: 0.88, box: { x: 10.7, y: 33.6, w: 5.7, h: 1.8 } },
      { key: "class", label: "Vehicle class", value: "GOODS CARRIER (LGV)", confidence: 0.91, box: { x: 10.7, y: 40.4, w: 9, h: 1.9 } },
    ],
    issues: [
      {
        code: "NAME_MISMATCH",
        severity: "BLOCKING",
        message:
          "This RC reads RAKESH YADAV. Your Aadhaar says RAKESH KUMAR YADAV. RTOs reject on this. Tell us which one is correct and we will file the correction with it.",
        fixLabel: "Resolve name",
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * 7. Challans
 * ------------------------------------------------------------------ */

export const mockChallans: Challan[] = [
  {
    id: "chl_001",
    citizenId: "cit_ananya",
    vehicleId: "veh_hr26dk8337",
    challanNumber: "HR26240819004471",
    offence: "OVER_SPEEDING",
    offenceHuman: "Speeding — 68 km/h in a 50 km/h zone",
    mvActSection: "Section 183(1), Motor Vehicles Act 1988",
    amount: 1000,
    issuedOn: "2026-06-14",
    dueOn: "2026-09-13",
    location: "NH-48, Kherki Daula toll, Gurugram",
    state: "Haryana",
    status: "PENDING",
    evidenceUrl: "/mock/evidence-speed-01.svg",
    cameraId: "HR-GGN-NH48-C12",
    disputeSignals: [],
  },
  {
    id: "chl_002",
    citizenId: "cit_ananya",
    vehicleId: "veh_hr26dk8337",
    challanNumber: "HR26240722004188",
    offence: "NO_HELMET",
    offenceHuman: "Riding without a helmet",
    mvActSection: "Section 194D, Motor Vehicles Act 1988",
    amount: 1000,
    issuedOn: "2026-04-02",
    dueOn: "2026-07-01",
    location: "Sector 29 roundabout, Gurugram",
    state: "Haryana",
    status: "PENDING",
    evidenceUrl: "/mock/evidence-helmet-01.svg",
    cameraId: "HR-GGN-S29-C04",
    disputeSignals: [
      "Issued 2 months before you bought this vehicle on 09 Jun 2026. The previous owner is liable.",
    ],
  },
  {
    id: "chl_003",
    citizenId: "cit_ananya",
    vehicleId: "veh_dl3cbf1129",
    challanNumber: "DL03240711009920",
    offence: "RED_LIGHT",
    offenceHuman: "Jumping a red light",
    mvActSection: "Section 177, Motor Vehicles Act 1988",
    amount: 500,
    issuedOn: "2026-07-11",
    dueOn: "2026-10-10",
    location: "Africa Avenue crossing, New Delhi",
    state: "Delhi",
    status: "PENDING",
    evidenceUrl: "/mock/evidence-redlight-01.svg",
    cameraId: "DL-SDL-AAC-C07",
    disputeSignals: [
      "You sold this vehicle on 30 May 2026, six weeks before this challan was issued.",
      "Sale deed is already in your wallet and will be attached automatically.",
    ],
  },
  {
    id: "chl_004",
    citizenId: "cit_rakesh",
    vehicleId: "veh_rj14gc4402",
    challanNumber: "RJ14240803001177",
    offence: "OVERLOADING",
    offenceHuman: "Carrying 1,200 kg over the permitted load",
    mvActSection: "Section 194(1), Motor Vehicles Act 1988",
    amount: 20000,
    issuedOn: "2026-08-03",
    dueOn: "2026-11-02",
    location: "Ajmer Road weighbridge, Jaipur",
    state: "Rajasthan",
    status: "PENDING",
    evidenceUrl: "/mock/evidence-overload-01.svg",
    cameraId: "RJ-JAI-AJM-WB2",
    disputeSignals: [],
  },
  {
    id: "chl_005",
    citizenId: "cit_rakesh",
    vehicleId: "veh_rj14gc4402",
    challanNumber: "RJ14240803001178",
    offence: "OVERLOADING",
    offenceHuman: "Carrying 1,200 kg over the permitted load",
    mvActSection: "Section 194(1), Motor Vehicles Act 1988",
    amount: 20000,
    issuedOn: "2026-08-03",
    dueOn: "2026-11-02",
    location: "Ajmer Road weighbridge, Jaipur",
    state: "Rajasthan",
    status: "PENDING",
    evidenceUrl: "/mock/evidence-overload-01.svg",
    cameraId: "RJ-JAI-AJM-WB2",
    disputeSignals: [
      "Duplicate. Identical offence, camera and timestamp as challan RJ14240803001177, issued 41 seconds apart.",
    ],
  },
  {
    id: "chl_006",
    citizenId: "cit_rakesh",
    vehicleId: "veh_rj14pa7781",
    challanNumber: "UP16240619007733",
    offence: "NO_PERMIT",
    offenceHuman: "Operating in Uttar Pradesh without a state permit",
    mvActSection: "Section 192A, Motor Vehicles Act 1988",
    amount: 10000,
    issuedOn: "2026-06-19",
    dueOn: "2026-09-18",
    location: "Yamuna Expressway, Jewar toll",
    state: "Uttar Pradesh",
    status: "PENDING",
    evidenceUrl: "/mock/evidence-permit-01.svg",
    cameraId: "UP-GBN-YEW-T03",
    disputeSignals: [],
  },
  {
    id: "chl_007",
    citizenId: "cit_rakesh",
    vehicleId: "veh_rj14pa7781",
    challanNumber: "RJ14240401000921",
    offence: "NO_PUC",
    offenceHuman: "No valid pollution certificate",
    mvActSection: "Section 190(2), Motor Vehicles Act 1988",
    amount: 2000,
    issuedOn: "2026-04-01",
    dueOn: "2026-06-30",
    location: "Tonk Road, Jaipur",
    state: "Rajasthan",
    status: "PAID",
    evidenceUrl: "/mock/evidence-puc-01.svg",
    cameraId: "RJ-JAI-TNK-C09",
    disputeSignals: [],
  },
];

/* ------------------------------------------------------------------ *
 * 8. Service catalogue
 * ------------------------------------------------------------------ */

export const mockServices: Record<ServiceId, ServiceTask> = {
  RC_TRANSFER: {
    id: "task_rc_transfer",
    serviceId: "RC_TRANSFER",
    title: "Transfer ownership to your name",
    titleHi: "मालिकाना हक अपने नाम करें",
    legalName: "Form 29 & Form 30 · Rule 55, CMVR 1989",
    feeInr: 530,
    estimatedDays: 9,
    requiredDocs: ["RC", "INSURANCE", "AADHAAR", "SALE_DEED", "PUC"],
    dependsOn: ["task_challan_clear"],
    reason:
      "The registration certificate is still in Vikram Singh Rathore's name. Until it changes, every fine on this vehicle goes to him and insurance claims can be refused.",
  },
  CHALLAN_CLEAR: {
    id: "task_challan_clear",
    serviceId: "CHALLAN_CLEAR",
    title: "Settle the fines on this vehicle",
    titleHi: "इस गाड़ी के चालान निपटाएँ",
    legalName: "e-Challan disposal · Section 208, MV Act",
    feeInr: 2000,
    estimatedDays: 1,
    requiredDocs: [],
    dependsOn: [],
    reason:
      "Two fines are open on HR 26 DK 8337. Ownership transfer is rejected while any fine is unpaid. One of them looks like the previous owner's.",
  },
  INSURANCE_UPDATE: {
    id: "task_insurance_update",
    serviceId: "INSURANCE_UPDATE",
    title: "Put the insurance in your name",
    titleHi: "बीमा अपने नाम कराएँ",
    legalName: "Policy endorsement · Section 157, MV Act",
    feeInr: 0,
    estimatedDays: 2,
    requiredDocs: ["INSURANCE", "RC"],
    dependsOn: ["task_rc_transfer"],
    reason:
      "Your policy expired on 12 Aug 2026 and is still in the seller's name. A claim on an unendorsed policy can be denied outright.",
  },
  DL_RENEWAL: {
    id: "task_dl_renewal",
    serviceId: "DL_RENEWAL",
    title: "Renew your driving licence",
    titleHi: "अपना ड्राइविंग लाइसेंस नवीनीकृत करें",
    legalName: "Form 9 · Section 15, MV Act",
    feeInr: 416,
    estimatedDays: 7,
    requiredDocs: ["DL", "AADHAAR", "PHOTO"],
    dependsOn: [],
    reason: "Your licence expires in 11 days. Renewing after expiry costs an extra ₹1,000 and may need a fresh test.",
  },
  DL_DUPLICATE: {
    id: "task_dl_duplicate",
    serviceId: "DL_DUPLICATE",
    title: "Get a replacement licence",
    titleHi: "डुप्लिकेट लाइसेंस पाएँ",
    legalName: "Form LLD · Rule 17, CMVR",
    feeInr: 216,
    estimatedDays: 5,
    requiredDocs: ["AADHAAR", "PHOTO", "ADDRESS_PROOF"],
    dependsOn: [],
    reason: "A duplicate licence is valid until the original expiry date. No new test is needed.",
  },
  LL_APPLY: {
    id: "task_ll_apply",
    serviceId: "LL_APPLY",
    title: "Apply for a learner's licence",
    titleHi: "लर्नर लाइसेंस के लिए आवेदन करें",
    legalName: "Form 2 · Section 8, MV Act",
    feeInr: 200,
    estimatedDays: 3,
    requiredDocs: ["AADHAAR", "PHOTO", "SIGNATURE", "ADDRESS_PROOF"],
    dependsOn: [],
    reason: "You need a learner's licence for 30 days before you can take the driving test.",
  },
  ADDRESS_CHANGE: {
    id: "task_address_change",
    serviceId: "ADDRESS_CHANGE",
    title: "Update your address",
    titleHi: "अपना पता बदलें",
    legalName: "Form 33 · Rule 54, CMVR",
    feeInr: 300,
    estimatedDays: 6,
    requiredDocs: ["RC", "ADDRESS_PROOF", "AADHAAR"],
    dependsOn: [],
    reason: "Your RC still shows your old address. Notices, including court summons for fines, go to that address.",
  },
  NOC_ISSUE: {
    id: "task_noc_issue",
    serviceId: "NOC_ISSUE",
    title: "Get clearance to move the vehicle to another state",
    titleHi: "दूसरे राज्य ले जाने की मंज़ूरी लें",
    legalName: "Form 28 (No Objection Certificate) · Section 48, MV Act",
    feeInr: 100,
    estimatedDays: 14,
    requiredDocs: ["RC", "INSURANCE", "PUC"],
    dependsOn: ["task_challan_clear"],
    reason: "Keeping a vehicle in a new state for more than 12 months without re-registering is an offence.",
  },
  HYPOTHECATION_TERMINATION: {
    id: "task_hypothecation",
    serviceId: "HYPOTHECATION_TERMINATION",
    title: "Remove the bank's name from your RC",
    titleHi: "आरसी से बैंक का नाम हटाएँ",
    legalName: "Form 35 · Section 51(5), MV Act",
    feeInr: 100,
    estimatedDays: 8,
    requiredDocs: ["RC", "NOC", "INSURANCE"],
    dependsOn: [],
    reason: "Your loan is closed but HDFC Bank Ltd is still on the RC. You cannot sell the vehicle until it comes off.",
  },
  PUC_RENEWAL: {
    id: "task_puc_renewal",
    serviceId: "PUC_RENEWAL",
    title: "Renew the pollution certificate",
    titleHi: "प्रदूषण प्रमाणपत्र नवीनीकृत करें",
    legalName: "PUC certificate · Rule 115(7), CMVR",
    feeInr: 90,
    estimatedDays: 1,
    requiredDocs: ["RC"],
    dependsOn: [],
    reason: "Driving without a valid PUC is a ₹2,000 fine on the spot.",
  },
};

/* ------------------------------------------------------------------ *
 * 9. Applications in flight
 * ------------------------------------------------------------------ */

export const mockApplications: Application[] = [
  {
    id: "app_ana_rc_001",
    citizenId: "cit_ananya",
    serviceId: "RC_TRANSFER",
    title: "Transfer ownership — HR 26 DK 8337",
    vehicleId: "veh_hr26dk8337",
    status: "DRAFT",
    feePaidInr: 0,
    rtoOfficeId: "rto_hr26",
    stages: [
      { key: "docs", label: "Documents", labelHi: "दस्तावेज़", state: "ACTIVE" },
      { key: "fee", label: "Fee payment", labelHi: "शुल्क भुगतान", state: "PENDING" },
      { key: "verify", label: "RTO verification", labelHi: "आरटीओ जाँच", state: "PENDING" },
      { key: "approve", label: "Approval", labelHi: "मंज़ूरी", state: "PENDING" },
      { key: "dispatch", label: "New RC dispatched", labelHi: "नई आरसी भेजी गई", state: "PENDING" },
    ],
    timeline: [
      { id: "ev_1", at: "2026-08-22T18:04:00+05:30", title: "You started this application", actor: "CITIZEN" },
    ],
  },
  {
    id: "app_rak_dl_002",
    citizenId: "cit_rakesh",
    serviceId: "DL_RENEWAL",
    title: "Renew driving licence",
    status: "QUERY_RAISED",
    submittedOn: "2026-08-11",
    expectedBy: "2026-08-26",
    feePaidInr: 416,
    rtoOfficeId: "rto_rj14",
    stages: [
      { key: "docs", label: "Documents", labelHi: "दस्तावेज़", state: "DONE", completedOn: "2026-08-11", office: "Online" },
      { key: "fee", label: "Fee payment", labelHi: "शुल्क भुगतान", state: "DONE", completedOn: "2026-08-11", office: "Online" },
      { key: "verify", label: "RTO verification", labelHi: "आरटीओ जाँच", state: "BLOCKED", office: "Verification Desk 2, RTO Jaipur South" },
      { key: "test", label: "Medical certificate check", labelHi: "मेडिकल जाँच", state: "PENDING" },
      { key: "approve", label: "Approval", labelHi: "मंज़ूरी", state: "PENDING" },
      { key: "dispatch", label: "Licence dispatched", labelHi: "लाइसेंस भेजा गया", state: "PENDING" },
    ],
    timeline: [
      { id: "ev_10", at: "2026-08-11T10:22:00+05:30", title: "You submitted this application", actor: "CITIZEN" },
      { id: "ev_11", at: "2026-08-11T10:23:00+05:30", title: "Fee of ₹416 received", actor: "SYSTEM" },
      { id: "ev_12", at: "2026-08-13T15:40:00+05:30", title: "Moved to Verification Desk 2, RTO Jaipur South", actor: "RTO" },
      {
        id: "ev_13",
        at: "2026-08-19T11:07:00+05:30",
        title: "Query raised by the verifying officer",
        detail: "Form 1A medical certificate is required for a commercial licence over the age of 40.",
        actor: "RTO",
      },
    ],
    blocker: {
      title: "One document is holding this up",
      detail:
        "Commercial licences for drivers over 40 need a Form 1A medical certificate signed by a registered doctor. Upload it and this moves back into the queue the same day.",
      actionLabel: "Upload Form 1A",
      actionHref: "/apply/task_dl_renewal?step=docs",
    },
  },
  {
    id: "app_rak_puc_003",
    citizenId: "cit_rakesh",
    serviceId: "PUC_RENEWAL",
    title: "Renew pollution certificate — RJ 14 PA 7781",
    vehicleId: "veh_rj14pa7781",
    status: "APPROVED",
    submittedOn: "2026-08-18",
    expectedBy: "2026-08-19",
    feePaidInr: 90,
    rtoOfficeId: "rto_rj14",
    stages: [
      { key: "docs", label: "Documents", labelHi: "दस्तावेज़", state: "DONE", completedOn: "2026-08-18", office: "Online" },
      { key: "fee", label: "Fee payment", labelHi: "शुल्क भुगतान", state: "DONE", completedOn: "2026-08-18", office: "Online" },
      { key: "test", label: "Emission test", labelHi: "उत्सर्जन जाँच", state: "DONE", completedOn: "2026-08-19", office: "PUC Centre, Tonk Road" },
      { key: "approve", label: "Certificate issued", labelHi: "प्रमाणपत्र जारी", state: "DONE", completedOn: "2026-08-19", office: "Online" },
    ],
    timeline: [
      { id: "ev_20", at: "2026-08-18T09:15:00+05:30", title: "You submitted this application", actor: "CITIZEN" },
      { id: "ev_21", at: "2026-08-19T12:30:00+05:30", title: "Emission test passed", detail: "CO 0.21%, HC 118 ppm — within limits.", actor: "RTO" },
      { id: "ev_22", at: "2026-08-19T12:34:00+05:30", title: "Certificate issued, valid till 19 Feb 2027", actor: "SYSTEM" },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * 10. Intent corpus
 * ------------------------------------------------------------------ */

export const mockIntents: IntentEntry[] = [
  {
    id: "int_bought_used_vehicle",
    patternsEn: [
      "i bought a used bike",
      "bought a second hand car",
      "purchased a used vehicle",
      "transfer rc to my name",
      "change owner name",
      "bought bike from someone",
    ],
    patternsHi: [
      "मैंने पुरानी बाइक खरीदी है",
      "सेकंड हैंड गाड़ी ली है",
      "आरसी अपने नाम करनी है",
      "गाड़ी खरीदी है नाम बदलना है",
    ],
    taskIds: ["CHALLAN_CLEAR", "RC_TRANSFER", "INSURANCE_UPDATE"],
    clarifier: "Which vehicle did you buy?",
    clarifierOptions: ["Two-wheeler", "Car", "Commercial vehicle"],
  },
  {
    id: "int_licence_expiring",
    patternsEn: ["my licence is expiring", "renew driving licence", "dl renewal", "licence expired last month"],
    patternsHi: ["लाइसेंस की तारीख खत्म हो रही है", "ड्राइविंग लाइसेंस रिन्यू करना है", "लाइसेंस रिन्यू"],
    taskIds: ["DL_RENEWAL"],
    clarifier: "Has it already expired?",
    clarifierOptions: ["Not yet", "Expired under a year ago", "Expired over a year ago"],
  },
  {
    id: "int_licence_lost",
    patternsEn: ["i lost my licence", "licence stolen", "duplicate dl", "misplaced my driving licence"],
    patternsHi: ["लाइसेंस खो गया", "लाइसेंस गुम हो गया है", "डुप्लीकेट लाइसेंस चाहिए"],
    taskIds: ["DL_DUPLICATE"],
    clarifier: "Do you remember your licence number?",
    clarifierOptions: ["Yes", "No"],
  },
  {
    id: "int_first_licence",
    patternsEn: ["i want to learn driving", "first time licence", "apply for learner licence", "new licence"],
    patternsHi: ["मुझे लाइसेंस बनवाना है", "पहली बार लाइसेंस", "लर्निंग लाइसेंस चाहिए", "गाड़ी चलाना सीखना है"],
    taskIds: ["LL_APPLY"],
    clarifier: "Which vehicle do you want to drive?",
    clarifierOptions: ["Two-wheeler", "Car", "Both"],
  },
  {
    id: "int_moving_state",
    patternsEn: ["moving to bangalore with my car", "shifting to another state", "need noc for my vehicle", "relocating"],
    patternsHi: ["दूसरे राज्य जा रहा हूँ", "गाड़ी के लिए एनओसी चाहिए", "शहर बदल रहा हूँ"],
    taskIds: ["CHALLAN_CLEAR", "NOC_ISSUE", "ADDRESS_CHANGE"],
    clarifier: "Which state are you moving to?",
    clarifierOptions: ["Karnataka", "Maharashtra", "Somewhere else"],
  },
  {
    id: "int_loan_closed",
    patternsEn: ["my car loan is paid off", "remove bank name from rc", "hypothecation removal", "loan closed"],
    patternsHi: ["लोन चुका दिया है", "आरसी से बैंक का नाम हटाना है", "गाड़ी का लोन बंद हो गया"],
    taskIds: ["HYPOTHECATION_TERMINATION"],
    clarifier: "Do you have the NOC from your bank?",
    clarifierOptions: ["Yes, I have it", "Not yet"],
  },
];

/* ------------------------------------------------------------------ *
 * 11. OCR fixtures
 * Keyed by kind + variant. runOcr() picks the variant from the filename:
 * a name containing "blur" / "mismatch" / "expired" triggers that path,
 * anything else returns "clean".
 * ------------------------------------------------------------------ */

export const mockOcrFixtures: OcrFixture[] = [
  {
    kind: "RC",
    variant: "clean",
    previewUrl: "/mock/rc-clean.png",
    fields: [
      { key: "regNumber", label: "Registration number", value: "HR26DK8337", confidence: 0.98, box: { x: 11.5, y: 23.7, w: 5.4, h: 2.1 } },
      { key: "owner", label: "Owner name", value: "VIKRAM SINGH RATHORE", confidence: 0.95, box: { x: 11.4, y: 30.6, w: 9.5, h: 2.2 } },
      { key: "makeModel", label: "Make and model", value: "ROYAL ENFIELD CLASSIC 350", confidence: 0.93, box: { x: 11.2, y: 37.5, w: 11.8, h: 2.3 } },
      { key: "chassis", label: "Chassis number", value: "ME3U3S5C1MK004471", confidence: 0.9, box: { x: 10.4, y: 65.2, w: 8.1, h: 2.2 } },
      { key: "engine", label: "Engine number", value: "U3S5C1MK18822", confidence: 0.89, box: { x: 10.3, y: 71.4, w: 6.2, h: 2.1 } },
      { key: "regDate", label: "Registered on", value: "18/06/2021", confidence: 0.96, box: { x: 10.1, y: 77.5, w: 4.8, h: 2 } },
    ],
    issues: [],
  },
  {
    kind: "RC",
    variant: "blur",
    previewUrl: "/mock/rc-blur.png",
    fields: [
      { key: "regNumber", label: "Registration number", value: "HR26DK8337", confidence: 0.91, box: { x: 11.5, y: 23.7, w: 5.4, h: 2.1 } },
      { key: "owner", label: "Owner name", value: "VIKRAM SINGH RATH0RE", confidence: 0.52, box: { x: 11.4, y: 30.6, w: 9.5, h: 2.2 } },
      { key: "chassis", label: "Chassis number", value: "ME3U3S5C1MK0O4471", confidence: 0.38, box: { x: 10.4, y: 65.2, w: 8.1, h: 2.2 } },
    ],
    issues: [
      {
        code: "BLUR",
        severity: "BLOCKING",
        message:
          "The bottom third of this scan is out of focus, so the chassis number could not be read reliably. Retake it in better light with the whole card flat in frame.",
        fixLabel: "Retake photo",
      },
    ],
  },
  {
    kind: "AADHAAR",
    variant: "clean",
    previewUrl: "/mock/aadhaar-clean.png",
    fields: [
      { key: "name", label: "Name", value: "ANANYA VERMA", confidence: 0.98, box: { x: 26.8, y: 23.9, w: 7, h: 2.2 } },
      { key: "dob", label: "Date of birth", value: "14/02/1999", confidence: 0.97, box: { x: 26.7, y: 31.9, w: 4.8, h: 1.8 } },
      { key: "uid", label: "Aadhaar number", value: "XXXX XXXX 4471", confidence: 0.99, box: { x: 26.4, y: 48.8, w: 8.6, h: 2.5 } },
    ],
    issues: [],
  },
  {
    kind: "RC",
    variant: "mismatch",
    previewUrl: "/mock/rc-mismatch.png",
    fields: [
      { key: "regNumber", label: "Registration number", value: "RJ14GC4402", confidence: 0.97, box: { x: 10.7, y: 26.6, w: 5.4, h: 2 } },
      { key: "owner", label: "Owner name", value: "RAKESH YADAV", confidence: 0.88, box: { x: 10.7, y: 33.6, w: 5.7, h: 1.8 } },
      { key: "class", label: "Vehicle class", value: "GOODS CARRIER (LGV)", confidence: 0.91, box: { x: 10.7, y: 40.4, w: 9, h: 1.9 } },
    ],
    issues: [
      {
        code: "NAME_MISMATCH",
        severity: "BLOCKING",
        message:
          "This RC reads RAKESH YADAV. Your Aadhaar says RAKESH KUMAR YADAV. RTOs reject on this. Tell us which one is correct and we will file the correction with it.",
        fixLabel: "Resolve name",
      },
    ],
  },
  {
    kind: "AADHAAR",
    variant: "mismatch",
    previewUrl: "/mock/aadhaar-mismatch.png",
    fields: [
      { key: "name", label: "Name", value: "ANANYA V", confidence: 0.86, box: { x: 26.8, y: 23.9, w: 4.7, h: 2.1 } },
      { key: "dob", label: "Date of birth", value: "14/02/1999", confidence: 0.97, box: { x: 26.7, y: 31.9, w: 4.8, h: 1.8 } },
      { key: "uid", label: "Aadhaar number", value: "XXXX XXXX 4471", confidence: 0.99, box: { x: 26.4, y: 48.8, w: 8.6, h: 2.5 } },
    ],
    issues: [
      {
        code: "NAME_MISMATCH",
        severity: "BLOCKING",
        message:
          "This document reads ANANYA V. Your profile says ANANYA VERMA. RTOs reject applications on exactly this. Pick the spelling that matches your Aadhaar and we will use it everywhere.",
        fixLabel: "Choose the correct name",
      },
    ],
  },
  {
    kind: "INSURANCE",
    variant: "expired",
    previewUrl: "/mock/insurance-expired.png",
    fields: [
      { key: "policyNo", label: "Policy number", value: "OG-26-1102-1847-00021873", confidence: 0.94, box: { x: 13.1, y: 20.4, w: 15.7, h: 1.3 } },
      { key: "regNumber", label: "Vehicle", value: "HR26DK8337", confidence: 0.96, box: { x: 13.2, y: 24.1, w: 6.1, h: 1.1 } },
      { key: "validTill", label: "Valid till", value: "12/08/2026", confidence: 0.97, box: { x: 13.3, y: 56.4, w: 7, h: 1.2 } },
      { key: "insurer", label: "Insurer", value: "BAJAJ ALLIANZ GENERAL", confidence: 0.92, box: { x: 13.2, y: 27.6, w: 12.9, h: 1.2 } },
    ],
    issues: [
      {
        code: "EXPIRED",
        severity: "BLOCKING",
        message:
          "This policy expired 11 days ago, on 12 Aug 2026. Ownership transfer needs insurance valid on the day you apply. Renew it, or upload the new policy if you already have one.",
        fixLabel: "Upload new policy",
      },
    ],
  },
  {
    kind: "DL",
    variant: "clean",
    previewUrl: "/mock/dl-clean.png",
    fields: [
      { key: "dlNumber", label: "Licence number", value: "HR-2620190004471", confidence: 0.97, box: { x: 10.6, y: 24.9, w: 9, h: 2.1 } },
      { key: "name", label: "Name", value: "ANANYA VERMA", confidence: 0.97, box: { x: 10.7, y: 32.1, w: 5.9, h: 1.8 } },
      { key: "dob", label: "Date of birth", value: "14/02/1999", confidence: 0.95, box: { x: 10.8, y: 39.2, w: 4.9, h: 1.8 } },
      { key: "cov", label: "Vehicle classes", value: "MCWG, LMV", confidence: 0.91, box: { x: 10.9, y: 46.3, w: 4.4, h: 1.8 } },
      { key: "validTill", label: "Valid till", value: "13/02/2039", confidence: 0.96, box: { x: 11, y: 53.3, w: 4.9, h: 1.8 } },
    ],
    issues: [],
  },
];

/* ------------------------------------------------------------------ *
 * 12. Complexity benchmarks — the "Kitna Kam?" meter
 *
 * !! COUNT THESE YOURSELF BEFORE THE PITCH !!
 * Open the live Parivahan flow, count the actual fields and portals, and
 * time yourself. These are placeholders. A judge who has used the portal
 * will know if the number is invented, and an invented number loses the
 * whole argument. Michigan's equivalent claim (42 pages -> 18, 80% fewer
 * questions, zero regulations changed) is what makes this land.
 * ------------------------------------------------------------------ */

export interface ComplexityBenchmark {
  serviceId: ServiceId;
  legacyQuestions: number;
  legacyPortals: number;
  legacyMinutes: number;
  ourQuestions: number;
  ourScreens: number;
  ourMinutes: number;
  /** Regulations we had to change. Always 0. That is the entire point. */
  rulesChanged: 0;
}

export const mockComplexityBenchmarks: ComplexityBenchmark[] = [
  { serviceId: "RC_TRANSFER", legacyQuestions: 47, legacyPortals: 4, legacyMinutes: 38, ourQuestions: 9, ourScreens: 1, ourMinutes: 4, rulesChanged: 0 },
  { serviceId: "DL_RENEWAL", legacyQuestions: 31, legacyPortals: 2, legacyMinutes: 26, ourQuestions: 6, ourScreens: 1, ourMinutes: 3, rulesChanged: 0 },
  { serviceId: "LL_APPLY", legacyQuestions: 38, legacyPortals: 2, legacyMinutes: 33, ourQuestions: 8, ourScreens: 1, ourMinutes: 4, rulesChanged: 0 },
  { serviceId: "CHALLAN_CLEAR", legacyQuestions: 12, legacyPortals: 3, legacyMinutes: 14, ourQuestions: 2, ourScreens: 1, ourMinutes: 1, rulesChanged: 0 },
];

/* ------------------------------------------------------------------ *
 * 13. Proactive triggers — "Aage Kya?"
 * Opened by the system, not requested by the citizen. Every card carries
 * the label "You didn't ask for this. We noticed."
 * ------------------------------------------------------------------ */

export type TriggerKind =
  | "DL_EXPIRING"
  | "INSURANCE_EXPIRING"
  | "PUC_EXPIRING"
  | "OWNERSHIP_PENDING"
  | "CHALLAN_DUE_SOON"
  | "HYPOTHECATION_STALE";

export interface ProactiveTrigger {
  id: string;
  citizenId: string;
  kind: TriggerKind;
  subjectId: string; // vehicleId, documentId or challanId
  serviceId: ServiceId;
  /** One line, plain, stating the cost of doing nothing. */
  headline: string;
  costOfInaction: string;
  urgencyDays: number;
}

export const mockProactiveTriggers: ProactiveTrigger[] = [
  {
    id: "trg_rak_dl",
    citizenId: "cit_rakesh",
    kind: "DL_EXPIRING",
    subjectId: "doc_rak_dl",
    serviceId: "DL_RENEWAL",
    headline: "Your licence expires in 11 days",
    costOfInaction: "Renewing after expiry adds ₹1,000 and can mean taking the driving test again.",
    urgencyDays: 11,
  },
  {
    id: "trg_rak_puc",
    citizenId: "cit_rakesh",
    kind: "PUC_EXPIRING",
    subjectId: "veh_rj14gc4402",
    serviceId: "PUC_RENEWAL",
    headline: "PUC on RJ 14 GC 4402 expires in 6 days",
    costOfInaction: "Driving without a valid PUC is a ₹2,000 fine on the spot.",
    urgencyDays: 6,
  },
  {
    id: "trg_rak_hypo",
    citizenId: "cit_rakesh",
    kind: "HYPOTHECATION_STALE",
    subjectId: "veh_rj14gc4402",
    serviceId: "HYPOTHECATION_TERMINATION",
    headline: "Your loan is closed but the bank is still on your RC",
    costOfInaction: "You cannot sell this vehicle until HDFC Bank Ltd comes off the registration.",
    urgencyDays: 0,
  },
  {
    id: "trg_ana_ins",
    citizenId: "cit_ananya",
    kind: "INSURANCE_EXPIRING",
    subjectId: "doc_ana_insurance",
    serviceId: "INSURANCE_UPDATE",
    headline: "Insurance on HR 26 DK 8337 expired 11 days ago",
    costOfInaction: "Ownership transfer will be rejected, and any claim can be denied outright.",
    urgencyDays: -11,
  },
  {
    id: "trg_ana_own",
    citizenId: "cit_ananya",
    kind: "OWNERSHIP_PENDING",
    subjectId: "veh_hr26dk8337",
    serviceId: "RC_TRANSFER",
    headline: "This bike is still registered to Vikram Singh Rathore",
    costOfInaction: "Every fine on it goes to him, and insurance claims can be refused.",
    urgencyDays: 0,
  },
];

/* ------------------------------------------------------------------ *
 * 14. Reminder schedules — shown, not hidden
 * Opt-out, never opt-in. Sequence: T+1, T+4, one day before the deadline.
 * ------------------------------------------------------------------ */

export interface Reminder {
  id: string;
  applicationId: string;
  sendOn: string;
  channel: "WHATSAPP" | "SMS";
  /** The actual message text, shown in the UI so the citizen can see it. */
  message: string;
  muted: boolean;
}

export const mockReminders: Reminder[] = [
  {
    id: "rem_001",
    applicationId: "app_rak_dl_002",
    sendOn: "2026-08-24",
    channel: "WHATSAPP",
    message: "Your licence renewal needs a Form 1A medical certificate. Upload it here and your file moves back into the queue the same day.",
    muted: false,
  },
  {
    id: "rem_002",
    applicationId: "app_rak_dl_002",
    sendOn: "2026-08-27",
    channel: "WHATSAPP",
    message: "Still waiting on your Form 1A medical certificate. Your licence expires on 3 Sep.",
    muted: false,
  },
  {
    id: "rem_003",
    applicationId: "app_rak_dl_002",
    sendOn: "2026-09-02",
    channel: "SMS",
    message: "Last day before your licence expires. Upload Form 1A today to avoid the ₹1,000 late fee.",
    muted: false,
  },
];

/* ------------------------------------------------------------------ *
 * 15. File access trail — "Kisne Dekha?"
 * Every hand that touched the file, timestamped. State the days and the
 * office average; never editorialise, never show a red DELAYED banner.
 * ------------------------------------------------------------------ */

export interface FileAccessEvent {
  id: string;
  applicationId: string;
  at: string;
  /** Named desk or system, not a person's name. */
  accessedBy: string;
  office: string;
  action: "RECEIVED" | "OPENED" | "READ_RECORD" | "FORWARDED" | "QUERY_RAISED" | "APPROVED";
}

export interface OfficeAgeing {
  applicationId: string;
  currentDesk: string;
  daysAtCurrentDesk: number;
  officeAverageDays: number;
}

export const mockFileAccess: FileAccessEvent[] = [
  { id: "fa_01", applicationId: "app_rak_dl_002", at: "2026-08-11T10:22:00+05:30", accessedBy: "Sarathi national database", office: "MoRTH", action: "READ_RECORD" },
  { id: "fa_02", applicationId: "app_rak_dl_002", at: "2026-08-11T10:23:00+05:30", accessedBy: "Fee gateway", office: "MoRTH", action: "READ_RECORD" },
  { id: "fa_03", applicationId: "app_rak_dl_002", at: "2026-08-13T15:40:00+05:30", accessedBy: "Verification Desk 2", office: "RTO Jaipur South", action: "RECEIVED" },
  { id: "fa_04", applicationId: "app_rak_dl_002", at: "2026-08-19T11:07:00+05:30", accessedBy: "Verification Desk 2", office: "RTO Jaipur South", action: "QUERY_RAISED" },
  { id: "fa_05", applicationId: "app_rak_puc_003", at: "2026-08-18T09:16:00+05:30", accessedBy: "Vahan national database", office: "MoRTH", action: "READ_RECORD" },
  { id: "fa_06", applicationId: "app_rak_puc_003", at: "2026-08-19T12:30:00+05:30", accessedBy: "PUC Centre, Tonk Road", office: "RTO Jaipur South", action: "APPROVED" },
];

export const mockOfficeAgeing: OfficeAgeing[] = [
  { applicationId: "app_rak_dl_002", currentDesk: "Verification Desk 2", daysAtCurrentDesk: 10, officeAverageDays: 3 },
];

/* ------------------------------------------------------------------ *
 * 16. Partial submission — "Aadha Bhar Do"
 * File with the legal minimum; owe the rest by a deadline.
 * ------------------------------------------------------------------ */

export interface PendingVerification {
  id: string;
  applicationId: string;
  docKind: DocKind;
  label: string;
  /** Legally required to file at all, versus required before approval. */
  blocking: boolean;
  dueBy: string;
  /** What actually happens if the deadline passes. Plain, not a threat. */
  consequence: string;
}

export const mockPendingVerifications: PendingVerification[] = [
  {
    id: "pv_01",
    applicationId: "app_rak_dl_002",
    docKind: "PHOTO",
    label: "Form 1A medical certificate",
    blocking: false,
    dueBy: "2026-09-06",
    consequence: "After 6 Sep the application closes and the ₹416 fee has to be paid again.",
  },
];

/* ------------------------------------------------------------------ *
 * 17. Seed bundle + lookups
 * ------------------------------------------------------------------ */

export const seedState = {
  citizens: mockCitizens,
  vehicles: mockVehicles,
  wallet: mockWallet,
  challans: mockChallans,
  applications: mockApplications,
  rtoOffices: mockRtoOffices,
  intents: mockIntents,
  ocrFixtures: mockOcrFixtures,
  services: mockServices,
  benchmarks: mockComplexityBenchmarks,
  triggers: mockProactiveTriggers,
  reminders: mockReminders,
  fileAccess: mockFileAccess,
  officeAgeing: mockOfficeAgeing,
  pendingVerifications: mockPendingVerifications,
  plans: [] as TaskPlan[],
};

export const getCitizen = (id: string) => mockCitizens.find((c) => c.id === id);
export const getVehicle = (id: string) => mockVehicles.find((v) => v.id === id);
export const getRto = (id: string) => mockRtoOffices.find((r) => r.id === id);
export const getVehiclesFor = (citizenId: string) => mockVehicles.filter((v) => v.citizenId === citizenId);
export const getChallansFor = (citizenId: string) => mockChallans.filter((c) => c.citizenId === citizenId);
export const getWalletFor = (citizenId: string) => mockWallet.filter((d) => d.citizenId === citizenId);
export const getApplicationsFor = (citizenId: string) =>
  mockApplications.filter((a) => a.citizenId === citizenId);
export const getTriggersFor = (citizenId: string) =>
  mockProactiveTriggers.filter((t) => t.citizenId === citizenId).sort((a, b) => a.urgencyDays - b.urgencyDays);
export const getBenchmark = (serviceId: ServiceId) =>
  mockComplexityBenchmarks.find((b) => b.serviceId === serviceId);
export const getFileAccessFor = (applicationId: string) =>
  mockFileAccess.filter((f) => f.applicationId === applicationId).sort((a, b) => b.at.localeCompare(a.at));
export const getAgeingFor = (applicationId: string) =>
  mockOfficeAgeing.find((o) => o.applicationId === applicationId);
export const getRemindersFor = (applicationId: string) =>
  mockReminders.filter((r) => r.applicationId === applicationId).sort((a, b) => a.sendOn.localeCompare(b.sendOn));
export const getPendingVerificationsFor = (applicationId: string) =>
  mockPendingVerifications.filter((p) => p.applicationId === applicationId);
