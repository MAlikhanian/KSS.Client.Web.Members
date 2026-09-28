'use client';

import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { PageNavbar } from '../page-navbar';
import { MembersReportContent } from './content';

export default function MembersReportsMemberPage() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <MembersReportContent />
      </Container>
    </Fragment>
  );
}
