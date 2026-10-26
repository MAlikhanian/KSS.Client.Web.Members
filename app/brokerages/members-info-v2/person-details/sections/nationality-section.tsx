'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { formatDateTime } from '@/app/components/person/components/format-utils';
import type { SampleLookup, SampleNationality } from '../sample-person-details';

// Read-only replica of the person nationalities section (same title, number,
// columns and disabled row actions), fed with sample data.
export function NationalitySectionReplica({ nationalities, countries }: { nationalities: SampleNationality[]; countries: SampleLookup }) {
  const { t, i18n } = useTranslation('person-nationality');
  const locale = i18n.language === 'fa' ? 'fa-IR' : 'en-US';
  const lang = i18n.language === 'fa' ? 'fa' : 'en';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">3</span>
          {t('sectionTitle', { defaultValue: 'Nationalities' })}
          <Badge variant="outline">{nationalities.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {nationalities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t('noItems', { defaultValue: 'No nationalities registered' })}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>{t('country', { defaultValue: 'Nationality Country' })}</TableHead>
                  <TableHead>{t('common:createdAt', { defaultValue: 'Created At' })}</TableHead>
                  <TableHead>{t('common:updatedAt', { defaultValue: 'Last Modified' })}</TableHead>
                  <TableHead className="w-20">{t('common:actions', { defaultValue: 'Actions' })}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nationalities.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{(index + 1).toLocaleString(locale)}</TableCell>
                    <TableCell>{countries[item.countryId]?.[lang] ?? String(item.countryId)}</TableCell>
                    <TableCell style={{ unicodeBidi: 'plaintext' }}>{formatDateTime(item.createdAt, locale)}</TableCell>
                    <TableCell style={{ unicodeBidi: 'plaintext' }}>{formatDateTime(item.updatedAt, locale)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" disabled>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" disabled>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
