'use client';

import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { PageNavbar } from '@/app/brokerages/page-navbar';
import { TradingOfficesGuideContent } from './content';

export default function TradingOfficesGuidePage() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <TradingOfficesGuideContent />
      </Container>
    </Fragment>
  );
}
