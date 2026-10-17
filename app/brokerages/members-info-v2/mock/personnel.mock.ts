// Stage-1 MOCK data for the new personnel page. Every name and national id here
// is synthetic and obviously so ("Sample Person NN", ids beginning 0000).
// Nothing is read from any service. Replaced by real data in a later stage.

export type EmploymentStatus = 'active' | 'ended' | 'awaitingStart' | 'missing' | 'conflict';

// One row per relationship the person lists; the relationship type describes
// the RELATED person. Inactive relationships are kept and marked, not hidden.
export interface MockDependent {
  id: string;
  isActive: boolean;
  name: { fa: string; en: string };
  nationalId: string;
  relationship: { fa: string; en: string };
  dateOfBirth: string; // ISO date
}

// One employment period at THIS brokerage. to = null means still open.
export interface MockEmploymentPeriod {
  from: string; // ISO date
  to: string | null;
}

export interface MockPersonnel {
  id: string;
  personId: string;
  name: { fa: string; en: string };
  nationalId: string;
  // null = not recorded. A key that is not in the lookup = an id with no
  // lookup row in the data (shown as "unknown").
  brokerageLocation: string | null; // stock exchange key, see STOCK_EXCHANGES
  businessUnit: string | null; // see BUSINESS_UNITS
  position: string | null; // see POSITIONS
  employmentHistory: MockEmploymentPeriod[];
  employmentStatus: EmploymentStatus;
  // Membership fields, edited through the existing membership edit (mock save).
  bourseCode: string;
  description: string;
  dependents: MockDependent[];
}

export const STOCK_EXCHANGES: Record<string, { fa: string; en: string }> = {
  tse: { fa: 'بورس اوراق بهادار تهران', en: 'Tehran Stock Exchange' },
  ifb: { fa: 'فرابورس ایران', en: 'Iran Fara Bourse' },
  ime: { fa: 'بورس کالای ایران', en: 'Iran Mercantile Exchange' },
  irenex: { fa: 'بورس انرژی ایران', en: 'Iran Energy Exchange' },
};

export const BUSINESS_UNITS: Record<string, { fa: string; en: string }> = {
  trading: { fa: 'معاملات', en: 'Trading' },
  backOffice: { fa: 'پشتیبانی معاملات', en: 'Back Office' },
  compliance: { fa: 'تطبیق و انطباق', en: 'Compliance' },
  research: { fa: 'تحلیل و پژوهش', en: 'Research' },
  customerService: { fa: 'خدمات مشتریان', en: 'Customer Service' },
};

export const POSITIONS: Record<string, { fa: string; en: string }> = {
  manager: { fa: 'مدیر', en: 'Manager' },
  trader: { fa: 'معامله‌گر', en: 'Trader' },
  analyst: { fa: 'تحلیلگر', en: 'Analyst' },
  officer: { fa: 'کارشناس', en: 'Officer' },
  assistant: { fa: 'دستیار', en: 'Assistant' },
};

export const WORK_LOCATIONS: Record<string, { fa: string; en: string }> = {
  head: { fa: 'دفتر مرکزی', en: 'Head office' },
  branch: { fa: 'شعبه', en: 'Branch' },
  station: { fa: 'ایستگاه معاملاتی', en: 'Trading station' },
};

export const MEMBERSHIP_STATUSES: Record<string, { fa: string; en: string }> = {
  approved: { fa: 'تأیید شده', en: 'Approved' },
  pending: { fa: 'در انتظار تأیید', en: 'Pending approval' },
};

const RELATIONSHIPS = [
  { fa: 'همسر', en: 'Spouse' },
  { fa: 'فرزند', en: 'Child' },
  { fa: 'پدر', en: 'Father' },
  { fa: 'مادر', en: 'Mother' },
  { fa: 'برادر', en: 'Brother' },
  { fa: 'خواهر', en: 'Sister' },
  { fa: 'خاله', en: 'Maternal aunt' },
  { fa: 'دایی', en: 'Maternal uncle' },
  { fa: 'برادرزاده / خواهرزاده', en: 'Nephew' },
  { fa: 'همکار', en: 'Colleague' },
];

