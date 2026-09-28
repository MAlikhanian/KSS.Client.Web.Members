'use client';

import { BrokerageProvider } from './contexts/brokerage-context';

export default function BrokeragesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BrokerageProvider>{children}</BrokerageProvider>;
}

