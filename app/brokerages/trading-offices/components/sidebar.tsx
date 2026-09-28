'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

interface SidebarProps {
  officesData: {
    totalOffices: number;
    totalEmployees: number;
    uniqueCountries: number;
    uniqueProvinces: number;
    lastUpdated: Date | null;
  };
}

export function Sidebar({ officesData }: SidebarProps) {
  const { t } = useTranslation('brokerages-trading-offices');

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return t('sidebar.notYetUpdated', { defaultValue: 'Not yet updated' });
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'همین الان';
    if (diffMins < 60) return `${diffMins} دقیقه پیش`;
    if (diffHours < 24) return `${diffHours} ساعت پیش`;
    return `${diffDays} روز پیش`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t('sidebar.title', { defaultValue: 'Offices Overview' })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🏢</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {t('sidebar.totalOffices', { defaultValue: 'Total Offices' })}
              </p>
              <p className="text-xs text-muted-foreground">{officesData.totalOffices} {t('sidebar.added', { defaultValue: 'offices' })}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">👥</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {t('sidebar.totalEmployees', { defaultValue: 'Total Employees' })}
              </p>
              <p className="text-xs text-muted-foreground">{officesData.totalEmployees} {t('sidebar.employees', { defaultValue: 'employees' })}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📍</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {t('sidebar.provinces', { defaultValue: 'Provinces' })}
              </p>
              <p className="text-xs text-muted-foreground">{officesData.uniqueProvinces} {t('sidebar.provincesCount', { defaultValue: 'provinces' })}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📈</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {t('sidebar.lastUpdated', { defaultValue: 'Last Updated' })}
              </p>
              <p className="text-xs text-muted-foreground">{formatLastUpdated(officesData.lastUpdated)}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-white text-2xl">🏢</span>
            </div>
            <p className="text-sm text-foreground font-medium">
              {t('sidebar.officesProfile')}
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
