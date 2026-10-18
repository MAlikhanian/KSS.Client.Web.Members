'use client';

import { Fragment, Suspense } from 'react';
import { Container } from '@/components/common/container';
import { PageNavbar } from '@/app/brokerages/page-navbar';
import { TradingOfficesV2Content } from '@/app/brokerages/trading-offices-v2/content';

// New version of Trading Offices, built separately; the current page at
// /brokerages/trading-offices is not changed by it. Suspense is required because
// the content reads its search and filters from the URL query.
export default function TradingOfficesV2Page() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <Suspense fallback={null}>
          <TradingOfficesV2Content />
        </Suspense>
      </Container>
    </Fragment>
  );
}
