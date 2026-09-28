'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerComponent } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/useTranslation';
import { ManagersStaffFormData } from './managers-staff-form';

interface RelatedPersonsSectionProps {
  formData: ManagersStaffFormData;
  onInputChange: (field: keyof ManagersStaffFormData, value: string) => void;
}

export function RelatedPersonsSection({ formData, onInputChange }: RelatedPersonsSectionProps) {
  const { t } = useTranslation('investment-funds');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">1</span>
          {t('managersStaff.form.sections.relatedPersons')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="personFullName">
              {t('managersStaff.form.fields.personFullName')}
            </Label>
            <Input
              id="personFullName"
              type="text"
              value={formData.personFullName}
              onChange={(e) => onInputChange('personFullName', e.target.value)}
              placeholder={t('managersStaff.form.placeholders.personFullName')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personGender">
              {t('managersStaff.form.fields.personGender')}
            </Label>
            <Select
              value={formData.personGender}
              onValueChange={(value) => onInputChange('personGender', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('managersStaff.form.placeholders.personGender')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">
                  {t('managersStaff.form.options.male')}
                </SelectItem>
                <SelectItem value="female">
                  {t('managersStaff.form.options.female')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="personFatherName">
              {t('managersStaff.form.fields.personFatherName')}
            </Label>
            <Input
              id="personFatherName"
              type="text"
              value={formData.personFatherName}
              onChange={(e) => onInputChange('personFatherName', e.target.value)}
              placeholder={t('managersStaff.form.placeholders.personFatherName')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personDateOfBirth">
              {t('managersStaff.form.fields.personDateOfBirth')}
            </Label>
            <DatePickerComponent
              value={formData.personDateOfBirth}
              onChange={(value) => onInputChange('personDateOfBirth', value)}
              placeholder={t('managersStaff.form.placeholders.personDateOfBirth')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personNationalId">
              {t('managersStaff.form.fields.personNationalId')}
            </Label>
            <Input
              id="personNationalId"
              type="text"
              value={formData.personNationalId}
              onChange={(e) => onInputChange('personNationalId', e.target.value)}
              placeholder={t('managersStaff.form.placeholders.personNationalId')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personWorkCity">
              {t('managersStaff.form.fields.personWorkCity')}
            </Label>
            <Input
              id="personWorkCity"
              type="text"
              value={formData.personWorkCity}
              onChange={(e) => onInputChange('personWorkCity', e.target.value)}
              placeholder={t('managersStaff.form.placeholders.personWorkCity')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personWorkUnit">
              {t('managersStaff.form.fields.personWorkUnit')}
            </Label>
            <Input
              id="personWorkUnit"
              type="text"
              value={formData.personWorkUnit}
              onChange={(e) => onInputChange('personWorkUnit', e.target.value)}
              placeholder={t('managersStaff.form.placeholders.personWorkUnit')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personPosition">
              {t('managersStaff.form.fields.personPosition')}
            </Label>
            <Input
              id="personPosition"
              type="text"
              value={formData.personPosition}
              onChange={(e) => onInputChange('personPosition', e.target.value)}
              placeholder={t('managersStaff.form.placeholders.personPosition')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personAge">
              {t('managersStaff.form.fields.personAge')}
            </Label>
            <Input
              id="personAge"
              type="text"
              value={formData.personAge}
              onChange={(e) => onInputChange('personAge', e.target.value)}
              placeholder={t('managersStaff.form.placeholders.personAge')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employmentStartDate">
              {t('managersStaff.form.fields.employmentStartDate')}
            </Label>
            <DatePickerComponent
              value={formData.employmentStartDate}
              onChange={(value) => onInputChange('employmentStartDate', value)}
              placeholder={t('managersStaff.form.placeholders.employmentStartDate')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personEducationDegree">
              {t('managersStaff.form.fields.personEducationDegree')}
            </Label>
            <Input
              id="personEducationDegree"
              type="text"
              value={formData.personEducationDegree}
              onChange={(e) => onInputChange('personEducationDegree', e.target.value)}
              placeholder={t('managersStaff.form.placeholders.personEducationDegree')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personFieldOfStudy">
              {t('managersStaff.form.fields.personFieldOfStudy')}
            </Label>
            <Input
              id="personFieldOfStudy"
              type="text"
              value={formData.personFieldOfStudy}
              onChange={(e) => onInputChange('personFieldOfStudy', e.target.value)}
              placeholder={t('managersStaff.form.placeholders.personFieldOfStudy')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personProfessionalCertificates">
              {t('managersStaff.form.fields.personProfessionalCertificates')}
            </Label>
            <Textarea
              id="personProfessionalCertificates"
              value={formData.personProfessionalCertificates}
              onChange={(e) => onInputChange('personProfessionalCertificates', e.target.value)}
              placeholder={t('managersStaff.form.placeholders.personProfessionalCertificates')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personHomeAddress">
              {t('managersStaff.form.fields.personHomeAddress')}
            </Label>
            <Textarea
              id="personHomeAddress"
              value={formData.personHomeAddress}
              onChange={(e) => onInputChange('personHomeAddress', e.target.value)}
              placeholder={t('managersStaff.form.placeholders.personHomeAddress')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personPostalCode">
              {t('managersStaff.form.fields.personPostalCode')}
            </Label>
            <Input
              id="personPostalCode"
              type="text"
              value={formData.personPostalCode}
              onChange={(e) => onInputChange('personPostalCode', e.target.value)}
              placeholder={t('managersStaff.form.placeholders.personPostalCode')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personMobile">
              {t('managersStaff.form.fields.personMobile')}
            </Label>
            <Input
              id="personMobile"
              type="text"
              value={formData.personMobile}
              onChange={(e) => onInputChange('personMobile', e.target.value)}
              placeholder={t('managersStaff.form.placeholders.personMobile')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personEmail">
              {t('managersStaff.form.fields.personEmail')}
            </Label>
            <Input
              id="personEmail"
              type="email"
              value={formData.personEmail}
              onChange={(e) => onInputChange('personEmail', e.target.value)}
              placeholder={t('managersStaff.form.placeholders.personEmail')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
