'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useBrokerages } from '@/hooks/use-brokerages';

interface BrokerageContextType {
  selectedBrokerageId: string;
  setSelectedBrokerageId: (id: string) => void;
  selectedBrokerageName: string;
  isEditMode: boolean;
  clearSelection: () => void;
}

const BrokerageContext = createContext<BrokerageContextType | undefined>(undefined);

export function BrokerageProvider({ children }: { children: ReactNode }) {
  const [selectedBrokerageId, setSelectedBrokerageId] = useState<string>('');
  const { brokerages } = useBrokerages();

  const selectedBrokerage = brokerages.find(brokerage => brokerage.id === selectedBrokerageId);
  const selectedBrokerageName = selectedBrokerage?.name || '';
  const isEditMode = !!selectedBrokerageId;

  const clearSelection = () => {
    setSelectedBrokerageId('');
  };

  return (
    <BrokerageContext.Provider
      value={{
        selectedBrokerageId,
        setSelectedBrokerageId,
        selectedBrokerageName,
        isEditMode,
        clearSelection,
      }}
    >
      {children}
    </BrokerageContext.Provider>
  );
}

export function useBrokerageContext() {
  const context = useContext(BrokerageContext);
  if (context === undefined) {
    throw new Error('useBrokerageContext must be used within a BrokerageProvider');
  }
  return context;
}

