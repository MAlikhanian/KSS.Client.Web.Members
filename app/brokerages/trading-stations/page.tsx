'use client';

import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { TradingStationsContent } from '@/app/brokerages/trading-stations/content';
import { PageNavbar } from '@/app/brokerages/page-navbar';

export default function TradingStationsPage() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <TradingStationsContent />
      </Container>
    </Fragment>
  );
}
