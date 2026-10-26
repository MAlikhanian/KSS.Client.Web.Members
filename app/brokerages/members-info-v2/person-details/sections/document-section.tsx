'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Eye, FileImage, FileText, Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { formatDateTime, localizeDigits } from '@/app/components/person/components/format-utils';
import type { SampleDocument, SampleLookup } from '../sample-person-details';

// Read-only replica of the person documents section (same title, number,
// columns and row actions). On the current page View and Download are live
// links to the stored file; here they are inert, as the preview holds no file.
export function DocumentSectionReplica({ documents, documentTypes }: { documents: SampleDocument[]; documentTypes: SampleLookup }) {
  const { t, i18n } = useTranslation('person-document');
  const locale = i18n.language === 'fa' ? 'fa-IR' : 'en-US';
  const lang = i18n.language === 'fa' ? 'fa' : 'en';

  const getDocTypeName = (id: number) => documentTypes[id]?.[lang] || '-';
  const isImageType = (fileName: string) => /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(fileName);
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return localizeDigits(`${bytes} B`, locale);
    if (bytes < 1024 * 1024) return localizeDigits(`${(bytes / 1024).toFixed(1)} KB`, locale);
    return localizeDigits(`${(bytes / (1024 * 1024)).toFixed(1)} MB`, locale);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">11</span>
          {t('sectionTitle', { defaultValue: 'Documents & Images' })}
          <Badge variant="outline">{(documents.length).toLocaleString(locale)}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t('noItems', { defaultValue: 'No documents registered' })}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>{t('documentType', { defaultValue: 'Document Type' })}</TableHead>
                  <TableHead>{t('fileName', { defaultValue: 'File Name' })}</TableHead>
                  <TableHead>{t('fileSize', { defaultValue: 'Size' })}</TableHead>
                  <TableHead>{t('common:createdAt', { defaultValue: 'Created At' })}</TableHead>
                  <TableHead>{t('common:updatedAt', { defaultValue: 'Last Modified' })}</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc, index) => (
                  <TableRow key={doc.id}>
                    <TableCell>{(index + 1).toLocaleString(locale)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {isImageType(doc.fileName)
                          ? <FileImage className="h-4 w-4 text-blue-500" />
                          : <FileText className="h-4 w-4 text-orange-500" />}
                        {getDocTypeName(doc.documentTypeId)}
                      </div>
                    </TableCell>
                    <TableCell>{doc.fileName}</TableCell>
                    <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                    <TableCell style={{ unicodeBidi: 'plaintext' }}>{formatDateTime(doc.createdAt, locale)}</TableCell>
                    <TableCell style={{ unicodeBidi: 'plaintext' }}>{formatDateTime(doc.updatedAt, locale)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" disabled title={t('common:view', { defaultValue: 'View' })}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" disabled title={t('common:download', { defaultValue: 'Download' })}>
                          <Download className="h-4 w-4" />
                        </Button>
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
