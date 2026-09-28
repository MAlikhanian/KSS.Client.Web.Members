'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { useSettings } from '@/providers/settings-provider';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { FundManagerContent } from './content';
import { PageNavbar } from '../page-navbar';
import { useTranslation } from '@/hooks/useTranslation';

export default function FundManagerPage() {
  const { settings } = useSettings();
  const { t } = useTranslation('investment-funds');

  return (
    <Fragment>
      <PageNavbar />
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                {t('fundManager.toolbar.description')}
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline">
                <Link href="#">{t('fundManager.toolbar.saveDraft')}</Link>
              </Button>
              <Button>
                <Link href="#">{t('fundManager.toolbar.submit')}</Link>
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <FundManagerContent />
      </Container>
    </Fragment>
  );
}
