'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Search, filters, paging and the selected brokerage live in the URL query, so
// they survive moving between pages, the back button and a reload.
// Paths stay zone-relative: Next adds the zone basePath itself.

export const PAGE_SIZES = [10, 25, 50, 100];
export const DEFAULT_PAGE_SIZE = 25;

export interface PersonnelQueryState {
  brokerageId: string;
  q: string;
  status: string;
  unit: string;
  position: string;
  page: number; // 1-based
  size: number;
}

export function usePersonnelQueryState() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const state = useMemo<PersonnelQueryState>(() => {
    const page = Number(params.get('page'));
    const size = Number(params.get('size'));
    return {
      brokerageId: params.get('b') ?? '',
      q: params.get('q') ?? '',
      status: params.get('status') ?? '',
      unit: params.get('unit') ?? '',
      position: params.get('position') ?? '',
      page: Number.isInteger(page) && page > 0 ? page : 1,
      size: PAGE_SIZES.includes(size) ? size : DEFAULT_PAGE_SIZE,
    };
  }, [params]);

  const update = useCallback(
    (patch: Partial<PersonnelQueryState>) => {
      const next = { ...state, ...patch };
      // Any change other than the page itself starts again at page 1.
      if (!('page' in patch)) next.page = 1;
      const qs = new URLSearchParams();
      if (next.brokerageId) qs.set('b', next.brokerageId);
      if (next.q) qs.set('q', next.q);
      if (next.status) qs.set('status', next.status);
      if (next.unit) qs.set('unit', next.unit);
      if (next.position) qs.set('position', next.position);
      if (next.page > 1) qs.set('page', String(next.page));
      if (next.size !== DEFAULT_PAGE_SIZE) qs.set('size', String(next.size));
      const query = qs.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [state, router, pathname],
  );

  return { state, update };
}
