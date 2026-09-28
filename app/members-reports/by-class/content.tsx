'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTranslation } from '@/hooks/useTranslation';
import { GLASS_WRAPPER, ReportHeader, MOCK_TINT } from '../components/report-scaffold';

// Brokerage comparison-by-class metrics (spec sheet 1, col A, R23–R34).
// `mock` numbers are sample placeholders — this report has NO real source until
// a brokerage classification field exists, so the whole table is flagged amber.
const METRICS: { key: string; en: string; mock: [string, string, string, string] }[] = [
  { key: 'bcRegCapital', en: 'Registered capital', mock: ['—', '—', '—', '—'] },
  { key: 'bcOffices', en: 'Offices, branches & halls', mock: ['—', '—', '—', '—'] },
  { key: 'bcStations', en: 'Trading stations', mock: ['—', '—', '—', '—'] },
  { key: 'bcStationsByCity', en: 'Trading stations by city', mock: ['—', '—', '—', '—'] },
  { key: 'bcEducation', en: 'Education level', mock: ['—', '—', '—', '—'] },
  { key: 'bcCredentials', en: 'Professional credentials', mock: ['—', '—', '—', '—'] },
  { key: 'bcHeadcount', en: 'Personnel headcount', mock: ['—', '—', '—', '—'] },
  { key: 'bcAge', en: 'Personnel age', mock: ['—', '—', '—', '—'] },
  { key: 'bcTenure', en: 'Personnel tenure at last brokerage', mock: ['—', '—', '—', '—'] },
  { key: 'bcShareholdersByType', en: 'Shareholder composition by type', mock: ['—', '—', '—', '—'] },
  { key: 'bcShareholdersByClass', en: 'Shareholder composition by class', mock: ['—', '—', '—', '—'] },
  { key: 'bcShareholdersByClassType', en: 'Shareholders by class & type', mock: ['—', '—', '—', '—'] },
];

const CLASSES = ['A', 'B', 'C', 'D'] as const;

export function ByClassContent() {
  const { t } = useTranslation('members-reports');

  return (
    <div className="space-y-5 lg:space-y-7.5">
      <ReportHeader
        title={t('pageTitleByClass', { defaultValue: 'Comparison by Class' })}
        description={t('descByClass', {
          defaultValue: 'Brokerages compared across classes A–D — capital, offices, trading stations, demographics and shareholder composition.',
        })}
      />

      <div className={GLASS_WRAPPER}>
        <Card className={MOCK_TINT}>
          <CardContent className="py-5">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="warning" appearance="light" className="text-amber-700 dark:text-amber-300">
                {t('sampleData', { defaultValue: 'Sample' })}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {t('byClassMockNote', {
                  defaultValue: 'Not real — needs a brokerage classification field before this report has data.',
                })}
              </span>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[220px]">{t('colMetric', { defaultValue: 'Metric' })}</TableHead>
                  {CLASSES.map((c) => (
                    <TableHead key={c} className="text-center whitespace-nowrap">
                      {t(`class${c}`, { defaultValue: `Class ${c}` })}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {METRICS.map((m) => (
                  <TableRow key={m.key}>
                    <TableCell className="font-medium">{t(m.key, { defaultValue: m.en })}</TableCell>
                    {m.mock.map((v, i) => (
                      <TableCell key={i} className="text-center text-muted-foreground">{v}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
