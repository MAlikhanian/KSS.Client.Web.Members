'use client';

import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { PageNavbar } from '@/app/brokerages/page-navbar';
import { GeneralInformationGuideContent } from './content';

export default function GeneralInformationGuidePage() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <GeneralInformationGuideContent />
      </Container>
    </Fragment>
  );
}
