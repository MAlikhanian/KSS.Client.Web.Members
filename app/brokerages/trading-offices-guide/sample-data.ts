// Sample (fake) data for the read-only trading-offices guide.
// The company-domain sections are identical to the general-information guide, so
// we reuse its sample data and add a sample branch (trading office) here.

import type { PersonSearchResult } from '@/components/common/person-search';

export {
  SAMPLE_BROKERAGE_NAME,
  sampleNameHistory,
  sampleRegistration,
  sampleEmails,
  samplePhones,
  sampleAddresses,
  sampleStakeholders,
} from '../general-information-guide/sample-data';

/** Core fields of one sample trading office (branch) for the static facsimile. */
export const sampleBranch = {
  nameFa: 'دفتر مرکزی تهران',
  branchCode: 'THR-001',
  officeTypeName: 'دفتر مرکزی',
  activityTypeName: 'معاملات اوراق بهادار',
  employeeCount: 24,
  isActive: true,
};

/** Selected branch manager (fed to ManagerSummary's `pick` so it renders without a fetch). */
export const sampleBranchManager: PersonSearchResult = {
  id: 'demo-branch-manager',
  nationalId: '0012345678',
  translations: [{ languageId: 12, firstName: 'علی', lastName: 'رضایی' }],
};

/** Branch addresses — feed the real AddressesGrid read-only. */
export const sampleBranchAddresses = [
  {
    id: 'demo-branch-addr-1',
    labelId: 1,
    labelName: 'دفتر مرکزی',
    countryId: 1,
    regionId: 1,
    cityId: 1,
    countryName: 'ایران',
    regionName: 'تهران',
    cityName: 'تهران',
    postalCode: '1512345678',
    street1: 'خیابان ولیعصر، بالاتر از میدان ونک',
    street2: 'پلاک ۲۲۰، طبقهٔ ۳',
    isPrimary: true,
    isVerified: true,
  },
];

/** Branch phones — feed the real PhonesGrid read-only. */
export const sampleBranchPhones = [
  {
    id: 'demo-branch-phone-1',
    labelId: 1,
    labelName: 'تلفن ثابت',
    countryId: 98,
    phoneNumber: '+982188112233',
    isPrimary: true,
    isVerified: true,
  },
];
