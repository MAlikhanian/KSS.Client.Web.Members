'use client';

import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { LicensesContent } from './content';
import { PageNavbar } from '@/app/brokerages/page-navbar';

export default function LicensesPage() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <LicensesContent />
      </Container>
    </Fragment>
  );
}
