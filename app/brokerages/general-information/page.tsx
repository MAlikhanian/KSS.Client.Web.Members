'use client';

import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { GeneralInformationContent } from './content';
import { PageNavbar } from '@/app/brokerages/page-navbar';

export default function GeneralInformationPage() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <GeneralInformationContent />
      </Container>
    </Fragment>
  );
}
