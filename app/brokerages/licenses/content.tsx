'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { useTranslation } from '@/hooks/useTranslation';
import { LicensesForm, Sidebar } from '@/app/brokerages/licenses/components';

export function LicensesContent() {
  const { t } = useTranslation('brokerages-licenses');

  const [licensesData, setLicensesData] = useState({
    totalLicenses: 0,
    activeLicenses: 0,
    expiredLicenses: 0,
    uniqueLicenseTypes: 0,
    lastUpdated: null as Date | null,
  });

  const handleDataUpdate = useCallback((data: {
    totalLicenses: number;
    activeLicenses: number;
    expiredLicenses: number;
    uniqueLicenseTypes: number;
  }) => {
    setLicensesData(prev => {
      // Only update if data actually changed
      if (
        prev.totalLicenses === data.totalLicenses &&
        prev.activeLicenses === data.activeLicenses &&
        prev.expiredLicenses === data.expiredLicenses &&
        prev.uniqueLicenseTypes === data.uniqueLicenseTypes
      ) {
        return prev;
      }

      return {
        ...data,
        lastUpdated: new Date(),
      };
    });
  }, []);

  return (
    <div className="space-y-5 lg:space-y-7.5">
      {/*
        Title Card lives OUTSIDE the descendant-tint wrapper below so its
        color override actually wins (descendant selectors beat Card-level
        classes on specificity even with `!`).
      */}
      <Card className="bg-blue-50/25! border-blue-100! dark:bg-blue-950/25! dark:border-blue-900! shadow-lg shadow-black/5">
        <CardContent className="py-5">
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                {t('toolbar.description')}
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline">
                <Link href="#">{t('toolbar.saveDraft')}</Link>
              </Button>
              <Button>
                <Link href="#">{t('toolbar.submit')}</Link>
              </Button>
            </ToolbarActions>
          </Toolbar>
        </CardContent>
      </Card>

      {/*
        Blue glass tint applied to every section Card via descendant selector.
      */}
      <div
        className={
          '[&_div.rounded-xl.bg-card]:bg-blue-50/25! ' +
          '[&_div.rounded-xl.bg-card]:border-blue-100! ' +
          'dark:[&_div.rounded-xl.bg-card]:bg-blue-950/25! ' +
          'dark:[&_div.rounded-xl.bg-card]:border-blue-900! ' +
          '[&_div.rounded-xl.bg-card]:shadow-lg ' +
          '[&_div.rounded-xl.bg-card]:shadow-black/5'
        }
      >
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 lg:gap-7.5">
          <div className="col-span-3">
            <div className="grid gap-5 lg:gap-7.5">
              <LicensesForm onDataUpdate={handleDataUpdate} />
            </div>
          </div>
          <div className="col-span-1">
            <div className="grid gap-5 lg:gap-7.5">
              <Sidebar licensesData={licensesData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
