/**
 * KSS ERP Members Service — Branch endpoints (KSS.Service.SEBA_ERP_Members).
 * Server-side only. Base URL from ERP_MEMBERS_API_BASE_URL. JWT Bearer required.
 */

function getBaseUrl(): string {
  const baseUrl = process.env.ERP_MEMBERS_API_BASE_URL;
  if (!baseUrl) {
    throw new Error('ERP_MEMBERS_API_BASE_URL environment variable is required but not set.');
  }
  return baseUrl;
}

async function req<T>(token: string, method: string, path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    let message = errorText;
    try {
      const parsed = JSON.parse(errorText);
      if (parsed?.message) message = String(parsed.message);
    } catch {
      /* keep raw text */
    }
    throw new Error(message || `Request failed: ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

// ============================================
// Branch core (+ names)
// ============================================

export interface BranchName {
  languageId: number;
  name: string;
}

export interface BranchCoreView {
  id: string;
  companyId: string;
  branchCode: string | null;
  branchTypeId: number | null;
  activityTypeId: number | null;
  managerPersonId: string | null;
  employeeCount: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  names: BranchName[];
}

export interface BranchCoreInsert {
  companyId: string;
  branchCode?: string | null;
  branchTypeId?: number | null;
  activityTypeId?: number | null;
  managerPersonId?: string | null;
  employeeCount?: number | null;
  names: BranchName[];
}

export interface BranchCoreUpdate extends Omit<BranchCoreInsert, 'companyId'> {
  id: string;
  isActive: boolean;
}

export const getBranchesByCompany = (token: string, companyId: string) =>
  req<BranchCoreView[]>(token, 'GET', `/Api/Branch/ByCompany/${companyId}`);

export const createBranch = (token: string, dto: BranchCoreInsert) =>
  req<BranchCoreView>(token, 'POST', `/Api/Branch/Create`, dto);

export const saveBranch = (token: string, dto: BranchCoreUpdate) =>
  req<BranchCoreView>(token, 'PUT', `/Api/Branch/Save`, dto);

export const deleteBranch = (token: string, id: string) =>
  req<void>(token, 'DELETE', `/Api/Branch/Delete/${id}`);

// ============================================
// Branch contacts (addresses + phones)
// ============================================

export interface BranchAddressContact {
  id: string;
  branchId: string;
  labelId: number;
  countryId: number;
  regionId: number;
  cityId: number;
  postalCode: string;
  street1: string;
  street2: string | null;
  isPrimary: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface BranchPhoneContact {
  id: string;
  branchId: string;
  labelId: number;
  countryId: number;
  phoneNumber: string;
  isPrimary: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface BranchContact {
  addresses: BranchAddressContact[];
  phones: BranchPhoneContact[];
}

export interface BranchAddressInput {
  labelId: number;
  countryId: number;
  regionId: number;
  cityId: number;
  postalCode: string;
  street1: string;
  street2?: string | null;
  isPrimary: boolean;
}

export interface BranchPhoneInput {
  labelId: number;
  countryId: number;
  phoneNumber: string;
  isPrimary: boolean;
}

export const getBranchContacts = (token: string, branchId: string, languageId = 12) =>
  req<BranchContact>(token, 'GET', `/Api/BranchContact/${branchId}?languageId=${languageId}`);

export const addBranchAddress = (token: string, branchId: string, dto: BranchAddressInput, languageId = 12) =>
  req<BranchAddressContact>(token, 'POST', `/Api/BranchContact/${branchId}/Address?languageId=${languageId}`, dto);

export const updateBranchAddress = (token: string, addressId: string, dto: BranchAddressInput, languageId = 12) =>
  req<BranchAddressContact>(token, 'PUT', `/Api/BranchContact/Address/${addressId}?languageId=${languageId}`, { ...dto, id: addressId });

export const deleteBranchAddress = (token: string, addressId: string) =>
  req<void>(token, 'DELETE', `/Api/BranchContact/Address/${addressId}`);

export const addBranchPhone = (token: string, branchId: string, dto: BranchPhoneInput) =>
  req<BranchPhoneContact>(token, 'POST', `/Api/BranchContact/${branchId}/Phone`, dto);

export const updateBranchPhone = (token: string, phoneId: string, dto: BranchPhoneInput) =>
  req<BranchPhoneContact>(token, 'PUT', `/Api/BranchContact/Phone/${phoneId}`, { ...dto, id: phoneId });

export const deleteBranchPhone = (token: string, phoneId: string) =>
  req<void>(token, 'DELETE', `/Api/BranchContact/Phone/${phoneId}`);

// ============================================
// Branch lookups (type / activity) — Members service
// ============================================

export const getBranchTypes = (token: string) =>
  req<{ id: number; code: string }[]>(token, 'GET', `/Api/BranchType/ToListAll`);

export const getBranchTypeTranslations = (token: string) =>
  req<{ branchTypeId: number; languageId: number; name: string }[]>(token, 'GET', `/Api/BranchTypeTranslation/ToListAll`);

export const getBranchActivityTypes = (token: string) =>
  req<{ id: number; code: string }[]>(token, 'GET', `/Api/BranchActivityType/ToListAll`);

export const getBranchActivityTypeTranslations = (token: string) =>
  req<{ branchActivityTypeId: number; languageId: number; name: string }[]>(token, 'GET', `/Api/BranchActivityTypeTranslation/ToListAll`);
