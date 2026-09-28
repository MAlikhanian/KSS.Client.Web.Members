'use client';

import { FundProvider } from './contexts/fund-context';

export default function InvestmentFundsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FundProvider>{children}</FundProvider>;
}

