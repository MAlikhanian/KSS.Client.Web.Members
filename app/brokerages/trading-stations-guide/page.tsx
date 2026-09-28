'use client';

import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { PageNavbar } from '@/app/brokerages/page-navbar';
import { TradingStationsGuideContent } from './content';

export default function TradingStationsGuidePage() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <TradingStationsGuideContent />
      </Container>
    </Fragment>
  );
}
