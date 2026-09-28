'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/useTranslation';

interface ContactAddressSectionProps {
  formData: {
    phoneNumber: string;
    faxNumber: string;
    email: string;
    website: string;
    headOfficeAddress: string;
    postalCode: string;
    poBox: string;
  };
  onInputChange: (field: 'phoneNumber' | 'faxNumber' | 'email' | 'website' | 'headOfficeAddress' | 'postalCode' | 'poBox', value: string) => void;
}

export function ContactAddressSection({ formData, onInputChange }: ContactAddressSectionProps) {
  const { t } = useTranslation('brokerages-general-info');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">3</span>
          {t('form.sections.contactInfo')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">
            {t('form.fields.phoneNumber')}
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => onInputChange('phoneNumber', e.target.value)}
            placeholder={t('form.placeholders.phoneNumber')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="faxNumber">
            {t('form.fields.faxNumber')}
          </Label>
          <Input
            id="faxNumber"
            type="tel"
            value={formData.faxNumber}
            onChange={(e) => onInputChange('faxNumber', e.target.value)}
            placeholder={t('form.placeholders.faxNumber')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            {t('form.fields.email')}
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder={t('form.placeholders.email')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">
            {t('form.fields.website')}
          </Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => onInputChange('website', e.target.value)}
            placeholder={t('form.placeholders.website')}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="headOfficeAddress">
            {t('form.fields.headOfficeAddress')}
          </Label>
          <Textarea
            id="headOfficeAddress"
            value={formData.headOfficeAddress}
            onChange={(e) => onInputChange('headOfficeAddress', e.target.value)}
            placeholder={t('form.placeholders.headOfficeAddress')}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCode">
            {t('form.fields.postalCode')}
          </Label>
          <Input
            id="postalCode"
            type="text"
            value={formData.postalCode}
            onChange={(e) => onInputChange('postalCode', e.target.value)}
            placeholder={t('form.placeholders.postalCode')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="poBox">
            {t('form.fields.poBox')}
          </Label>
          <Input
            id="poBox"
            type="text"
            value={formData.poBox}
            onChange={(e) => onInputChange('poBox', e.target.value)}
            placeholder={t('form.placeholders.poBox')}
          />
        </div>
      </div>
      </CardContent>
    </Card>
  );
}
