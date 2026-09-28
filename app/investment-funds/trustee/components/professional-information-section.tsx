'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';

interface ProfessionalInformationSectionProps {
  formData: {
    trusteePosition: string;
    trusteeWorkExperience: string;
  };
  onInputChange: (field: 'trusteePosition' | 'trusteeWorkExperience', value: string) => void;
}

export function ProfessionalInformationSection({ formData, onInputChange }: ProfessionalInformationSectionProps) {
  const { t } = useTranslation('investment-funds');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">2</span>
          {t('trustee.form.sections.professionalInfo')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trusteePosition">
              {t('trustee.form.fields.trusteePosition')}
            </Label>
            <Input
              id="trusteePosition"
              type="text"
              value={formData.trusteePosition}
              onChange={(e) => onInputChange('trusteePosition', e.target.value)}
              placeholder={t('trustee.form.placeholders.trusteePosition')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trusteeWorkExperience">
              {t('trustee.form.fields.trusteeWorkExperience')}
            </Label>
            <Input
              id="trusteeWorkExperience"
              type="text"
              value={formData.trusteeWorkExperience}
              onChange={(e) => onInputChange('trusteeWorkExperience', e.target.value)}
              placeholder={t('trustee.form.placeholders.trusteeWorkExperience')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
