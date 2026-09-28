'use client';

import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { PageNavbar } from '../page-navbar';
import { OverviewContent } from '../content';

export default function MembersReportsOverviewPage() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <OverviewContent />
      </Container>
    </Fragment>
  );
}
