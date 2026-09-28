'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';
import { CollapsibleSection } from '@/components/common/collapsible-section';
import {
  NameSection,
  PersonalInformationSection,
  ContactInformationSection,
  EmploymentInformationSection,
  EducationSection,
  RelationshipSection,
  DocumentSection,
  NationalitySection,
  StatusSection,
} from '@/app/components/person/edit';
import type { PersonFormData, ReferenceData } from '@/app/components/person/edit/person-form';
import type { PersonTranslationEntry } from '@/app/components/person/edit/person-name-grid';

// Language id from KSS_Common_Prod.dbo.Language (fa).
const PERSIAN_LANGUAGE_ID = 12;

interface PersonDetailResponse {
  id: string;
  nationalId: string;
  sexId: number;
  preferredLanguageId: number;
  dateOfBirth: string;
  birthCountryId: number;
  birthRegionId: number;
  birthCityId: number;
  birthCertificateNumber?: string | null;
  birthCertificateSeriesNumber?: string | null;
  birthCertificateSeriesLetterId?: number | null;
  birthCertificateSerial?: string | null;
  birthCertificateIssueCountryId: number;
  birthCertificateIssueRegionId: number;
  birthCertificateIssueCityId: number;
  maritalStatusId: number;
  religionId: number;
  passportNumber?: string | null;
  militaryServiceStatusId: number;
  militaryServiceLocationId?: number | null;
  insuranceTypeId: number;
  insuranceNumber?: string | null;
  translations: Array<{
    languageId: number;
    firstName: string;
    lastName: string;
    fatherName?: string | null;
    createdAt?: string;
    updatedAt?: string;
  }>;
}

// The reused sections never invoke their edit callbacks while the wrapping
// <fieldset disabled> is set, so a single no-op satisfies the required props.
const noop = () => {};

const emptyFormData: PersonFormData = {
  nationalId: '',
  sexId: 0,
  preferredLanguageId: PERSIAN_LANGUAGE_ID,
  dateOfBirth: '',
  birthCountryId: 0,
  birthRegionId: 0,
  birthCityId: 0,
  birthCertificateNumber: '',
  birthCertificateSeriesNumber: '',
  birthCertificateSeriesLetterId: 0,
  birthCertificateSerial: '',
  birthCertificateIssueCountryId: 0,
  birthCertificateIssueRegionId: 0,
  birthCertificateIssueCityId: 0,
  maritalStatusId: 0,
  religionId: 0,
  passportNumber: '',
  militaryServiceStatusId: 0,
  militaryServiceLocationId: 0,
  insuranceTypeId: 0,
  insuranceNumber: '',
};

interface PersonInfoViewProps {
  /** Person id to display. */
  personId: string;
  /** The collapsible box starts collapsed (default true). */
  defaultCollapsed?: boolean;
}

/**
 * Read-only "all person items" block — the person twin of {@link CompanyInfoView}.
 * Renders the same sections as /person/edit (name, personal, nationality,
 * contact, employment, education + certificates, relationships, documents,
 * status), loaded from the person endpoints keyed off `personId`, inside one
 * collapsible box. Every control is disabled via a wrapping <fieldset disabled>
 * (the same mechanism /person/edit uses for its view-only mode) plus the
 * sections' own `isReadOnly`. Person data is edited under /person/edit —
 * never here.
 */
