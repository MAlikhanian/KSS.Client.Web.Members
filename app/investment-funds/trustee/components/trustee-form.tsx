'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { PersonalInformationSection } from './personal-information-section';
import { ProfessionalInformationSection } from './professional-information-section';
import { ContactInformationSection } from './contact-information-section';
import { EducationCertificatesSection } from './education-certificates-section';
import { FundSelectionCard, useFundContext } from '../../components';

interface TrusteeFormData {
  // Personal Information
  trusteeName: string;
  trusteeGender: string;
  trusteeYearOfBirth: string;
  trusteeNationalId: string;
  
  // Professional Information
  trusteePosition: string;
  trusteeWorkExperience: string;
  
  // Contact Information
  trusteeMobile: string;
  trusteeEmail: string;
  
  // Education & Certificates
  trusteeEducationDegree: string;
  trusteeFieldOfStudy: string;
  trusteeProfessionalCertificates: string;
}

export function TrusteeForm() {
  const { t } = useTranslation('investment-funds');
  const { selectedFundId, setSelectedFundId, isEditMode, clearSelection } = useFundContext();
  const [formData, setFormData] = useState<TrusteeFormData>({
    // Personal Information
    trusteeName: '',
    trusteeGender: '',
    trusteeYearOfBirth: '',
    trusteeNationalId: '',
    
    // Professional Information
    trusteePosition: '',
    trusteeWorkExperience: '',
    
    // Contact Information
    trusteeMobile: '',
    trusteeEmail: '',
    
    // Education & Certificates
    trusteeEducationDegree: '',
    trusteeFieldOfStudy: '',
    trusteeProfessionalCertificates: '',
  });

  const handleInputChange = (field: keyof TrusteeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Fund Selection Card */}
      <FundSelectionCard
        value={selectedFundId}
        onValueChange={setSelectedFundId}
        isEditMode={isEditMode}
        onNewFund={clearSelection}
      />

      <PersonalInformationSection 
        formData={{
          trusteeName: formData.trusteeName,
          trusteeGender: formData.trusteeGender,
          trusteeYearOfBirth: formData.trusteeYearOfBirth,
          trusteeNationalId: formData.trusteeNationalId,
        }}
        onInputChange={handleInputChange}
      />

      <ProfessionalInformationSection 
        formData={{
          trusteePosition: formData.trusteePosition,
          trusteeWorkExperience: formData.trusteeWorkExperience,
        }}
        onInputChange={handleInputChange}
      />

      <ContactInformationSection 
        formData={{
          trusteeMobile: formData.trusteeMobile,
          trusteeEmail: formData.trusteeEmail,
        }}
        onInputChange={handleInputChange}
      />

      <EducationCertificatesSection 
        formData={{
          trusteeEducationDegree: formData.trusteeEducationDegree,
          trusteeFieldOfStudy: formData.trusteeFieldOfStudy,
          trusteeProfessionalCertificates: formData.trusteeProfessionalCertificates,
        }}
        onInputChange={handleInputChange}
      />

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline">
          {t('trustee.form.actions.cancel')}
        </Button>
        <Button type="submit">
          {t('trustee.form.actions.save')}
        </Button>
      </div>
    </form>
  );
}
