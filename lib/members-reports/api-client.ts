/**
 * Members Reports API client.
 *
 * v1 routes through `mock-store.ts` so the UI works without the backend.
 * Once `KSS.Service.Report.SEBA_ERP_Members` exposes the per-report
 * endpoints, set `NEXT_PUBLIC_REPORTS_USE_MOCK=0` (or remove the env var)
 * and the same call sites switch to live `fetch()` calls — no UI changes
 * needed.
 */

import type {
  BrokerageFilter,
  BrokerageReportRow,
  DashboardStats,
  MemberFilter,
  MemberReportRow,
} from './types';
import {
  getDashboardStats,
  listBrokerageRowsFiltered,
  listMemberRowsFiltered,
} from './mock-store';

const REPORTS_BASE = process.env.NEXT_PUBLIC_REPORTS_URL ?? 'http://localhost:7100';
const USE_MOCK = (process.env.NEXT_PUBLIC_REPORTS_USE_MOCK ?? '1') === '1';

/** Small artificial delay so loading skeletons get a chance to render. */
async function settle<T>(value: T): Promise<T> {
  if (typeof window === 'undefined') return value;
  return new Promise((resolve) => setTimeout(() => resolve(value), 60));
}

async function callReports<T>(
  path: string,
  init?: RequestInit & { bearer?: string },
): Promise<T> {
  const url = `${REPORTS_BASE.replace(/\/$/, '')}${path}`;
  const headers = new Headers(init?.headers);
  headers.set('Accept', 'application/json');
  if (init?.bearer) headers.set('Authorization', `Bearer ${init.bearer}`);

  const resp = await fetch(url, { ...init, headers });
  if (!resp.ok) {
    throw new ReportsApiError(resp.status, await resp.text().catch(() => ''));
  }
  return (await resp.json()) as T;
}

export class ReportsApiError extends Error {
  constructor(public readonly status: number, public readonly body: string) {
    super(`Reports API error ${status}`);
    this.name = 'ReportsApiError';
  }
}

function toQuery(filter: object): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(filter)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      for (const item of v) parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(item))}`);
    } else if (typeof v === 'object') {
      // Range: serialise as `${k}From` / `${k}To`.
      const tuple = v as [unknown, unknown];
      if (tuple[0] != null) parts.push(`${encodeURIComponent(k)}From=${encodeURIComponent(String(tuple[0]))}`);
      if (tuple[1] != null) parts.push(`${encodeURIComponent(k)}To=${encodeURIComponent(String(tuple[1]))}`);
    } else {
      parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
    }
  }
  return parts.length ? `?${parts.join('&')}` : '';
}

// ─── Public API ─────────────────────────────────────────────────────────────

export const reportsApi = {
  async dashboard(opts?: { bearer?: string; signal?: AbortSignal }): Promise<DashboardStats> {
    if (USE_MOCK) return settle(getDashboardStats());
    return callReports<DashboardStats>('/reports/dashboard', opts);
  },

  async brokerages(
    filter: BrokerageFilter,
    opts?: { bearer?: string; signal?: AbortSignal },
  ): Promise<BrokerageReportRow[]> {
    if (USE_MOCK) return settle(listBrokerageRowsFiltered(filter));
    return callReports<BrokerageReportRow[]>(`/reports/brokerages${toQuery(filter)}`, opts);
  },

  async members(
    filter: MemberFilter,
    opts?: { bearer?: string; signal?: AbortSignal },
  ): Promise<MemberReportRow[]> {
    if (USE_MOCK) return settle(listMemberRowsFiltered(filter));
    return callReports<MemberReportRow[]>(`/reports/members${toQuery(filter)}`, opts);
  },
};
