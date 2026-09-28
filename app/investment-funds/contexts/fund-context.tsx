'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useInvestmentFunds } from '@/hooks/use-investment-funds';

interface FundContextType {
  selectedFundId: string;
  setSelectedFundId: (id: string) => void;
  selectedFundName: string;
  isEditMode: boolean;
  clearSelection: () => void;
}

const FundContext = createContext<FundContextType | undefined>(undefined);

export function FundProvider({ children }: { children: ReactNode }) {
  const [selectedFundId, setSelectedFundId] = useState<string>('');
  const { investmentFunds } = useInvestmentFunds();

  const selectedFund = investmentFunds.find(fund => fund.id === selectedFundId);
  const selectedFundName = selectedFund?.name || '';
  const isEditMode = !!selectedFundId;

  const clearSelection = () => {
    setSelectedFundId('');
  };

  return (
    <FundContext.Provider
      value={{
        selectedFundId,
        setSelectedFundId,
        selectedFundName,
        isEditMode,
        clearSelection,
      }}
    >
      {children}
    </FundContext.Provider>
  );
}

export function useFundContext() {
  const context = useContext(FundContext);
  if (context === undefined) {
    throw new Error('useFundContext must be used within a FundProvider');
  }
  return context;
}

