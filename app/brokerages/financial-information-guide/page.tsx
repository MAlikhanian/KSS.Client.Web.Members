'use client';

import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { PageNavbar } from '@/app/brokerages/page-navbar';
import { FinancialInformationGuideContent } from './content';

export default function FinancialInformationGuidePage() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <FinancialInformationGuideContent />
      </Container>
    </Fragment>
  );
}
