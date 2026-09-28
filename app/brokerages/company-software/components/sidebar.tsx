'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

export function Sidebar() {
  const { t } = useTranslation('brokerages-company-software');

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
              <span className="text-white font-bold text-sm">💻</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {t('sidebar.totalSystems')}
              </p>
              <p className="text-xs text-muted-foreground">10 Systems</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🌐</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {t('sidebar.onlineSystems')}
              </p>
              <p className="text-xs text-muted-foreground">3 Online</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📊</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {t('sidebar.tradingSystems')}
              </p>
              <p className="text-xs text-muted-foreground">4 Trading</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🔧</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {t('sidebar.supportSystems')}
              </p>
              <p className="text-xs text-muted-foreground">3 Support</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-white text-2xl">💻</span>
            </div>
            <p className="text-sm text-foreground font-medium">
              {t('sidebar.softwareProfile')}
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
