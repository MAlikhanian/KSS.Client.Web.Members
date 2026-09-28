/**
 * Shared types for the Members Reports UI.
 *
 * Field names mirror the planned shapes the Reports backend service
 * (KSS.Service.Report.SEBA_ERP_Members) will return — so swapping the mock
 * store for real `fetch()` calls is a 1:1 swap, not a rewrite.
 *
 * v1 surface (3 pages):
 *   - Overview        → DashboardStats
 *   - Brokerages      → BrokerageReportRow[]
 *   - Members         → MemberReportRow[]
 */

// ─── Reference enums (mirrors Members service) ─────────────────────────────

/** Brokerage classification (طبقه). Tier label tied to capital + activity. */
export type BrokerageClass = 'A' | 'B' | 'C' | 'D';

export const ALL_BROKERAGE_CLASSES: readonly BrokerageClass[] = ['A', 'B', 'C', 'D'] as const;

/**
 * Personnel positions (سمت) — mirrors the 8 named role reports in the xlsx
 * spec. Sourced from the Members service's `Position` reference table
 * when the backend lands.
 */
export type MemberPosition =
  | 'CEO'
  | 'BoardMember'
  | 'TradingManager'
  | 'FinanceStaff'
  | 'AdmissionStaff'
  | 'AnalyticsStaff'
  | 'OfferingConsultant'
  | 'TrainingResearchMarketing'
  | 'Other';

export const ALL_MEMBER_POSITIONS: readonly MemberPosition[] = [
  'CEO',
  'BoardMember',
  'TradingManager',
  'FinanceStaff',
  'AdmissionStaff',
  'AnalyticsStaff',
  'OfferingConsultant',
  'TrainingResearchMarketing',
  'Other',
] as const;

export type Gender = 'Male' | 'Female' | 'Unknown';

/** Education level — مدرک تحصیلی. */
export type EducationLevel = 'HighSchool' | 'Associate' | 'Bachelor' | 'Master' | 'PhD' | 'Other';

export const ALL_EDUCATION_LEVELS: readonly EducationLevel[] = [
  'HighSchool',
  'Associate',
  'Bachelor',
  'Master',
  'PhD',
  'Other',
] as const;

// ─── Dashboard stats ────────────────────────────────────────────────────────

/**
 * Aggregate tiles shown on `/members-reports` landing.
 * `byClass` powers the small distribution mini-charts on the overview cards.
 */
export interface DashboardStats {
  asOf: string; // ISO timestamp the snapshot was taken

  brokerageCount: number;
  brokerageByClass: Record<BrokerageClass, number>;

  fundCount: number;
  activeFundCount: number;

  memberCount: number;
  memberByPosition: Record<MemberPosition, number>;

  /** Total registered capital across all brokerages, in Rials. */
  totalRegisteredCapitalRial: number;
  /** Total paid capital across all brokerages, in Rials. */
  totalPaidCapitalRial: number;

  /** Branches / offices / halls — combined count from BrokerageBranch. */
  totalBranchCount: number;

  /** Brokerages listed on stock exchange. */
  listedOnExchangeCount: number;
}

// ─── Brokerages report ──────────────────────────────────────────────────────

export interface BrokerageReportRow {
  companyId: string;
  /** Persian / display name. */
  nameFa: string;
  /** Latin transliteration; optional. */
  nameEn?: string;

  classification: BrokerageClass;

  registeredCapitalRial: number;
  paidCapitalRial: number;

  /** City of head-office registration. */
  registrationCity: string;

  employeeCount: number;
  branchCount: number;

  isListedOnExchange: boolean;
  seoRegistrationDate?: string; // ISO date
  seoLicenseExpiryDate?: string; // ISO date

  /** Shareholder composition summary (counts by type — کیک ترکیب سهامداران). */
  shareholders: {
    individualCount: number;
    legalEntityCount: number;
    foreignCount: number;
  };

  createdAt: string;
  updatedAt: string;
}

export interface BrokerageFilter {
  classification?: BrokerageClass[];
  city?: string;
  /** Optional [min, max] capital range in Rials, inclusive. */
  capitalRange?: [number | null, number | null];
  /** Free-text match on name (Fa or En). */
  search?: string;
  /** Listed-on-exchange flag — undefined = both. */
  isListedOnExchange?: boolean;
}

// ─── Members directory ──────────────────────────────────────────────────────

export interface MemberReportRow {
  personId: string;
  fullNameFa: string;
  fullNameEn?: string;

  brokerageId: string;
  brokerageNameFa: string;
  brokerageClass: BrokerageClass;

  position: MemberPosition;
  bourseCode?: string;

  /** Person's reported age in years, computed at snapshot time. */
  age?: number;
  gender: Gender;
  education?: EducationLevel;
  /** Field of study — رشته تحصیلی. */
  fieldOfStudy?: string;

  /** City where the member is actually working. */
  workCity?: string;

  /** Tenure at the current brokerage in years (سابقه کار در آخرین شرکت کارگزاری). */
  tenureYears?: number;

  /** مدارک حرفه‌ای — professional credentials, comma-separated short codes. */
  professionalCredentials?: string;

  /** Member status — active / on leave / etc. */
  statusId: string;
  statusLabel: string;

  joinedAt?: string; // ISO date
}

export interface MemberFilter {
  brokerageId?: string;
  brokerageClass?: BrokerageClass[];
  position?: MemberPosition[];
  city?: string;
  gender?: Gender;
  education?: EducationLevel[];
  /** Optional [min, max] age range, inclusive. */
  ageRange?: [number | null, number | null];
  /** Free-text match on name / bourse code. */
  search?: string;
}
