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
import { BoardCommitteesForm, Sidebar } from '@/app/brokerages/board-committees/components';

export function BoardCommitteesContent() {
  const { t } = useTranslation('brokerages-board-committees');

  const [committeesData, setCommitteesData] = useState({
    totalCommittees: 0,
    activeCommittees: 0,
    totalDocuments: 0,
    lastUpdated: null as Date | null,
  });

  const handleDataUpdate = useCallback((data: {
    totalCommittees: number;
    activeCommittees: number;
    totalDocuments: number;
  }) => {
    setCommitteesData(prev => {
      if (
        prev.totalCommittees === data.totalCommittees &&
        prev.activeCommittees === data.activeCommittees &&
        prev.totalDocuments === data.totalDocuments
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
              <BoardCommitteesForm onDataUpdate={handleDataUpdate} />
            </div>
          </div>
          <div className="col-span-1">
            <div className="grid gap-5 lg:gap-7.5">
              <Sidebar committeesData={committeesData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
