'use client';

import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { PageNavbar } from '../page-navbar';
import { BrokeragesReportContent } from './content';

export default function MembersReportsBrokeragesPage() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <BrokeragesReportContent />
      </Container>
    </Fragment>
  );
}
