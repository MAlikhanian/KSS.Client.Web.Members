// Sample (fake) data for the read-only brokerage financial-information guide.
// The company-domain sections are identical to the general-information guide, so
// we reuse its sample data and only add the financial records here.

import type { FinancialInfoRecord } from '../financial-information/components/financial-info-grid';

export {
  SAMPLE_BROKERAGE_NAME,
  sampleNameHistory,
  sampleRegistration,
  sampleEmails,
  samplePhones,
  sampleAddresses,
  sampleStakeholders,
} from '../general-information-guide/sample-data';

/** Per-fiscal-year financial records — the editable section on this page. */
export const sampleFinancialRecords: FinancialInfoRecord[] = [
  {
    id: 'demo-fin-1',
    companyId: 'demo-company',
    fiscalYear: 1403,
    registeredCapital: 5000000000000,
    numberOfShares: 5000000000,
  },
  {
    id: 'demo-fin-2',
    companyId: 'demo-company',
    fiscalYear: 1402,
    registeredCapital: 4000000000000,
    numberOfShares: 4000000000,
  },
  {
    id: 'demo-fin-3',
    companyId: 'demo-company',
    fiscalYear: 1401,
    registeredCapital: 3000000000000,
    numberOfShares: 3000000000,
  },
];
