import type { MockPersonnel } from '../mock/personnel.mock';

// Stage-1 SAMPLE person details for the preview's expanded row, in the shapes
// the current Members Info page displays. Every value is synthetic and derived
// from the sample person (names "Sample ...", ids and numbers beginning 0000).
// Nothing is read from any service.

export type SampleLookup = Record<number, { fa: string; en: string }>;

interface Stamped {
  createdAt: string;
  updatedAt?: string;
}

export interface SampleNameTranslation extends Stamped {
  languageId: number;
  firstName: string;
  lastName: string;
  fatherName?: string;
}

export interface SamplePersonal {
  nationalId: string;
  birthCertificateNumber: string;
  passportNumber: string;
  birthCertificateSeriesLetterId: number;
  birthCertificateSeriesNumber: string;
  birthCertificateSerial: string;
  dateOfBirth: string; // yyyy-mm-dd
  sexId: number;
  maritalStatusId: number;
  birthCountryId: number;
  birthRegionId: number;
  birthCityId: number;
  certIssueCountryId: number;
  certIssueRegionId: number;
  certIssueCityId: number;
  religionId: number;
  militaryServiceStatusId: number;
  militaryServiceLocationId: number;
  insuranceTypeId: number;
  insuranceNumber: string;
}

export interface SampleNationality extends Stamped { id: string; countryId: number }
export interface SampleContact extends Stamped { id: string; labelId: number; value: string; isPrimary: boolean }
export interface SampleAddress extends Stamped {
  id: string;
  labelId: number;
  countryId: number;
  regionId: number;
  cityId: number;
  street1: string;
  street2?: string;
  postalCode: string;
  isPrimary: boolean;
}
export interface SampleFile { id: string; fileName: string }
export interface SampleEmployment extends Stamped {
  id: string;
  companyName: string;
  companyNationalId: string;
  activityFieldId: number;
  activityUnitId: number;
  positionId: number;
  contractTypeId: number;
  fromDate: string;
  toDate: string | null;
  documents: SampleFile[];
}
export interface SampleEducation extends Stamped {
  id: string;
  educationLevelId: number;
  fieldOfStudyId: number;
  institutionId: number;
  startDate: string;
  endDate: string | null;
  gpa: number | null;
  isCompleted: boolean;
  documents: SampleFile[];
}
export interface SampleRelationship extends Stamped {
  id: string;
  relationshipTypeId: number;
  relatedPersonName: string;
  relatedPersonNationalId: string;
}
export interface SampleDocument extends Stamped { id: string; documentTypeId: number; fileName: string; fileSize: number }
export interface SampleStatus extends Stamped { id: string; startDate: string; endDate: string | null }

export interface SamplePersonDetails {
  names: SampleNameTranslation[];
  personal: SamplePersonal;
  nationalities: SampleNationality[];
  emails: SampleContact[];
  phones: SampleContact[];
  addresses: SampleAddress[];
  employments: SampleEmployment[];
  educations: SampleEducation[];
  relationships: SampleRelationship[];
  documents: SampleDocument[];
  statuses: SampleStatus[];
}

