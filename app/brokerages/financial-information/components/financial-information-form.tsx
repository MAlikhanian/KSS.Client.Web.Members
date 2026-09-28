'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { BrokerageSelectionCard, useBrokerageContext } from '@/app/brokerages/components';
import { CompanyInfoView } from '@/components/common/company-info';
import { useTranslation } from '@/hooks/useTranslation';
import { FinancialInfoGrid, FinancialInfoRecord } from './financial-info-grid';

function showSuccess(message: string) {
  toast.custom(
    () => (
      <Alert variant="mono" icon="success">
        <AlertIcon>
          <RiCheckboxCircleFill />
        </AlertIcon>
        <AlertTitle>{message}</AlertTitle>
      </Alert>
    ),
    { position: 'top-center' },
  );
}

function showError(message: string) {
  toast.custom(
    () => (
      <Alert variant="mono" icon="destructive">
        <AlertIcon>
          <RiErrorWarningFill />
        </AlertIcon>
        <AlertTitle>{message}</AlertTitle>
      </Alert>
    ),
    { position: 'top-center' },
  );
}

export function FinancialInformationForm() {
  const { t } = useTranslation('brokerages-financial-info');
  const { selectedBrokerageId, setSelectedBrokerageId, isEditMode } = useBrokerageContext();
  const [records, setRecords] = useState<FinancialInfoRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Load financial info records when brokerage is selected
  const loadRecords = useCallback(async () => {
    if (!selectedBrokerageId) {
      setRecords([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/brokerages/${selectedBrokerageId}/financial-info`);
      if (!response.ok) throw new Error('Failed to load financial info');
      const data: FinancialInfoRecord[] = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('Error loading financial info:', error);
      showError(t('form.errors.loadFailed', { defaultValue: 'Failed to load financial information' }));
    } finally {
      setLoading(false);
    }
  }, [selectedBrokerageId, t]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // Add handler
  const handleAdd = useCallback(async (data: { fiscalYear: number; registeredCapital: number; numberOfShares: number }) => {
    if (!selectedBrokerageId) return;
    try {
      const response = await fetch(`/api/brokerages/${selectedBrokerageId}/financial-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        showSuccess(t('form.messages.addSuccess', { defaultValue: 'Financial information added successfully' }));
        await loadRecords();
      } else {
        const err = await response.json().catch(() => ({ message: 'Unknown error' }));
        showError(err.message || t('form.errors.addFailed', { defaultValue: 'Failed to add financial information' }));
      }
    } catch (error) {
      console.error('Error adding financial info:', error);
      showError(t('form.errors.addFailed', { defaultValue: 'Failed to add financial information' }));
    }
  }, [selectedBrokerageId, loadRecords, t]);

  // Edit handler
  const handleEdit = useCallback(async (id: string, data: { fiscalYear: number; registeredCapital: number; numberOfShares: number }) => {
    if (!selectedBrokerageId) return;
    try {
      const response = await fetch(`/api/brokerages/${selectedBrokerageId}/financial-info`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: id, ...data }),
      });
      if (response.ok) {
        showSuccess(t('form.messages.editSuccess', { defaultValue: 'Financial information updated successfully' }));
        await loadRecords();
      } else {
        const err = await response.json().catch(() => ({ message: 'Unknown error' }));
        showError(err.message || t('form.errors.editFailed', { defaultValue: 'Failed to update financial information' }));
      }
    } catch (error) {
      console.error('Error editing financial info:', error);
      showError(t('form.errors.editFailed', { defaultValue: 'Failed to update financial information' }));
    }
  }, [selectedBrokerageId, loadRecords, t]);

  // Delete handler
  const handleDelete = useCallback(async (id: string) => {
    if (!selectedBrokerageId) return;
    try {
      const response = await fetch(`/api/brokerages/${selectedBrokerageId}/financial-info?itemId=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        showSuccess(t('form.messages.deleteSuccess', { defaultValue: 'Financial information deleted successfully' }));
        await loadRecords();
      } else {
        const err = await response.json().catch(() => ({ message: 'Unknown error' }));
        showError(err.message || t('form.errors.deleteFailed', { defaultValue: 'Failed to delete financial information' }));
      }
    } catch (error) {
      console.error('Error deleting financial info:', error);
      showError(t('form.errors.deleteFailed', { defaultValue: 'Failed to delete financial information' }));
    }
  }, [selectedBrokerageId, loadRecords, t]);

  return (
    <div className="space-y-6">
      {/* Brokerage Selection Card — black/white border override (matches general-information). */}
      <div
        className={
          '[&_div.rounded-xl.bg-card.bg-card]:border-black! ' +
          'dark:[&_div.rounded-xl.bg-card.bg-card]:border-white!'
        }
      >
        <BrokerageSelectionCard
          value={selectedBrokerageId}
          onValueChange={setSelectedBrokerageId}
          isEditMode={isEditMode}
        />
      </div>

      {/* Sections below appear only once a brokerage is selected — no empty cards. */}
      {isEditMode && (
        <>
          {/* Shared read-only company information block (same as /company/view). */}
          <CompanyInfoView companyId={selectedBrokerageId} />

          {/* Financial Information Grid — the editable section on this page. */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">1</span>
                {t('form.title', { defaultValue: 'Financial Information' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {t('common.loading', { defaultValue: 'Loading...' })}
                </p>
              ) : (
                <FinancialInfoGrid
                  records={records}
                  onAdd={handleAdd}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  disabled={!selectedBrokerageId}
                />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
