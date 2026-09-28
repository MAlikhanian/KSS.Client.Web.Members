'use client';

import { useMemo, useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';
import type { CompanySoftwareSlotDto, SoftwareCatalogItemDto } from '@/services/company-api';

/** Sentinel Select value for "nothing chosen yet" — Radix Select forbids an empty-string item value. */
const NONE_VALUE = 'none';

interface SoftwareAssignmentGridProps {
  /** Rows that already have a software picked (`softwareId != null`) — rendered in the grid. */
  assignments: CompanySoftwareSlotDto[];
  /** Categories NOT yet assigned — the only choices offered when adding a new row. */
  categoryOptions: CompanySoftwareSlotDto[];
  /** Full software catalog (active software + provider company), driving the Provider/Software cascade. */
  catalog: SoftwareCatalogItemDto[];
  /** Upsert the software picked for a category. */
  onSave: (categoryId: number, softwareId: number) => void | Promise<void>;
  /** Clear a category's pick. */
  onDelete: (categoryId: number) => void | Promise<void>;
  disabled?: boolean;
  /** Hide add / edit / delete affordances entirely (view-only). */
  readOnly?: boolean;
}

interface DialogFormState {
  /** NONE_VALUE or the category's numeric id, stringified — Category select value. */
  categoryId: string;
  /** NONE_VALUE or the provider company's guid — Provider select value. */
  providerId: string;
  /** NONE_VALUE or the software's numeric id, stringified — Software select value. */
  softwareId: string;
}

const EMPTY_FORM: DialogFormState = { categoryId: NONE_VALUE, providerId: NONE_VALUE, softwareId: NONE_VALUE };

/**
 * Grid + Add/Edit dialog for CompanySoftware assignments (one software per
 * category, out of the fixed SoftwareCategory set). The dialog holds the
 * provider→software cascade; the grid itself only shows already-assigned
 * categories. Mirrors the Email/Phone/Address grid template
 * (components/common/company-info/emails-grid.tsx).
 */
export function SoftwareAssignmentGrid({
  assignments,
  categoryOptions,
  catalog,
  onSave,
  onDelete,
  disabled,
  readOnly = false,
}: SoftwareAssignmentGridProps) {
  const { t } = useTranslation('brokerages-company-software');

  // Distinct provider companies present in the catalog, for the Provider select.
  const providers = useMemo(
    () =>
      Array.from(new Map(catalog.map((c) => [c.companyId, c.companyName])), ([companyId, companyName]) => ({
        companyId,
        companyName,
      })),
    [catalog],
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<CompanySoftwareSlotDto | null>(null);
  const [formData, setFormData] = useState<DialogFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const isEditing = editingSlot != null;

  const handleOpenAdd = () => {
    setEditingSlot(null);
    setFormData(EMPTY_FORM);
    setDialogOpen(true);
  };

  const handleOpenEdit = (slot: CompanySoftwareSlotDto) => {
    setEditingSlot(slot);
    setFormData({
      categoryId: slot.softwareCategoryId.toString(),
      providerId: slot.providerCompanyId ?? NONE_VALUE,
      softwareId: slot.softwareId != null ? slot.softwareId.toString() : NONE_VALUE,
    });
    setDialogOpen(true);
  };

  // Changing the provider invalidates any previously chosen software (it
  // belonged to the old provider's product line).
  const handleProviderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, providerId: value, softwareId: NONE_VALUE }));
  };

  const softwareOptions =
    formData.providerId === NONE_VALUE ? [] : catalog.filter((c) => c.companyId === formData.providerId);

  const canSave = formData.categoryId !== NONE_VALUE && formData.softwareId !== NONE_VALUE;

  const handleSubmit = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await onSave(Number(formData.categoryId), Number(formData.softwareId));
      setDialogOpen(false);
      setFormData(EMPTY_FORM);
      setEditingSlot(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">1</span>
          {t('grid.title', { defaultValue: 'Software Assignments' })}
          {!readOnly && <Badge variant="secondary">{assignments.length}</Badge>}
        </CardTitle>
        {!readOnly && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenAdd}
            disabled={disabled || categoryOptions.length === 0}
          >
            <Plus className="h-4 w-4 ml-1" />
            {t('grid.addAssignment', { defaultValue: 'Add Assignment' })}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {assignments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {t('grid.noAssignments', { defaultValue: 'No software assigned yet.' })}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('grid.columns.category', { defaultValue: 'Category' })}</TableHead>
                <TableHead>{t('grid.columns.provider', { defaultValue: 'Provider' })}</TableHead>
                <TableHead>{t('grid.columns.software', { defaultValue: 'Software' })}</TableHead>
                {!readOnly && (
                  <TableHead className="w-24">{t('common:actions', { defaultValue: 'Actions' })}</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((slot) => (
                <TableRow key={slot.softwareCategoryId}>
                  <TableCell>{slot.categoryName}</TableCell>
                  <TableCell>{slot.providerCompanyName}</TableCell>
                  <TableCell>{slot.softwareName}</TableCell>
                  {!readOnly && (
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleOpenEdit(slot)}
                          disabled={disabled}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => onDelete(slot.softwareCategoryId)}
                          disabled={disabled}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-white! dark:border-white!">
          <DialogHeader>
            <DialogTitle>
              {isEditing
                ? t('grid.editAssignment', { defaultValue: 'Edit Assignment' })
                : t('grid.addAssignment', { defaultValue: 'Add Assignment' })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('grid.columns.category', { defaultValue: 'Category' })}</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
                disabled={isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('grid.selectCategory', { defaultValue: 'Select category' })} />
                </SelectTrigger>
                <SelectContent>
                  {isEditing && editingSlot ? (
                    <SelectItem value={editingSlot.softwareCategoryId.toString()}>
                      {editingSlot.categoryName}
                    </SelectItem>
                  ) : (
                    categoryOptions.map((slot) => (
                      <SelectItem key={slot.softwareCategoryId} value={slot.softwareCategoryId.toString()}>
                        {slot.categoryName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('form.provider', { defaultValue: 'Provider' })}</Label>
              <Select value={formData.providerId} onValueChange={handleProviderChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t('form.selectProvider', { defaultValue: 'Select provider' })} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE_VALUE}>{t('form.none', { defaultValue: '— None —' })}</SelectItem>
                  {providers.map((p) => (
                    <SelectItem key={p.companyId} value={p.companyId}>{p.companyName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('form.selectSoftware', { defaultValue: 'Select software' })}</Label>
              <Select
                value={formData.softwareId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, softwareId: value }))}
                disabled={formData.providerId === NONE_VALUE}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('form.selectSoftware', { defaultValue: 'Select software' })} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE_VALUE}>{t('form.none', { defaultValue: '— None —' })}</SelectItem>
                  {softwareOptions.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              {t('common:cancel', { defaultValue: 'Cancel' })}
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={!canSave || saving}>
              {isEditing ? t('common:save', { defaultValue: 'Save' }) : t('common:add', { defaultValue: 'Add' })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
