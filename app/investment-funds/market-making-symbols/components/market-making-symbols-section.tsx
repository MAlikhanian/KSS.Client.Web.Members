'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerComponent } from '@/components/ui/date-picker';
import { useTranslation } from '@/hooks/useTranslation';
import { MarketMakingSymbolsFormData } from './market-making-symbols-form';

interface MarketMakingSymbolsSectionProps {
  formData: MarketMakingSymbolsFormData;
  onInputChange: (field: keyof MarketMakingSymbolsFormData, value: string) => void;
}

export function MarketMakingSymbolsSection({ formData, onInputChange }: MarketMakingSymbolsSectionProps) {
  const { t } = useTranslation('investment-funds');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">1</span>
          {t('marketMakingSymbols.form.sections.marketMakingSymbols')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="marketMakingCompanyName">
              {t('marketMakingSymbols.form.fields.marketMakingCompanyName')}
            </Label>
            <Input
              id="marketMakingCompanyName"
              type="text"
              value={formData.marketMakingCompanyName}
              onChange={(e) => onInputChange('marketMakingCompanyName', e.target.value)}
              placeholder={t('marketMakingSymbols.form.placeholders.marketMakingCompanyName')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="marketMakingCompanySymbol">
              {t('marketMakingSymbols.form.fields.marketMakingCompanySymbol')}
            </Label>
            <Input
              id="marketMakingCompanySymbol"
              type="text"
              value={formData.marketMakingCompanySymbol}
              onChange={(e) => onInputChange('marketMakingCompanySymbol', e.target.value)}
              placeholder={t('marketMakingSymbols.form.placeholders.marketMakingCompanySymbol')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="market">
              {t('marketMakingSymbols.form.fields.market')}
            </Label>
            <Select
              value={formData.market}
              onValueChange={(value) => onInputChange('market', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('marketMakingSymbols.form.placeholders.market')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tehran">
                  {t('marketMakingSymbols.form.options.tehran')}
                </SelectItem>
                <SelectItem value="otc">
                  {t('marketMakingSymbols.form.options.otc')}
                </SelectItem>
                <SelectItem value="commodity">
                  {t('marketMakingSymbols.form.options.commodity')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tradingBoard">
              {t('marketMakingSymbols.form.fields.tradingBoard')}
            </Label>
            <Select
              value={formData.tradingBoard}
              onValueChange={(value) => onInputChange('tradingBoard', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('marketMakingSymbols.form.placeholders.tradingBoard')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">
                  {t('marketMakingSymbols.form.options.main')}
                </SelectItem>
                <SelectItem value="secondary">
                  {t('marketMakingSymbols.form.options.secondary')}
                </SelectItem>
                <SelectItem value="otc">
                  {t('marketMakingSymbols.form.options.otc')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="symbolLicenseDate">
              {t('marketMakingSymbols.form.fields.symbolLicenseDate')}
            </Label>
            <DatePickerComponent
              value={formData.symbolLicenseDate}
              onChange={(value) => onInputChange('symbolLicenseDate', value)}
              placeholder={t('marketMakingSymbols.form.placeholders.symbolLicenseDate')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minAccumulatedOrder">
              {t('marketMakingSymbols.form.fields.minAccumulatedOrder')}
            </Label>
            <Input
              id="minAccumulatedOrder"
              type="text"
              value={formData.minAccumulatedOrder}
              onChange={(e) => onInputChange('minAccumulatedOrder', e.target.value)}
              placeholder={t('marketMakingSymbols.form.placeholders.minAccumulatedOrder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quoteRange">
              {t('marketMakingSymbols.form.fields.quoteRange')}
            </Label>
            <Input
              id="quoteRange"
              type="text"
              value={formData.quoteRange}
              onChange={(e) => onInputChange('quoteRange', e.target.value)}
              placeholder={t('marketMakingSymbols.form.placeholders.quoteRange')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minDailyTradingVolume">
              {t('marketMakingSymbols.form.fields.minDailyTradingVolume')}
            </Label>
            <Input
              id="minDailyTradingVolume"
              type="text"
              value={formData.minDailyTradingVolume}
              onChange={(e) => onInputChange('minDailyTradingVolume', e.target.value)}
              placeholder={t('marketMakingSymbols.form.placeholders.minDailyTradingVolume')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avgNavLastEsfand">
              {t('marketMakingSymbols.form.fields.avgNavLastEsfand')}
            </Label>
            <Input
              id="avgNavLastEsfand"
              type="text"
              value={formData.avgNavLastEsfand}
              onChange={(e) => onInputChange('avgNavLastEsfand', e.target.value)}
              placeholder={t('marketMakingSymbols.form.placeholders.avgNavLastEsfand')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
