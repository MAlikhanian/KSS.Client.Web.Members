'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Eye, Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { formatDateTime, localizeDigits } from '@/app/components/person/components/format-utils';
import type { SampleEmployment, SampleLookup } from '../sample-person-details';

interface EmploymentReplicaProps {
  employments: SampleEmployment[];
  activityFields: SampleLookup;
  activityUnits: SampleLookup;
  positions: SampleLookup;
  contractTypes: SampleLookup;
}

// Read-only replica of the person work-experience section (same title, number,
// columns, current-row badge, documents cell and row actions), fed with sample
// data. The current page's View and Download are live file links; here inert.
export function EmploymentSectionReplica(p: EmploymentReplicaProps) {
  const { t, i18n } = useTranslation('person-employment');
  const locale = i18n.language === 'fa' ? 'fa-IR' : 'en-US';
  const lang = i18n.language === 'fa' ? 'fa' : 'en';
  const { employments } = p;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString(locale, { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">7</span>
          {t('sectionTitle', { defaultValue: 'Work Experience' })}
          <Badge variant="outline">{employments.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {employments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t('noItems', { defaultValue: 'No work experience records' })}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>{t('company', { defaultValue: 'Company' })}</TableHead>
                  <TableHead>{t('nationalId', { defaultValue: 'National ID' })}</TableHead>
                  <TableHead>{t('activityField', { defaultValue: 'Business Sector' })}</TableHead>
                  <TableHead>{t('activityUnit', { defaultValue: 'Business Unit' })}</TableHead>
                  <TableHead>{t('position', { defaultValue: 'Position' })}</TableHead>
                  <TableHead>{t('contractType', { defaultValue: 'Contract Type' })}</TableHead>
                  <TableHead>{t('common:startDate', { defaultValue: 'From Date' })}</TableHead>
                  <TableHead>{t('common:endDate', { defaultValue: 'To Date' })}</TableHead>
                  <TableHead>{t('common:createdAt', { defaultValue: 'Created At' })}</TableHead>
                  <TableHead>{t('common:updatedAt', { defaultValue: 'Last Modified' })}</TableHead>
                  <TableHead>{t('documents', { defaultValue: 'Documents' })}</TableHead>
                  <TableHead className="w-24">{t('common:actions', { defaultValue: 'Actions' })}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employments.map((item, index) => {
                  const isLast = index === employments.length - 1;
                  const isCurrent = isLast && !item.toDate;
                  return (
                    <TableRow key={item.id} className={isCurrent ? 'bg-muted/30' : ''}>
                      <TableCell>{(index + 1).toLocaleString(locale)}</TableCell>
                      <TableCell>{item.companyName}</TableCell>
                      <TableCell>{localizeDigits(item.companyNationalId, locale)}</TableCell>
                      <TableCell>{p.activityFields[item.activityFieldId]?.[lang] || '-'}</TableCell>
                      <TableCell>{p.activityUnits[item.activityUnitId]?.[lang] || '-'}</TableCell>
                      <TableCell>{p.positions[item.positionId]?.[lang] || '-'}</TableCell>
                      <TableCell>{p.contractTypes[item.contractTypeId]?.[lang] || '-'}</TableCell>
                      <TableCell>{formatDate(item.fromDate)}</TableCell>
                      <TableCell>
                        {item.toDate ? formatDate(item.toDate) : (
                          <Badge variant="success" className="text-xs font-sans">
                            {t('common:current', { defaultValue: 'Current' })}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell style={{ unicodeBidi: 'plaintext' }}>{formatDateTime(item.createdAt, locale)}</TableCell>
                      <TableCell style={{ unicodeBidi: 'plaintext' }}>{formatDateTime(item.updatedAt, locale)}</TableCell>
                      <TableCell>
                        {item.documents.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {item.documents.map((doc) => (
                              <div key={doc.id} className="flex items-center gap-1">
                                <span className="truncate max-w-[160px] text-xs">{doc.fileName}</span>
                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" disabled title={t('common:view', { defaultValue: 'View' })}>
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" disabled title={t('common:download', { defaultValue: 'Download' })}>
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
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
