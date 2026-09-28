'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/useTranslation';

interface ContactAddressSectionProps {
  formData: {
    headOfficeAddress: string;
    headOfficePostalCode: string;
    poBox: string;
    website: string;
    email: string;
  };
  onInputChange: (field: 'headOfficeAddress' | 'headOfficePostalCode' | 'poBox' | 'website' | 'email', value: string) => void;
  disabled?: boolean;
}

export function ContactAddressSection({ formData, onInputChange, disabled = false }: ContactAddressSectionProps) {
  const { t } = useTranslation('investment-funds');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">4</span>
          {t('generalInformation.form.sections.contactAddress')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="headOfficeAddress">
              {t('generalInformation.form.fields.headOfficeAddress')}
            </Label>
            <Textarea
              id="headOfficeAddress"
              value={formData.headOfficeAddress}
              onChange={(e) => onInputChange('headOfficeAddress', e.target.value)}
              placeholder={t('generalInformation.form.placeholders.headOfficeAddress')}
              rows={3}
              readOnly={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="headOfficePostalCode">
              {t('generalInformation.form.fields.headOfficePostalCode')}
            </Label>
            <Input
              id="headOfficePostalCode"
              type="text"
              value={formData.headOfficePostalCode}
              onChange={(e) => onInputChange('headOfficePostalCode', e.target.value)}
              placeholder={t('generalInformation.form.placeholders.headOfficePostalCode')}
              readOnly={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="poBox">
              {t('generalInformation.form.fields.poBox')}
            </Label>
            <Input
              id="poBox"
              type="text"
              value={formData.poBox}
              onChange={(e) => onInputChange('poBox', e.target.value)}
              placeholder={t('generalInformation.form.placeholders.poBox')}
              readOnly={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">
              {t('generalInformation.form.fields.website')}
            </Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => onInputChange('website', e.target.value)}
              placeholder={t('generalInformation.form.placeholders.website')}
              readOnly={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              {t('generalInformation.form.fields.email')}
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              placeholder={t('generalInformation.form.placeholders.email')}
              readOnly={disabled}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
