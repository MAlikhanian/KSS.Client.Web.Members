'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';

interface GeneralInformationSectionProps {
  formData: {
    persianName: string;
    latinName: string;
  };
  onInputChange: (field: 'persianName' | 'latinName', value: string) => void;
  disabled?: boolean;
}

export function GeneralInformationSection({ formData, onInputChange, disabled = false }: GeneralInformationSectionProps) {
  const { t } = useTranslation('investment-funds');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">1</span>
          {t('generalInformation.form.sections.generalInfo')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="persianName">
              {t('generalInformation.form.fields.persianName')}
            </Label>
            <Input
              id="persianName"
              type="text"
              value={formData.persianName}
              onChange={(e) => onInputChange('persianName', e.target.value)}
              placeholder={t('generalInformation.form.placeholders.persianName')}
              readOnly={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="latinName">
              {t('generalInformation.form.fields.latinName')}
            </Label>
            <Input
              id="latinName"
              type="text"
              value={formData.latinName}
              onChange={(e) => onInputChange('latinName', e.target.value)}
              placeholder={t('generalInformation.form.placeholders.latinName')}
              readOnly={disabled}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
