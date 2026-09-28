'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/useTranslation';

const LANG_CODE_TO_ID: Record<string, number> = { fa: 12, en: 10 };

interface PersonDetail {
  id: string;
  nationalId: string | null;
  sexId: number;
  dateOfBirth: string | null;
  translations: Array<{
    languageId: number;
    firstName: string;
    lastName: string;
    fatherName?: string | null;
  }>;
  emails?: Array<{ address: string }>;
  phones?: Array<{ number: string }>;
  addresses?: Array<{
    line1?: string | null;
    line2?: string | null;
    postalCode?: string | null;
  }>;
}

interface SexTranslation {
  sexId: number;
  languageId: number;
  name: string;
}

interface PersonReadOnlyCardProps {
  personId: string;
  /** Sex lookup translations (from /api/person/reference) to resolve sexId → label. */
  sexTranslations?: SexTranslation[];
}

/**
 * Read-only display of a Person's profile, fetched once from
 * /api/person/{personId}. Used inside the brokerages "Related Parties" form
 * so the user can see who they picked without re-entering identity fields.
 */
export function PersonReadOnlyCard({ personId, sexTranslations = [] }: PersonReadOnlyCardProps) {
  const { t, i18n } = useTranslation('brokerages-members-info');
  const langId = LANG_CODE_TO_ID[i18n.language] ?? 12;

  const [person, setPerson] = useState<PersonDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!personId) {
      setPerson(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/person/${personId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled) setPerson(data);
      })
      .catch(() => {
        if (!cancelled) setPerson(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [personId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-4 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </CardContent>
      </Card>
    );
  }

  if (!person) {
    return (
      <Card>
        <CardContent className="py-4 text-sm text-muted-foreground">
          {t('form.personReadOnly.notFound', { defaultValue: 'Person not found' })}
        </CardContent>
      </Card>
    );
  }

  const tr =
    person.translations?.find((x) => x.languageId === langId) ??
    person.translations?.[0];
  const fullName = tr ? `${tr.firstName} ${tr.lastName}`.trim() : '-';
  const fatherName = tr?.fatherName ?? '-';
  const dob = person.dateOfBirth
    ? new Date(person.dateOfBirth).toLocaleDateString(
        i18n.language === 'fa' ? 'fa-IR' : 'en-US',
      )
    : '-';
  const email = person.emails?.[0]?.address ?? '-';
  const phone = person.phones?.[0]?.number ?? '-';
  const address = person.addresses?.[0]
    ? [person.addresses[0].line1, person.addresses[0].line2].filter(Boolean).join(', ')
    : '-';
  const postalCode = person.addresses?.[0]?.postalCode ?? '-';

  const gender =
    person.sexId != null
      ? sexTranslations.find((s) => s.sexId === person.sexId && s.languageId === langId)?.name ??
        sexTranslations.find((s) => s.sexId === person.sexId)?.name ??
        '-'
      : '-';

  const age = (() => {
    if (!person.dateOfBirth) return '-';
    const dobDate = new Date(person.dateOfBirth);
    if (Number.isNaN(dobDate.getTime())) return '-';
    const now = new Date();
    let years = now.getFullYear() - dobDate.getFullYear();
    const monthDiff = now.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dobDate.getDate())) {
      years -= 1;
    }
    if (years < 0) return '-';
    return years.toLocaleString(i18n.language === 'fa' ? 'fa-IR' : 'en-US');
  })();

  return (
    <Card>
      <CardContent className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <Row label={t('form.personReadOnly.fullName', { defaultValue: 'Full name' })} value={fullName} />
          <Row label={t('form.personReadOnly.nationalId', { defaultValue: 'National ID' })} value={person.nationalId ?? '-'} />
          <Row label={t('form.personReadOnly.fatherName', { defaultValue: 'Father name' })} value={fatherName} />
          <Row label={t('form.personReadOnly.dateOfBirth', { defaultValue: 'Date of birth' })} value={dob} />
          <Row label={t('form.personReadOnly.gender', { defaultValue: 'Gender' })} value={gender} />
          <Row label={t('form.personReadOnly.age', { defaultValue: 'Age' })} value={age} />
          <Row label={t('form.personReadOnly.email', { defaultValue: 'Email' })} value={email} />
          <Row label={t('form.personReadOnly.phone', { defaultValue: 'Phone' })} value={phone} />
          <Row
            label={t('form.personReadOnly.address', { defaultValue: 'Address' })}
            value={address}
            className="md:col-span-2"
          />
          <Row label={t('form.personReadOnly.postalCode', { defaultValue: 'Postal code' })} value={postalCode} />
        </div>
      </CardContent>
    </Card>
  );
}

function Row({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-0.5 ${className ?? ''}`}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-medium break-words">{value}</span>
    </div>
  );
}
