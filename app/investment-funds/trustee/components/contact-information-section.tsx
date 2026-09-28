'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';

interface ContactInformationSectionProps {
  formData: {
    trusteeMobile: string;
    trusteeEmail: string;
  };
  onInputChange: (field: 'trusteeMobile' | 'trusteeEmail', value: string) => void;
}

export function ContactInformationSection({ formData, onInputChange }: ContactInformationSectionProps) {
  const { t } = useTranslation('investment-funds');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">3</span>
          {t('trustee.form.sections.contactInfo')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trusteeMobile">
              {t('trustee.form.fields.trusteeMobile')}
            </Label>
            <Input
              id="trusteeMobile"
              type="tel"
              value={formData.trusteeMobile}
              onChange={(e) => onInputChange('trusteeMobile', e.target.value)}
              placeholder={t('trustee.form.placeholders.trusteeMobile')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trusteeEmail">
              {t('trustee.form.fields.trusteeEmail')}
            </Label>
            <Input
              id="trusteeEmail"
              type="email"
              value={formData.trusteeEmail}
              onChange={(e) => onInputChange('trusteeEmail', e.target.value)}
              placeholder={t('trustee.form.placeholders.trusteeEmail')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
