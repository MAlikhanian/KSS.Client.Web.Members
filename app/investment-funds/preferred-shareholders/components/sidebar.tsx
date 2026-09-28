'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

export function Sidebar() {
  const { t } = useTranslation('investment-funds');

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t('preferredShareholders.sidebar.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="text-white text-2xl">👥</span>
          </div>
          <p className="text-sm text-foreground font-medium">
            {t('preferredShareholders.sidebar.shareholdersProfile')}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t('preferredShareholders.sidebar.profileDescription')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
