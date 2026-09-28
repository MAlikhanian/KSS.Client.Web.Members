'use client';

import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import type { MemberEntityReport } from '@/services/report-api';

// Sky hue — shared across the members-reports section so all reports look alike.
export const GLASS_WRAPPER =
  'space-y-5 lg:space-y-7.5 ' +
  '[&_div.rounded-xl.bg-card]:bg-sky-50/25! ' +
  '[&_div.rounded-xl.bg-card]:border-sky-100! ' +
  'dark:[&_div.rounded-xl.bg-card]:bg-sky-950/25! ' +
  'dark:[&_div.rounded-xl.bg-card]:border-sky-900! ' +
  '[&_div.rounded-xl.bg-card]:shadow-lg ' +
  '[&_div.rounded-xl.bg-card]:shadow-black/5';

/** The sky-tinted title card + toolbar shared by every report page. */
export function ReportHeader({ title, description }: { title: string; description: string }) {
  return (
    <Card className="bg-sky-50/25! border-sky-100! dark:bg-sky-950/25! dark:border-sky-900! shadow-lg shadow-black/5">
      <CardContent className="py-5">
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle text={title} />
            <ToolbarDescription>{description}</ToolbarDescription>
          </ToolbarHeading>
        </Toolbar>
      </CardContent>
    </Card>
  );
}

/**
 * Placeholder shown inside a report section whose backend aggregation endpoint
 * is not yet wired. Keeps the report's topic list visible while making clear
 * the numbers are pending.
 */
export function AwaitingData() {
  const { t } = useTranslation('members-reports');
  return (
    <div className="py-6 text-center text-sm text-muted-foreground" role="note">
      {t('awaitingData', {
        defaultValue: 'Report data will appear here once the backend report endpoint is connected.',
      })}
    </div>
  );
}

// Amber treatment for sections/cards whose numbers are mock (no real data
// source yet) — color alone flags "not real", per the report design.
export const MOCK_TINT =
  'bg-amber-50/60! border-amber-300! dark:bg-amber-950/30! dark:border-amber-800!';

/**
 * A titled report section card. `mock` tints it amber to signal the data isn't
 * real. Renders children, or the AwaitingData note.
 */
export function SectionCard({
  title,
  mock,
  children,
}: {
  title: string;
  mock?: boolean;
  children?: ReactNode;
}) {
  const { t } = useTranslation('members-reports');
  return (
    <Card className={mock ? MOCK_TINT : undefined}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <span>{title}</span>
          {mock && (
            <Badge
              variant="warning"
              appearance="light"
              className="text-[10px] text-amber-700 dark:text-amber-300"
            >
              {t('sampleData', { defaultValue: 'Sample' })}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>{children ?? <AwaitingData />}</CardContent>
    </Card>
  );
}

async function fetchEntities(): Promise<MemberEntityReport> {
  const res = await fetch('/members/api/members-reports/entities');
  if (!res.ok) throw new Error('Failed to load companies');
  return res.json();
}

/**
 * Searchable company picker fed by the member-entities report (real data).
 * `entityType` narrows to brokerages or funds; omit for all member companies.
 */
export function EntityPicker({
  entityType,
  value,
  onChange,
  label,
  placeholder,
}: {
  entityType?: 'Brokerage' | 'Fund';
  value: string;
  onChange: (companyId: string) => void;
  label: string;
  placeholder: string;
}) {
  const { t } = useTranslation('members-reports');
  const [open, setOpen] = useState(false);

  const { data } = useQuery<MemberEntityReport>({
    queryKey: ['members-reports', 'member-entities'],
    queryFn: fetchEntities,
    staleTime: 60 * 1000,
  });

  const companies = (data?.items ?? []).filter(
    (c) => !entityType || c.entityType === entityType,
  );
  const selected = companies.find((c) => c.companyId === value);

  return (
    <div className="space-y-1 flex-1 min-w-[260px] max-w-md">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {selected
              ? `${selected.name}${selected.nationalId ? ` (${selected.nationalId})` : ''}`
              : placeholder}
            <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder={t('searchCompanyPlaceholder', { defaultValue: 'Search name or national ID…' })}
            />
            <CommandList>
              <CommandEmpty>{t('noCompaniesFound', { defaultValue: 'No companies found.' })}</CommandEmpty>
              <CommandGroup>
                {companies.map((c) => (
                  <CommandItem
                    key={`${c.entityType}-${c.companyId}`}
                    value={`${c.name} ${c.nationalId ?? ''}`}
                    onSelect={() => {
                      onChange(c.companyId);
                      setOpen(false);
                    }}
                  >
                    <Check className={cn('me-2 h-4 w-4', value === c.companyId ? 'opacity-100' : 'opacity-0')} />
                    <span className="flex-1">{c.name}</span>
                    {c.nationalId && (
                      <span className="text-xs text-muted-foreground font-mono">{c.nationalId}</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