// Sample lookups standing in for the reference data the current page loads.
// The language entry holds each language's own name, as the page shows it.
export const SAMPLE_LOOKUPS = {
  languages: { 12: { fa: 'فارسی', en: 'Persian' }, 10: { fa: 'English', en: 'English' } } as SampleLookup,
  countries: { 1: { fa: 'ایران', en: 'Iran' }, 2: { fa: 'ترکیه', en: 'Turkey' } } as SampleLookup,
  regions: { 1: { fa: 'تهران', en: 'Tehran' }, 2: { fa: 'اصفهان', en: 'Isfahan' }, 3: { fa: 'فارس', en: 'Fars' } } as SampleLookup,
  cities: { 1: { fa: 'تهران', en: 'Tehran' }, 2: { fa: 'اصفهان', en: 'Isfahan' }, 3: { fa: 'شیراز', en: 'Shiraz' } } as SampleLookup,
  sexes: { 1: { fa: 'مرد', en: 'Male' }, 2: { fa: 'زن', en: 'Female' } } as SampleLookup,
  maritalStatuses: { 1: { fa: 'مجرد', en: 'Single' }, 2: { fa: 'متاهل', en: 'Married' } } as SampleLookup,
  seriesLetters: { 1: { fa: 'الف', en: 'Alef' }, 2: { fa: 'ب', en: 'Be' } } as SampleLookup,
  religions: { 1: { fa: 'اسلام', en: 'Islam' }, 2: { fa: 'مسیحیت', en: 'Christianity' } } as SampleLookup,
  militaryStatuses: { 1: { fa: 'پایان خدمت', en: 'Completed' }, 2: { fa: 'معافیت', en: 'Exempt' } } as SampleLookup,
  militaryLocations: { 1: { fa: 'تهران', en: 'Tehran' }, 2: { fa: 'سایر', en: 'Other' } } as SampleLookup,
  insuranceTypes: { 1: { fa: 'تامین اجتماعی', en: 'Social security' }, 2: { fa: 'خدمات درمانی', en: 'Medical services' } } as SampleLookup,
  emailLabels: { 1: { fa: 'کاری', en: 'Work' }, 2: { fa: 'شخصی', en: 'Personal' } } as SampleLookup,
  phoneLabels: { 1: { fa: 'همراه', en: 'Mobile' }, 2: { fa: 'محل کار', en: 'Work' } } as SampleLookup,
  addressLabels: { 1: { fa: 'منزل', en: 'Home' }, 2: { fa: 'محل کار', en: 'Work' } } as SampleLookup,
  activityFields: { 1: { fa: 'بازار سرمایه', en: 'Capital market' }, 2: { fa: 'بانکداری', en: 'Banking' } } as SampleLookup,
  activityUnits: { 1: { fa: 'معاملات', en: 'Trading' }, 2: { fa: 'تحلیل و پژوهش', en: 'Research' } } as SampleLookup,
  positions: { 1: { fa: 'کارشناس', en: 'Officer' }, 2: { fa: 'مدیر', en: 'Manager' } } as SampleLookup,
  contractTypes: { 1: { fa: 'تمام وقت', en: 'Full time' }, 2: { fa: 'پاره وقت', en: 'Part time' } } as SampleLookup,
  educationLevels: { 1: { fa: 'کارشناسی', en: 'Bachelor' }, 2: { fa: 'کارشناسی ارشد', en: 'Master' } } as SampleLookup,
  fieldsOfStudy: { 1: { fa: 'مدیریت مالی', en: 'Financial management' }, 2: { fa: 'اقتصاد', en: 'Economics' } } as SampleLookup,
  institutions: { 1: { fa: 'دانشگاه نمونه', en: 'Sample University' }, 2: { fa: 'موسسه نمونه', en: 'Sample Institute' } } as SampleLookup,
  relationshipTypes: { 1: { fa: 'همسر', en: 'Spouse' }, 2: { fa: 'فرزند', en: 'Child' }, 3: { fa: 'پدر', en: 'Father' }, 4: { fa: 'مادر', en: 'Mother' }, 5: { fa: 'سایر', en: 'Other' } } as SampleLookup,
  documentTypes: { 1: { fa: 'تصویر کارت ملی', en: 'National card image' }, 2: { fa: 'تصویر شناسنامه', en: 'Birth certificate image' } } as SampleLookup,
};

const RELATIONSHIP_TYPE_BY_NAME: Record<string, number> = { Spouse: 1, Child: 2, Father: 3, Mother: 4 };
const pad = (n: number, len: number) => String(n).padStart(len, '0');
const at = (y: number, m: number, d: number) => `${y}-${pad(m, 2)}-${pad(d, 2)}T08:30:00Z`;
const day = (y: number, m: number, d: number) => `${y}-${pad(m, 2)}-${pad(d, 2)}`;

