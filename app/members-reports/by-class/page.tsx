'use client';

import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { PageNavbar } from '../page-navbar';
import { ByClassContent } from './content';

export default function MembersReportsByClassPage() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <ByClassContent />
      </Container>
    </Fragment>
  );
}
