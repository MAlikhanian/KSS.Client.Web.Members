'use client';

import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import {
  GLASS_WRAPPER,
  ReportHeader,
  SectionCard,
  EntityPicker,
} from '../components/report-scaffold';
import type { FundReport } from '@/services/report-api';

const fmtDate = (s: string | null | undefined) => (s ? s.split('T')[0] : '—');
const fmtNum = (n: number | null | undefined) => (n == null ? '—' : n.toLocaleString());

function KV({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="space-y-1.5 text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4">
          <dt className="text-muted-foreground">{k}</dt>
          <dd className="font-medium text-end">{v ?? '—'}</dd>
        </div>
      ))}
    </dl>
  );
}

export function FundReportsContent() {
  const { t } = useTranslation('members-reports');
  const [companyId, setCompanyId] = useState('');

  const { data, isLoading, isError } = useQuery<FundReport>({
    queryKey: ['members-reports', 'fund-report', companyId],
    queryFn: async () => {
      const res = await fetch(`/members/api/members-reports/fund-report?companyId=${encodeURIComponent(companyId)}`);
      if (!res.ok) throw new Error('Failed to load fund report');
      return res.json();
    },
    enabled: !!companyId,
    staleTime: 60 * 1000,
  });

  const organs = data?.organRoles ?? [];
  const organBreakdown: ReactNode = organs.length ? (
    <KV rows={organs.map((o) => [o.roleName ?? `#${o.fundRoleId}`, o.count] as [string, ReactNode])} />
  ) : (
    <p className="text-sm text-muted-foreground">{t('noResults', { defaultValue: 'No records.' })}</p>
  );

  return (
    <div className="space-y-5 lg:space-y-7.5">
      <ReportHeader
        title={t('pageTitleFundReports', { defaultValue: 'Market-Making Funds' })}
        description={t('descFundReports', {
          defaultValue: 'Dedicated market-making fund reports — specs, organs, trustee, market-making symbols and NAV.',
        })}
      />

      <div className={GLASS_WRAPPER}>
        <Card>
          <CardContent className="py-5">
            <div className="flex flex-wrap items-end gap-4">
              <EntityPicker
                entityType="Fund"
                value={companyId}
                onChange={setCompanyId}
                label={t('fundLabel', { defaultValue: 'Fund' })}
                placeholder={t('selectFundPlaceholder', { defaultValue: 'Select a fund' })}
              />
            </div>
          </CardContent>
        </Card>

        {!companyId && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              {t('selectFundPrompt', { defaultValue: 'Select a fund to view its reports.' })}
            </CardContent>
          </Card>
        )}

        {companyId && isLoading && (
          <Card>
            <CardContent role="status" aria-busy="true" className="py-10 text-center text-sm text-muted-foreground">
              {t('loading', { defaultValue: 'Loading…' })}
            </CardContent>
          </Card>
        )}

        {companyId && isError && (
          <Card>
            <CardContent role="alert" className="py-10 text-center text-sm text-rose-800 dark:text-rose-300">
              {t('errorLoading', { defaultValue: 'Failed to load the report.' })}
            </CardContent>
          </Card>
        )}

        {companyId && data && !isLoading && !isError && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-7.5">
            {/* R2 Specs — real */}
            <SectionCard title={t('frSpecs', { defaultValue: 'Fund specifications' })}>
              <KV
                rows={[
                  [t('frRegNo', { defaultValue: 'SEO registration no.' }), data.specs?.registrationNumberSeo ?? '—'],
                  [t('frRegDate', { defaultValue: 'SEO registration date' }), fmtDate(data.specs?.registrationDateSeo)],
                  [t('frEndOfActivity', { defaultValue: 'End of activity period' }), fmtDate(data.specs?.endOfActivityPeriodSeo)],
                  [t('frFiscalYear', { defaultValue: 'Fiscal year' }), data.specs?.fiscalYear ?? '—'],
                  [t('frPreferredUnits', { defaultValue: 'Preferred units' }), fmtNum(data.specs?.preferredUnitsCount)],
                  [t('frOrdinaryUnitsInvestors', { defaultValue: 'Ordinary units (investors)' }), fmtNum(data.specs?.ordinaryUnitsInvestors)],
                  [t('frOrdinaryUnitsSeo', { defaultValue: 'Ordinary units (SEO)' }), fmtNum(data.specs?.ordinaryUnitsSeo)],
                ]}
              />
            </SectionCard>

            {/* R3 Station license — real (station count) */}
            <SectionCard title={t('frStationLicense', { defaultValue: 'Trading-station license' })}>
              <div className="text-2xl font-bold tabular-nums">{data.tradingStationCount.toLocaleString()}</div>
            </SectionCard>

            {/* R4 Count/management/ownership/organs — real (organ breakdown) */}
            <SectionCard title={t('frCountMgmtOwnershipOrgans', { defaultValue: 'Count, management & organs' })}>
              <KV rows={[[t('frTotalOrgans', { defaultValue: 'Total organs' }), data.totalOrganCount]]} />
            </SectionCard>

            {/* R5 Management composition — real */}
            <SectionCard title={t('frMgmtComposition', { defaultValue: 'Count & management composition' })}>
              {organBreakdown}
            </SectionCard>

            {/* R6 Trustee type — real (role breakdown incl. trustee) */}
            <SectionCard title={t('frTrusteeType', { defaultValue: 'Trustee type by legal entity' })}>
              {organBreakdown}
            </SectionCard>

            {/* R7 Organs list — real */}
            <SectionCard title={t('frOrgans', { defaultValue: 'Organs list' })}>
              {organBreakdown}
            </SectionCard>

            {/* R8–R10 — no source → amber sample */}
            <SectionCard title={t('frSymbolsByExchange', { defaultValue: 'Market-making symbols by exchange' })} mock />
            <SectionCard title={t('frSymbolCount', { defaultValue: 'Market-making symbol count' })} mock />
            <SectionCard title={t('frNav', { defaultValue: 'Net asset value (NAV)' })} mock />
          </div>
        )}
      </div>
    </div>
  );
}
