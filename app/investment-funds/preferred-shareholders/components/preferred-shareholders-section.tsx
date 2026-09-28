'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { PreferredShareholdersFormData } from './preferred-shareholders-form';

interface PreferredShareholdersSectionProps {
  formData: PreferredShareholdersFormData;
  onInputChange: (field: keyof PreferredShareholdersFormData, value: string) => void;
}

export function PreferredShareholdersSection({ formData, onInputChange }: PreferredShareholdersSectionProps) {
  const { t } = useTranslation('investment-funds');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">1</span>
          {t('preferredShareholders.form.sections.preferredShareholders')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="preferredUnitHolderName">
              {t('preferredShareholders.form.fields.preferredUnitHolderName')}
            </Label>
            <Input
              id="preferredUnitHolderName"
              type="text"
              value={formData.preferredUnitHolderName}
              onChange={(e) => onInputChange('preferredUnitHolderName', e.target.value)}
              placeholder={t('preferredShareholders.form.placeholders.preferredUnitHolderName')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredUnitHolderType">
              {t('preferredShareholders.form.fields.preferredUnitHolderType')}
            </Label>
            <Select
              value={formData.preferredUnitHolderType}
              onValueChange={(value) => onInputChange('preferredUnitHolderType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('preferredShareholders.form.placeholders.preferredUnitHolderType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">
                  {t('preferredShareholders.form.options.individual')}
                </SelectItem>
                <SelectItem value="legalEntity">
                  {t('preferredShareholders.form.options.legalEntity')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredUnitOwnershipPercent">
              {t('preferredShareholders.form.fields.preferredUnitOwnershipPercent')}
            </Label>
            <Input
              id="preferredUnitOwnershipPercent"
              type="text"
              value={formData.preferredUnitOwnershipPercent}
              onChange={(e) => onInputChange('preferredUnitOwnershipPercent', e.target.value)}
              placeholder={t('preferredShareholders.form.placeholders.preferredUnitOwnershipPercent')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredUnitsCount">
              {t('preferredShareholders.form.fields.preferredUnitsCount')}
            </Label>
            <Input
              id="preferredUnitsCount"
              type="text"
              value={formData.preferredUnitsCount}
              onChange={(e) => onInputChange('preferredUnitsCount', e.target.value)}
              placeholder={t('preferredShareholders.form.placeholders.preferredUnitsCount')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
