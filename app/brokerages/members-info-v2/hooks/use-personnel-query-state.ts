'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Search, filters, paging and the selected brokerage live in the URL query, so
// they survive moving between pages, the back button and a reload. A filter
// with several values repeats its key (?status=active&status=ended): the native
// URLSearchParams form, with no delimiter that a value could ever contain.
// Paths stay zone-relative: Next adds the zone basePath itself.

export const PAGE_SIZES = [10, 25, 50, 100];
export const DEFAULT_PAGE_SIZE = 25;

export interface PersonnelQueryState {
  brokerageId: string;
  q: string;
  status: string[];
  unit: string[];
  position: string[];
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
      status: params.getAll('status').filter(Boolean),
      unit: params.getAll('unit').filter(Boolean),
      position: params.getAll('position').filter(Boolean),
      page: Number.isInteger(page) && page > 0 ? page : 1,
      size: PAGE_SIZES.includes(size) ? size : DEFAULT_PAGE_SIZE,
    };
  }, [params]);

  // router.replace lands asynchronously, so two changes made in quick succession
  // would both start from the same URL and the later one would drop the earlier.
  // Each change therefore builds on the latest state WRITTEN, which is reset to
  // the URL whenever the URL itself changes (reload, Back, a link).
  const latest = useRef(state);
  useEffect(() => {
    latest.current = state;
  }, [state]);

  const update = useCallback(
    (patch: Partial<PersonnelQueryState>) => {
      const next = { ...latest.current, ...patch };
      // Any change other than the page itself starts again at page 1.
      if (!('page' in patch)) next.page = 1;
      const qs = new URLSearchParams();
      if (next.brokerageId) qs.set('b', next.brokerageId);
      if (next.q) qs.set('q', next.q);
      next.status.forEach((v) => qs.append('status', v));
      next.unit.forEach((v) => qs.append('unit', v));
      next.position.forEach((v) => qs.append('position', v));
      if (next.page > 1) qs.set('page', String(next.page));
      if (next.size !== DEFAULT_PAGE_SIZE) qs.set('size', String(next.size));
      latest.current = next;
      const query = qs.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  return { state, update };
}
