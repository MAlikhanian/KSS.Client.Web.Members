'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePickerComponent } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/useTranslation';
import { ManagersStaffFormData } from './managers-staff-form';

interface DependentsSectionProps {
  formData: ManagersStaffFormData;
  onInputChange: (field: keyof ManagersStaffFormData, value: string) => void;
}

export function DependentsSection({ formData, onInputChange }: DependentsSectionProps) {
  const { t } = useTranslation('investment-funds');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">2</span>
          {t('managersStaff.form.sections.dependents')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dependentFullName">
              {t('managersStaff.form.fields.dependentFullName')}
            </Label>
            <Input
              id="dependentFullName"
              type="text"
              value={formData.dependentFullName}
              onChange={(e) => onInputChange('dependentFullName', e.target.value)}
              placeholder={t('managersStaff.form.placeholders.dependentFullName')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dependentFatherName">
              {t('managersStaff.form.fields.dependentFatherName')}
            </Label>
            <Input
              id="dependentFatherName"
              type="text"
              value={formData.dependentFatherName}
              onChange={(e) => onInputChange('dependentFatherName', e.target.value)}
              placeholder={t('managersStaff.form.placeholders.dependentFatherName')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dependentDateOfBirth">
              {t('managersStaff.form.fields.dependentDateOfBirth')}
            </Label>
            <DatePickerComponent
              value={formData.dependentDateOfBirth}
              onChange={(value) => onInputChange('dependentDateOfBirth', value)}
              placeholder={t('managersStaff.form.placeholders.dependentDateOfBirth')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dependentNationalId">
              {t('managersStaff.form.fields.dependentNationalId')}
            </Label>
            <Input
              id="dependentNationalId"
              type="text"
              value={formData.dependentNationalId}
              onChange={(e) => onInputChange('dependentNationalId', e.target.value)}
              placeholder={t('managersStaff.form.placeholders.dependentNationalId')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dependentPostalCode">
              {t('managersStaff.form.fields.dependentPostalCode')}
            </Label>
            <Input
              id="dependentPostalCode"
              type="text"
              value={formData.dependentPostalCode}
              onChange={(e) => onInputChange('dependentPostalCode', e.target.value)}
              placeholder={t('managersStaff.form.placeholders.dependentPostalCode')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dependentPhone">
              {t('managersStaff.form.fields.dependentPhone')}
            </Label>
            <Input
              id="dependentPhone"
              type="text"
              value={formData.dependentPhone}
              onChange={(e) => onInputChange('dependentPhone', e.target.value)}
              placeholder={t('managersStaff.form.placeholders.dependentPhone')}
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="dependentHomeAddress">
              {t('managersStaff.form.fields.dependentHomeAddress')}
            </Label>
            <Textarea
              id="dependentHomeAddress"
              value={formData.dependentHomeAddress}
              onChange={(e) => onInputChange('dependentHomeAddress', e.target.value)}
              placeholder={t('managersStaff.form.placeholders.dependentHomeAddress')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
