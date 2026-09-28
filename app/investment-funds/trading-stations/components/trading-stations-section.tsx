'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { LocationSelect } from '@/app/brokerages/components';
import { useTranslation } from '@/hooks/useTranslation';
import { TradingStationsFormData } from './trading-stations-form';

interface TradingStationsSectionProps {
  formData: TradingStationsFormData;
  onInputChange: (field: keyof TradingStationsFormData, value: string) => void;
}

export function TradingStationsSection({ formData, onInputChange }: TradingStationsSectionProps) {
  const { t } = useTranslation('investment-funds');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">1</span>
          {t('tradingStations.form.sections.tradingStations')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="officeType">
              {t('tradingStations.form.fields.officeType')}
            </Label>
            <Select
              value={formData.officeType}
              onValueChange={(value) => onInputChange('officeType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('tradingStations.form.placeholders.officeType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="headOffice">
                  {t('tradingStations.form.options.headOffice')}
                </SelectItem>
                <SelectItem value="branch">
                  {t('tradingStations.form.options.branch')}
                </SelectItem>
                <SelectItem value="representativeOffice">
                  {t('tradingStations.form.options.representativeOffice')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activityType">
              {t('tradingStations.form.fields.activityType')}
            </Label>
            <Select
              value={formData.activityType}
              onValueChange={(value) => onInputChange('activityType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('tradingStations.form.placeholders.activityType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trading">
                  {t('tradingStations.form.options.trading')}
                </SelectItem>
                <SelectItem value="advisory">
                  {t('tradingStations.form.options.advisory')}
                </SelectItem>
                <SelectItem value="both">
                  {t('tradingStations.form.options.both')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="traderName">
              {t('tradingStations.form.fields.traderName')}
            </Label>
            <Input
              id="traderName"
              type="text"
              value={formData.traderName}
              onChange={(e) => onInputChange('traderName', e.target.value)}
              placeholder={t('tradingStations.form.placeholders.traderName')}
            />
          </div>

          <LocationSelect
            type="province"
            value={formData.province}
            onValueChange={(value) => onInputChange('province', value)}
            label={t('tradingStations.form.fields.province')}
            placeholder={t('tradingStations.form.placeholders.province')}
            countryId="IR"
          />

          <LocationSelect
            type="city"
            value={formData.city}
            onValueChange={(value) => onInputChange('city', value)}
            label={t('tradingStations.form.fields.city')}
            placeholder={t('tradingStations.form.placeholders.city')}
            provinceId={formData.province}
          />

          <div className="space-y-2">
            <Label htmlFor="phone">
              {t('tradingStations.form.fields.phone')}
            </Label>
            <Input
              id="phone"
              type="text"
              value={formData.phone}
              onChange={(e) => onInputChange('phone', e.target.value)}
              placeholder={t('tradingStations.form.placeholders.phone')}
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="address">
              {t('tradingStations.form.fields.address')}
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => onInputChange('address', e.target.value)}
              placeholder={t('tradingStations.form.placeholders.address')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
