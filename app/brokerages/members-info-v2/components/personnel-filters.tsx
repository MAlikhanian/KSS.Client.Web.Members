'use client';

import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { BUSINESS_UNITS, POSITIONS, type EmploymentStatus } from '../mock/personnel.mock';
import type { PersonnelQueryState } from '../hooks/use-personnel-query-state';

const STATUSES: EmploymentStatus[] = ['active', 'ended', 'awaitingStart', 'missing', 'conflict'];
const ALL = '__all__';

interface PersonnelFiltersProps {
  state: PersonnelQueryState;
  update: (patch: Partial<PersonnelQueryState>) => void;
  lang: 'fa' | 'en';
  canViewPersonalData: boolean;
}

export function PersonnelFilters({ state, update, lang, canViewPersonalData }: PersonnelFiltersProps) {
  const { t } = useTranslation('brokerages-members-info-v2');
  const [text, setText] = useState(state.q);

  // Keep the box in step with the URL (back button, reload).
  useEffect(() => setText(state.q), [state.q]);

  // Commit typing to the URL after a short pause, not on every key.
  useEffect(() => {
    if (text === state.q) return;
    const id = setTimeout(() => update({ q: text.trim() }), 300);
    return () => clearTimeout(id);
  }, [text, state.q, update]);

  const hasAny = !!(state.q || state.status || state.unit || state.position);

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="relative w-full sm:w-72">
        <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="ps-9"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={canViewPersonalData ? t('filters.searchPlaceholder') : t('filters.searchPlaceholderNameOnly')}
          aria-label={t('filters.search')}
        />
      </div>

      <Select value={state.status || ALL} onValueChange={(v) => update({ status: v === ALL ? '' : v })}>
        <SelectTrigger className="w-48" aria-label={t('filters.status')}>
          <SelectValue placeholder={t('filters.status')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{t('filters.allStatuses')}</SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>{t(`status.${s}`)}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={state.unit || ALL} onValueChange={(v) => update({ unit: v === ALL ? '' : v })}>
        <SelectTrigger className="w-48" aria-label={t('filters.unit')}>
          <SelectValue placeholder={t('filters.unit')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{t('filters.allUnits')}</SelectItem>
          {Object.entries(BUSINESS_UNITS).map(([key, label]) => (
            <SelectItem key={key} value={key}>{label[lang]}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={state.position || ALL} onValueChange={(v) => update({ position: v === ALL ? '' : v })}>
        <SelectTrigger className="w-48" aria-label={t('filters.position')}>
          <SelectValue placeholder={t('filters.position')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{t('filters.allPositions')}</SelectItem>
          {Object.entries(POSITIONS).map(([key, label]) => (
            <SelectItem key={key} value={key}>{label[lang]}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasAny && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setText('');
            update({ q: '', status: '', unit: '', position: '' });
          }}
        >
          <X className="size-4" />
          {t('filters.clear')}
        </Button>
      )}
    </div>
  );
}
