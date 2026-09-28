'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { MarketMakingSymbolsSection } from './market-making-symbols-section';
import { FundSelectionCard, useFundContext } from '../../components';

export interface MarketMakingSymbolsFormData {
  marketMakingCompanyName: string;
  marketMakingCompanySymbol: string;
  market: string;
  tradingBoard: string;
  symbolLicenseDate: string;
  minAccumulatedOrder: string;
  quoteRange: string;
  minDailyTradingVolume: string;
  avgNavLastEsfand: string;
}

export function MarketMakingSymbolsForm() {
  const { t } = useTranslation('investment-funds');
  const { selectedFundId, setSelectedFundId, isEditMode, clearSelection } = useFundContext();
  
  const [formData, setFormData] = useState<MarketMakingSymbolsFormData>({
    marketMakingCompanyName: '',
    marketMakingCompanySymbol: '',
    market: '',
    tradingBoard: '',
    symbolLicenseDate: '',
    minAccumulatedOrder: '',
    quoteRange: '',
    minDailyTradingVolume: '',
    avgNavLastEsfand: '',
  });

  const handleInputChange = (field: keyof MarketMakingSymbolsFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving market-making symbols data:', formData);
    // TODO: Implement save functionality
  };

  const handleSubmit = () => {
    console.log('Submitting market-making symbols data:', formData);
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
            {t('marketMakingSymbols.form.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('marketMakingSymbols.toolbar.description')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave}>
            {t('marketMakingSymbols.toolbar.saveDraft')}
          </Button>
          <Button onClick={handleSubmit}>
            {t('marketMakingSymbols.toolbar.submit')}
          </Button>
        </div>
      </div>

      <MarketMakingSymbolsSection 
        formData={formData}
        onInputChange={handleInputChange}
      />
    </div>
  );
}
