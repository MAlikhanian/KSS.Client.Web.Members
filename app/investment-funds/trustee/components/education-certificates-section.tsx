'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/useTranslation';

interface EducationCertificatesSectionProps {
  formData: {
    trusteeEducationDegree: string;
    trusteeFieldOfStudy: string;
    trusteeProfessionalCertificates: string;
  };
  onInputChange: (field: 'trusteeEducationDegree' | 'trusteeFieldOfStudy' | 'trusteeProfessionalCertificates', value: string) => void;
}

export function EducationCertificatesSection({ formData, onInputChange }: EducationCertificatesSectionProps) {
  const { t } = useTranslation('investment-funds');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">4</span>
          {t('trustee.form.sections.educationCertificates')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trusteeEducationDegree">
              {t('trustee.form.fields.trusteeEducationDegree')}
            </Label>
            <Input
              id="trusteeEducationDegree"
              type="text"
              value={formData.trusteeEducationDegree}
              onChange={(e) => onInputChange('trusteeEducationDegree', e.target.value)}
              placeholder={t('trustee.form.placeholders.trusteeEducationDegree')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trusteeFieldOfStudy">
              {t('trustee.form.fields.trusteeFieldOfStudy')}
            </Label>
            <Input
              id="trusteeFieldOfStudy"
              type="text"
              value={formData.trusteeFieldOfStudy}
              onChange={(e) => onInputChange('trusteeFieldOfStudy', e.target.value)}
              placeholder={t('trustee.form.placeholders.trusteeFieldOfStudy')}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="trusteeProfessionalCertificates">
              {t('trustee.form.fields.trusteeProfessionalCertificates')}
            </Label>
            <Textarea
              id="trusteeProfessionalCertificates"
              value={formData.trusteeProfessionalCertificates}
              onChange={(e) => onInputChange('trusteeProfessionalCertificates', e.target.value)}
              placeholder={t('trustee.form.placeholders.trusteeProfessionalCertificates')}
              rows={3}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
