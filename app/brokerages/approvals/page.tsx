'use client';

import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { ApprovalsContent } from './content';
import { PageNavbar } from '@/app/brokerages/page-navbar';

export default function ApprovalsPage() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <ApprovalsContent />
      </Container>
    </Fragment>
  );
}
