'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTranslation } from '@/hooks/useTranslation';
import type { MemberEntityReport, MemberEntityReportRow } from '@/services/report-api';

const GLASS_WRAPPER =
  'space-y-5 lg:space-y-7.5 ' +
  '[&_div.rounded-xl.bg-card]:bg-sky-50/25! ' +
  '[&_div.rounded-xl.bg-card]:border-sky-100! ' +
  'dark:[&_div.rounded-xl.bg-card]:bg-sky-950/25! ' +
  'dark:[&_div.rounded-xl.bg-card]:border-sky-900! ' +
  '[&_div.rounded-xl.bg-card]:shadow-lg ' +
  '[&_div.rounded-xl.bg-card]:shadow-black/5';

type TypeFilter = 'ALL' | 'Brokerage' | 'Fund';

async function fetchReport(): Promise<MemberEntityReport> {
  const res = await fetch('/members/api/members-reports/entities');
  if (!res.ok) throw new Error('Failed to load report');
  return res.json();
}

export function BrokeragesReportContent() {
  const { t } = useTranslation('members-reports');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL');
  const [search, setSearch] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading, isError } = useQuery<MemberEntityReport>({
    queryKey: ['members-reports', 'member-entities'],
    queryFn: fetchReport,
    staleTime: 60 * 1000,
  });

  const rows = useMemo<MemberEntityReportRow[]>(() => {
    const items = data?.items ?? [];
    const needle = search.trim().toLowerCase();
    return items.filter((r) => {
      if (typeFilter !== 'ALL' && r.entityType !== typeFilter) return false;
      if (needle) {
        const hay = `${r.name} ${r.nationalId ?? ''} ${r.lastPersonName ?? ''} ${r.lastPersonNationalId ?? ''}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [data, typeFilter, search]);

  const entityTypeLabel = (type: string) =>
    type === 'Fund'
      ? t('entityTypeFund', { defaultValue: 'Fund' })
      : t('entityTypeBrokerage', { defaultValue: 'Brokerage' });

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const res = await fetch('/members/api/members-reports/entities/export');
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'member-entities.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Excel export failed:', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-5 lg:space-y-7.5">
      <Card className="bg-sky-50/25! border-sky-100! dark:bg-sky-950/25! dark:border-sky-900! shadow-lg shadow-black/5">
        <CardContent className="py-5">
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle
                text={t('pageTitleEntities', { defaultValue: 'Brokerages & Funds' })}
              />
              <ToolbarDescription>{t('descEntities')}</ToolbarDescription>
            </ToolbarHeading>
          </Toolbar>
        </CardContent>
      </Card>

      <div className={GLASS_WRAPPER}>
        <Card>
          <CardContent className="py-5">
            {/* Filter bar */}
            <div className="flex flex-wrap items-end gap-4 mb-5">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  {t('colEntityType', { defaultValue: 'Type' })}
                </Label>
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{t('filterAllTypes', { defaultValue: 'All types' })}</SelectItem>
                    <SelectItem value="Brokerage">{entityTypeLabel('Brokerage')}</SelectItem>
                    <SelectItem value="Fund">{entityTypeLabel('Fund')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 flex-1 min-w-[200px] max-w-sm">
                <Label className="text-xs text-muted-foreground">
                  {t('filterSearch', { defaultValue: 'Search' })}
                </Label>
                <Input value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={isExporting || !data}
              >
                {isExporting
                  ? t('exporting', { defaultValue: 'Exporting…' })
                  : t('exportExcel', { defaultValue: 'Export to Excel' })}
              </Button>
              {data && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground ms-auto">
                  <Badge variant="secondary" appearance="light">
                    {t('statBrokerages', { defaultValue: 'Brokerages' })}: {data.brokerageCount}
                  </Badge>
                  <Badge variant="secondary" appearance="light">
                    {t('statFunds', { defaultValue: 'Funds' })}: {data.fundCount}
                  </Badge>
                  <span>{t('resultCount', { defaultValue: '{{count}} record(s)', count: rows.length })}</span>
                </div>
              )}
            </div>

            {isLoading && (
              <div
                role="status"
                aria-live="polite"
                aria-busy="true"
                className="py-10 text-center text-sm text-muted-foreground"
              >
                {t('loading', { defaultValue: 'Loading…' })}
              </div>
            )}

            {isError && (
              <div
                role="alert"
                aria-live="assertive"
                className="py-10 text-center text-sm text-rose-800 dark:text-rose-300"
              >
                {t('errorLoading', { defaultValue: 'Failed to load the report.' })}
              </div>
            )}

            {data && !isLoading && !isError && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead className="whitespace-nowrap">{t('colEntityType', { defaultValue: 'Type' })}</TableHead>
                    <TableHead>{t('colCompanyName', { defaultValue: 'Company Name' })}</TableHead>
                    <TableHead className="whitespace-nowrap">{t('colCompanyNationalId', { defaultValue: 'Company National ID' })}</TableHead>
                    <TableHead>{t('colLastPerson', { defaultValue: 'Representative' })}</TableHead>
                    <TableHead className="whitespace-nowrap">{t('colLastPersonNationalId', { defaultValue: 'Representative National ID' })}</TableHead>
                    <TableHead className="text-end whitespace-nowrap">{t('colPersonCount', { defaultValue: 'Representatives Count' })}</TableHead>
                    <TableHead className="text-end whitespace-nowrap">{t('colTotalPersonsCreated', { defaultValue: 'Persons Count' })}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r, idx) => (
                    <TableRow
                      key={`${r.entityType}-${r.companyId}`}
                      className={
                        r.totalPersonsCreated === 0
                          ? 'bg-rose-50/25! border-rose-100! dark:bg-rose-950/25! dark:border-rose-900!'
                          : undefined
                      }
                    >
                      <TableCell className="text-xs text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell>
                        <Badge
                          variant={r.entityType === 'Fund' ? 'secondary' : 'primary'}
                          appearance="light"
                          className="text-xs"
                        >
                          {entityTypeLabel(r.entityType)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell className="font-mono text-xs whitespace-nowrap">{r.nationalId ?? '—'}</TableCell>
                      <TableCell className="whitespace-nowrap">{r.lastPersonName ?? '—'}</TableCell>
                      <TableCell className="font-mono text-xs whitespace-nowrap">{r.lastPersonNationalId ?? '—'}</TableCell>
                      <TableCell className="text-end tabular-nums">{r.personCount}</TableCell>
                      <TableCell className="text-end tabular-nums">{r.totalPersonsCreated}</TableCell>
                    </TableRow>
                  ))}
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        {t('noResults', { defaultValue: 'No records match the current filters.' })}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
