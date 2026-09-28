'use client';

import { Navbar } from '@/partials/navbar/navbar';
import { NavbarMenu } from '@/partials/navbar/navbar-menu';
import { useSettings } from '@/providers/settings-provider';
import { Container } from '@/components/common/container';
import { useTranslatedMenu } from '@/lib/use-translated-menu';
import { navItemsForPathPrefix } from '@/lib/menu-nav-utils';

const PageNavbar = () => {
  const { settings } = useSettings();
  const { menuSidebar } = useTranslatedMenu();
  const brokerageMenuConfig = navItemsForPathPrefix(menuSidebar, '/brokerages/');

  if (brokerageMenuConfig && settings?.layout === 'demo1') {
    return (
      <Navbar>
        <Container>
          <NavbarMenu items={brokerageMenuConfig} />
        </Container>
      </Navbar>
    );
  } else {
    return <></>;
  }
};

export { PageNavbar };
