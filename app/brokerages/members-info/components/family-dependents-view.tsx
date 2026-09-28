'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/useTranslation';

const LANG_CODE_TO_ID: Record<string, number> = { fa: 12, en: 10 };

interface RelationshipDto {
  personId: string;
  relatedPersonId: string;
  relationshipTypeId?: number | null;
  relationshipTypeName?: string | null;
}

interface RelatedPersonSummary {
  id: string;
  nationalId: string | null;
  translations: Array<{ languageId: number; firstName: string; lastName: string }>;
  dateOfBirth: string | null;
}

interface FamilyDependentsViewProps {
  personId: string;
}

/**
 * Read-only list of a Person's dependents, sourced directly from the Person
 * service's `relationshipsAsPerson` array. No edits, no save — dependents are
 * managed on the person profile page.
 */
export function FamilyDependentsView({ personId }: FamilyDependentsViewProps) {
  const { t, i18n } = useTranslation('brokerages-members-info');
  const langId = LANG_CODE_TO_ID[i18n.language] ?? 12;

  const [relationships, setRelationships] = useState<RelationshipDto[]>([]);
  const [related, setRelated] = useState<Record<string, RelatedPersonSummary | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!personId) {
      setRelationships([]);
      setRelated({});
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(`/api/person/${personId}`);
        if (!res.ok) {
          if (!cancelled) {
            setRelationships([]);
            setRelated({});
          }
          return;
        }
        const data = await res.json();
        const rels: RelationshipDto[] = data?.relationshipsAsPerson ?? [];
        if (cancelled) return;
        setRelationships(rels);

        const enriched: Record<string, RelatedPersonSummary | null> = {};
        await Promise.all(
          rels.map(async (r) => {
            try {
              const rr = await fetch(`/api/person/${r.relatedPersonId}`);
              enriched[r.relatedPersonId] = rr.ok ? await rr.json() : null;
            } catch {
              enriched[r.relatedPersonId] = null;
            }
          }),
        );
        if (!cancelled) setRelated(enriched);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [personId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          {t('form.familyDependents.title', { defaultValue: 'Family / Dependents' })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : relationships.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t('form.familyDependents.empty', { defaultValue: 'No dependents on record' })}
          </p>
        ) : (
          <ul className="divide-y">
            {relationships.map((rel) => {
              const p = related[rel.relatedPersonId];
              const tr =
                p?.translations?.find((x) => x.languageId === langId) ??
                p?.translations?.[0];
              const name = tr ? `${tr.firstName} ${tr.lastName}`.trim() : '-';
              const nid = p?.nationalId ?? '-';
              const dob = p?.dateOfBirth
                ? new Date(p.dateOfBirth).toLocaleDateString(
                    i18n.language === 'fa' ? 'fa-IR' : 'en-US',
                  )
                : '-';
              return (
                <li key={rel.relatedPersonId} className="flex items-center justify-between py-2 text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium">{name}</span>
                    <span className="text-xs text-muted-foreground">
                      {t('form.familyDependents.nationalId', { defaultValue: 'NID' })}: {nid} · {dob}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {rel.relationshipTypeName ?? '-'}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
