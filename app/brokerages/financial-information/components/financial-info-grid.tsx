'use client';

import { useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';

export interface FinancialInfoRecord {
  id: string;
  companyId: string;
  fiscalYear: number;
  registeredCapital: number;
  numberOfShares: number;
}

interface FinancialInfoGridProps {
  records: FinancialInfoRecord[];
  onAdd: (data: { fiscalYear: number; registeredCapital: number; numberOfShares: number }) => void;
  onEdit: (id: string, data: { fiscalYear: number; registeredCapital: number; numberOfShares: number }) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

/** Format number with thousand separators (Persian locale) */
function formatNumber(value: number): string {
  return value.toLocaleString('fa-IR');
}

export function FinancialInfoGrid({ records, onAdd, onEdit, onDelete, disabled }: FinancialInfoGridProps) {
  const { t } = useTranslation('brokerages-financial-info');

  // --- Dialog state ---
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fiscalYear, setFiscalYear] = useState('');
  const [registeredCapital, setRegisteredCapital] = useState('');
  const [numberOfShares, setNumberOfShares] = useState('');

  // --- Open dialog for add ---
  const handleOpenAdd = () => {
    setEditingId(null);
    setFiscalYear('');
    setRegisteredCapital('');
    setNumberOfShares('');
    setDialogOpen(true);
  };

  // --- Open dialog for edit ---
  const handleOpenEdit = (record: FinancialInfoRecord) => {
    setEditingId(record.id);
    setFiscalYear(record.fiscalYear.toString());
    setRegisteredCapital(record.registeredCapital.toString());
    setNumberOfShares(record.numberOfShares.toString());
    setDialogOpen(true);
  };

  // --- Submit (add or edit) ---
  const handleSubmit = () => {
    const year = parseInt(fiscalYear);
    const capital = parseFloat(registeredCapital);
    const shares = parseInt(numberOfShares);

    if (!year || year < 1300 || year > 1500) return;
    if (!capital || capital <= 0) return;
    if (!shares || shares <= 0) return;

    if (editingId) {
      onEdit(editingId, { fiscalYear: year, registeredCapital: capital, numberOfShares: shares });
    } else {
      onAdd({ fiscalYear: year, registeredCapital: capital, numberOfShares: shares });
    }
    setDialogOpen(false);
  };

  const isFormValid = (() => {
    const year = parseInt(fiscalYear);
    const capital = parseFloat(registeredCapital);
    const shares = parseInt(numberOfShares);
    return year >= 1300 && year <= 1500 && capital > 0 && shares > 0;
  })();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          {t('form.title', { defaultValue: 'Financial Information' })}
          <Badge variant="secondary">{records.length}</Badge>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleOpenAdd}
          disabled={disabled}
        >
          <Plus className="h-4 w-4 ml-1" />
          {t('common.add', { defaultValue: 'Add' })}
        </Button>
      </div>

      {/* Grid / Table */}
      {records.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          {t('form.noRecords', { defaultValue: 'No financial information recorded' })}
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">
                {t('form.fields.fiscalYear', { defaultValue: 'Fiscal Year' })}
              </TableHead>
              <TableHead>
                {t('form.fields.lastRegisteredCapital', { defaultValue: 'Last Registered Capital' })}
              </TableHead>
              <TableHead>
                {t('form.fields.numberOfShares', { defaultValue: 'Number of Shares' })}
              </TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <Badge variant="outline" className="text-sm px-2 py-0.5 font-mono">
                    {record.fiscalYear}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {formatNumber(record.registeredCapital)}
                </TableCell>
                <TableCell className="font-medium">
                  {formatNumber(record.numberOfShares)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleOpenEdit(record)}
                      disabled={disabled}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => onDelete(record.id)}
                      disabled={disabled}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId
                ? t('form.editRecord', { defaultValue: 'Edit Financial Information' })
                : t('form.addRecord', { defaultValue: 'Add Financial Information' })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Fiscal Year */}
            <div className="space-y-2">
              <Label>
                {t('form.fields.fiscalYear', { defaultValue: 'Fiscal Year' })}
                <span className="text-destructive mr-1">*</span>
              </Label>
              <Input
                type="number"
                value={fiscalYear}
                onChange={(e) => setFiscalYear(e.target.value)}
                placeholder={t('form.placeholders.fiscalYear', { defaultValue: 'Enter fiscal year (e.g., 2024)' })}
                min={1300}
                max={1500}
              />
            </div>

            {/* Registered Capital */}
            <div className="space-y-2">
              <Label>
                {t('form.fields.lastRegisteredCapital', { defaultValue: 'Last Registered Capital (Rial)' })}
                <span className="text-destructive mr-1">*</span>
              </Label>
              <Input
                type="number"
                value={registeredCapital}
                onChange={(e) => setRegisteredCapital(e.target.value)}
                placeholder={t('form.placeholders.lastRegisteredCapital', { defaultValue: 'Enter last registered capital amount' })}
                min={1}
              />
            </div>

            {/* Number of Shares */}
            <div className="space-y-2">
              <Label>
                {t('form.fields.numberOfShares', { defaultValue: 'Number of Shares' })}
                <span className="text-destructive mr-1">*</span>
              </Label>
              <Input
                type="number"
                value={numberOfShares}
                onChange={(e) => setNumberOfShares(e.target.value)}
                placeholder={t('form.placeholders.numberOfShares', { defaultValue: 'Enter number of shares' })}
                min={1}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              {t('common.cancel', { defaultValue: 'Cancel' })}
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              {editingId
                ? t('common.save', { defaultValue: 'Save' })
                : t('common.add', { defaultValue: 'Add' })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
