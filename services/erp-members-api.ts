/**
 * KSS ERP Members Service (KSS.Service.SEBA_ERP_Members)
 *
 * Server-side only functions for brokerage-specific (SEO/domain) data.
 * Base URL from ERP_MEMBERS_API_BASE_URL env (set in .env / ConfigMap / k8s).
 * All endpoints require JWT Bearer token from Auth service.
 */

function getBaseUrl(): string {
  const baseUrl = process.env.ERP_MEMBERS_API_BASE_URL;
  if (!baseUrl) {
    console.error(
      '[ERP Members API] ERP_MEMBERS_API_BASE_URL is not set in environment variables',
    );
    throw new Error(
      'ERP_MEMBERS_API_BASE_URL environment variable is required but not set.',
    );
  }
  return baseUrl;
}

/** BrokerageDto from SEBA_ERP_Members service */
export interface BrokerageErpDto {
  id: string;
  companyId: string;
  brokerageStatusId: number;
  brokerageCode: string | null;
  seoRegistrationNo: string | null;
  seoRegistrationDate: string | null;
  seoLicenseNo: string | null;
  seoLicenseDate: string | null;
  seoLicenseExpiryDate: string | null;
  capitalAmount: number | null;
  employeeCount: number | null;
  branchCount: number | null;
  isListedOnExchange: boolean;
  exchangeSymbol: string | null;
  isActive: boolean;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * GET /Api/Brokerage/Count — returns the scalar total. The dashboard tile
 * fetches just the count; no entity rows are exposed.
 */
export async function getBrokerageCount(token: string): Promise<number> {
  const url = `${getBaseUrl()}/Api/Brokerage/Count`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(errorText || 'Failed to fetch brokerage count');
  }
  const dto: { count: number } = await response.json();
  return dto.count;
}

/**
 * Find brokerage ERP record by CompanyId
 * GET /Api/Brokerage/FindByCompanyId/{companyId}
 * Custom endpoint on BrokerageController.
 */
export async function getBrokerageByCompanyId(
  token: string,
  companyId: string,
): Promise<BrokerageErpDto | null> {
  const url = `${getBaseUrl()}/Api/Brokerage/FindByCompanyId/${companyId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (response.status === 404 || response.status === 204) {
    return null; // No brokerage record for this company yet
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    console.error('[ERP Members API] getBrokerageByCompanyId failed:', {
      status: response.status,
      errorText,
    });
    throw new Error(`Failed to fetch brokerage ERP data: ${response.status}`);
  }

  return response.json();
}

/**
 * Create a new brokerage ERP record
 * POST /Api/Brokerage/Create (auth-only path, mirrors BranchController.Create —
 * not gated by Members.Brokerage.Modify)
 */
export async function createBrokerageErp(
  token: string,
  data: Partial<BrokerageErpDto>,
): Promise<BrokerageErpDto> {
  const url = `${getBaseUrl()}/Api/Brokerage/Create`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    console.error('[ERP Members API] createBrokerageErp failed:', {
      status: response.status,
      errorText,
    });
    throw new Error(`Failed to create brokerage ERP record: ${response.status}`);
  }

  return response.json();
}

/** PersonStatusDto */
export interface PersonStatusErpDto {
  id: number;
  code: string;
}

/** PersonStatusTranslationDto */
export interface PersonStatusTranslationErpDto {
  personStatusId: number;
  languageId: number;
  name: string;
}

export async function getBrokeragePersonByPersonId(
  token: string,
  personId: string,
): Promise<BrokeragePersonDto | null> {
  const url = `${getBaseUrl()}/Api/BrokeragePerson/FindByPersonIdAsync/${personId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (response.status === 404 || response.status === 204) return null;
  if (!response.ok) throw new Error(`Failed to fetch brokerage person: ${response.status}`);
  return response.json();
}

export async function listPersonStatusErp(token: string): Promise<PersonStatusErpDto[]> {
  const url = `${getBaseUrl()}/Api/PersonStatus/ToListAllAsync`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Failed to list person statuses: ${response.status}`);
  return response.json();
}

export async function listPersonStatusTranslationsErp(
  token: string,
): Promise<PersonStatusTranslationErpDto[]> {
  const url = `${getBaseUrl()}/Api/PersonStatusTranslation/ToListAllAsync`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Failed to list translations: ${response.status}`);
  return response.json();
}

