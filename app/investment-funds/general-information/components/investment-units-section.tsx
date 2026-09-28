'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';

interface InvestmentUnitsSectionProps {
  formData: {
    preferredUnitsCount: string;
    ordinaryUnitsInvestors: string;
    ordinaryUnitsSeo: string;
  };
  onInputChange: (field: 'preferredUnitsCount' | 'ordinaryUnitsInvestors' | 'ordinaryUnitsSeo', value: string) => void;
  disabled?: boolean;
}

export function InvestmentUnitsSection({ formData, onInputChange, disabled = false }: InvestmentUnitsSectionProps) {
  const { t } = useTranslation('investment-funds');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">2</span>
          {t('generalInformation.form.sections.investmentUnits')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="preferredUnitsCount">
              {t('generalInformation.form.fields.preferredUnitsCount')}
            </Label>
            <Input
              id="preferredUnitsCount"
              type="text"
              value={formData.preferredUnitsCount}
              onChange={(e) => onInputChange('preferredUnitsCount', e.target.value)}
              placeholder={t('generalInformation.form.placeholders.preferredUnitsCount')}
              readOnly={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ordinaryUnitsInvestors">
              {t('generalInformation.form.fields.ordinaryUnitsInvestors')}
            </Label>
            <Input
              id="ordinaryUnitsInvestors"
              type="text"
              value={formData.ordinaryUnitsInvestors}
              onChange={(e) => onInputChange('ordinaryUnitsInvestors', e.target.value)}
              placeholder={t('generalInformation.form.placeholders.ordinaryUnitsInvestors')}
              readOnly={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ordinaryUnitsSeo">
              {t('generalInformation.form.fields.ordinaryUnitsSeo')}
            </Label>
            <Input
              id="ordinaryUnitsSeo"
              type="text"
              value={formData.ordinaryUnitsSeo}
              onChange={(e) => onInputChange('ordinaryUnitsSeo', e.target.value)}
              placeholder={t('generalInformation.form.placeholders.ordinaryUnitsSeo')}
              readOnly={disabled}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
