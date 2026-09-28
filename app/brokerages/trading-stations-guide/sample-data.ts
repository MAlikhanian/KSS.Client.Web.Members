// Sample (fake) data for the read-only trading-stations guide.
// The company-domain sections are identical to the general-information guide, so
// we reuse its sample data and add a sample station here.

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

/** Core fields of one sample trading station for the static facsimile. */
export const sampleStation = {
  stationTypeName: 'ایستگاه اصلی',
  activityTypeName: 'معاملات سهام',
  isActive: true,
};

/** Selected trader (fed to ManagerSummary's `pick` so it renders without a fetch). */
export const sampleStationTrader: PersonSearchResult = {
  id: 'demo-station-trader',
  nationalId: '0023456789',
  translations: [{ languageId: 12, firstName: 'مریم', lastName: 'کریمی' }],
};

/** Station addresses — feed the real AddressesGrid read-only. */
export const sampleStationAddresses = [
  {
    id: 'demo-station-addr-1',
    labelId: 1,
    labelName: 'دفتر مرکزی',
    countryId: 1,
    regionId: 1,
    cityId: 1,
    countryName: 'ایران',
    regionName: 'تهران',
    cityName: 'تهران',
    postalCode: '1517834562',
    street1: 'خیابان مطهری، نبش خیابان میرعماد',
    street2: 'پلاک ۴۸، طبقهٔ ۲',
    isPrimary: true,
    isVerified: true,
  },
];

/** Station phones — feed the real PhonesGrid read-only. */
export const sampleStationPhones = [
  {
    id: 'demo-station-phone-1',
    labelId: 1,
    labelName: 'تلفن ثابت',
    countryId: 98,
    phoneNumber: '+982188445566',
    isPrimary: true,
    isVerified: true,
  },
];
