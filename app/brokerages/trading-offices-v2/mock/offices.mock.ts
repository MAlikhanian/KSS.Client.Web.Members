// Stage-1 MOCK data for the new trading offices page. Every office, manager,
// address and phone here is synthetic and obviously so ("Sample Office NN",
// "Sample Manager NN", ids beginning 0000). Nothing is read from any service.
// Replaced by real data in a later stage.

type Label = { fa: string; en: string };

export interface MockOfficeAddress {
  id: string;
  label: Label;
  provinceId: string; // see PROVINCES
  cityId: string; // see CITIES
  postalCode: string;
  street: Label;
  isPrimary: boolean;
}

export interface MockOfficePhone {
  id: string;
  label: Label;
  number: string;
  isPrimary: boolean;
}

export interface MockOfficeManager {
  personId: string;
  name: Label;
  nationalId: string;
  mobile: string;
}

export interface MockOffice {
  id: string;
  // The Persian name is the one the current page edits; the English one is
  // shown only when the page itself is in English.
  name: Label;
  code: string | null; // null = not recorded
  // null = not recorded. A key that is not in OFFICE_TYPES = an id with no
  // lookup row in the data (shown as "unknown").
  typeId: string | null;
  manager: MockOfficeManager | null; // null = no manager recorded
  employeeCount: number | null;
  isActive: boolean;
  addresses: MockOfficeAddress[];
  phones: MockOfficePhone[];
}

export const OFFICE_TYPES: Record<string, Label> = {
  main: { fa: 'دفتر مرکزی', en: 'Main office' },
  branch: { fa: 'دفتر شعبه', en: 'Branch office' },
  representative: { fa: 'دفتر نمایندگی', en: 'Representative office' },
  tradingFloor: { fa: 'سالن معاملات', en: 'Trading floor' },
};

export const PROVINCES: Record<string, Label> = {
  tehran: { fa: 'تهران', en: 'Tehran' },
  isfahan: { fa: 'اصفهان', en: 'Isfahan' },
  khorasanRazavi: { fa: 'خراسان رضوی', en: 'Razavi Khorasan' },
  fars: { fa: 'فارس', en: 'Fars' },
  eastAzarbaijan: { fa: 'آذربایجان شرقی', en: 'East Azerbaijan' },
};

export const CITIES: Record<string, Label & { provinceId: string }> = {
  tehranCity: { fa: 'تهران', en: 'Tehran', provinceId: 'tehran' },
  rey: { fa: 'ری', en: 'Rey', provinceId: 'tehran' },
  isfahanCity: { fa: 'اصفهان', en: 'Isfahan', provinceId: 'isfahan' },
  kashan: { fa: 'کاشان', en: 'Kashan', provinceId: 'isfahan' },
  mashhad: { fa: 'مشهد', en: 'Mashhad', provinceId: 'khorasanRazavi' },
  neyshabur: { fa: 'نیشابور', en: 'Neyshabur', provinceId: 'khorasanRazavi' },
  shiraz: { fa: 'شیراز', en: 'Shiraz', provinceId: 'fars' },
  marvdasht: { fa: 'مرودشت', en: 'Marvdasht', provinceId: 'fars' },
  tabriz: { fa: 'تبریز', en: 'Tabriz', provinceId: 'eastAzarbaijan' },
  maragheh: { fa: 'مراغه', en: 'Maragheh', provinceId: 'eastAzarbaijan' },
};

const ADDRESS_LABELS: Label[] = [
  { fa: 'محل دفتر', en: 'Office' },
  { fa: 'انبار اسناد', en: 'Records store' },
  { fa: 'محل پذیرش مشتریان', en: 'Client reception' },
];

const PHONE_LABELS: Label[] = [
  { fa: 'تلفن دفتر', en: 'Office phone' },
  { fa: 'نمابر', en: 'Fax' },
];

// Address shapes, cycled across the offices, so the preview shows each case of
// the province/city filter:
//   0, 3, 5  one address
//   1        two addresses in DIFFERENT provinces (province of one + city of the
//            other must NOT match)
//   2        no address (never matches a province or city filter)
//   4        three addresses, two of them in the same province
const ADDRESS_KINDS = 6;
function addressCitiesFor(kind: number, n: number): string[] {
  const cities = Object.keys(CITIES);
  const at = (k: number) => cities[(n + k) % cities.length];
  switch (kind) {
    case 1: return [at(0), at(5)];
    case 2: return [];
    case 4: return [at(0), at(1), at(6)];
    default: return [at(0)];
  }
}

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const toFaDigits = (s: string) => s.replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
const pad = (n: number, len: number) => String(n).padStart(len, '0');

// A stable small hash so each brokerage shows its own (synthetic) list.
function seedOf(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}

export function buildMockOffices(brokerageId: string): MockOffice[] {
  if (!brokerageId) return [];
  const seed = seedOf(brokerageId);
  const count = 18 + (seed % 10); // 18..27 offices, enough to exercise paging
  const types = Object.keys(OFFICE_TYPES);

  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    const code = pad(n, 2);
    const addresses: MockOfficeAddress[] = addressCitiesFor(i % ADDRESS_KINDS, n).map((cityId, j) => ({
      id: `mock-address-${n}-${j + 1}`,
      label: ADDRESS_LABELS[j % ADDRESS_LABELS.length],
      provinceId: CITIES[cityId].provinceId,
      cityId,
      postalCode: `0000${pad(n, 3)}${pad(j + 1, 3)}`,
      street: {
        fa: `خیابان نمونه ${toFaDigits(String(j + 1))}، پلاک ${toFaDigits(code)}`,
        en: `Sample Street ${j + 1}, No. ${code}`,
      },
      isPrimary: j === 0,
    }));
    const phones: MockOfficePhone[] = Array.from({ length: (seed + i) % 3 }, (_, j) => ({
      id: `mock-phone-${n}-${j + 1}`,
      label: PHONE_LABELS[j % PHONE_LABELS.length],
      number: `0000${pad(n, 3)}${pad(j + 1, 4)}`,
      isPrimary: j === 0,
    }));
    return {
      id: `mock-office-${n}`,
      name: { fa: `دفتر نمونه ${toFaDigits(code)}`, en: `Sample Office ${code}` },
      // Every 8th office: no code recorded. Every 9th: a type id with no lookup
      // row. Every 7th: no manager. Every 5th: inactive.
      code: n % 8 === 0 ? null : `MCK-${pad(n, 3)}`,
      typeId: n % 9 === 0 ? 'type-id-without-lookup' : types[(seed + i) % types.length],
      manager:
        n % 7 === 0
          ? null
          : {
              personId: `mock-person-${n}`,
              name: { fa: `مدیر نمونه ${toFaDigits(code)}`, en: `Sample Manager ${code}` },
              nationalId: `00000000${code}`,
              mobile: `0000000${pad(n, 4)}`,
            },
      employeeCount: n % 6 === 0 ? null : 3 + ((seed + i * 5) % 40),
      isActive: n % 5 !== 0,
      addresses,
      phones,
    };
  });
}
