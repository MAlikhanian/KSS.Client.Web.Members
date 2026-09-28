'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { PreferredShareholdersSection } from './preferred-shareholders-section';
import { FundSelectionCard, useFundContext } from '../../components';

export interface PreferredShareholdersFormData {
  preferredUnitHolderName: string;
  preferredUnitHolderType: string;
  preferredUnitOwnershipPercent: string;
  preferredUnitsCount: string;
}

export function PreferredShareholdersForm() {
  const { t } = useTranslation('investment-funds');
  const { selectedFundId, setSelectedFundId, isEditMode, clearSelection } = useFundContext();
  
  const [formData, setFormData] = useState<PreferredShareholdersFormData>({
    preferredUnitHolderName: '',
    preferredUnitHolderType: '',
    preferredUnitOwnershipPercent: '',
    preferredUnitsCount: '',
  });

  const handleInputChange = (field: keyof PreferredShareholdersFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving preferred shareholders data:', formData);
    // TODO: Implement save functionality
  };

  const handleSubmit = () => {
    console.log('Submitting preferred shareholders data:', formData);
    // TODO: Implement submit functionality
  };

  return (
    <div className="space-y-6">
      {/* Fund Selection Card */}
      <FundSelectionCard
        value={selectedFundId}
        onValueChange={setSelectedFundId}
        isEditMode={isEditMode}
        onNewFund={clearSelection}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('preferredShareholders.form.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('preferredShareholders.toolbar.description')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave}>
            {t('preferredShareholders.toolbar.saveDraft')}
          </Button>
          <Button onClick={handleSubmit}>
            {t('preferredShareholders.toolbar.submit')}
          </Button>
        </div>
      </div>

      <PreferredShareholdersSection 
        formData={formData}
        onInputChange={handleInputChange}
      />
    </div>
  );
}
