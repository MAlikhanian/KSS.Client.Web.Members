'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

export function Sidebar() {
  const { t } = useTranslation('brokerages-financial-info');

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t('sidebar.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">💰</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {t('sidebar.capitalStatus')}
              </p>
              <p className="text-xs text-muted-foreground">Registered</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📊</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {t('sidebar.financialHealth')}
              </p>
              <p className="text-xs text-muted-foreground">Good Standing</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📈</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {t('sidebar.lastUpdated')}
              </p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-white text-2xl">💼</span>
            </div>
            <p className="text-sm text-foreground font-medium">
              {t('sidebar.financialProfile')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('sidebar.profileDescription')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
