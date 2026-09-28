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
import type { BrokerageProfileReport } from '@/services/report-api';

const fmtDate = (s: string | null | undefined) => (s ? s.split('T')[0] : '—');
const fmtNum = (n: number | null | undefined) =>
  n == null ? '—' : n.toLocaleString();

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

function Count({ value }: { value: number }) {
  return <div className="text-2xl font-bold tabular-nums">{value.toLocaleString()}</div>;
}

function Breakdown({ rows, empty }: { rows: { name: string; count: number }[]; empty: string }) {
  if (!rows.length) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return <KV rows={rows.map((r) => [r.name, r.count] as [string, ReactNode])} />;
}

// Remaining demographic sections — still no source (need education / employment
// aggregation) → amber sample. Age + gender are now real (rendered explicitly).
const DEMOGRAPHICS: { key: string; en: string }[] = [
  { key: 'bpTenure', en: 'Tenure at last brokerage' },
  { key: 'bpEducation', en: 'Education level' },
  { key: 'bpActivityCity', en: 'Activity city' },
  { key: 'bpCredentials', en: 'Professional credentials' },
  { key: 'bpActivityExchange', en: 'Activity exchange' },
  { key: 'bpFieldOfStudy', en: 'Field of study' },
];

// Location breakdowns still need per-row addresses → sky "awaiting".
const PENDING: { key: string; en: string }[] = [
  { key: 'bpStationLocations', en: 'Trading station locations' },
  { key: 'bpOfficeLocations', en: 'Office / branch / hall locations' },
];

