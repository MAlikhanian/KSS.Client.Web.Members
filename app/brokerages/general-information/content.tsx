'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { useTranslation } from '@/hooks/useTranslation';
import { GuideLinkButton } from '@/app/components/company/guide-link-button';
import { GeneralInformationForm } from './components';

export function GeneralInformationContent() {
  const { t } = useTranslation('brokerages-general-info');

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
              <GuideLinkButton href="/general-information-guide" />
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
        <div className="grid gap-5 lg:gap-7.5">
          <GeneralInformationForm />
        </div>
      </div>
    </div>
  );
}
