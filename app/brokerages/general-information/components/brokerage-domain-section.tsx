'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePickerComponent } from '@/components/ui/date-picker';
import { useTranslation } from '@/hooks/useTranslation';

interface BrokerageDomainSectionProps {
  formData: {
    seoRegistrationDate: string;
    seoRegistrationNumber: string;
  };
  onInputChange: (field: 'seoRegistrationDate' | 'seoRegistrationNumber', value: string) => void;
  disabled?: boolean;
  /** When true, render only the fields (no Card/header) — the parent supplies the
   *  collapsible card + title, so this avoids a doubled card and redundant title. */
  hideHeader?: boolean;
}

export function BrokerageDomainSection({ formData, onInputChange, disabled = false, hideHeader = false }: BrokerageDomainSectionProps) {
  const { t } = useTranslation('brokerages-general-info');

  const fields = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="seoRegistrationDate">
              {t('form.fields.seoRegistrationDate')} <span className="text-destructive">*</span>
            </Label>
            <DatePickerComponent
              value={formData.seoRegistrationDate}
              onChange={(value) => onInputChange('seoRegistrationDate', value)}
              placeholder={t('form.placeholders.seoRegistrationDate', { defaultValue: 'Select SEO registration date' })}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoRegistrationNumber">
              {t('form.fields.seoRegistrationNumber')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="seoRegistrationNumber"
              type="text"
              value={formData.seoRegistrationNumber}
              onChange={(e) => onInputChange('seoRegistrationNumber', e.target.value)}
              placeholder={t('form.placeholders.seoRegistrationNumber')}
              disabled={disabled}
            />
          </div>
    </div>
  );

  if (hideHeader) return fields;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">1</span>
          {t('form.sections.brokerageDomain', { defaultValue: 'Brokerage Specialized Information' })}
        </CardTitle>
      </CardHeader>
      <CardContent>{fields}</CardContent>
    </Card>
  );
}
