'use client';

import { useEffect, useState } from 'react';
import { Briefcase, Building2, Coins, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';
import { reportsApi } from '@/lib/members-reports/api-client';
import type { DashboardStats, MemberPosition } from '@/lib/members-reports/types';
import { ALL_BROKERAGE_CLASSES, ALL_MEMBER_POSITIONS } from '@/lib/members-reports/types';
import { formatDateTime, formatNumber, formatRial } from '@/lib/members-reports/format';

// Glass tint scoped to descendant Cards — sky-blue hue per the locked theme.
const GLASS_WRAPPER =
  'space-y-5 lg:space-y-7.5 ' +
  '[&_div.rounded-xl.bg-card]:bg-sky-50/25! ' +
  '[&_div.rounded-xl.bg-card]:border-sky-100! ' +
  'dark:[&_div.rounded-xl.bg-card]:bg-sky-950/25! ' +
  'dark:[&_div.rounded-xl.bg-card]:border-sky-900! ' +
  '[&_div.rounded-xl.bg-card]:shadow-lg ' +
  '[&_div.rounded-xl.bg-card]:shadow-black/5';

export function OverviewContent() {
  const { t } = useTranslation('members-reports');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    let cancelled = false;

    (async () => {
      try {
        const data = await reportsApi.dashboard({ signal: ctrl.signal });
        if (!cancelled) {
          setStats(data);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e));
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, []);

  return (
    <div className="space-y-5 lg:space-y-7.5">
      {/* Header — sky-blue tinted card */}
      <Card className="bg-sky-50/25! border-sky-100! dark:bg-sky-950/25! dark:border-sky-900! shadow-lg shadow-black/5">
        <CardContent className="py-5">
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle
                text={t('pageTitleOverview', { defaultValue: 'Members Reports — Overview' })}
              />
              <ToolbarDescription>{t('descOverview')}</ToolbarDescription>
            </ToolbarHeading>
          </Toolbar>
        </CardContent>
      </Card>

      <div className={GLASS_WRAPPER}>
        {loading && <LoadingCard label={t('loading', { defaultValue: 'Loading…' })} />}
        {error && (
          <ErrorCard label={t('errorLoading', { defaultValue: 'Failed to load the report.' })} />
        )}
        {stats && (
          <>
            <PrimaryStatsCard stats={stats} />
            <ByClassCard stats={stats} />
            <ByPositionCard stats={stats} />
            <SnapshotFooter asOf={stats.asOf} />
          </>
        )}
      </div>
    </div>
  );
}

function LoadingCard({ label }: { label: string }) {
  return (
    <Card>
      <CardContent
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="py-10 text-center text-sm text-muted-foreground"
      >
        {label}
      </CardContent>
    </Card>
  );
}

function ErrorCard({ label }: { label: string }) {
  return (
    <Card>
      <CardContent
        role="alert"
        aria-live="assertive"
        className="py-10 text-center text-sm text-rose-800 dark:text-rose-300"
      >
        {label}
      </CardContent>
    </Card>
  );
}

function PrimaryStatsCard({ stats }: { stats: DashboardStats }) {
  const { t } = useTranslation('members-reports');
  return (
    <Card>
      <CardContent className="py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatTile
            icon={<Building2 className="size-5 text-sky-600 dark:text-sky-400" />}
            label={t('statBrokerageCount', { defaultValue: 'Brokerages' })}
            value={formatNumber(stats.brokerageCount)}
          />
          <StatTile
            icon={<Users className="size-5 text-sky-600 dark:text-sky-400" />}
            label={t('statMemberCount', { defaultValue: 'Members' })}
            value={formatNumber(stats.memberCount)}
          />
          <StatTile
            icon={<Coins className="size-5 text-sky-600 dark:text-sky-400" />}
            label={t('statTotalRegisteredCapital', { defaultValue: 'Total Registered Capital' })}
            value={formatRial(stats.totalRegisteredCapitalRial)}
            secondary={
              <span>
                {t('statTotalPaidCapital', { defaultValue: 'Paid' })}:{' '}
                {formatRial(stats.totalPaidCapitalRial)}
              </span>
            }
          />
          <StatTile
            icon={<Briefcase className="size-5 text-sky-600 dark:text-sky-400" />}
            label={t('statTotalBranches', { defaultValue: 'Branches' })}
            value={formatNumber(stats.totalBranchCount)}
            secondary={
              <span>
                {t('statListedOnExchange', { defaultValue: 'Listed' })}:{' '}
                {formatNumber(stats.listedOnExchangeCount)}
              </span>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface StatTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  secondary?: React.ReactNode;
}

function StatTile({ icon, label, value, secondary }: StatTileProps) {
  return (
    <div className="rounded-md border border-sky-100 dark:border-sky-900 bg-white/50 dark:bg-sky-950/20 p-4 flex items-start gap-3">
      <div aria-hidden="true" className="rounded-md bg-sky-50 dark:bg-sky-900/40 p-2 shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <div className="text-base font-semibold truncate" title={value}>
          {value}
        </div>
        {secondary && (
          <div className="text-[11px] text-muted-foreground mt-0.5">{secondary}</div>
        )}
      </div>
    </div>
  );
}

function ByClassCard({ stats }: { stats: DashboardStats }) {
  const { t } = useTranslation('members-reports');
  const total = stats.brokerageCount || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('statByClass', { defaultValue: 'By Class' })}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ALL_BROKERAGE_CLASSES.map((cls) => {
            const count = stats.brokerageByClass[cls];
            const pct = Math.round((count / total) * 100);
            return (
              <DistributionTile
                key={cls}
                label={t(`class${cls}`, { defaultValue: `Class ${cls}` })}
                count={count}
                percent={pct}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function ByPositionCard({ stats }: { stats: DashboardStats }) {
  const { t } = useTranslation('members-reports');
  const total = stats.memberCount || 1;
  // Hide buckets with zero count so the seeded "Other = 0" doesn't take a tile slot.
  const positions: MemberPosition[] = ALL_MEMBER_POSITIONS.filter(
    (p) => stats.memberByPosition[p] > 0,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('statByPosition', { defaultValue: 'By Position' })}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {positions.map((pos) => {
            const count = stats.memberByPosition[pos];
            const pct = Math.round((count / total) * 100);
            return (
              <DistributionTile
                key={pos}
                label={t(`position${pos}`, { defaultValue: pos })}
                count={count}
                percent={pct}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

interface DistributionTileProps {
  label: string;
  count: number;
  percent: number;
}

function DistributionTile({ label, count, percent }: DistributionTileProps) {
  return (
    <div className="rounded-md border border-sky-100 dark:border-sky-900 bg-white/50 dark:bg-sky-950/20 p-3 space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium truncate" title={label}>
          {label}
        </span>
        <span className="text-sm font-bold tabular-nums">{formatNumber(count)}</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 rounded-full bg-sky-100 dark:bg-sky-900/40 overflow-hidden"
      >
        <div
          className="h-full bg-sky-500 dark:bg-sky-400 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="text-[10px] text-muted-foreground tabular-nums">{percent}%</div>
    </div>
  );
}

function SnapshotFooter({ asOf }: { asOf: string }) {
  const { t } = useTranslation('members-reports');
  return (
    <Card>
      <CardContent className="py-3 text-xs text-center text-muted-foreground">
        {t('statAsOf', { defaultValue: 'As of' })}:{' '}
        <time dateTime={asOf}>{formatDateTime(asOf)}</time>
      </CardContent>
    </Card>
  );
}
