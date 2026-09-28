/**
 * KSS ERP Members Service — TradingStation endpoints (KSS.Service.SEBA_ERP_Members).
 * Server-side only. Base URL from ERP_MEMBERS_API_BASE_URL. JWT Bearer required.
 * Mirrors branch-api.ts; a TradingStation has NO name/translations.
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
// TradingStation core (no names)
// ============================================

export interface TradingStationView {
  id: string;
  companyId: string;
  stationCode: string | null;
  branchId: string | null;
  stationTypeId: number | null;
  activityTypeId: number | null;
  traderPersonId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface TradingStationInsert {
  companyId: string;
  stationCode?: string | null;
  branchId?: string | null;
  stationTypeId?: number | null;
  activityTypeId?: number | null;
  traderPersonId?: string | null;
}

export interface TradingStationUpdate {
  id: string;
  companyId: string;
  stationCode?: string | null;
  branchId?: string | null;
  stationTypeId?: number | null;
  activityTypeId?: number | null;
  traderPersonId?: string | null;
  isActive: boolean;
}

export const getTradingStationsByCompany = (token: string, companyId: string) =>
  req<TradingStationView[]>(token, 'GET', `/Api/TradingStation/ByCompany/${companyId}`);

export const createTradingStation = (token: string, dto: TradingStationInsert) =>
  req<TradingStationView>(token, 'POST', `/Api/TradingStation/Create`, dto);

export const saveTradingStation = (token: string, dto: TradingStationUpdate) =>
  req<TradingStationView>(token, 'PUT', `/Api/TradingStation/Save`, dto);

export const deleteTradingStation = (token: string, id: string) =>
  req<void>(token, 'DELETE', `/Api/TradingStation/Delete/${id}`);

// ============================================
// TradingStation lookups (type / activity) — Members service
// ============================================

export const getTradingStationTypes = (token: string) =>
  req<{ id: number; code: string }[]>(token, 'GET', `/Api/TradingStationType/ToListAll`);

export const getTradingStationTypeTranslations = (token: string) =>
  req<{ tradingStationTypeId: number; languageId: number; name: string }[]>(token, 'GET', `/Api/TradingStationTypeTranslation/ToListAll`);

export const getTradingStationActivityTypes = (token: string) =>
  req<{ id: number; code: string }[]>(token, 'GET', `/Api/TradingStationActivityType/ToListAll`);

export const getTradingStationActivityTypeTranslations = (token: string) =>
  req<{ tradingStationActivityTypeId: number; languageId: number; name: string }[]>(token, 'GET', `/Api/TradingStationActivityTypeTranslation/ToListAll`);