export function PersonInfoView({ personId, defaultCollapsed = true }: PersonInfoViewProps) {
  const { t } = useTranslation('brokerages-members-info');
  const [formData, setFormData] = useState<PersonFormData>(emptyFormData);
  const [translations, setTranslations] = useState<PersonTranslationEntry[]>([]);

  // Shared reference-data cache (same key the person page uses).
  const { data: referenceData } = useQuery<ReferenceData>({
    queryKey: ['person-reference-data'],
    queryFn: async () => {
      const response = await fetch('/api/person/reference');
      if (!response.ok) throw new Error('Failed to load reference data');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!personId) {
      setFormData(emptyFormData);
      setTranslations([]);
      return;
    }
    let cancelled = false;
    fetch(`/api/person/${personId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((person: PersonDetailResponse | null) => {
        if (cancelled || !person) return;
        setFormData({
          id: person.id,
          nationalId: person.nationalId || '',
          sexId: person.sexId || 0,
          preferredLanguageId: person.preferredLanguageId || PERSIAN_LANGUAGE_ID,
          dateOfBirth: person.dateOfBirth ? person.dateOfBirth.split('T')[0] : '',
          birthCountryId: person.birthCountryId || 0,
          birthRegionId: person.birthRegionId || 0,
          birthCityId: person.birthCityId || 0,
          birthCertificateNumber: person.birthCertificateNumber || '',
          birthCertificateSeriesNumber: person.birthCertificateSeriesNumber || '',
          birthCertificateSeriesLetterId: person.birthCertificateSeriesLetterId || 0,
          birthCertificateSerial: person.birthCertificateSerial || '',
          birthCertificateIssueCountryId: person.birthCertificateIssueCountryId || 0,
          birthCertificateIssueRegionId: person.birthCertificateIssueRegionId || 0,
          birthCertificateIssueCityId: person.birthCertificateIssueCityId || 0,
          maritalStatusId: person.maritalStatusId || 0,
          religionId: person.religionId || 0,
          passportNumber: person.passportNumber || '',
          militaryServiceStatusId: person.militaryServiceStatusId || 0,
          militaryServiceLocationId: person.militaryServiceLocationId || 0,
          insuranceTypeId: person.insuranceTypeId || 0,
          insuranceNumber: person.insuranceNumber || '',
        });
        setTranslations(
          (person.translations || []).map((tr) => ({
            languageId: tr.languageId,
            firstName: tr.firstName || '',
            lastName: tr.lastName || '',
            fatherName: tr.fatherName || undefined,
            createdAt: tr.createdAt,
            updatedAt: tr.updatedAt,
          })),
        );
      })
      .catch(() => {
        /* person profile is best-effort here — edited under /person/edit */
      });
    return () => {
      cancelled = true;
    };
  }, [personId]);

  if (!personId) return null;

  return (
    <CollapsibleSection
      title={t('form.personInfoTitle', { defaultValue: 'Person Information' })}
      defaultOpen={!defaultCollapsed}
    >
      {/* Disabling the fieldset disables every nested control in one shot — the
          same read-only mechanism /person/edit uses. `contents` keeps the
          fieldset out of the layout box so the sections flow in the parent grid. */}
      <fieldset disabled className="contents">
        {/* Section 1 — blue */}
        <div className="[&_div.rounded-xl.bg-card.bg-card]:border-blue-500! dark:[&_div.rounded-xl.bg-card.bg-card]:border-blue-500!">
          <NameSection
            translations={translations}
            onTranslationsChange={noop}
            lockEnglishIfPresent
            isReadOnly
            personId={personId}
          />
        </div>

        {/* Section 2 — blue */}
        <div className="[&_div.rounded-xl.bg-card.bg-card]:border-blue-500! dark:[&_div.rounded-xl.bg-card.bg-card]:border-blue-500!">
          <PersonalInformationSection
            formData={formData}
            onInputChange={noop}
            referenceData={referenceData}
            nationalIdLocked
          />
        </div>

        {/* Section 3 — emerald */}
        <div className="[&_div.rounded-xl.bg-card.bg-card]:border-emerald-500! dark:[&_div.rounded-xl.bg-card.bg-card]:border-emerald-500!">
          <NationalitySection personId={personId} isReadOnly />
        </div>

        {/* Sections 4, 5, 6 — colored borders applied inside ContactInformationSection. */}
        <ContactInformationSection personId={personId} referenceData={referenceData} isReadOnly />

        {/* Section 7 — orange */}
        <div className="[&_div.rounded-xl.bg-card.bg-card]:border-orange-500! dark:[&_div.rounded-xl.bg-card.bg-card]:border-orange-500!">
          <EmploymentInformationSection personId={personId} referenceData={referenceData} isReadOnly />
        </div>

        {/* Section 8 — cyan */}
        <div className="[&_div.rounded-xl.bg-card.bg-card]:border-cyan-500! dark:[&_div.rounded-xl.bg-card.bg-card]:border-cyan-500!">
          <EducationSection personId={personId} referenceData={referenceData} isReadOnly />
        </div>

        {/* Section 9 — pink */}
        <div className="[&_div.rounded-xl.bg-card.bg-card]:border-pink-500! dark:[&_div.rounded-xl.bg-card.bg-card]:border-pink-500!">
          <RelationshipSection personId={personId} referenceData={referenceData} isReadOnly />
        </div>

        {/* Section 10 — cyan */}
        <div className="[&_div.rounded-xl.bg-card.bg-card]:border-cyan-500! dark:[&_div.rounded-xl.bg-card.bg-card]:border-cyan-500!">
          <DocumentSection personId={personId} referenceData={referenceData} isReadOnly />
        </div>

        {/* Section 11 — red */}
        <div className="[&_div.rounded-xl.bg-card.bg-card]:border-red-500! dark:[&_div.rounded-xl.bg-card.bg-card]:border-red-500!">
          <StatusSection personId={personId} isReadOnly />
        </div>
      </fieldset>
    </CollapsibleSection>
  );
}
