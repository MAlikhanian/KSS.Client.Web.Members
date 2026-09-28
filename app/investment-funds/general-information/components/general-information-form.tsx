'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RiCheckboxCircleFill, RiErrorWarningFill, RiInformationFill } from '@remixicon/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useTranslation } from '@/hooks/useTranslation';
import { translateApiError } from '@/lib/format-utils';
import { GeneralInformationSection } from './general-information-section';
import { InvestmentUnitsSection } from './investment-units-section';
import { CompanyRegistrationSection } from './company-registration-section';
import { FundSeoRegistrationSection } from './fund-seo-registration-section';
import { ContactAddressSection } from './contact-address-section';
import { FundOrgansSection } from './fund-organs-section';
import { FinancialInformationSection } from './financial-information-section';
import { FundSelectionCard, useFundContext } from '../../components';

interface GeneralInformationFormData {
  // General Information (Company)
  persianName: string;
  latinName: string;

  // Investment Units (Fund)
  preferredUnitsCount: string;
  ordinaryUnitsInvestors: string;
  ordinaryUnitsSeo: string;

  // Registration & Legal (mixed)
  establishmentDate: string;          // Company.RegistrationDate
  endOfActivityPeriodSeo: string;     // Fund
  registrationDateCompanies: string;  // Company
  registrationNumberCompanies: string;// Company
  registrationPlaceCompanies: string; // Company (city name)
  registrationDateSeo: string;        // Fund
  registrationNumberSeo: string;      // Fund
  nationalId: string;                 // Company
  economicCode: string;               // Company

  // Contact & Address (Company)
  headOfficeAddress: string;
  headOfficePostalCode: string;
  poBox: string;
  website: string;
  email: string;

  // Financial (Fund)
  fiscalYear: string;
}

interface TranslationEntry {
  languageId: number;
  name: string;
}

interface AddressItem {
  isPrimary?: boolean;
  street1?: string;
  street2?: string | null;
  postalCode?: string;
}

interface EmailItem {
  isPrimary?: boolean;
  emailAddress?: string;
}

const emptyFormData: GeneralInformationFormData = {
  persianName: '',
  latinName: '',
  preferredUnitsCount: '',
  ordinaryUnitsInvestors: '',
  ordinaryUnitsSeo: '',
  establishmentDate: '',
  endOfActivityPeriodSeo: '',
  registrationDateCompanies: '',
  registrationNumberCompanies: '',
  registrationPlaceCompanies: '',
  registrationDateSeo: '',
  registrationNumberSeo: '',
  nationalId: '',
  economicCode: '',
  headOfficeAddress: '',
  headOfficePostalCode: '',
  poBox: '',
  website: '',
  email: '',
  fiscalYear: '',
};

function pickName(translations: TranslationEntry[] | undefined, languageId: number): string {
  if (!translations || translations.length === 0) return '';
  return translations.find((t) => t.languageId === languageId)?.name || '';
}

function dateOnly(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Date(iso).toISOString().split('T')[0];
}

