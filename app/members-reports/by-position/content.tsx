'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
import { GLASS_WRAPPER, ReportHeader } from '../components/report-scaffold';
import type { PersonnelByPositionReport } from '@/services/report-api';

async function fetchReport(): Promise<PersonnelByPositionReport> {
  const res = await fetch('/members/api/members-reports/personnel-by-position');
  if (!res.ok) throw new Error('Failed to load report');
  return res.json();
}

export function ByPositionContent() {
  const { t } = useTranslation('members-reports');

  const { data, isLoading, isError } = useQuery<PersonnelByPositionReport>({
    queryKey: ['members-reports', 'personnel-by-position'],
    queryFn: fetchReport,
    staleTime: 60 * 1000,
  });

  const items = data?.items ?? [];

  return (
    <div className="space-y-5 lg:space-y-7.5">
      <ReportHeader
        title={t('pageTitleByPosition', { defaultValue: 'Personnel by Position' })}
        description={t('descByPosition', {
          defaultValue: 'Current brokerage personnel grouped by their work-experience position across the industry.',
        })}
      />

      <div className={GLASS_WRAPPER}>
        <Card>
          <CardContent className="py-5">
            {isLoading && (
              <div role="status" aria-live="polite" aria-busy="true" className="py-10 text-center text-sm text-muted-foreground">
                {t('loading', { defaultValue: 'Loading…' })}
              </div>
            )}
            {isError && (
              <div role="alert" aria-live="assertive" className="py-10 text-center text-sm text-rose-800 dark:text-rose-300">
                {t('errorLoading', { defaultValue: 'Failed to load the report.' })}
              </div>
            )}
            {data && !isLoading && !isError && (
              <>
                <div className="flex items-center justify-end mb-4">
                  <Badge variant="secondary" appearance="light">
                    {t('statMemberCount', { defaultValue: 'Members' })}: {data.totalCount.toLocaleString()}
                  </Badge>
                </div>
                {items.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    {t('noResults', { defaultValue: 'No records match the current filters.' })}
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {items.map((p) => (
                      <div
                        key={p.positionId}
                        className="rounded-md border border-sky-100 dark:border-sky-900 bg-white/50 dark:bg-sky-950/20 p-4"
                      >
                        <Label className="text-xs text-muted-foreground" title={p.name ?? undefined}>
                          {p.name ?? `#${p.positionId}`}
                        </Label>
                        <div className="text-base font-semibold tabular-nums">{p.count.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
