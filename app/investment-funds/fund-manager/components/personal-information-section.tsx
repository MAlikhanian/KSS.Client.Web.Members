'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';

interface PersonalInformationSectionProps {
  formData: {
    fundManagerName: string;
    fundManagerGender: string;
    fundManagerYearOfBirth: string;
    fundManagerNationalId: string;
  };
  onInputChange: (field: 'fundManagerName' | 'fundManagerGender' | 'fundManagerYearOfBirth' | 'fundManagerNationalId', value: string) => void;
}

export function PersonalInformationSection({ formData, onInputChange }: PersonalInformationSectionProps) {
  const { t } = useTranslation('investment-funds');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">1</span>
          {t('fundManager.form.sections.personalInfo')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fundManagerName">
              {t('fundManager.form.fields.fundManagerName')}
            </Label>
            <Input
              id="fundManagerName"
              type="text"
              value={formData.fundManagerName}
              onChange={(e) => onInputChange('fundManagerName', e.target.value)}
              placeholder={t('fundManager.form.placeholders.fundManagerName')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fundManagerGender">
              {t('fundManager.form.fields.fundManagerGender')}
            </Label>
            <Select value={formData.fundManagerGender} onValueChange={(value) => onInputChange('fundManagerGender', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('fundManager.form.placeholders.fundManagerGender')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t('fundManager.form.options.male')}</SelectItem>
                <SelectItem value="female">{t('fundManager.form.options.female')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fundManagerYearOfBirth">
              {t('fundManager.form.fields.fundManagerYearOfBirth')}
            </Label>
            <Input
              id="fundManagerYearOfBirth"
              type="number"
              value={formData.fundManagerYearOfBirth}
              onChange={(e) => onInputChange('fundManagerYearOfBirth', e.target.value)}
              placeholder={t('fundManager.form.placeholders.fundManagerYearOfBirth')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fundManagerNationalId">
              {t('fundManager.form.fields.fundManagerNationalId')}
            </Label>
            <Input
              id="fundManagerNationalId"
              type="text"
              value={formData.fundManagerNationalId}
              onChange={(e) => onInputChange('fundManagerNationalId', e.target.value)}
              placeholder={t('fundManager.form.placeholders.fundManagerNationalId')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
