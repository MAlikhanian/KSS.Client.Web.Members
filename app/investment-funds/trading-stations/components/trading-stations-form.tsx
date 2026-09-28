'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { TradingStationsSection } from './trading-stations-section';
import { FundSelectionCard, useFundContext } from '../../components';

export interface TradingStationsFormData {
  officeType: string;
  activityType: string;
  traderName: string;
  province: string;
  city: string;
  address: string;
  phone: string;
}

export function TradingStationsForm() {
  const { t } = useTranslation('investment-funds');
  const { selectedFundId, setSelectedFundId, isEditMode, clearSelection } = useFundContext();
  
  const [formData, setFormData] = useState<TradingStationsFormData>({
    officeType: '',
    activityType: '',
    traderName: '',
    province: '',
    city: '',
    address: '',
    phone: '',
  });

  const handleInputChange = (field: keyof TradingStationsFormData, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Clear city when province changes
      if (field === 'province') {
        updated.city = '';
      }
      
      return updated;
    });
  };

  const handleSave = () => {
    console.log('Saving trading stations data:', formData);
    // TODO: Implement save functionality
  };

  const handleSubmit = () => {
    console.log('Submitting trading stations data:', formData);
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
            {t('tradingStations.form.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('tradingStations.toolbar.description')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave}>
            {t('tradingStations.toolbar.saveDraft')}
          </Button>
          <Button onClick={handleSubmit}>
            {t('tradingStations.toolbar.submit')}
          </Button>
        </div>
      </div>

      <TradingStationsSection 
        formData={formData}
        onInputChange={handleInputChange}
      />
    </div>
  );
}
