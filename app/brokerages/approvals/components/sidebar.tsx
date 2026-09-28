'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

interface SidebarProps {
  approvalsData: {
    totalApprovals: number;
    activeApprovals: number;
    expiredApprovals: number;
    uniqueContractors: number;
    lastUpdated: Date | null;
  };
}

export function Sidebar({ approvalsData }: SidebarProps) {
  const { t } = useTranslation('brokerages-approvals');

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return t('sidebar.notYetUpdated', { defaultValue: 'Not yet updated' });
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return t('common.time.justNow', { defaultValue: 'Just now' });
    if (diffMins < 60) return t('common.time.minutesAgo', { count: diffMins, defaultValue: `${diffMins} minutes ago` });
    if (diffHours < 24) return t('common.time.hoursAgo', { count: diffHours, defaultValue: `${diffHours} hours ago` });
    return t('common.time.daysAgo', { count: diffDays, defaultValue: `${diffDays} days ago` });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('sidebar.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📊</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{t('sidebar.totalApprovals')}</p>
              <p className="text-xs text-muted-foreground">{approvalsData.totalApprovals} {t('sidebar.items')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">✓</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{t('sidebar.activeApprovals')}</p>
              <p className="text-xs text-muted-foreground">{approvalsData.activeApprovals} {t('sidebar.items')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">⏰</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{t('sidebar.expiredApprovals')}</p>
              <p className="text-xs text-muted-foreground">{approvalsData.expiredApprovals} {t('sidebar.items')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🏢</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{t('sidebar.uniqueContractors')}</p>
              <p className="text-xs text-muted-foreground">{approvalsData.uniqueContractors} {t('sidebar.contractors')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📈</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{t('sidebar.lastUpdated')}</p>
              <p className="text-xs text-muted-foreground">{formatLastUpdated(approvalsData.lastUpdated)}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-white text-2xl">📋</span>
            </div>
            <p className="text-sm text-foreground font-medium">{t('sidebar.profileTitle')}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('sidebar.profileDescription')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
