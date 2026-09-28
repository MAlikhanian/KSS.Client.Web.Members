'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';

const LANG_CODE_TO_ID: Record<string, number> = { fa: 12, en: 10 };

interface HolderReadOnlyCardProps {
  /** 1 = Company, 2 = Person — Stakeholder.RelatedPartyType convention. */
  holderType: 1 | 2;
  holderId: string;
}

interface PersonDetail {
  nationalId: string | null;
  translations: Array<{ languageId: number; firstName: string; lastName: string }>;
}

interface CompanyDetail {
  companyPersianName: string;
  companyLatinName: string | null;
  nationalId: string;
}

export function HolderReadOnlyCard({ holderType, holderId }: HolderReadOnlyCardProps) {
  const { t, i18n } = useTranslation('brokerages-members-info');
  const langId = LANG_CODE_TO_ID[i18n.language] ?? 12;

  const [loading, setLoading] = useState(true);
  const [person, setPerson] = useState<PersonDetail | null>(null);
  const [company, setCompany] = useState<CompanyDetail | null>(null);

  useEffect(() => {
    if (!holderId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);

    const url = holderType === 2 ? `/api/person/${holderId}` : `/api/company/${holderId}`;

    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (holderType === 2) setPerson(data);
        else setCompany(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [holderType, holderId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-3 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </CardContent>
      </Card>
    );
  }

  if (holderType === 2 && person) {
    const tr =
      person.translations?.find((x) => x.languageId === langId) ??
      person.translations?.[0];
    const name = tr ? `${tr.firstName} ${tr.lastName}`.trim() : '-';
    return (
      <Card>
        <CardContent className="py-3 flex items-center gap-3 text-sm">
          <Badge variant="secondary">
            {t('form.holder.individual', { defaultValue: 'Individual' })}
          </Badge>
          <span className="font-medium">{name}</span>
          {person.nationalId && (
            <span className="text-xs text-muted-foreground font-mono">{person.nationalId}</span>
          )}
        </CardContent>
      </Card>
    );
  }

  if (holderType === 1 && company) {
    const name =
      i18n.language === 'fa'
        ? company.companyPersianName
        : company.companyLatinName ?? company.companyPersianName;
    return (
      <Card>
        <CardContent className="py-3 flex items-center gap-3 text-sm">
          <Badge variant="secondary">
            {t('form.holder.legalEntity', { defaultValue: 'Legal Entity' })}
          </Badge>
          <span className="font-medium">{name}</span>
          {company.nationalId && (
            <span className="text-xs text-muted-foreground font-mono">{company.nationalId}</span>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="py-3 text-sm text-muted-foreground">
        {t('form.holder.notFound', { defaultValue: 'Holder not found' })}
      </CardContent>
    </Card>
  );
}