// One deterministic sample set per sample person. Every few people a section is
// left empty, so the preview also shows each section's "nothing registered" text.
export function buildSamplePersonDetails(p: MockPersonnel): SamplePersonDetails {
  const n = Number(p.id.replace(/\D+/g, '')) || 1;
  const code = pad(n, 2);
  const female = n % 3 === 0;
  const stamp = { createdAt: at(2024, 1 + (n % 12), 1 + (n % 27)), updatedAt: at(2025, 1 + (n % 12), 1 + (n % 27)) };
  const id = (section: string, i: number) => `sample-${section}-${n}-${i}`;

  return {
    names: [
      { languageId: 12, firstName: 'شخص', lastName: p.name.fa.replace('شخص ', ''), fatherName: 'پدر نمونه', ...stamp },
      ...(n % 4 === 0 ? [] : [{ languageId: 10, firstName: 'Sample', lastName: `Person ${code}`, fatherName: 'Sample Father', ...stamp }]),
    ],
    personal: {
      nationalId: p.nationalId,
      birthCertificateNumber: `0000${pad(n, 4)}`,
      passportNumber: n % 5 === 0 ? '' : `X0000${pad(n, 3)}`,
      birthCertificateSeriesLetterId: 1 + (n % 2),
      birthCertificateSeriesNumber: pad(n % 99, 2),
      birthCertificateSerial: `0000${pad(n, 2)}`,
      dateOfBirth: day(1975 + (n % 25), 1 + (n % 12), 1 + (n % 27)),
      sexId: female ? 2 : 1,
      maritalStatusId: 1 + (n % 2),
      birthCountryId: 1,
      birthRegionId: 1 + (n % 3),
      birthCityId: 1 + (n % 3),
      certIssueCountryId: 1,
      certIssueRegionId: 1 + ((n + 1) % 3),
      certIssueCityId: 1 + ((n + 1) % 3),
      religionId: 1,
      militaryServiceStatusId: female ? 0 : 1 + (n % 2),
      militaryServiceLocationId: female ? 0 : 1 + (n % 2),
      insuranceTypeId: 1 + (n % 2),
      insuranceNumber: `0000${pad(n, 6)}`,
    },
    nationalities: [
      { id: id('nat', 1), countryId: 1, ...stamp },
      ...(n % 9 === 0 ? [{ id: id('nat', 2), countryId: 2, ...stamp }] : []),
    ],
    emails: n % 6 === 0 ? [] : [
      { id: id('email', 1), labelId: 1, value: `sample.person${code}@example.invalid`, isPrimary: true, ...stamp },
      ...(n % 2 === 0 ? [{ id: id('email', 2), labelId: 2, value: `person${code}.home@example.invalid`, isPrimary: false, ...stamp }] : []),
    ],
    phones: [
      { id: id('phone', 1), labelId: 1, value: `0000000${pad(n, 4)}`, isPrimary: true, ...stamp },
      ...(n % 3 === 0 ? [{ id: id('phone', 2), labelId: 2, value: `0000100${pad(n, 4)}`, isPrimary: false, ...stamp }] : []),
    ],
    addresses: n % 7 === 0 ? [] : [
      { id: id('addr', 1), labelId: 1, countryId: 1, regionId: 1 + (n % 3), cityId: 1 + (n % 3), street1: `خیابان نمونه ${n}، پلاک ${n}`, postalCode: `0000${pad(n, 6)}`, isPrimary: true, ...stamp },
    ],
    employments: n % 8 === 0 ? [] : [
      { id: id('emp', 1), companyName: 'شرکت نمونه یک', companyNationalId: '00000000001', activityFieldId: 2, activityUnitId: 2, positionId: 1, contractTypeId: 1, fromDate: day(2012, 3, 1), toDate: day(2018, 2, 28), documents: [], ...stamp },
      { id: id('emp', 2), companyName: 'کارگزاری نمونه', companyNationalId: '00000000002', activityFieldId: 1, activityUnitId: 1, positionId: 1 + (n % 2), contractTypeId: 1, fromDate: day(2018, 3, 1), toDate: n % 4 === 0 ? day(2025, 6, 30) : null, documents: n % 2 === 0 ? [{ id: id('empdoc', 1), fileName: `contract-sample-${code}.pdf` }] : [], ...stamp },
    ],
    educations: n % 5 === 0 ? [] : [
      { id: id('edu', 1), educationLevelId: 1, fieldOfStudyId: 1 + (n % 2), institutionId: 1, startDate: day(2000, 9, 23), endDate: day(2004, 6, 30), gpa: 15 + (n % 5), isCompleted: true, documents: [{ id: id('edudoc', 1), fileName: `degree-sample-${code}.pdf` }], ...stamp },
      ...(n % 2 === 0 ? [{ id: id('edu', 2), educationLevelId: 2, fieldOfStudyId: 2, institutionId: 2, startDate: day(2005, 9, 23), endDate: null, gpa: null, isCompleted: false, documents: [], ...stamp }] : []),
    ],
    // The person's relationships are the preview's sample dependents.
    relationships: p.dependents.map((d, i) => ({
      id: id('rel', i + 1),
      relationshipTypeId: RELATIONSHIP_TYPE_BY_NAME[d.relationship.en] ?? 5,
      relatedPersonName: d.name.fa,
      relatedPersonNationalId: d.nationalId,
      ...stamp,
    })),
    documents: n % 4 === 1 ? [] : [
      { id: id('doc', 1), documentTypeId: 1, fileName: `national-card-sample-${code}.jpg`, fileSize: 182_000 + n * 1000, ...stamp },
      ...(n % 2 === 0 ? [{ id: id('doc', 2), documentTypeId: 2, fileName: `birth-certificate-sample-${code}.pdf`, fileSize: 940_000 + n * 1000, ...stamp }] : []),
    ],
    statuses: n % 10 === 0 ? [] : [
      { id: id('status', 1), startDate: day(2015, 1, 1), endDate: n % 3 === 0 ? day(2025, 1, 1) : null, ...stamp },
    ],
  };
}
