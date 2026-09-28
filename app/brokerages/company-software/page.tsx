'use client';

import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { CompanySoftwareContent } from './content';
import { PageNavbar } from '@/app/brokerages/page-navbar';

export default function CompanySoftwarePage() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <CompanySoftwareContent />
      </Container>
    </Fragment>
  );
}