export function GeneralInformationForm() {
  const { t } = useTranslation('investment-funds');
  const queryClient = useQueryClient();
  const { selectedFundId, setSelectedFundId, isEditMode, clearSelection } = useFundContext();
  const [formData, setFormData] = useState<GeneralInformationFormData>(emptyFormData);
  // The Fund row id — needed for PUT /api/funds payload.
  const [loadedFundId, setLoadedFundId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!selectedFundId) {
        setFormData(emptyFormData);
        setLoadedFundId(null);
        return;
      }

      try {
        // selectedFundId is the Company.Id (matches the brokerage pattern).
        const [companyRes, fundRes] = await Promise.all([
          fetch(`/api/company/${selectedFundId}/read-view`),
          fetch(`/api/funds/by-company/${selectedFundId}`),
        ]);

        const fund = fundRes.ok ? await fundRes.json() : null;
        const company = companyRes.ok ? await companyRes.json() : null;
        setLoadedFundId(fund?.id ?? null);

        const primaryAddress: AddressItem | undefined = (company?.addresses || []).find(
          (a: AddressItem) => a.isPrimary,
        ) || (company?.addresses || [])[0];
        const primaryEmail: EmailItem | undefined = (company?.emails || []).find(
          (e: EmailItem) => e.isPrimary,
        ) || (company?.emails || [])[0];

        // For investment-funds the page-language is Persian (12); fall back to English (10).
        const persianName = pickName(company?.nameHistory?.find((h: { isCurrent?: boolean; translations: TranslationEntry[] }) => h.isCurrent)?.translations, 12)
          || company?.companyPersianName
          || '';
        const latinName = pickName(company?.nameHistory?.find((h: { isCurrent?: boolean; translations: TranslationEntry[] }) => h.isCurrent)?.translations, 10)
          || company?.companyLatinName
          || '';

        setFormData({
          persianName,
          latinName,
          preferredUnitsCount: fund?.preferredUnitsCount?.toString() || '',
          ordinaryUnitsInvestors: fund?.ordinaryUnitsInvestors?.toString() || '',
          ordinaryUnitsSeo: fund?.ordinaryUnitsSeo?.toString() || '',
          establishmentDate: dateOnly(company?.registrationDate),
          endOfActivityPeriodSeo: dateOnly(fund?.endOfActivityPeriodSeo),
          registrationDateCompanies: dateOnly(company?.registrationDate),
          registrationNumberCompanies: company?.registrationNumber || '',
          registrationPlaceCompanies: company?.registrationCity?.name || '',
          registrationDateSeo: dateOnly(fund?.registrationDateSeo),
          registrationNumberSeo: fund?.registrationNumberSeo || '',
          nationalId: company?.nationalId || '',
          economicCode: company?.economicCode || '',
          headOfficeAddress: [primaryAddress?.street1, primaryAddress?.street2].filter(Boolean).join(' — '),
          headOfficePostalCode: primaryAddress?.postalCode || '',
          poBox: '',
          website: company?.website || '',
          email: primaryEmail?.emailAddress || '',
          fiscalYear: fund?.fiscalYear || '',
        });
      } catch (err) {
        console.error('Error loading fund data:', err);
        setFormData(emptyFormData);
        setLoadedFundId(null);
      }
    };

    load();
  }, [selectedFundId]);

  const handleInputChange = (field: keyof GeneralInformationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // PUT only Fund-domain fields. Never any Company columns.
  const mutation = useMutation({
    mutationFn: async (data: GeneralInformationFormData) => {
      if (!loadedFundId) throw new Error('No fund loaded.');
      const response = await fetch(`/api/funds`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: loadedFundId,
          preferredUnitsCount: data.preferredUnitsCount === '' ? null : Number(data.preferredUnitsCount),
          ordinaryUnitsInvestors: data.ordinaryUnitsInvestors === '' ? null : Number(data.ordinaryUnitsInvestors),
          ordinaryUnitsSeo: data.ordinaryUnitsSeo === '' ? null : Number(data.ordinaryUnitsSeo),
          fiscalYear: data.fiscalYear || null,
          endOfActivityPeriodSeo: data.endOfActivityPeriodSeo || null,
          registrationDateSeo: data.registrationDateSeo || null,
          registrationNumberSeo: data.registrationNumberSeo || null,
        }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to save fund');
      }
      return response.json();
    },
    onSuccess: () => {
      toast.custom(
        () => (
          <Alert variant="mono" icon="success">
            <AlertIcon><RiCheckboxCircleFill /></AlertIcon>
            <AlertTitle>
              {t('generalInformation.form.messages.fundUpdated', { defaultValue: 'Fund updated successfully' })}
            </AlertTitle>
          </Alert>
        ),
        { position: 'top-center' },
      );
      queryClient.invalidateQueries({ queryKey: ['investment-funds-select'] });
    },
    onError: (error: Error) => {
      toast.custom(
        () => (
          <Alert variant="mono" icon="destructive">
            <AlertIcon><RiErrorWarningFill /></AlertIcon>
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
      <FundSelectionCard
        value={selectedFundId}
        onValueChange={setSelectedFundId}
        isEditMode={isEditMode}
        onNewFund={clearSelection}
      />

      {isEditMode && (
        <Alert variant="mono" icon="primary">
          <AlertIcon><RiInformationFill /></AlertIcon>
          <AlertTitle>
            {t('generalInformation.form.alerts.companyFieldsReadOnly.title', {
              defaultValue: 'Company fields are read-only on this page',
            })}
          </AlertTitle>
          <AlertDescription>
            {t('generalInformation.form.alerts.companyFieldsReadOnly.description', {
              defaultValue: 'To edit company information (name, registration, contacts, addresses) go to ',
            })}
            <Link href="/company/information" className="underline font-medium">
              {t('generalInformation.form.alerts.companyFieldsReadOnly.link', {
                defaultValue: 'Company → Information',
              })}
            </Link>
            {t('generalInformation.form.alerts.companyFieldsReadOnly.suffix', { defaultValue: '.' })}
          </AlertDescription>
        </Alert>
      )}

      {/* ───── Company block (read-only) ───── */}
      <h2 className="text-base font-semibold text-muted-foreground pt-2">
        {t('generalInformation.form.groups.companyInfo', { defaultValue: 'Company Information (read-only)' })}
      </h2>

      <GeneralInformationSection
        formData={{
          persianName: formData.persianName,
          latinName: formData.latinName,
        }}
        onInputChange={handleInputChange}
        disabled
      />

      <CompanyRegistrationSection
        formData={{
          establishmentDate: formData.establishmentDate,
          registrationDateCompanies: formData.registrationDateCompanies,
          registrationNumberCompanies: formData.registrationNumberCompanies,
          registrationPlaceCompanies: formData.registrationPlaceCompanies,
          nationalId: formData.nationalId,
          economicCode: formData.economicCode,
        }}
      />

      <ContactAddressSection
        formData={{
          headOfficeAddress: formData.headOfficeAddress,
          headOfficePostalCode: formData.headOfficePostalCode,
          poBox: formData.poBox,
          website: formData.website,
          email: formData.email,
        }}
        onInputChange={(field, value) => handleInputChange(field as keyof GeneralInformationFormData, value)}
        disabled
      />

      {/* ───── Fund block (editable) ───── */}
      <h2 className="text-base font-semibold text-muted-foreground pt-4">
        {t('generalInformation.form.groups.fundInfo', { defaultValue: 'Fund Information' })}
      </h2>

      <InvestmentUnitsSection
        formData={{
          preferredUnitsCount: formData.preferredUnitsCount,
          ordinaryUnitsInvestors: formData.ordinaryUnitsInvestors,
          ordinaryUnitsSeo: formData.ordinaryUnitsSeo,
        }}
        onInputChange={handleInputChange}
        disabled={!isEditMode}
      />

      <FundSeoRegistrationSection
        formData={{
          endOfActivityPeriodSeo: formData.endOfActivityPeriodSeo,
          registrationDateSeo: formData.registrationDateSeo,
          registrationNumberSeo: formData.registrationNumberSeo,
        }}
        onInputChange={handleInputChange}
        disabled={!isEditMode}
      />

      <FinancialInformationSection
        formData={{
          fiscalYear: formData.fiscalYear,
        }}
        onInputChange={handleInputChange}
        disabled={!isEditMode}
      />

      <FundOrgansSection fundId={loadedFundId} />

      <Card>
        <CardHeader>
          <CardTitle>{t('generalInformation.form.sections.operations', { defaultValue: 'Operations' })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end space-x-4 space-x-reverse">
            <Button type="submit" disabled={isSubmitting || !isEditMode || !loadedFundId}>
              {isSubmitting
                ? t('generalInformation.form.actions.processing', { defaultValue: 'Processing...' })
                : t('generalInformation.form.actions.save')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
