/**
 * Local mock data store for Members Reports.
 *
 * Same approach as cash-advance V2 / customer-risk: seeds run on first read
 * and persist to localStorage so dev edits survive page reloads. Once the
 * real Reports backend lands, `api-client.ts` switches to live fetches and
 * this file is left untouched (kept for tests + offline demos).
 */

import type {
  BrokerageClass,
  BrokerageFilter,
  BrokerageReportRow,
  DashboardStats,
  EducationLevel,
  Gender,
  MemberFilter,
  MemberPosition,
  MemberReportRow,
} from './types';

// ─── Storage keys ───────────────────────────────────────────────────────────

const KEY_BROKERAGES = 'members-reports:brokerages';
const KEY_MEMBERS = 'members-reports:members';
const SEED_FLAG = 'members-reports:seeded';

// ─── Browser-safe storage helpers ───────────────────────────────────────────

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
}

// ─── Seed data ──────────────────────────────────────────────────────────────

const CITIES = ['Tehran', 'Esfahan', 'Mashhad', 'Shiraz', 'Tabriz', 'Karaj', 'Qom', 'Ahvaz'];

// Name pools — declared above SEED_MEMBERS so they are initialised before
// `generateMembers(SEED_BROKERAGES)` runs (function declarations are hoisted
// but `const` bindings stay in the temporal dead zone until their line).
const FA_FIRST_M = ['علی', 'محمد', 'حسین', 'رضا', 'مهدی', 'امیر', 'حسن', 'احمد', 'سعید', 'مجتبی'];
const FA_FIRST_F = ['زهرا', 'فاطمه', 'مریم', 'سارا', 'نگار', 'لیلا', 'الهام', 'مهسا', 'پریسا', 'شیما'];
const FA_LAST = ['محمدی', 'احمدی', 'رضایی', 'حسینی', 'رستمی', 'کریمی', 'حسنی', 'موسوی', 'صادقی', 'علوی', 'نجفی'];

const SEED_BROKERAGES: BrokerageReportRow[] = [
  brokerage('brk-001', 'کارگزاری بورس تجارت ایرانیان', 'Bourse Tejarat Iranian', 'A', 500_000_000_000, 12, 320, 'Tehran', true, {
    individual: 1200, legal: 35, foreign: 8,
  }),
  brokerage('brk-002', 'کارگزاری مفید', 'Mofid', 'A', 800_000_000_000, 18, 410, 'Tehran', true, {
    individual: 2400, legal: 52, foreign: 14,
  }),
  brokerage('brk-003', 'کارگزاری آگاه', 'Agah', 'B', 250_000_000_000, 9, 180, 'Esfahan', true, {
    individual: 850, legal: 22, foreign: 4,
  }),
  brokerage('brk-004', 'کارگزاری حافظ', 'Hafez', 'B', 200_000_000_000, 8, 150, 'Shiraz', false, {
    individual: 600, legal: 18, foreign: 2,
  }),
  brokerage('brk-005', 'کارگزاری پارسیان', 'Parsian', 'C', 100_000_000_000, 5, 75, 'Mashhad', false, {
    individual: 320, legal: 12, foreign: 1,
  }),
  brokerage('brk-006', 'کارگزاری سپهر باستان', 'Sepehr Bastan', 'C', 80_000_000_000, 4, 50, 'Tabriz', false, {
    individual: 220, legal: 9, foreign: 0,
  }),
  brokerage('brk-007', 'کارگزاری اقتصاد بیدار', 'Eqtesad Bidar', 'D', 50_000_000_000, 3, 28, 'Karaj', false, {
    individual: 140, legal: 6, foreign: 0,
  }),
  brokerage('brk-008', 'کارگزاری آرمان آتیه', 'Arman Atieh', 'D', 35_000_000_000, 2, 18, 'Qom', false, {
    individual: 90, legal: 4, foreign: 0,
  }),
];

const SEED_MEMBERS: MemberReportRow[] = generateMembers(SEED_BROKERAGES);

