'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';

interface CompanyRegistrationSectionProps {
  formData: {
    establishmentDate: string;
    registrationDateCompanies: string;
    registrationNumberCompanies: string;
    registrationPlaceCompanies: string;
    nationalId: string;
    economicCode: string;
  };
}

export function CompanyRegistrationSection({ formData }: CompanyRegistrationSectionProps) {
  const { t } = useTranslation('investment-funds');

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t('generalInformation.form.sections.companyRegistration', { defaultValue: 'Company Registration' })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="establishmentDate">
              {t('generalInformation.form.fields.establishmentDate')}
            </Label>
            <Input id="establishmentDate" type="text" value={formData.establishmentDate} readOnly />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationDateCompanies">
              {t('generalInformation.form.fields.registrationDateCompanies')}
            </Label>
            <Input id="registrationDateCompanies" type="text" value={formData.registrationDateCompanies} readOnly />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationNumberCompanies">
              {t('generalInformation.form.fields.registrationNumberCompanies')}
            </Label>
            <Input id="registrationNumberCompanies" type="text" value={formData.registrationNumberCompanies} readOnly />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationPlaceCompanies">
              {t('generalInformation.form.fields.registrationPlaceCompanies')}
            </Label>
            <Input id="registrationPlaceCompanies" type="text" value={formData.registrationPlaceCompanies} readOnly />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationalId">
              {t('generalInformation.form.fields.nationalId')}
            </Label>
            <Input id="nationalId" type="text" value={formData.nationalId} readOnly />
          </div>

          <div className="space-y-2">
            <Label htmlFor="economicCode">
              {t('generalInformation.form.fields.economicCode')}
            </Label>
            <Input id="economicCode" type="text" value={formData.economicCode} readOnly />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
