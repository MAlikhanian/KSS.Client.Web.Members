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
import { TrusteeContent } from './content';
import { PageNavbar } from '../page-navbar';
import { useTranslation } from '@/hooks/useTranslation';

export default function TrusteePage() {
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
                {t('trustee.toolbar.description')}
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline">
                <Link href="#">{t('trustee.toolbar.saveDraft')}</Link>
              </Button>
              <Button>
                <Link href="#">{t('trustee.toolbar.submit')}</Link>
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <TrusteeContent />
      </Container>
    </Fragment>
  );
}
