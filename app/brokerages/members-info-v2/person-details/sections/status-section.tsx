'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { formatDateTime } from '@/app/components/person/components/format-utils';
import type { SampleStatus } from '../sample-person-details';

// Read-only replica of the person status section as the current Members Info
// page shows it (same title, number, columns, badges and disabled row actions),
// fed with sample data instead of loading the person's records.
export function StatusSectionReplica({ statuses: unsorted }: { statuses: SampleStatus[] }) {
  const { t, i18n } = useTranslation('person-status');
  const locale = i18n.language === 'fa' ? 'fa-IR' : 'en-US';
  const statuses = [...unsorted].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );
  const currentStatus = statuses.length > 0 ? statuses[statuses.length - 1] : null;
  const isCurrentlyActive = currentStatus !== null && !currentStatus.endDate;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString(locale, { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">12</span>
          {t('sectionTitle', { defaultValue: 'Status' })}
          {statuses.length > 0 && (
            <Badge variant={isCurrentlyActive ? 'success' : 'secondary'}>
              {isCurrentlyActive
                ? t('common:active', { defaultValue: 'Active' })
                : t('common:inactive', { defaultValue: 'Inactive' })}
            </Badge>
          )}
          <Badge variant="outline">{statuses.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statuses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t('noItems', { defaultValue: 'No active periods registered' })}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>{t('common:startDate', { defaultValue: 'Start Date' })}</TableHead>
                  <TableHead>{t('common:endDate', { defaultValue: 'End Date' })}</TableHead>
                  <TableHead>{t('common:createdAt', { defaultValue: 'Created At' })}</TableHead>
                  <TableHead>{t('common:updatedAt', { defaultValue: 'Last Modified' })}</TableHead>
                  <TableHead className="w-24">{t('common:actions', { defaultValue: 'Actions' })}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statuses.map((status, index) => {
                  const isLast = index === statuses.length - 1;
                  const isCurrent = isLast && !status.endDate;
                  return (
                    <TableRow key={status.id} className={isCurrent ? 'bg-muted/30' : ''}>
                      <TableCell>{(index + 1).toLocaleString(locale)}</TableCell>
                      <TableCell>{formatDate(status.startDate)}</TableCell>
                      <TableCell>
                        {status.endDate ? formatDate(status.endDate) : (
                          <Badge variant="success" className="text-xs font-sans">
                            {t('common:current', { defaultValue: 'Current' })}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell style={{ unicodeBidi: 'plaintext' }}>{formatDateTime(status.createdAt, locale)}</TableCell>
                      <TableCell style={{ unicodeBidi: 'plaintext' }}>{formatDateTime(status.updatedAt, locale)}</TableCell>
                      <TableCell>
                        {/* Shown as on the current page, where the read-only view disables them. */}
                        {isLast && (
                          <div className="flex items-center gap-1">
                            {!status.endDate && (
                              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" disabled title={t('setEndDate', { defaultValue: 'Set End Date' })}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" disabled>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
