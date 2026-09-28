'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/useTranslation';

interface EducationCertificatesSectionProps {
  formData: {
    fundManagerEducationDegree: string;
    fundManagerFieldOfStudy: string;
    fundManagerProfessionalCertificates: string;
  };
  onInputChange: (field: 'fundManagerEducationDegree' | 'fundManagerFieldOfStudy' | 'fundManagerProfessionalCertificates', value: string) => void;
}

export function EducationCertificatesSection({ formData, onInputChange }: EducationCertificatesSectionProps) {
  const { t } = useTranslation('investment-funds');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">4</span>
          {t('fundManager.form.sections.educationCertificates')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fundManagerEducationDegree">
              {t('fundManager.form.fields.fundManagerEducationDegree')}
            </Label>
            <Input
              id="fundManagerEducationDegree"
              type="text"
              value={formData.fundManagerEducationDegree}
              onChange={(e) => onInputChange('fundManagerEducationDegree', e.target.value)}
              placeholder={t('fundManager.form.placeholders.fundManagerEducationDegree')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fundManagerFieldOfStudy">
              {t('fundManager.form.fields.fundManagerFieldOfStudy')}
            </Label>
            <Input
              id="fundManagerFieldOfStudy"
              type="text"
              value={formData.fundManagerFieldOfStudy}
              onChange={(e) => onInputChange('fundManagerFieldOfStudy', e.target.value)}
              placeholder={t('fundManager.form.placeholders.fundManagerFieldOfStudy')}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="fundManagerProfessionalCertificates">
              {t('fundManager.form.fields.fundManagerProfessionalCertificates')}
            </Label>
            <Textarea
              id="fundManagerProfessionalCertificates"
              value={formData.fundManagerProfessionalCertificates}
              onChange={(e) => onInputChange('fundManagerProfessionalCertificates', e.target.value)}
              placeholder={t('fundManager.form.placeholders.fundManagerProfessionalCertificates')}
              rows={3}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
