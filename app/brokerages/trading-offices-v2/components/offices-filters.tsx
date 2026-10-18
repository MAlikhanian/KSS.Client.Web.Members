'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';
import { CITIES, OFFICE_TYPES, PROVINCES } from '../mock/offices.mock';
import { citiesInProvinces } from '../mock/filter-offices';
import type { OfficesQueryState } from '../hooks/use-offices-query-state';

interface MultiFilterProps {
  id: string;
  title: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
}

// Multi-select in a popover, the same pattern as the personnel preview's
// filters. Picking several values matches ANY of them.
function MultiFilter({ id, title, options, selected, onChange }: MultiFilterProps) {
  const { t } = useTranslation('brokerages-trading-offices-v2');
  // The URL catches up a moment after each click, so the popover keeps its own
  // pending selection: a second quick click builds on the first instead of on
  // a URL that has not updated yet. It re-syncs whenever the URL value changes.
  const [pending, setPending] = useState<string[]>(selected);
  const pendingRef = useRef<string[]>(selected);
  const selectedKey = selected.join('|');
  useEffect(() => {
    pendingRef.current = selected;
    setPending(selected);
    // Keyed on the joined value: a new array with the same values is no change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey]);

  const chosen = new Set(pending);
  const toggle = (value: string) => {
    const next = new Set(pendingRef.current);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    // Keep the option order, so the URL is the same whatever order was clicked.
    const ordered = options.map((o) => o.value).filter((v) => next.has(v));
    pendingRef.current = ordered;
    setPending(ordered);
    onChange(ordered);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button id={id} type="button" variant="outline" className="w-52 justify-between" aria-label={title}>
          <span className="truncate">{title}</span>
          <span className="flex items-center gap-1.5">
            {chosen.size > 0 && (
              <Badge variant="primary" appearance="light" size="sm">
                {t('filters.selectedCount', { count: chosen.size })}
              </Badge>
            )}
            <ChevronDown className="size-4 opacity-60" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>{t('filters.noOptions')}</CommandEmpty>
            <CommandGroup>
              {options.map((o) => {
                const on = chosen.has(o.value);
                return (
                  <CommandItem key={o.value} value={o.label} onSelect={() => toggle(o.value)} aria-checked={on} role="option">
                    <span
                      className={cn(
                        'me-2 flex size-4 items-center justify-center rounded-sm border border-primary',
                        on ? 'bg-primary text-primary-foreground' : 'opacity-50',
                      )}
                    >
                      {on && <Check className="size-3" />}
                    </span>
                    {o.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {chosen.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      pendingRef.current = [];
                      setPending([]);
                      onChange([]);
                    }}
                    className="justify-center text-center"
                  >
                    {t('filters.clearCategory')}
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface OfficesFiltersProps {
  state: OfficesQueryState;
  update: (patch: Partial<OfficesQueryState>) => void;
  lang: 'fa' | 'en';
}

export function OfficesFilters({ state, update, lang }: OfficesFiltersProps) {
  const { t } = useTranslation('brokerages-trading-offices-v2');
  const [text, setText] = useState(state.q);

  // Keep the box in step with the URL (back button, reload).
  useEffect(() => setText(state.q), [state.q]);

  // Commit typing to the URL after a short pause, not on every key.
  useEffect(() => {
    if (text === state.q) return;
    const id = setTimeout(() => update({ q: text.trim() }), 300);
    return () => clearTimeout(id);
  }, [text, state.q, update]);

  const hasAny = !!(state.q || state.type.length || state.province.length || state.city.length);

  // City options follow the chosen provinces; with several provinces chosen, a
  // city's province is shown beside it so same-named cities stay apart.
  const cityOptions = citiesInProvinces(state.province).map((value) => ({
    value,
    label:
      state.province.length === 1
        ? CITIES[value][lang]
        : `${CITIES[value][lang]} (${PROVINCES[CITIES[value].provinceId][lang]})`,
  }));

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="relative w-full sm:w-80">
        <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="ps-9"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('filters.searchPlaceholder')}
          aria-label={t('filters.search')}
        />
      </div>

      <MultiFilter
        id="v2-filter-type"
        title={t('filters.type')}
        options={Object.entries(OFFICE_TYPES).map(([value, label]) => ({ value, label: label[lang] }))}
        selected={state.type}
        onChange={(type) => update({ type })}
      />
      <MultiFilter
        id="v2-filter-province"
        title={t('filters.province')}
        options={Object.entries(PROVINCES).map(([value, label]) => ({ value, label: label[lang] }))}
        selected={state.province}
        onChange={(province) => update({ province })}
      />
      <MultiFilter
        id="v2-filter-city"
        title={t('filters.city')}
        options={cityOptions}
        selected={state.city}
        onChange={(city) => update({ city })}
      />

      {hasAny && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setText('');
            update({ q: '', type: [], province: [], city: [] });
          }}
        >
          <X className="size-4" />
          {t('filters.clear')}
        </Button>
      )}

      {(state.province.length > 0 || state.city.length > 0) && (
        <span className="w-full text-xs text-muted-foreground">{t('filters.locationHint')}</span>
      )}
    </div>
  );
}
