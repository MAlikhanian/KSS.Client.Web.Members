'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { useTranslation } from '@/hooks/useTranslation';
import { translateApiError } from '@/lib/format-utils';
import { CompanyInfoView } from '@/components/common/company-info';
import { BrokerageDomainSection } from './brokerage-domain-section';
import { BrokerageSelectionCard, useBrokerageContext } from '../../components';

interface BrokerageFormData {
  seoRegistrationDate: string;
  seoRegistrationNumber: string;
}

const emptyFormData: BrokerageFormData = {
  seoRegistrationDate: '',
  seoRegistrationNumber: '',
};

export function GeneralInformationForm() {
  const { t } = useTranslation('brokerages-general-info');
  const queryClient = useQueryClient();
  const { selectedBrokerageId, setSelectedBrokerageId, isEditMode } = useBrokerageContext();
  const [formData, setFormData] = useState<BrokerageFormData>(emptyFormData);

  // Load the brokerage ERP/SEO record when a brokerage is selected. The read-only
  // company sections are rendered (and loaded) by <CompanyInfoView/>.
  useEffect(() => {
    const loadData = async () => {
      if (!selectedBrokerageId) {
        setFormData(emptyFormData);
        return;
      }

      try {
        const res = await fetch(`/api/brokerages/${selectedBrokerageId}`);
        const brokerage = res.ok ? await res.json() : null;
        setFormData({
          seoRegistrationDate: brokerage?.seoRegistrationDate
            ? new Date(brokerage.seoRegistrationDate).toISOString().split('T')[0]
            : '',
          seoRegistrationNumber: brokerage?.seoRegistrationNumber || '',
        });
      } catch (error) {
        console.error('Error loading brokerage data:', error);
      }
    };

    loadData();
  }, [selectedBrokerageId]);

  // Only the brokerage ERP/SEO fields are editable on this page.
  const handleInputChange = (field: 'seoRegistrationDate' | 'seoRegistrationNumber', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Mutation for updating the brokerage (ERP/SEO fields only).
  const mutation = useMutation({
    mutationFn: async (data: BrokerageFormData) => {
      const response = await fetch(`/api/brokerages/${selectedBrokerageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seoRegistrationDate: data.seoRegistrationDate,
          seoRegistrationNumber: data.seoRegistrationNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save brokerage');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.custom(
        () => (
          <Alert variant="mono" icon="success">
            <AlertIcon>
              <RiCheckboxCircleFill />
            </AlertIcon>
            <AlertTitle>
              {t('form.messages.brokerageUpdated', { defaultValue: 'Brokerage updated successfully' })}
            </AlertTitle>
          </Alert>
        ),
        { position: 'top-center' },
      );

      queryClient.invalidateQueries({ queryKey: ['brokerages-select'] });
    },
    onError: (error: Error) => {
      toast.custom(
        () => (
          <Alert variant="mono" icon="destructive">
            <AlertIcon>
              <RiErrorWarningFill />
            </AlertIcon>
            <AlertTitle>{translateApiError(error.message, t)}</AlertTitle>
          </Alert>
        ),
        { position: 'top-center' },
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const isSubmitting = mutation.status === 'pending';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Brokerage Selection Card — black/white border override (matches company view). */}
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

          {/* Brokerage Domain (SEO) — the only editable section on this page (plain card, like financial-information). */}
          <BrokerageDomainSection
            formData={{
              seoRegistrationDate: formData.seoRegistrationDate,
              seoRegistrationNumber: formData.seoRegistrationNumber,
            }}
            onInputChange={handleInputChange}
            disabled={!isEditMode}
          />

          {/* Form Actions — only updates ERP/SEO fields */}
          <Card>
            <CardHeader>
              <CardTitle>{t('form.sections.operations', { defaultValue: 'Operations' })}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end space-x-4 space-x-reverse">
                <Button type="submit" disabled={isSubmitting || !isEditMode}>
                  <Save className="h-4 w-4" />
                  {isSubmitting
                    ? t('form.actions.processing', { defaultValue: 'Processing...' })
                    : t('form.actions.update', { defaultValue: 'Update' })}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </form>
  );
}