function brokerage(
  id: string,
  nameFa: string,
  nameEn: string,
  classification: BrokerageClass,
  registeredCapital: number,
  branches: number,
  employees: number,
  city: string,
  listed: boolean,
  shareholders: { individual: number; legal: number; foreign: number },
): BrokerageReportRow {
  const now = new Date('2026-06-01').toISOString();
  return {
    companyId: id,
    nameFa,
    nameEn,
    classification,
    registeredCapitalRial: registeredCapital,
    paidCapitalRial: Math.round(registeredCapital * 0.9),
    registrationCity: city,
    employeeCount: employees,
    branchCount: branches,
    isListedOnExchange: listed,
    seoRegistrationDate: '2010-03-15',
    seoLicenseExpiryDate: '2028-03-15',
    shareholders: {
      individualCount: shareholders.individual,
      legalEntityCount: shareholders.legal,
      foreignCount: shareholders.foreign,
    },
    createdAt: now,
    updatedAt: now,
  };
}

// Deterministic but varied member generation so report tables look realistic.
function generateMembers(brokerages: BrokerageReportRow[]): MemberReportRow[] {
  const result: MemberReportRow[] = [];
  const positions: MemberPosition[] = [
    'CEO',
    'BoardMember',
    'TradingManager',
    'FinanceStaff',
    'AdmissionStaff',
    'AnalyticsStaff',
    'OfferingConsultant',
    'TrainingResearchMarketing',
  ];
  const genders: Gender[] = ['Male', 'Male', 'Female']; // skewed male per Iranian-finance demographic
  const educationLevels: EducationLevel[] = ['Bachelor', 'Bachelor', 'Master', 'Master', 'PhD', 'Associate'];
  const fields = ['اقتصاد', 'حسابداری', 'مدیریت مالی', 'مهندسی صنایع', 'بانکداری', 'ریاضی کاربردی'];
  const creds = ['CFA', 'FRM', 'گواهینامه اصول بازار', 'گواهینامه معامله‌گری', 'گواهینامه تحلیل‌گری'];

  let serial = 1;
  for (const brk of brokerages) {
    // Roughly proportional headcount: A=20, B=10, C=6, D=4.
    const headcount = brk.classification === 'A' ? 20 : brk.classification === 'B' ? 10 : brk.classification === 'C' ? 6 : 4;
    for (let i = 0; i < headcount; i++) {
      const seed = serial++;
      const position = positions[i % positions.length];
      const gender = genders[seed % genders.length];
      const age = 28 + ((seed * 7) % 25); // 28..52
      const education = educationLevels[seed % educationLevels.length];
      const fos = fields[seed % fields.length];
      const cred = (seed % 3 === 0) ? creds[seed % creds.length] : undefined;
      const tenure = ((seed * 3) % 12) + 1;
      const city = CITIES[seed % CITIES.length];
      result.push({
        personId: `m-${seed.toString().padStart(4, '0')}`,
        fullNameFa: persianName(seed, gender),
        brokerageId: brk.companyId,
        brokerageNameFa: brk.nameFa,
        brokerageClass: brk.classification,
        position,
        bourseCode: position === 'CEO' || position === 'BoardMember' ? `K${(10000 + seed).toString()}` : undefined,
        age,
        gender,
        education,
        fieldOfStudy: fos,
        workCity: city,
        tenureYears: tenure,
        professionalCredentials: cred,
        statusId: 'active',
        statusLabel: 'فعال',
        joinedAt: new Date(2026 - tenure, (seed % 12), 1).toISOString(),
      });
    }
  }
  return result;
}

function persianName(seed: number, gender: Gender): string {
  const firsts = gender === 'Female' ? FA_FIRST_F : FA_FIRST_M;
  return `${firsts[seed % firsts.length]} ${FA_LAST[(seed * 7) % FA_LAST.length]}`;
}

// ─── Seeding ────────────────────────────────────────────────────────────────

function ensureSeed(): void {
  if (!isBrowser()) return;
  if (window.localStorage.getItem(SEED_FLAG)) return;
  write(KEY_BROKERAGES, SEED_BROKERAGES);
  write(KEY_MEMBERS, SEED_MEMBERS);
  window.localStorage.setItem(SEED_FLAG, '1');
}

// ─── Filter helpers ─────────────────────────────────────────────────────────

function matchesText(needle: string | undefined, ...haystacks: (string | undefined)[]): boolean {
  if (!needle) return true;
  const n = needle.toLowerCase();
  return haystacks.some((h) => h && h.toLowerCase().includes(n));
}

function matchesRange(value: number | undefined, range?: [number | null, number | null]): boolean {
  if (!range) return true;
  if (value === undefined) return false;
  const [lo, hi] = range;
  if (lo != null && value < lo) return false;
  if (hi != null && value > hi) return false;
  return true;
}

