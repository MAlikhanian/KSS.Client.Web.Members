'use client';

import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { PageNavbar } from '../page-navbar';
import { ByPositionContent } from './content';

export default function MembersReportsByPositionPage() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <ByPositionContent />
      </Container>
    </Fragment>
  );
}
