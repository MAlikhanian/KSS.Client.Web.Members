'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { BrokerageSelectionCard, useBrokerageContext } from '@/app/brokerages/components';
import { useTranslation } from '@/hooks/useTranslation';
import { useSoftwareCatalog } from '@/hooks/use-software-list';
import { translateApiError } from '@/lib/format-utils';
import type { CompanySoftwareSlotDto } from '@/services/company-api';
import { SoftwareAssignmentGrid } from './software-assignment-grid';

export function CompanySoftwareForm() {
  const { t } = useTranslation('brokerages-company-software');
  const { selectedBrokerageId, setSelectedBrokerageId, isEditMode } = useBrokerageContext();
  const { data: catalogData } = useSoftwareCatalog();
  const catalog = catalogData ?? [];
  const [slots, setSlots] = useState<CompanySoftwareSlotDto[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    toast.custom(
      () => (
        <Alert variant="mono" icon={type === 'success' ? 'success' : 'destructive'}>
          <AlertIcon>
            {type === 'success' ? <RiCheckboxCircleFill /> : <RiErrorWarningFill />}
          </AlertIcon>
          <AlertTitle>{message}</AlertTitle>
        </Alert>
      ),
      { position: 'top-center' },
    );
  }, []);

  // Reload the 9 category slots (left-joined to this brokerage's picks).
  // Guarded on selectedBrokerageId, and re-run whenever it changes — so
  // switching brokerages naturally clears then re-seeds from the new
  // brokerage's own slots (no separate reset effect needed).
  const reloadSlots = useCallback(async () => {
    if (!selectedBrokerageId) {
      setSlots([]);
      return;
    }
    try {
      const res = await fetch(`/api/company/${selectedBrokerageId}/software`);
      if (res.ok) {
        const data: CompanySoftwareSlotDto[] = (await res.json()) || [];
        setSlots(data);
      }
    } catch (error) {
      console.error('Error loading company software:', error);
    }
  }, [selectedBrokerageId]);

  useEffect(() => {
    reloadSlots();
  }, [reloadSlots]);

  // Assigned categories (rendered in the grid) vs. not-yet-assigned categories
  // (the only choices offered when adding a new row).
  const assignments = useMemo(() => slots.filter((s) => s.softwareId != null), [slots]);
  const categoryOptions = useMemo(() => slots.filter((s) => s.softwareId == null), [slots]);

  // Upsert the software picked for a category.
  const handleSave = useCallback(async (softwareCategoryId: number, softwareId: number) => {
    if (!selectedBrokerageId) return;
    try {
      const res = await fetch(`/api/company/${selectedBrokerageId}/software`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ softwareCategoryId, softwareId }),
      });
      if (res.ok) {
        await reloadSlots();
        showToast(t('form.messages.saved', { defaultValue: 'Software saved.' }), 'success');
      } else {
        const err = await res.json().catch(() => null);
        showToast(translateApiError(err?.message || '', t), 'error');
      }
    } catch (error) {
      console.error('Error saving company software:', error);
    }
  }, [selectedBrokerageId, reloadSlots, showToast, t]);

  // Clear a category's pick.
  const handleDelete = useCallback(async (softwareCategoryId: number) => {
    if (!selectedBrokerageId) return;
    try {
      const res = await fetch(`/api/company/${selectedBrokerageId}/software?categoryId=${softwareCategoryId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await reloadSlots();
        showToast(t('form.messages.cleared', { defaultValue: 'Selection cleared.' }), 'success');
      } else {
        const err = await res.json().catch(() => null);
        showToast(translateApiError(err?.message || '', t), 'error');
      }
    } catch (error) {
      console.error('Error clearing company software:', error);
    }
  }, [selectedBrokerageId, reloadSlots, showToast, t]);

  const disabled = !selectedBrokerageId || !isEditMode;

  return (
    <div className="space-y-6">
      {/* Brokerage Selection */}
      <BrokerageSelectionCard
        value={selectedBrokerageId}
        onValueChange={setSelectedBrokerageId}
        isEditMode={isEditMode}
        required
      />

      {!selectedBrokerageId ? (
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-4">
              {t('form.messages.noBrokerage', { defaultValue: 'Select a brokerage to manage its software.' })}
            </p>
          </CardContent>
        </Card>
      ) : (
        <SoftwareAssignmentGrid
          assignments={assignments}
          categoryOptions={categoryOptions}
          catalog={catalog}
          onSave={handleSave}
          onDelete={handleDelete}
          disabled={disabled}
        />
      )}
    </div>
  );
}
