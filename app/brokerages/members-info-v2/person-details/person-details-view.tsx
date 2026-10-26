'use client';

import { useMemo } from 'react';
import { CollapsibleSection } from '@/components/common/collapsible-section';
import { useTranslation } from '@/hooks/useTranslation';
import type { MockPersonnel } from '../mock/personnel.mock';
import { SAMPLE_LOOKUPS as L, buildSamplePersonDetails } from './sample-person-details';
import { ContactInformationSectionReplica } from './sections/contact-information-section';
import { DocumentSectionReplica } from './sections/document-section';
import { EducationSectionReplica } from './sections/education-section';
import { EmploymentSectionReplica } from './sections/employment-section';
import { NameSectionReplica } from './sections/name-section';
import { NationalitySectionReplica } from './sections/nationality-section';
import { PersonalInformationSectionReplica } from './sections/personal-information-section';
import { RelationshipSectionReplica } from './sections/relationship-section';
import { StatusSectionReplica } from './sections/status-section';

// The person information block exactly as the current Members Info page shows
// it in an expanded row: the same title, the same sections in the same order,
// numbers and colours (that page shows no section 9), every control disabled.
// Fed with sample data; nothing is loaded.
export function PersonDetailsView({ person, defaultCollapsed = true }: { person: MockPersonnel; defaultCollapsed?: boolean }) {
  const { t } = useTranslation('brokerages-members-info');
  const d = useMemo(() => buildSamplePersonDetails(person), [person]);

  return (
    <CollapsibleSection
      title={t('form.personInfoTitle', { defaultValue: 'Person Information' })}
      defaultOpen={!defaultCollapsed}
    >
      <fieldset disabled className="contents">
        {/* Section 1 - blue */}
        <div className="[&_div.rounded-xl.bg-card.bg-card]:border-blue-500! dark:[&_div.rounded-xl.bg-card.bg-card]:border-blue-500!">
          <NameSectionReplica translations={d.names} languages={L.languages} />
        </div>

        {/* Section 2 - blue */}
        <div className="[&_div.rounded-xl.bg-card.bg-card]:border-blue-500! dark:[&_div.rounded-xl.bg-card.bg-card]:border-blue-500!">
          <PersonalInformationSectionReplica data={d.personal} lookups={L} />
        </div>

        {/* Section 3 - emerald */}
        <div className="[&_div.rounded-xl.bg-card.bg-card]:border-emerald-500! dark:[&_div.rounded-xl.bg-card.bg-card]:border-emerald-500!">
          <NationalitySectionReplica nationalities={d.nationalities} countries={L.countries} />
        </div>

        {/* Sections 4, 5, 6 - coloured borders applied inside the contact section. */}
        <ContactInformationSectionReplica
          emails={d.emails}
          phones={d.phones}
          addresses={d.addresses}
          emailLabels={L.emailLabels}
          phoneLabels={L.phoneLabels}
          addressLabels={L.addressLabels}
          countries={L.countries}
          regions={L.regions}
          cities={L.cities}
        />

        {/* Section 7 - orange */}
        <div className="[&_div.rounded-xl.bg-card.bg-card]:border-orange-500! dark:[&_div.rounded-xl.bg-card.bg-card]:border-orange-500!">
          <EmploymentSectionReplica
            employments={d.employments}
            activityFields={L.activityFields}
            activityUnits={L.activityUnits}
            positions={L.positions}
            contractTypes={L.contractTypes}
          />
        </div>

        {/* Section 8 - cyan */}
        <div className="[&_div.rounded-xl.bg-card.bg-card]:border-cyan-500! dark:[&_div.rounded-xl.bg-card.bg-card]:border-cyan-500!">
          <EducationSectionReplica
            educations={d.educations}
            levels={L.educationLevels}
            fields={L.fieldsOfStudy}
            institutions={L.institutions}
          />
        </div>

        {/* Section 10 - pink */}
        <div className="[&_div.rounded-xl.bg-card.bg-card]:border-pink-500! dark:[&_div.rounded-xl.bg-card.bg-card]:border-pink-500!">
          <RelationshipSectionReplica relationships={d.relationships} types={L.relationshipTypes} />
        </div>

        {/* Section 11 - cyan */}
        <div className="[&_div.rounded-xl.bg-card.bg-card]:border-cyan-500! dark:[&_div.rounded-xl.bg-card.bg-card]:border-cyan-500!">
          <DocumentSectionReplica documents={d.documents} documentTypes={L.documentTypes} />
        </div>

        {/* Section 12 - red */}
        <div className="[&_div.rounded-xl.bg-card.bg-card]:border-red-500! dark:[&_div.rounded-xl.bg-card.bg-card]:border-red-500!">
          <StatusSectionReplica statuses={d.statuses} />
        </div>
      </fieldset>
    </CollapsibleSection>
  );
}
