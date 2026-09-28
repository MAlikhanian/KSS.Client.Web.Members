// Sample (fake) data for the read-only brokerage general-information guide.
// The company-domain sections are identical to /company/information, so we reuse
// that guide's sample data and only add the brokerage-specific pieces here.

export {
  SAMPLE_COMPANY_NAME,
  sampleNameHistory,
  sampleRegistration,
  sampleEmails,
  samplePhones,
  sampleAddresses,
  sampleStakeholders,
} from '@/app/components/company/information-guide/sample-data';

/** Shown in the static brokerage-selection facsimile. */
export const SAMPLE_BROKERAGE_NAME = 'کارگزاری نمونهٔ پارس';

/** The brokerage-specific (SEO / organization) fields — the only editable section. */
export const sampleBrokerageDomain = {
  seoRegistrationDate: '2018-06-10',
  seoRegistrationNumber: '12345',
};
