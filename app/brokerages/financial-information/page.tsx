'use client';

import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { FinancialInformationContent } from './content';
import { PageNavbar } from '@/app/brokerages/page-navbar';

export default function FinancialInformationPage() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <FinancialInformationContent />
      </Container>
    </Fragment>
  );
}
