'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import type { PersonSearchResult } from '@/components/common/person-search';

const LANG_CODE_TO_ID: Record<string, number> = { fa: 12, en: 10 };

interface ManagerSummaryProps {
  personId: string;
  /** Fresh selection from PersonSearch — when present, no fetch is needed. */
  pick: PersonSearchResult | null;
}

/** Compact one-line person display: full name + national ID only. Reused for
 *  the trading-station trader (same shape as the trading-offices manager). */
export function ManagerSummary({ personId, pick }: ManagerSummaryProps) {
  const { i18n } = useTranslation();
  const langId = LANG_CODE_TO_ID[i18n.language] ?? 12;
  const [fetched, setFetched] = useState<{ name: string; nationalId: string } | null>(null);

  useEffect(() => {
    if (pick || !personId) {
      setFetched(null);
      return;
    }
    let cancelled = false;
    fetch(`/api/person/${personId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const tr =
          data.translations?.find((x: { languageId: number }) => x.languageId === langId) ??
          data.translations?.[0];
        const name = tr ? `${tr.firstName} ${tr.lastName}`.trim() : '';
        setFetched({ name, nationalId: data.nationalId ?? '' });
      })
      .catch(() => {
        if (!cancelled) setFetched(null);
      });
    return () => {
      cancelled = true;
    };
  }, [personId, pick, langId]);

  let name = '';
  let nationalId = '';
  if (pick) {
    const tr = pick.translations?.find((x) => x.languageId === langId) ?? pick.translations?.[0];
    name = tr ? `${tr.firstName} ${tr.lastName}`.trim() : '';
    nationalId = pick.nationalId ?? '';
  } else if (fetched) {
    name = fetched.name;
    nationalId = fetched.nationalId;
  }

  if (!name && !nationalId) return null;

  return (
    <div className="flex items-center gap-3 text-sm">
      {name && <span className="font-medium">{name}</span>}
      {nationalId && (
        <span className="text-muted-foreground font-mono" dir="ltr">{nationalId}</span>
      )}
    </div>
  );
}
