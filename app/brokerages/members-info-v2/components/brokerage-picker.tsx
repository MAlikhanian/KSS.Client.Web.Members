'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useBrokerages } from '@/hooks/use-brokerages';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

// Same look and texts as the brokerage selection card on the other brokerage
// pages, but driven by the brokerage list ONLY (GET /api/brokerages/select).
// The shared company select loads the company and fund lists as well, which
// this page has no use for.
export function BrokeragePicker({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (id: string) => void;
}) {
  const { t } = useTranslation('brokerages-common');
  const { t: tc } = useTranslation('company-information');
  const { brokerages, loading, error } = useBrokerages();
  const [open, setOpen] = useState(false);
  const selected = brokerages.find((b) => b.id === value);
  const label = t('selectBrokerage.label', { defaultValue: 'Brokerage' });

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>{t('selectBrokerage.title', { defaultValue: 'Select Brokerage' })}</CardTitle>
        <CardDescription className="mx-auto max-w-2xl">
          {t('selectBrokerage.description', {
            defaultValue: 'To edit information, select a brokerage from the list.',
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="v2-brokerage-picker">{label}</Label>
          <div className="flex gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="v2-brokerage-picker"
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  disabled={loading || !!error}
                >
                  {loading
                    ? tc('common.loading', { defaultValue: 'Loading...' })
                    : error
                      ? tc('common.error', { defaultValue: 'Error loading' })
                      : selected
                        ? selected.name
                        : t('selectBrokerage.placeholder', { defaultValue: 'Select brokerage to edit...' })}
                  <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder={tc('search.placeholder', { defaultValue: 'Search companies...' })} />
                  <CommandList>
                    <CommandEmpty>{tc('search.noResults', { defaultValue: 'No companies found.' })}</CommandEmpty>
                    <CommandGroup>
                      {brokerages.map((b) => (
                        <CommandItem
                          key={b.id}
                          value={`${b.name} ${b.code || ''}`}
                          onSelect={() => {
                            onValueChange(b.id);
                            setOpen(false);
                          }}
                        >
                          <Check className={cn('me-2 h-4 w-4', value === b.id ? 'opacity-100' : 'opacity-0')} />
                          <span className="flex-1">{b.name}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {selected && (
              <Button
                type="button"
                variant="ghost"
                mode="icon"
                onClick={() => onValueChange('')}
                aria-label={tc('common.clear', { defaultValue: 'Clear' })}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
