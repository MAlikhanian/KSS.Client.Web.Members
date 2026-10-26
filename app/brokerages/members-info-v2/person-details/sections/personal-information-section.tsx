'use client';

import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePickerComponent } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import type { SampleLookup, SamplePersonal } from '../sample-person-details';

const FEMALE_SEX_ID = 2;
const noop = () => {};

// The current page's dropdowns list the Persian names whatever the page language.
function LookupSelect({ id, value, options }: { id: string; value: number; options: SampleLookup }) {
  const { t } = useTranslation('person-form');
  return (
    <Select value={value ? String(value) : ''} onValueChange={noop}>
      <SelectTrigger id={id}>
        <SelectValue placeholder={t('common:select', { defaultValue: 'Select' })} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="0" className="text-muted-foreground">{t('common:select', { defaultValue: 'Select' })}</SelectItem>
        {Object.entries(options).map(([key, label]) => (
          <SelectItem key={key} value={key}>{label.fa}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Same look as the location picker on the current page (an outline button
// showing the chosen place), without loading the location lists.
function LocationReplica({ label, value, options, disabledText }: { label: string; value: number; options: SampleLookup; disabledText?: string }) {
  const { t } = useTranslation();
  const name = options[value]?.fa;
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Button type="button" variant="outline" role="combobox" className="w-full justify-between" disabled>
        {name ?? disabledText ?? t('common.selectOption', { defaultValue: 'Select' })}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </div>
  );
}

export interface PersonalLookups {
  sexes: SampleLookup;
  maritalStatuses: SampleLookup;
  seriesLetters: SampleLookup;
  religions: SampleLookup;
  militaryStatuses: SampleLookup;
  militaryLocations: SampleLookup;
  insuranceTypes: SampleLookup;
  countries: SampleLookup;
  regions: SampleLookup;
  cities: SampleLookup;
}

// Read-only replica of the person personal-information section: the same 19
// fields, in the same order, with the same labels and the same "national code
// cannot be changed" note, fed with sample data.
export function PersonalInformationSectionReplica({ data, lookups: L }: { data: SamplePersonal; lookups: PersonalLookups }) {
  const { t } = useTranslation('person-form');
  const isFemale = data.sexId === FEMALE_SEX_ID;
  const text = (id: string, label: string, value: string, extra?: { required?: boolean; note?: string }) => (
    <div className="space-y-2">
      <Label htmlFor={id} className={extra?.note ? 'flex items-baseline gap-4 flex-wrap' : undefined}>
        {extra?.note ? (
          <>
            <span>{label} {extra.required && <span className="text-destructive">*</span>}</span>
            <span className="text-xs italic text-muted-foreground font-normal">{extra.note}</span>
          </>
        ) : (
          <>{label} {extra?.required && <span className="text-destructive">*</span>}</>
        )}
      </Label>
      <Input id={id} type="text" value={value} readOnly disabled placeholder={label} />
    </div>
  );
  const select = (id: string, label: string, value: number, options: SampleLookup, required?: boolean) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label} {required && <span className="text-destructive">*</span>}</Label>
      <LookupSelect id={id} value={value} options={options} />
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">2</span>
            {t('personalInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {text('v2-nationalId', t('nationalCode'), data.nationalId, { required: true, note: t('nationalCodeFrozen') })}
            {text('v2-birthCertificateNumber', t('birthCertificateNumber'), data.birthCertificateNumber)}
            {text('v2-passportNumber', t('passport', { defaultValue: 'Passport Number' }), data.passportNumber)}
            {select('v2-birthCertificateSeriesLetterId', t('birthCertificateSeriesLetter', { defaultValue: 'Certificate Series Letter' }), data.birthCertificateSeriesLetterId, L.seriesLetters)}
            {text('v2-birthCertificateSeriesNumber', t('birthCertificateSeriesNumber'), data.birthCertificateSeriesNumber)}
            {text('v2-birthCertificateSerial', t('birthCertificateSerial'), data.birthCertificateSerial)}
            <div className="space-y-2">
              <Label htmlFor="v2-dateOfBirth">{t('birthDate')} <span className="text-destructive">*</span></Label>
              <DatePickerComponent value={data.dateOfBirth} onChange={noop} placeholder={t('birthDate')} forcePersian={true} />
            </div>
            {select('v2-sexId', t('sex'), data.sexId, L.sexes, true)}
            {select('v2-maritalStatusId', t('maritalStatus', { defaultValue: 'Marital Status' }), data.maritalStatusId, L.maritalStatuses)}
            <LocationReplica label={t('birthCountry', { defaultValue: 'Country of Birth' })} value={data.birthCountryId} options={L.countries} />
            <LocationReplica label={t('birthRegion', { defaultValue: 'Birth Province' })} value={data.birthRegionId} options={L.regions} />
            <LocationReplica label={t('birthCity', { defaultValue: 'Birthplace City' })} value={data.birthCityId} options={L.cities} />
            <LocationReplica label={t('certIssueCountry', { defaultValue: 'Certificate Issue Country' })} value={data.certIssueCountryId} options={L.countries} />
            <LocationReplica label={t('certIssueRegion', { defaultValue: 'Certificate Issue Province' })} value={data.certIssueRegionId} options={L.regions} />
            <LocationReplica label={t('certIssueCity', { defaultValue: 'Birth Certificate Registration City' })} value={data.certIssueCityId} options={L.cities} />
            {select('v2-religionId', t('religion', { defaultValue: 'Religion' }), data.religionId, L.religions)}
            {/* For a woman the current page greys out both military-service fields. */}
            {select('v2-militaryServiceStatusId', t('militaryStatus'), isFemale ? 0 : data.militaryServiceStatusId, L.militaryStatuses)}
            {select('v2-militaryServiceLocationId', t('militaryLocation', { defaultValue: 'Military Service Location' }), isFemale ? 0 : data.militaryServiceLocationId, L.militaryLocations)}
            {select('v2-insuranceTypeId', t('insuranceType'), data.insuranceTypeId, L.insuranceTypes)}
            {text('v2-insuranceNumber', t('insuranceNumber'), data.insuranceNumber)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
