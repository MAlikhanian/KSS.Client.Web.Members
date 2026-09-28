'use client';

import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { TradingOfficesContent } from '@/app/brokerages/trading-offices/content';
import { PageNavbar } from '@/app/brokerages/page-navbar';

export default function TradingOfficesPage() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <TradingOfficesContent />
      </Container>
    </Fragment>
  );
}
