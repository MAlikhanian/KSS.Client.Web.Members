'use client';

import { Navbar } from '@/partials/navbar/navbar';
import { NavbarMenu } from '@/partials/navbar/navbar-menu';
import { useSettings } from '@/providers/settings-provider';
import { Container } from '@/components/common/container';
import { useTranslation } from '@/hooks/useTranslation';

const PageNavbar = () => {
  const { settings } = useSettings();
  const { t } = useTranslation('members-reports');

  const items = [
    { title: t('navOverview', { defaultValue: 'Overview' }), path: '/members-reports/overview' },
    { title: t('navDataEntry', { defaultValue: 'Data Entry' }), path: '/members-reports/dataentry' },
    { title: t('navMembers', { defaultValue: 'Members' }), path: '/members-reports/member' },
    { title: t('navBrokerageProfile', { defaultValue: 'Brokerage Profile' }), path: '/members-reports/brokerage-profile' },
    { title: t('navByClass', { defaultValue: 'By Class' }), path: '/members-reports/by-class' },
    { title: t('navByPosition', { defaultValue: 'By Position' }), path: '/members-reports/by-position' },
    { title: t('navFundReports', { defaultValue: 'Funds' }), path: '/members-reports/funds' },
  ];

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
