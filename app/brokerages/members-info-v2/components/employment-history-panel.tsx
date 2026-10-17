'use client';

import { useTranslation } from '@/hooks/useTranslation';
import type { MockPersonnel } from '../mock/personnel.mock';
import { EmploymentStatusBadge } from './employment-status-badge';

// Read-only: the person's employment periods at the selected brokerage, so a
// reviewer can see why the status reads as it does (sample data).
export function EmploymentHistoryPanel({ person }: { person: MockPersonnel }) {
  const { t } = useTranslation('brokerages-members-info-v2');
  const periods = [...person.employmentHistory].sort((a, b) => a.from.localeCompare(b.from));

  return (
    <div className="px-6 py-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
        {t('history.title')}
        <EmploymentStatusBadge status={person.employmentStatus} />
      </div>
      {periods.length === 0 ? (
        <div className="text-sm text-muted-foreground">{t('history.none')}</div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground">
              <th className="py-1.5 text-start font-normal">{t('history.from')}</th>
              <th className="py-1.5 text-start font-normal">{t('history.to')}</th>
            </tr>
          </thead>
          <tbody>
            {periods.map((p, i) => (
              <tr key={i} className="border-t border-border">
                <td className="py-1.5"><span dir="ltr">{p.from}</span></td>
                <td className="py-1.5">
                  {p.to ? <span dir="ltr">{p.to}</span> : t('history.open')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
