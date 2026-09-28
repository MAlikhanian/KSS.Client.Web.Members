'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';

interface ContactInformationSectionProps {
  formData: {
    fundManagerMobile: string;
    fundManagerEmail: string;
  };
  onInputChange: (field: 'fundManagerMobile' | 'fundManagerEmail', value: string) => void;
}

export function ContactInformationSection({ formData, onInputChange }: ContactInformationSectionProps) {
  const { t } = useTranslation('investment-funds');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">3</span>
          {t('fundManager.form.sections.contactInfo')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fundManagerMobile">
              {t('fundManager.form.fields.fundManagerMobile')}
            </Label>
            <Input
              id="fundManagerMobile"
              type="tel"
              value={formData.fundManagerMobile}
              onChange={(e) => onInputChange('fundManagerMobile', e.target.value)}
              placeholder={t('fundManager.form.placeholders.fundManagerMobile')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fundManagerEmail">
              {t('fundManager.form.fields.fundManagerEmail')}
            </Label>
            <Input
              id="fundManagerEmail"
              type="email"
              value={formData.fundManagerEmail}
              onChange={(e) => onInputChange('fundManagerEmail', e.target.value)}
              placeholder={t('fundManager.form.placeholders.fundManagerEmail')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
