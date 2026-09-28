'use client';

import { useSession } from 'next-auth/react';
import { Navbar } from '@/partials/navbar/navbar';
import { NavbarMenu } from '@/partials/navbar/navbar-menu';
import { useSettings } from '@/providers/settings-provider';
import { Container } from '@/components/common/container';
import { useTranslation } from 'react-i18next';
import { filterMenuByRole } from '@/lib/menu-translation-utils';

const PageNavbar = () => {
  const { settings } = useSettings();
  const { t } = useTranslation();
  const { data: session } = useSession();

  const userRoles = session?.user?.roles ?? [];
  const userPermissions = session?.user?.permissions ?? [];

  // Each tab is gated by the same Read/Manage pair as the global sidebar item.
  const items = filterMenuByRole(
    [
      {
        title: t('menu.generalInformation', { defaultValue: 'General Information' }),
        path: '/investment-funds/general-information',
        permissions: ['Members.InvestmentFunds.Read', 'Members.InvestmentFunds.Modify'],
      },
      {
        title: t('menu.fundManager', { defaultValue: 'Fund Manager' }),
        path: '/investment-funds/fund-manager',
        permissions: ['Members.InvestmentFunds.Read', 'Members.InvestmentFunds.Modify'],
      },
      {
        title: t('menu.trustee', { defaultValue: 'Trustee' }),
        path: '/investment-funds/trustee',
        permissions: ['Members.InvestmentFunds.Read', 'Members.InvestmentFunds.Modify'],
      },
      {
        title: t('menu.preferredShareholders', { defaultValue: 'Preferred Shareholders' }),
        path: '/investment-funds/preferred-shareholders',
        permissions: ['Members.InvestmentFunds.Read', 'Members.InvestmentFunds.Modify'],
      },
      {
        title: t('menu.marketMakingSymbols', { defaultValue: 'Market-Making Symbols' }),
        path: '/investment-funds/market-making-symbols',
        permissions: ['Members.InvestmentFunds.Read', 'Members.InvestmentFunds.Modify'],
      },
      {
        title: t('menu.managersAndStaff', { defaultValue: 'Managers & Staff' }),
        path: '/investment-funds/managers-staff',
        permissions: ['Members.InvestmentFunds.Read', 'Members.InvestmentFunds.Modify'],
      },
      {
        title: t('menu.tradingStations', { defaultValue: 'Trading Stations' }),
        path: '/investment-funds/trading-stations',
        permissions: ['Members.InvestmentFunds.Read', 'Members.InvestmentFunds.Modify'],
      },
    ],
    userRoles,
    userPermissions,
  );

  if (settings?.layout === 'demo1') {
    return (
      <Navbar>
        <Container>
          <NavbarMenu items={items} />
        </Container>
      </Navbar>
    );
  }
  return <></>;
};

export { PageNavbar };
