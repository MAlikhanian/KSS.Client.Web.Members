'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';

interface ProfessionalInformationSectionProps {
  formData: {
    fundManagerPosition: string;
    fundManagerWorkExperience: string;
  };
  onInputChange: (field: 'fundManagerPosition' | 'fundManagerWorkExperience', value: string) => void;
}

export function ProfessionalInformationSection({ formData, onInputChange }: ProfessionalInformationSectionProps) {
  const { t } = useTranslation('investment-funds');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">2</span>
          {t('fundManager.form.sections.professionalInfo')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fundManagerPosition">
              {t('fundManager.form.fields.fundManagerPosition')}
            </Label>
            <Input
              id="fundManagerPosition"
              type="text"
              value={formData.fundManagerPosition}
              onChange={(e) => onInputChange('fundManagerPosition', e.target.value)}
              placeholder={t('fundManager.form.placeholders.fundManagerPosition')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fundManagerWorkExperience">
              {t('fundManager.form.fields.fundManagerWorkExperience')}
            </Label>
            <Input
              id="fundManagerWorkExperience"
              type="text"
              value={formData.fundManagerWorkExperience}
              onChange={(e) => onInputChange('fundManagerWorkExperience', e.target.value)}
              placeholder={t('fundManager.form.placeholders.fundManagerWorkExperience')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
