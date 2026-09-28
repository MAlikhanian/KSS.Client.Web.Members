'use client';

import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { PageNavbar } from '../page-navbar';
import { FundReportsContent } from './content';

export default function MembersReportsFundsPage() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <FundReportsContent />
      </Container>
    </Fragment>
  );
}
