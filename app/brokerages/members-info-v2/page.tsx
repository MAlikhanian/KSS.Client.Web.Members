'use client';

import { Fragment, Suspense } from 'react';
import { Container } from '@/components/common/container';
import { PageNavbar } from '@/app/brokerages/page-navbar';
import { MembersInfoV2Content } from '@/app/brokerages/members-info-v2/content';

// New version of Members Info, built separately; the current page at
// /brokerages/members-info is not changed by it. Suspense is required because
// the content reads its search and filters from the URL query.
export default function MembersInfoV2Page() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <Suspense fallback={null}>
          <MembersInfoV2Content />
        </Suspense>
      </Container>
    </Fragment>
  );
}
