'use client';

import { ShieldAlert, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
import type { MockPersonnel } from '../mock/personnel.mock';

interface DependentsPanelProps {
  person: MockPersonnel;
  lang: 'fa' | 'en';
  // false = the viewer has no permission for dependents' data (mock preview).
  canViewPersonalData: boolean;
}

// Read-only. Every relationship the person lists is shown, whatever its type,
// inactive ones included and marked; they are edited on the person's profile.
export function DependentsPanel({ person, lang, canViewPersonalData }: DependentsPanelProps) {
  const { t } = useTranslation('brokerages-members-info-v2');

  if (!canViewPersonalData) {
    return (
      <div className="flex items-center gap-2 px-6 py-4 text-sm text-muted-foreground">
        <ShieldAlert className="size-4" />
        {t('dependents.restricted')}
      </div>
    );
  }

  if (person.dependents.length === 0) {
    return (
      <div className="flex items-center gap-2 px-6 py-4 text-sm text-muted-foreground">
        <Users className="size-4" />
        {t('dependents.none')}
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      <div className="mb-2 text-sm font-medium text-foreground">
        {t('dependents.title', { count: person.dependents.length })}
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted-foreground">
            <th className="py-1.5 text-start font-normal">{t('dependents.columns.name')}</th>
            <th className="py-1.5 text-start font-normal">{t('dependents.columns.relationship')}</th>
            <th className="py-1.5 text-start font-normal">{t('dependents.columns.nationalId')}</th>
            <th className="py-1.5 text-start font-normal">{t('dependents.columns.dateOfBirth')}</th>
          </tr>
        </thead>
        <tbody>
          {person.dependents.map((d) => (
            <tr key={d.id} className={d.isActive ? 'border-t border-border' : 'border-t border-border text-muted-foreground'}>
              <td className="py-1.5">
                {d.name[lang]}
                {!d.isActive && (
                  <Badge variant="outline" size="xs" className="ms-2">
                    {t('dependents.inactive')}
                  </Badge>
                )}
              </td>
              <td className="py-1.5">{d.relationship[lang]}</td>
              <td className="py-1.5"><span className="font-mono" dir="ltr">{d.nationalId}</span></td>
              <td className="py-1.5"><span dir="ltr">{d.dateOfBirth}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