// ─── Brokerages ─────────────────────────────────────────────────────────────

export function listBrokerageRows(): BrokerageReportRow[] {
  ensureSeed();
  return read<BrokerageReportRow[]>(KEY_BROKERAGES, SEED_BROKERAGES);
}

export function listBrokerageRowsFiltered(filter: BrokerageFilter): BrokerageReportRow[] {
  return listBrokerageRows().filter((row) => {
    if (filter.classification?.length && !filter.classification.includes(row.classification)) return false;
    if (filter.city && row.registrationCity.toLowerCase() !== filter.city.toLowerCase()) return false;
    if (filter.isListedOnExchange !== undefined && row.isListedOnExchange !== filter.isListedOnExchange) return false;
    if (!matchesRange(row.registeredCapitalRial, filter.capitalRange)) return false;
    if (filter.search && !matchesText(filter.search, row.nameFa, row.nameEn, row.companyId)) return false;
    return true;
  });
}

// ─── Members ────────────────────────────────────────────────────────────────

export function listMemberRows(): MemberReportRow[] {
  ensureSeed();
  return read<MemberReportRow[]>(KEY_MEMBERS, SEED_MEMBERS);
}

export function listMemberRowsFiltered(filter: MemberFilter): MemberReportRow[] {
  return listMemberRows().filter((row) => {
    if (filter.brokerageId && row.brokerageId !== filter.brokerageId) return false;
    if (filter.brokerageClass?.length && !filter.brokerageClass.includes(row.brokerageClass)) return false;
    if (filter.position?.length && !filter.position.includes(row.position)) return false;
    if (filter.city && row.workCity?.toLowerCase() !== filter.city.toLowerCase()) return false;
    if (filter.gender && row.gender !== filter.gender) return false;
    if (filter.education?.length && (!row.education || !filter.education.includes(row.education))) return false;
    if (!matchesRange(row.age, filter.ageRange)) return false;
    if (filter.search && !matchesText(filter.search, row.fullNameFa, row.fullNameEn, row.bourseCode, row.personId)) return false;
    return true;
  });
}

// ─── Dashboard ──────────────────────────────────────────────────────────────

export function getDashboardStats(): DashboardStats {
  const brokerages = listBrokerageRows();
  const members = listMemberRows();

  const brokerageByClass: Record<BrokerageClass, number> = { A: 0, B: 0, C: 0, D: 0 };
  let totalRegistered = 0;
  let totalPaid = 0;
  let totalBranches = 0;
  let listed = 0;
  for (const b of brokerages) {
    brokerageByClass[b.classification] += 1;
    totalRegistered += b.registeredCapitalRial;
    totalPaid += b.paidCapitalRial;
    totalBranches += b.branchCount;
    if (b.isListedOnExchange) listed += 1;
  }

  const memberByPosition: Record<MemberPosition, number> = {
    CEO: 0,
    BoardMember: 0,
    TradingManager: 0,
    FinanceStaff: 0,
    AdmissionStaff: 0,
    AnalyticsStaff: 0,
    OfferingConsultant: 0,
    TrainingResearchMarketing: 0,
    Other: 0,
  };
  for (const m of members) memberByPosition[m.position] += 1;

  return {
    asOf: new Date().toISOString(),
    brokerageCount: brokerages.length,
    brokerageByClass,
    fundCount: 0, // v2
    activeFundCount: 0, // v2
    memberCount: members.length,
    memberByPosition,
    totalRegisteredCapitalRial: totalRegistered,
    totalPaidCapitalRial: totalPaid,
    totalBranchCount: totalBranches,
    listedOnExchangeCount: listed,
  };
}

// ─── Helpers exported for filter UIs ────────────────────────────────────────

export function listBrokerageCities(): string[] {
  return Array.from(new Set(listBrokerageRows().map((b) => b.registrationCity))).sort();
}

export function listMemberCities(): string[] {
  return Array.from(
    new Set(
      listMemberRows()
        .map((m) => m.workCity)
        .filter((c): c is string => !!c),
    ),
  ).sort();
}

export function listBrokeragesForSelect(): { id: string; label: string }[] {
  return listBrokerageRows().map((b) => ({ id: b.companyId, label: b.nameFa }));
}
