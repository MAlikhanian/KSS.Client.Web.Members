'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Eye, Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { formatDateTime, localizeDigits } from '@/app/components/person/components/format-utils';
import type { SampleEducation, SampleLookup } from '../sample-person-details';

interface EducationReplicaProps {
  educations: SampleEducation[];
  levels: SampleLookup;
  fields: SampleLookup;
  institutions: SampleLookup;
}

// Read-only replica of the person education section (same title, number,
// columns, documents cell and row actions), fed with sample data. The current
// page's View and Download are live file links; here they are inert.
export function EducationSectionReplica({ educations, levels, fields, institutions }: EducationReplicaProps) {
  const { t, i18n } = useTranslation('person-education');
  const locale = i18n.language === 'fa' ? 'fa-IR' : 'en-US';
  const lang = i18n.language === 'fa' ? 'fa' : 'en';

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString(locale, { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">8</span>
          {t('sectionTitle', { defaultValue: 'Education' })}
          <Badge variant="outline">{educations.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {educations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t('noItems', { defaultValue: 'No education records registered' })}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>{t('educationLevel', { defaultValue: 'Education Level' })}</TableHead>
                  <TableHead>{t('fieldOfStudy', { defaultValue: 'Field of Study' })}</TableHead>
                  <TableHead>{t('institution', { defaultValue: 'Institution' })}</TableHead>
                  <TableHead>{t('startDate', { defaultValue: 'Start Date' })}</TableHead>
                  <TableHead>{t('endDate', { defaultValue: 'End Date' })}</TableHead>
                  <TableHead>{t('gpa', { defaultValue: 'GPA' })}</TableHead>
                  <TableHead>{t('isCompleted', { defaultValue: 'Completed' })}</TableHead>
                  <TableHead>{t('common:createdAt', { defaultValue: 'Created At' })}</TableHead>
                  <TableHead>{t('documents', { defaultValue: 'Documents' })}</TableHead>
                  <TableHead className="w-24">{t('common:actions', { defaultValue: 'Actions' })}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {educations.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{(index + 1).toLocaleString(locale)}</TableCell>
                    <TableCell>{levels[item.educationLevelId]?.[lang] || '-'}</TableCell>
                    <TableCell>{fields[item.fieldOfStudyId]?.[lang] || '-'}</TableCell>
                    <TableCell>{institutions[item.institutionId]?.[lang] || '-'}</TableCell>
                    <TableCell>{formatDate(item.startDate)}</TableCell>
                    <TableCell>{formatDate(item.endDate)}</TableCell>
                    <TableCell>{item.gpa !== null ? localizeDigits(String(item.gpa), locale) : '-'}</TableCell>
                    <TableCell>
                      {item.isCompleted ? (
                        <Badge variant="success" className="text-xs font-sans">
                          {t('isCompleted', { defaultValue: 'Completed' })}
                        </Badge>
                      ) : '-'}
                    </TableCell>
                    <TableCell style={{ unicodeBidi: 'plaintext' }}>{formatDateTime(item.createdAt, locale)}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
