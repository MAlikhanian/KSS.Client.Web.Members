'use client';

import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { PageNavbar } from '../page-navbar';
import { BrokerageProfileContent } from './content';

export default function MembersReportsBrokerageProfilePage() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <BrokerageProfileContent />
      </Container>
    </Fragment>
  );
}
