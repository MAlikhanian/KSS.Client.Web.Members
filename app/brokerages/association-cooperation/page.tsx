'use client';

import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { AssociationCooperationContent } from './content';
import { PageNavbar } from '@/app/brokerages/page-navbar';

export default function AssociationCooperationPage() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <AssociationCooperationContent />
      </Container>
    </Fragment>
  );
}
