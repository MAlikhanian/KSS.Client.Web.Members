'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';

interface PersonalInformationSectionProps {
  formData: {
    trusteeName: string;
    trusteeGender: string;
    trusteeYearOfBirth: string;
    trusteeNationalId: string;
  };
  onInputChange: (field: 'trusteeName' | 'trusteeGender' | 'trusteeYearOfBirth' | 'trusteeNationalId', value: string) => void;
}

export function PersonalInformationSection({ formData, onInputChange }: PersonalInformationSectionProps) {
  const { t } = useTranslation('investment-funds');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">1</span>
          {t('trustee.form.sections.personalInfo')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trusteeName">
              {t('trustee.form.fields.trusteeName')}
            </Label>
            <Input
              id="trusteeName"
              type="text"
              value={formData.trusteeName}
              onChange={(e) => onInputChange('trusteeName', e.target.value)}
              placeholder={t('trustee.form.placeholders.trusteeName')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trusteeGender">
              {t('trustee.form.fields.trusteeGender')}
            </Label>
            <Select value={formData.trusteeGender} onValueChange={(value) => onInputChange('trusteeGender', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('trustee.form.placeholders.trusteeGender')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t('trustee.form.options.male')}</SelectItem>
                <SelectItem value="female">{t('trustee.form.options.female')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trusteeYearOfBirth">
              {t('trustee.form.fields.trusteeYearOfBirth')}
            </Label>
            <Input
              id="trusteeYearOfBirth"
              type="number"
              value={formData.trusteeYearOfBirth}
              onChange={(e) => onInputChange('trusteeYearOfBirth', e.target.value)}
              placeholder={t('trustee.form.placeholders.trusteeYearOfBirth')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trusteeNationalId">
              {t('trustee.form.fields.trusteeNationalId')}
            </Label>
            <Input
              id="trusteeNationalId"
              type="text"
              value={formData.trusteeNationalId}
              onChange={(e) => onInputChange('trusteeNationalId', e.target.value)}
              placeholder={t('trustee.form.placeholders.trusteeNationalId')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
