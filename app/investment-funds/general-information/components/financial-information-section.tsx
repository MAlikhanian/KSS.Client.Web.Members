'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';

interface FinancialInformationSectionProps {
  formData: {
    fiscalYear: string;
  };
  onInputChange: (field: 'fiscalYear', value: string) => void;
  disabled?: boolean;
}

export function FinancialInformationSection({ formData, onInputChange, disabled = false }: FinancialInformationSectionProps) {
  const { t } = useTranslation('investment-funds');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">7</span>
          {t('generalInformation.form.sections.financialInfo')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fiscalYear">
              {t('generalInformation.form.fields.fiscalYear')}
            </Label>
            <Input
              id="fiscalYear"
              type="text"
              value={formData.fiscalYear}
              onChange={(e) => onInputChange('fiscalYear', e.target.value)}
              placeholder={t('generalInformation.form.placeholders.fiscalYear')}
              readOnly={disabled}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
