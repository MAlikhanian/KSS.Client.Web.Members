'use client';

import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { LegalCasesContent } from './content';
import { PageNavbar } from '@/app/brokerages/page-navbar';

export default function LegalCasesPage() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <LegalCasesContent />
      </Container>
    </Fragment>
  );
}