// ILLUSTRATION ONLY of the agreed rules, so the preview shows each case. The
// real status is computed in a later stage from the employment records.
//   no period                         -> missing ("Not determined")
//   periods that overlap, or more
//   than one still open               -> conflict (a GENUINE conflict only)
//   valid sequential periods          -> judged by the latest one, NOT a conflict
//   latest starts in the future       -> awaitingStart
//   latest has ended                  -> ended
//   otherwise                         -> active
export function deriveMockStatus(history: MockEmploymentPeriod[], today: string): EmploymentStatus {
  if (history.length === 0) return 'missing';
  const sorted = [...history].sort((a, b) => a.from.localeCompare(b.from));
  const open = sorted.filter((p) => p.to === null).length;
  if (open > 1) return 'conflict';
  for (let i = 1; i < sorted.length; i++) {
    const prevEnd = sorted[i - 1].to;
    if (prevEnd === null || prevEnd >= sorted[i].from) return 'conflict';
  }
  const latest = sorted[sorted.length - 1];
  if (latest.from > today) return 'awaitingStart';
  if (latest.to !== null && latest.to < today) return 'ended';
  return 'active';
}

const isoDaysFrom = (base: Date, days: number) => {
  const d = new Date(base.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

// Employment-history shapes, cycled across the rows. 1 and 8 are valid
// SEQUENTIAL histories (shown Active and Ended, NOT conflicting); 6 and 9 are
// genuine conflicts (two open periods; overlapping periods); 4 starts in the
// future (Awaiting); 5 has no record.
function historyFor(kind: number, base: Date): MockEmploymentPeriod[] {
  const d = (days: number) => isoDaysFrom(base, days);
  switch (kind) {
    case 1: return [{ from: d(-2200), to: d(-1100) }, { from: d(-1099), to: null }];
    case 3: return [{ from: d(-1800), to: d(-200) }];
    case 4: return [{ from: d(30), to: null }];
    case 5: return [];
    case 6: return [{ from: d(-1500), to: null }, { from: d(-300), to: null }];
    case 8: return [{ from: d(-2000), to: d(-900) }, { from: d(-850), to: d(-100) }];
    case 9: return [{ from: d(-1400), to: d(-500) }, { from: d(-700), to: null }];
    default: return [{ from: d(-1000 - kind * 37), to: null }];
  }
}
const HISTORY_KINDS = 10;

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const toFaDigits = (s: string) => s.replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
const pad = (n: number, len: number) => String(n).padStart(len, '0');

// A stable small hash so each brokerage shows its own (synthetic) list.
function seedOf(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}

export function buildMockPersonnel(brokerageId: string, today: Date = new Date()): MockPersonnel[] {
  if (!brokerageId) return [];
  const todayIso = today.toISOString().slice(0, 10);
  const seed = seedOf(brokerageId);
  const count = 40 + (seed % 25); // 40..64 rows, enough to exercise paging
  const exchanges = Object.keys(STOCK_EXCHANGES);
  const units = Object.keys(BUSINESS_UNITS);
  const positions = Object.keys(POSITIONS);

  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    const code = pad(n, 2);
    const dependentCount = (seed + i) % 4; // 0..3
    const dependents: MockDependent[] = Array.from({ length: dependentCount }, (_, j) => {
      const dn = `${code}-${j + 1}`;
      return {
        id: `mock-dep-${n}-${j + 1}`,
        isActive: (n + j) % 7 !== 0,
        name: { fa: `وابسته نمونه ${toFaDigits(dn)}`, en: `Sample Dependent ${dn}` },
        nationalId: `0000${pad(n, 3)}${pad(j + 1, 3)}`,
        relationship: RELATIONSHIPS[(i + j) % RELATIONSHIPS.length],
        dateOfBirth: `${1990 + ((i + j) % 25)}-0${1 + (j % 9)}-1${j % 9}`,
      };
    });
    return {
      id: `mock-membership-${n}`,
      personId: `mock-person-${n}`,
      name: { fa: `شخص نمونه ${toFaDigits(code)}`, en: `Sample Person ${code}` },
      nationalId: `00000000${code}`,
      // Every 11th row: no stock exchange recorded. Every 13th: unit id with no
      // lookup row. Every 17th: position id with no lookup row.
      brokerageLocation: n % 11 === 0 ? null : exchanges[(seed + i) % exchanges.length],
      businessUnit: n % 13 === 0 ? 'unit-id-without-lookup' : units[(seed + i * 3) % units.length],
      position: n % 17 === 0 ? 'position-id-without-lookup' : positions[(seed + i * 7) % positions.length],
      employmentHistory: historyFor(i % HISTORY_KINDS, today),
      employmentStatus: deriveMockStatus(historyFor(i % HISTORY_KINDS, today), todayIso),
      bourseCode: `MCK${pad(n, 3)}`,
      description: '',
      dependents,
    };
  });
}
