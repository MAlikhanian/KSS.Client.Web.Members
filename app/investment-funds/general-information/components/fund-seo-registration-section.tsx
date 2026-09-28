'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePickerComponent } from '@/components/ui/date-picker';
import { useTranslation } from '@/hooks/useTranslation';

interface FundSeoRegistrationSectionProps {
  formData: {
    endOfActivityPeriodSeo: string;
    registrationDateSeo: string;
    registrationNumberSeo: string;
  };
  onInputChange: (
    field: 'endOfActivityPeriodSeo' | 'registrationDateSeo' | 'registrationNumberSeo',
    value: string,
  ) => void;
  disabled?: boolean;
}

export function FundSeoRegistrationSection({
  formData,
  onInputChange,
  disabled = false,
}: FundSeoRegistrationSectionProps) {
  const { t } = useTranslation('investment-funds');

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t('generalInformation.form.sections.fundSeoRegistration', { defaultValue: 'Fund SEO Registration' })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="endOfActivityPeriodSeo">
              {t('generalInformation.form.fields.endOfActivityPeriodSeo')}
            </Label>
            {disabled ? (
              <Input id="endOfActivityPeriodSeo" type="text" value={formData.endOfActivityPeriodSeo} readOnly />
            ) : (
              <DatePickerComponent
                value={formData.endOfActivityPeriodSeo}
                onChange={(value) => onInputChange('endOfActivityPeriodSeo', value)}
                placeholder={t('generalInformation.form.placeholders.endOfActivityPeriodSeo', { defaultValue: 'Select end of activity period' })}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationDateSeo">
              {t('generalInformation.form.fields.registrationDateSeo')}
            </Label>
            {disabled ? (
              <Input id="registrationDateSeo" type="text" value={formData.registrationDateSeo} readOnly />
            ) : (
              <DatePickerComponent
                value={formData.registrationDateSeo}
                onChange={(value) => onInputChange('registrationDateSeo', value)}
                placeholder={t('generalInformation.form.placeholders.registrationDateSeo', { defaultValue: 'Select registration date (SEO)' })}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationNumberSeo">
              {t('generalInformation.form.fields.registrationNumberSeo')}
            </Label>
            <Input
              id="registrationNumberSeo"
              type="text"
              value={formData.registrationNumberSeo}
              onChange={(e) => onInputChange('registrationNumberSeo', e.target.value)}
              placeholder={t('generalInformation.form.placeholders.registrationNumberSeo')}
              readOnly={disabled}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
