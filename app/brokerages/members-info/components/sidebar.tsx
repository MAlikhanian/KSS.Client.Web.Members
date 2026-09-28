'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

export function Sidebar() {
  const { t } = useTranslation('brokerages-members-info');

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t('sidebar.title', { defaultValue: 'Members Info' })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">👥</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {t('sidebar.totalShareholders', { defaultValue: 'Total Shareholders' })}
              </p>
              <p className="text-xs text-muted-foreground">0 Added</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">👥</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {t('sidebar.relatedPersons', { defaultValue: 'Related Persons' })}
              </p>
              <p className="text-xs text-muted-foreground">0 Added</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">👨‍👩‍👧‍👦</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {t('sidebar.familyDependents', { defaultValue: 'Family Dependents' })}
              </p>
              <p className="text-xs text-muted-foreground">0 Added</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📊</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {t('sidebar.ownershipDistribution', { defaultValue: 'Ownership Distribution' })}
              </p>
              <p className="text-xs text-muted-foreground">Not Calculated</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📈</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {t('sidebar.lastUpdated', { defaultValue: 'Last Updated' })}
              </p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-white text-2xl">👥</span>
            </div>
            <p className="text-sm text-foreground font-medium">
              {t('sidebar.membersProfile', { defaultValue: 'Members Profile' })}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('sidebar.profileDescription', { defaultValue: 'Manage all member-related information in one place' })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

