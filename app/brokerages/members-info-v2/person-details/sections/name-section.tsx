'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslation } from '@/hooks/useTranslation';
import { formatDateTime } from '@/app/components/person/components/format-utils';
import type { SampleLookup, SampleNameTranslation } from '../sample-person-details';

const EN_LANGUAGE_ID = 10;

// Read-only replica of the person name section (same title, number, columns
// and the "English name cannot be changed" note), fed with sample data. In the
// current page's read-only view the actions column is present but empty.
export function NameSectionReplica({ translations, languages }: { translations: SampleNameTranslation[]; languages: SampleLookup }) {
  const { t } = useTranslation();
  const { t: tGrid, i18n } = useTranslation('person-name-grid');
  const locale = i18n.language === 'fa' ? 'fa-IR' : 'en-US';
  const englishExists = translations.some((tr) => tr.languageId === EN_LANGUAGE_ID);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">1</span>
          {t('sectionTitle', { ns: 'person-name-grid', defaultValue: 'Name, Family Name & Father Name' })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {translations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-3">
              {tGrid('noItems', { defaultValue: 'No names registered. Add at least one language.' })}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tGrid('language', { defaultValue: 'Language' })}</TableHead>
                  <TableHead>{tGrid('firstName', { defaultValue: 'First Name' })}</TableHead>
                  <TableHead>{tGrid('lastName', { defaultValue: 'Last Name' })}</TableHead>
                  <TableHead>{tGrid('fatherName', { defaultValue: 'Father Name' })}</TableHead>
                  <TableHead>{tGrid('common:createdAt', { defaultValue: 'Created At' })}</TableHead>
                  <TableHead>{tGrid('common:updatedAt', { defaultValue: 'Last Modified' })}</TableHead>
                  <TableHead className="w-20">{tGrid('common:actions', { defaultValue: 'Actions' })}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {translations.map((tr) => (
                  <TableRow key={tr.languageId}>
                    <TableCell>
                      {/* The current page shows each language's own (native) name. */}
                      <Badge variant="outline" className="text-xs px-1.5">
                        {languages[tr.languageId]?.fa ?? String(tr.languageId)}
                      </Badge>
                    </TableCell>
                    <TableCell>{tr.firstName}</TableCell>
                    <TableCell>{tr.lastName}</TableCell>
                    <TableCell>{tr.fatherName || '—'}</TableCell>
                    <TableCell style={{ unicodeBidi: 'plaintext' }}>{formatDateTime(tr.createdAt, locale)}</TableCell>
                    <TableCell style={{ unicodeBidi: 'plaintext' }}>{formatDateTime(tr.updatedAt, locale)}</TableCell>
                    <TableCell />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        {englishExists && (
          <p className="mt-2 text-xs italic text-muted-foreground">
            {t('person-form:englishNameFrozen', { defaultValue: 'English name cannot be changed after creation' })}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