/** PersonStatus lookup item in the legacy useData shape. */
export interface PersonStatusLookupItem {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

/**
 * PersonStatus lookup with FA/EN names resolved, mapped to the useData shape.
 * Joins PersonStatus + PersonStatusTranslation via the base `ToListAll` route
 * (ASP.NET strips the Async suffix from the action name).
 */
export async function listPersonStatusesLookup(token: string): Promise<PersonStatusLookupItem[]> {
  const headers = { Accept: 'application/json', Authorization: `Bearer ${token}` };
  const [statusRes, transRes] = await Promise.all([
    fetch(`${getBaseUrl()}/Api/PersonStatus/ToListAll`, { method: 'GET', headers, cache: 'no-store' }),
    fetch(`${getBaseUrl()}/Api/PersonStatusTranslation/ToListAll`, { method: 'GET', headers, cache: 'no-store' }),
  ]);
  if (!statusRes.ok) throw new Error(`Failed to list person statuses: ${statusRes.status}`);
  if (!transRes.ok) throw new Error(`Failed to list person status translations: ${transRes.status}`);

  const statuses: PersonStatusErpDto[] = await statusRes.json();
  const translations: PersonStatusTranslationErpDto[] = await transRes.json();

  return statuses.map((s) => {
    const fa = translations.find((t) => t.personStatusId === s.id && t.languageId === 12);
    const en = translations.find((t) => t.personStatusId === s.id && t.languageId === 10);
    return { id: String(s.id), code: s.code, name: fa?.name ?? en?.name ?? s.code, isActive: true };
  });
}

/**
 * Update a brokerage ERP record
 * PUT /Api/Brokerage/Save (auth-only path, mirrors BranchController.Save —
 * not gated by Members.Brokerage.Modify)
 */
export async function updateBrokerageErp(
  token: string,
  data: Partial<BrokerageErpDto>,
): Promise<void> {
  const url = `${getBaseUrl()}/Api/Brokerage/Save`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    console.error('[ERP Members API] updateBrokerageErp failed:', {
      status: response.status,
      errorText,
    });
    throw new Error(`Failed to update brokerage ERP record: ${response.status}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Position / WorkLocation lookups (added with migration 002)
// ─────────────────────────────────────────────────────────────────────────────

export interface PositionTranslation {
  positionId: number;
  languageId: number;
  name: string;
}
export interface Position {
  id: number;
  code: string;
  translations: PositionTranslation[];
}
export interface WorkLocationTranslation {
  workLocationId: number;
  languageId: number;
  name: string;
}
export interface WorkLocation {
  id: number;
  code: string;
  translations: WorkLocationTranslation[];
}

export async function listPositions(token: string): Promise<Position[]> {
  const response = await fetch(`${getBaseUrl()}/Api/Position/ToListAll`, {
    method: 'GET',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Failed to list positions: ${response.status}`);
  return response.json();
}

export async function listWorkLocations(token: string): Promise<WorkLocation[]> {
  const response = await fetch(`${getBaseUrl()}/Api/WorkLocation/ToListAll`, {
    method: 'GET',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Failed to list work locations: ${response.status}`);
  return response.json();
}

export interface StockExchangeTranslation {
  stockExchangeId: number;
  languageId: number;
  name: string;
}
export interface StockExchange {
  id: number;
  code: string;
  translations: StockExchangeTranslation[];
}

export async function listStockExchanges(token: string): Promise<StockExchange[]> {
  const response = await fetch(`${getBaseUrl()}/Api/StockExchange/ToListAll`, {
    method: 'GET',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Failed to list stock exchanges: ${response.status}`);
  return response.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// BrokeragePerson CRUD (membership row keyed by (BrokerageId, PersonId))
// ─────────────────────────────────────────────────────────────────────────────

export interface BrokeragePersonDto {
  id?: string;
  personId: string;
  brokerageId: string;
  personStatusId: number;
  bourseCode: string;
  description: string | null;
  workLocationId: number | null;
  stockExchangeId: number | null;
  positionId: number | null;
  workExperience: string | null;
  terminationCertificate: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export async function listBrokeragePersonsByBrokerage(
  token: string,
  brokerageId: string,
): Promise<BrokeragePersonDto[]> {
  const response = await fetch(
    `${getBaseUrl()}/Api/BrokeragePerson/FindByBrokerageId/${brokerageId}`,
    {
      method: 'GET',
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
    },
  );
  if (!response.ok) throw new Error(`Failed to list brokerage persons: ${response.status}`);
  return response.json();
}

export async function upsertBrokeragePerson(
  token: string,
  dto: BrokeragePersonDto,
): Promise<BrokeragePersonDto> {
  const response = await fetch(`${getBaseUrl()}/Api/BrokeragePerson/UpsertMembership`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dto),
    cache: 'no-store',
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    let message = errorText;
    try {
      const parsed = JSON.parse(errorText);
      if (parsed?.message) message = String(parsed.message);
    } catch {}
    throw new Error(message || `Upsert brokerage person failed: ${response.status}`);
  }
  return response.json();
}

export async function deleteBrokeragePerson(token: string, id: string): Promise<void> {
  const response = await fetch(`${getBaseUrl()}/Api/BrokeragePerson/Remove`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Delete brokerage person failed: ${response.status}`);
}

// ─── Investment Fund + organ role assignments ───────────────────────────────

export interface FundDto {
  id: string;
  companyId: string;
  preferredUnitsCount: number | null;
  ordinaryUnitsInvestors: number | null;
  ordinaryUnitsSeo: number | null;
  fiscalYear: string | null;
  endOfActivityPeriodSeo: string | null;
  registrationDateSeo: string | null;
  registrationNumberSeo: string | null;
  createdAt: string;
  updatedAt: string | null;
  isActive: boolean;
}

export interface FundRolePersonDto {
  id: string;
  fundId: string;
  personId: string;
  fundRoleId: number;
  createdAt: string;
  updatedAt: string | null;
  isActive: boolean;
}

const jsonHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Authorization: `Bearer ${token}`,
});

export async function getFundByCompanyId(token: string, companyId: string): Promise<FundDto | null> {
  const url = `${getBaseUrl()}/Api/Fund/FindByCompanyId/${companyId}`;
  const r = await fetch(url, { method: 'GET', headers: jsonHeaders(token), cache: 'no-store' });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`getFundByCompanyId failed: ${r.status}`);
  return r.json();
}

/**
 * Company select DTO returned by the ERP_Members CompanyList endpoints.
 * Mirrors KSS.Service.Company's CompanySelectDto — same shape used by
 * /api/company/select, /api/brokerages/select, /api/funds/select.
 */
export interface CompanySelectDto {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  nationalId?: string;
  website?: string;
  nameHistory: Array<{
    id: string;
    name: string;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
  }>;
}

function buildCompanyListUrl(path: string, languageId: number, query: string | undefined): string {
  const params = new URLSearchParams({ languageId: String(languageId) });
  if (query) params.set('query', query);
  return `${getBaseUrl()}${path}?${params.toString()}`;
}

/**
 * GET /Api/Brokerage/CompanyList — companies that have an active Brokerage row,
 * shaped as CompanySelectDto. ERP_Members handles the domain↔company join
 * (cached) and forwards through to the Company service with the caller's token.
 */
export async function listBrokerageCompanies(token: string, languageId = 12, query?: string): Promise<CompanySelectDto[]> {
  const r = await fetch(buildCompanyListUrl('/Api/Brokerage/CompanyList', languageId, query), {
    method: 'GET',
    headers: jsonHeaders(token),
    cache: 'no-store',
  });
  if (!r.ok) throw new Error(`listBrokerageCompanies failed: ${r.status}`);
  return r.json();
}

/**
 * GET /Api/Fund/CompanyList — companies that have an active Fund row,
 * shaped as CompanySelectDto. Replaces the prior listAllFunds + JS-side
 * intersection in /api/funds/select.
 */
export async function listFundCompanies(token: string, languageId = 12, query?: string): Promise<CompanySelectDto[]> {
  const r = await fetch(buildCompanyListUrl('/Api/Fund/CompanyList', languageId, query), {
    method: 'GET',
    headers: jsonHeaders(token),
    cache: 'no-store',
  });
  if (!r.ok) throw new Error(`listFundCompanies failed: ${r.status}`);
  return r.json();
}

/**
 * GET /Api/Fund/Count — scalar total of active funds. Powers the dashboard
 * "Funds" tile. Backend marks this endpoint [AllowAnonymous] so any logged-in
 * user (regardless of InvestmentFunds permission) can see the count.
 */
export async function getFundCount(token: string): Promise<number> {
  const url = `${getBaseUrl()}/Api/Fund/Count`;
  const r = await fetch(url, { method: 'GET', headers: jsonHeaders(token), cache: 'no-store' });
  if (!r.ok) {
    const errorText = await r.text().catch(() => r.statusText);
    throw new Error(errorText || 'Failed to fetch fund count');
  }
  const dto: { count: number } = await r.json();
  return dto.count;
}

export async function addFund(token: string, data: Record<string, unknown>): Promise<FundDto> {
  const r = await fetch(`${getBaseUrl()}/Api/Fund/Add`, {
    method: 'POST', headers: jsonHeaders(token), body: JSON.stringify(data), cache: 'no-store',
  });
  if (!r.ok) throw new Error(`addFund failed: ${r.status}`);
  return r.json();
}

export async function updateFund(token: string, data: Record<string, unknown>): Promise<void> {
  const r = await fetch(`${getBaseUrl()}/Api/Fund/UpdateDto`, {
    method: 'PUT', headers: jsonHeaders(token), body: JSON.stringify(data), cache: 'no-store',
  });
  if (!r.ok) throw new Error(`updateFund failed: ${r.status}`);
}

export async function listFundRolePersons(token: string, fundId: string): Promise<FundRolePersonDto[]> {
  const r = await fetch(`${getBaseUrl()}/Api/FundRolePerson/ToListByFund/${fundId}`, {
    method: 'GET', headers: jsonHeaders(token), cache: 'no-store',
  });
  if (!r.ok) throw new Error(`listFundRolePersons failed: ${r.status}`);
  return r.json();
}

export async function addFundRolePerson(token: string, data: Record<string, unknown>): Promise<FundRolePersonDto> {
  const r = await fetch(`${getBaseUrl()}/Api/FundRolePerson/Add`, {
    method: 'POST', headers: jsonHeaders(token), body: JSON.stringify(data), cache: 'no-store',
  });
  if (!r.ok) throw new Error(`addFundRolePerson failed: ${r.status}`);
  return r.json();
}

export async function removeFundRolePerson(token: string, id: string): Promise<void> {
  const r = await fetch(`${getBaseUrl()}/Api/FundRolePerson/Remove`, {
    method: 'DELETE', headers: jsonHeaders(token), body: JSON.stringify({ id }), cache: 'no-store',
  });
  if (!r.ok) throw new Error(`removeFundRolePerson failed: ${r.status}`);
}

export interface FundRoleLookup {
  id: number;
  code: string;
  name: string;
}

/**
 * Returns FundRole rows joined with their translation for the requested
 * language. BFF helper — called by the /api/common/fund-roles route.
 */
export async function listFundRoles(token: string, languageId: number): Promise<FundRoleLookup[]> {
  const base = getBaseUrl();
  const [rolesRes, trRes] = await Promise.all([
    fetch(`${base}/Api/FundRole/ToListAll`, { method: 'GET', headers: jsonHeaders(token), cache: 'no-store' }),
    fetch(`${base}/Api/FundRoleTranslation/ToListAll`, { method: 'GET', headers: jsonHeaders(token), cache: 'no-store' }),
  ]);
  if (!rolesRes.ok || !trRes.ok) throw new Error('Failed to load fund roles');
  const roles: Array<{ id: number; code: string; isActive: boolean }> = await rolesRes.json();
  const trs: Array<{ fundRoleId: number; languageId: number; name: string }> = await trRes.json();

  return roles
    .filter((r) => r.isActive !== false)
    .map((r) => {
      const tr =
        trs.find((x) => x.fundRoleId === r.id && x.languageId === languageId) ||
        trs.find((x) => x.fundRoleId === r.id && x.languageId === 10) ||
        trs.find((x) => x.fundRoleId === r.id);
      return { id: r.id, code: r.code, name: tr?.name || r.code };
    });
}

