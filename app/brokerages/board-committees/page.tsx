'use client';

import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { BoardCommitteesContent } from './content';
import { PageNavbar } from '@/app/brokerages/page-navbar';

export default function BoardCommitteesPage() {
  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <BoardCommitteesContent />
      </Container>
    </Fragment>
  );
}
