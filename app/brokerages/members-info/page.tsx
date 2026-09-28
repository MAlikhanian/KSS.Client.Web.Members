'use client';

import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { MembersInfoContent } from '@/app/brokerages/members-info/content';
import { PageNavbar } from '@/app/brokerages/page-navbar';

export default function MembersInfoPage() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <MembersInfoContent />
      </Container>
    </Fragment>
  );
}
