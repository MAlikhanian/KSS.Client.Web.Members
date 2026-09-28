/**
 * KSS Report Service (KSS.Service.Report.SEBA_ERP_Members)
 *
 * Server-side only helpers for the reports aggregation service.
 * Base URL from REPORT_API_BASE_URL env (set in .env / ConfigMap / k8s).
 * All endpoints require a JWT Bearer token; the report service forwards it to
 * the upstream Members service so its authorization still applies.
 */

function getReportBaseUrl(): string {
  const baseUrl = process.env.REPORT_API_BASE_URL;
  if (!baseUrl) {
    console.error('[Report API] REPORT_API_BASE_URL is not set in environment variables');
    throw new Error('REPORT_API_BASE_URL environment variable is required but not set.');
  }
  return baseUrl;
}

/** One row of the combined brokerages + funds report (one per company). */
export interface MemberEntityReportRow {
  entityType: string; // "Brokerage" | "Fund"
  companyId: string;
  name: string;
  nationalId: string | null;
  personCount: number;
  totalPersonsCreated: number;
  lastPersonId: string | null;
  lastPersonName: string | null;
  lastPersonNationalId: string | null;
}

/** GET /reports/member-entities response envelope. */
export interface MemberEntityReport {
  totalCount: number;
  brokerageCount: number;
  fundCount: number;
  items: MemberEntityReportRow[];
}

/**
 * GET /reports/member-entities — all brokerages + funds with company name and
 * national ID. The report service aggregates the Members service's
 * Brokerage/CompanyList + Fund/CompanyList endpoints.
 */
export async function getMemberEntitiesReport(token: string): Promise<MemberEntityReport> {
  const r = await fetch(`${getReportBaseUrl()}/reports/member-entities`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });
  if (!r.ok) throw new Error(`getMemberEntitiesReport failed: ${r.status}`);
  return r.json();
}

/**
 * One person node in the Member report tree — a person the company's
 * representative(s) inserted, with their forward relations nested as `children`.
 */
export interface CompanyPersonRow {
  personId: string;
  fullName: string | null;
  nationalId: string | null;
  /** For a nested (related) person, the relationship type linking it to its parent. Null at the top level. */
  relationshipTypeId: number | null;
  /** This person's forward relations (persons they added), resolved recursively. */
  children: CompanyPersonRow[];
}

/** GET /reports/company-persons response envelope. */
export interface CompanyPersonsReport {
  companyId: string;
  totalCount: number;
  items: CompanyPersonRow[];
}

/**
 * GET /reports/company-persons?companyId=… — the persons attached to a single
 * member company (its access-holders), resolved to name + national ID. Same
 * access-grant method as the member-entities report, scoped to one company.
 */
export async function getCompanyPersonsReport(
  token: string,
  companyId: string,
): Promise<CompanyPersonsReport> {
  const url = `${getReportBaseUrl()}/reports/company-persons?companyId=${encodeURIComponent(companyId)}`;
  const r = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });
  if (!r.ok) throw new Error(`getCompanyPersonsReport failed: ${r.status}`);
  return r.json();
}

/**
 * GET /reports/company-persons/export?companyId=… — the company-persons report
 * as a styled .xlsx workbook. Returns the raw Response so the proxy route can
 * stream the binary back to the browser.
 */
export async function getCompanyPersonsExport(token: string, companyId: string): Promise<Response> {
  const url = `${getReportBaseUrl()}/reports/company-persons/export?companyId=${encodeURIComponent(companyId)}`;
  const r = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    cache: 'no-store',
  });
  if (!r.ok) throw new Error(`getCompanyPersonsExport failed: ${r.status}`);
  return r;
}

/** One position row in the personnel-by-position report. */
export interface PersonnelByPositionRow {
  positionId: number;
  name: string | null;
  count: number;
}

/** GET /reports/personnel-by-position response envelope. */
export interface PersonnelByPositionReport {
  totalCount: number;
  items: PersonnelByPositionRow[];
}

/**
 * GET /reports/personnel-by-position — current brokerage personnel grouped by
 * their work-experience position, industry-wide. Real data (Members brokerage
 * companies + Person employments).
 */
export async function getPersonnelByPosition(token: string): Promise<PersonnelByPositionReport> {
  const r = await fetch(`${getReportBaseUrl()}/reports/personnel-by-position`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!r.ok) throw new Error(`getPersonnelByPosition failed: ${r.status}`);
  return r.json();
}

/** Brokerage profile — real structural sections. */
export interface BrokerageProfileReport {
  companyId: string;
  found: boolean;
  general: {
    id: string;
    companyId: string;
    brokerageStatusId: number;
    brokerageCode: string | null;
    seoRegistrationNo: string | null;
    seoRegistrationDate: string | null;
    seoLicenseNo: string | null;
    seoLicenseDate: string | null;
    seoLicenseExpiryDate: string | null;
  } | null;
  capital: { fiscalYear: number; registeredCapital: number; numberOfShares: number } | null;
  location: { countryId: number; regionId: number; cityId: number; postalCode: string | null } | null;
  personnelCount: number;
  tradingStationCount: number;
  officeCount: number;
  stationsByType: { name: string; count: number }[];
  officesByType: { name: string; count: number }[];
  officesByActivity: { name: string; count: number }[];
  ageDistribution: { name: string; count: number }[];
  genderDistribution: { name: string; count: number }[];
}

/**
 * GET /reports/brokerage-profile?companyId=… — one brokerage's structural
 * profile (general, capital, location, counts). Real data from Members + Company.
 */
export async function getBrokerageProfile(token: string, companyId: string): Promise<BrokerageProfileReport> {
  const url = `${getReportBaseUrl()}/reports/brokerage-profile?companyId=${encodeURIComponent(companyId)}`;
  const r = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!r.ok) throw new Error(`getBrokerageProfile failed: ${r.status}`);
  return r.json();
}

/** Market-making fund report — real structural sections. */
export interface FundReport {
  companyId: string;
  found: boolean;
  specs: {
    registrationNumberSeo: string | null;
    registrationDateSeo: string | null;
    endOfActivityPeriodSeo: string | null;
    fiscalYear: string | null;
    preferredUnitsCount: number | null;
    ordinaryUnitsInvestors: number | null;
    ordinaryUnitsSeo: number | null;
  } | null;
  tradingStationCount: number;
  totalOrganCount: number;
  organRoles: { fundRoleId: number; roleName: string | null; count: number }[];
}

/**
 * GET /reports/fund-report?companyId=… — one market-making fund's structural
 * report (specs, station count, organ/role breakdown). Real data from Members.
 */
export async function getFundReport(token: string, companyId: string): Promise<FundReport> {
  const url = `${getReportBaseUrl()}/reports/fund-report?companyId=${encodeURIComponent(companyId)}`;
  const r = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!r.ok) throw new Error(`getFundReport failed: ${r.status}`);
  return r.json();
}

const XLSX_CONTENT_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/**
 * GET /reports/member-entities/export — the same brokerages + funds report as a
 * styled .xlsx workbook. Returns the raw Response so the proxy route can stream
 * the binary back to the browser.
 */
export async function getMemberEntitiesExport(token: string): Promise<Response> {
  const r = await fetch(`${getReportBaseUrl()}/reports/member-entities/export`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: XLSX_CONTENT_TYPE,
    },
    cache: 'no-store',
  });
  if (!r.ok) throw new Error(`getMemberEntitiesExport failed: ${r.status}`);
  return r;
}
