'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { RiErrorWarningFill } from '@remixicon/react';
import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { useBrokerageContext } from '@/app/brokerages/contexts/brokerage-context';
import { BrokeragePicker } from '@/app/brokerages/members-info-v2/components/brokerage-picker';
import { usePermission } from '@/hooks/use-permission';
import { useTranslation } from '@/hooks/useTranslation';
import { useOfficesQueryState } from './hooks/use-offices-query-state';
import { OfficesTable } from './components';

// Same permissions that gate the current Trading Offices page's menu entry.
// Nothing here widens access: without them the page shows no data at all.
const PAGE_PERMISSIONS = ['Members.Brokerage.Read', 'Members.Brokerage.Modify'];

export function TradingOfficesV2Content() {
  const { t, i18n } = useTranslation('brokerages-trading-offices-v2');
  const lang: 'fa' | 'en' = i18n.language === 'en' ? 'en' : 'fa';
  const { status } = useSession();
  const { hasPermission } = usePermission();
  const { selectedBrokerageId, setSelectedBrokerageId } = useBrokerageContext();
  const { state, update } = useOfficesQueryState();

  // The brokerage lives in the URL too, so returning to the page (or reloading
  // it) brings back the same brokerage with its search and filters.
  useEffect(() => {
    if (state.brokerageId && state.brokerageId !== selectedBrokerageId) {
      setSelectedBrokerageId(state.brokerageId);
    }
    // Only when the URL changes; the picker below writes the URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.brokerageId]);

  const pickBrokerage = (id: string) => {
    setSelectedBrokerageId(id);
    update({ brokerageId: id });
  };

  const brokerageId = state.brokerageId || selectedBrokerageId;

  return (
    <div className="space-y-5 lg:space-y-7.5">
      <Alert variant="warning" appearance="light">
        <AlertIcon><RiErrorWarningFill /></AlertIcon>
        <AlertTitle>{t('preview.bannerTitle')}</AlertTitle>
        <AlertDescription>{t('preview.bannerBody')}</AlertDescription>
      </Alert>

      <Card className="bg-blue-50/25! border-blue-100! dark:bg-blue-950/25! dark:border-blue-900! shadow-lg shadow-black/5">
        <CardContent className="py-5">
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle text={t('toolbar.title')} />
              <ToolbarDescription>{t('toolbar.description')}</ToolbarDescription>
            </ToolbarHeading>
          </Toolbar>
        </CardContent>
      </Card>

      {status === 'loading' ? null : !hasPermission(PAGE_PERMISSIONS) ? (
        <Alert variant="destructive" appearance="light">
          <AlertIcon><RiErrorWarningFill /></AlertIcon>
          <AlertTitle>{t('access.denied')}</AlertTitle>
        </Alert>
      ) : (
        <div className="grid gap-5 lg:gap-7.5">
          <div
            className={
              '[&_div.rounded-xl.bg-card.bg-card]:border-black! ' +
              'dark:[&_div.rounded-xl.bg-card.bg-card]:border-white!'
            }
          >
            <BrokeragePicker value={brokerageId} onValueChange={pickBrokerage} />
          </div>

          {brokerageId ? (
            <OfficesTable state={{ ...state, brokerageId }} update={update} lang={lang} />
          ) : (
            <div className="py-8 text-center text-muted-foreground">{t('table.pickBrokerage')}</div>
          )}
        </div>
      )}
    </div>
  );
}
