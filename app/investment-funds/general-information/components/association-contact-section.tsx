'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';

interface AssociationContactSectionProps {
  formData: {
    associationLiaisonName: string;
    associationLiaisonMobile: string;
  };
  onInputChange: (field: 'associationLiaisonName' | 'associationLiaisonMobile', value: string) => void;
}

export function AssociationContactSection({ formData, onInputChange }: AssociationContactSectionProps) {
  const { t } = useTranslation('investment-funds');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">6</span>
          {t('generalInformation.form.sections.associationContact')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="associationLiaisonName">
              {t('generalInformation.form.fields.associationLiaisonName')}
            </Label>
            <Input
              id="associationLiaisonName"
              type="text"
              value={formData.associationLiaisonName}
              onChange={(e) => onInputChange('associationLiaisonName', e.target.value)}
              placeholder={t('generalInformation.form.placeholders.associationLiaisonName')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="associationLiaisonMobile">
              {t('generalInformation.form.fields.associationLiaisonMobile')}
            </Label>
            <Input
              id="associationLiaisonMobile"
              type="tel"
              value={formData.associationLiaisonMobile}
              onChange={(e) => onInputChange('associationLiaisonMobile', e.target.value)}
              placeholder={t('generalInformation.form.placeholders.associationLiaisonMobile')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