export function BrokerageProfileContent() {
  const { t } = useTranslation('members-reports');
  const [companyId, setCompanyId] = useState('');

  const { data, isLoading, isError } = useQuery<BrokerageProfileReport>({
    queryKey: ['members-reports', 'brokerage-profile', companyId],
    queryFn: async () => {
      const res = await fetch(`/members/api/members-reports/brokerage-profile?companyId=${encodeURIComponent(companyId)}`);
      if (!res.ok) throw new Error('Failed to load profile');
      return res.json();
    },
    enabled: !!companyId,
    staleTime: 60 * 1000,
  });

  return (
    <div className="space-y-5 lg:space-y-7.5">
      <ReportHeader
        title={t('pageTitleBrokerageProfile', { defaultValue: 'Brokerage Profile' })}
        description={t('descBrokerageProfile', {
          defaultValue: 'Full profile of a single brokerage — general info, capital, personnel, demographics, trading stations and offices.',
        })}
      />

      <div className={GLASS_WRAPPER}>
        <Card>
          <CardContent className="py-5">
            <div className="flex flex-wrap items-end gap-4">
              <EntityPicker
                entityType="Brokerage"
                value={companyId}
                onChange={setCompanyId}
                label={t('brokerageLabel', { defaultValue: 'Brokerage' })}
                placeholder={t('selectBrokeragePlaceholder', { defaultValue: 'Select a brokerage' })}
              />
            </div>
          </CardContent>
        </Card>

        {!companyId && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              {t('selectBrokeragePrompt', { defaultValue: 'Select a brokerage to view its profile.' })}
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
            {/* R2 General — real */}
            <SectionCard title={t('bpGeneral', { defaultValue: 'General information' })}>
              <KV
                rows={[
                  [t('bpBrokerageCode', { defaultValue: 'Brokerage code' }), data.general?.brokerageCode ?? '—'],
                  [t('bpSeoRegNo', { defaultValue: 'SEO registration no.' }), data.general?.seoRegistrationNo ?? '—'],
                  [t('bpSeoRegDate', { defaultValue: 'SEO registration date' }), fmtDate(data.general?.seoRegistrationDate)],
                  [t('bpSeoLicenseNo', { defaultValue: 'SEO license no.' }), data.general?.seoLicenseNo ?? '—'],
                  [t('bpSeoLicenseDate', { defaultValue: 'SEO license date' }), fmtDate(data.general?.seoLicenseDate)],
                  [t('bpSeoLicenseExpiry', { defaultValue: 'SEO license expiry' }), fmtDate(data.general?.seoLicenseExpiryDate)],
                ]}
              />
            </SectionCard>

            {/* R3 Classification — mock */}
            <SectionCard title={t('bpClassification', { defaultValue: 'Classification' })} mock />

            {/* R4 Capital — real */}
            <SectionCard title={t('bpCapital', { defaultValue: 'Registered & paid capital' })}>
              <KV
                rows={[
                  [t('bpRegisteredCapital', { defaultValue: 'Registered capital (Rial)' }), fmtNum(data.capital?.registeredCapital)],
                  [t('bpNumberOfShares', { defaultValue: 'Number of shares' }), fmtNum(data.capital?.numberOfShares)],
                  [t('bpFiscalYear', { defaultValue: 'Fiscal year' }), data.capital ? data.capital.fiscalYear : '—'],
                ]}
              />
            </SectionCard>

            {/* R5 Registration location — real */}
            <SectionCard title={t('bpRegLocation', { defaultValue: 'Registration location' })}>
              <KV
                rows={[
                  [t('bpPostalCode', { defaultValue: 'Postal code' }), data.location?.postalCode ?? '—'],
                  [t('bpCityCode', { defaultValue: 'City code' }), data.location ? data.location.cityId : '—'],
                  [t('bpRegionCode', { defaultValue: 'Province code' }), data.location ? data.location.regionId : '—'],
                ]}
              />
            </SectionCard>

            {/* R6 Personnel — real */}
            <SectionCard title={t('bpPersonnel', { defaultValue: 'Personnel' })}>
              <Count value={data.personnelCount} />
            </SectionCard>

            {/* R7 Age — real */}
            <SectionCard title={t('bpAge', { defaultValue: 'Age distribution' })}>
              <Breakdown rows={data.ageDistribution} empty={t('noResults', { defaultValue: 'No records.' })} />
            </SectionCard>

            {/* R8 Gender — real */}
            <SectionCard title={t('bpGender', { defaultValue: 'Gender distribution' })}>
              <Breakdown rows={data.genderDistribution} empty={t('noResults', { defaultValue: 'No records.' })} />
            </SectionCard>

            {/* R9–R14 remaining demographics — mock */}
            {DEMOGRAPHICS.map((s) => (
              <SectionCard key={s.key} title={t(s.key, { defaultValue: s.en })} mock />
            ))}

            {/* R15 Trading stations — real */}
            <SectionCard title={t('bpTradingStations', { defaultValue: 'Trading stations' })}>
              <Count value={data.tradingStationCount} />
            </SectionCard>

            {/* R17 Trading stations by type — real */}
            <SectionCard title={t('bpStationsByExchange', { defaultValue: 'Trading stations by exchange type' })}>
              <Breakdown rows={data.stationsByType} empty={t('noResults', { defaultValue: 'No records.' })} />
            </SectionCard>

            {/* R18 Offices — real */}
            <SectionCard title={t('bpOffices', { defaultValue: 'Offices, branches & halls' })}>
              <Count value={data.officeCount} />
            </SectionCard>

            {/* R20 Office types — real */}
            <SectionCard title={t('bpOfficeTypes', { defaultValue: 'Office / branch / hall types' })}>
              <Breakdown rows={data.officesByType} empty={t('noResults', { defaultValue: 'No records.' })} />
            </SectionCard>

            {/* R21 Office activities — real */}
            <SectionCard title={t('bpOfficeActivities', { defaultValue: 'Office / branch / hall activities & services' })}>
              <Breakdown rows={data.officesByActivity} empty={t('noResults', { defaultValue: 'No records.' })} />
            </SectionCard>

            {/* R16/R19 location breakdowns — pending per-row addresses */}
            {PENDING.map((s) => (
              <SectionCard key={s.key} title={t(s.key, { defaultValue: s.en })} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
