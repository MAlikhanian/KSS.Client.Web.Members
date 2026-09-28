'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { PersonalInformationSection } from './personal-information-section';
import { ProfessionalInformationSection } from './professional-information-section';
import { ContactInformationSection } from './contact-information-section';
import { EducationCertificatesSection } from './education-certificates-section';
import { FundSelectionCard, useFundContext } from '../../components';

interface FundManagerFormData {
  // Personal Information
  fundManagerName: string;
  fundManagerGender: string;
  fundManagerYearOfBirth: string;
  fundManagerNationalId: string;
  
  // Professional Information
  fundManagerPosition: string;
  fundManagerWorkExperience: string;
  
  // Contact Information
  fundManagerMobile: string;
  fundManagerEmail: string;
  
  // Education & Certificates
  fundManagerEducationDegree: string;
  fundManagerFieldOfStudy: string;
  fundManagerProfessionalCertificates: string;
}

export function FundManagerForm() {
  const { t } = useTranslation('investment-funds');
  const { selectedFundId, setSelectedFundId, isEditMode, clearSelection } = useFundContext();
  const [formData, setFormData] = useState<FundManagerFormData>({
    // Personal Information
    fundManagerName: '',
    fundManagerGender: '',
    fundManagerYearOfBirth: '',
    fundManagerNationalId: '',
    
    // Professional Information
    fundManagerPosition: '',
    fundManagerWorkExperience: '',
    
    // Contact Information
    fundManagerMobile: '',
    fundManagerEmail: '',
    
    // Education & Certificates
    fundManagerEducationDegree: '',
    fundManagerFieldOfStudy: '',
    fundManagerProfessionalCertificates: '',
  });

  const handleInputChange = (field: keyof FundManagerFormData, value: string) => {
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
          fundManagerName: formData.fundManagerName,
          fundManagerGender: formData.fundManagerGender,
          fundManagerYearOfBirth: formData.fundManagerYearOfBirth,
          fundManagerNationalId: formData.fundManagerNationalId,
        }}
        onInputChange={handleInputChange}
      />

      <ProfessionalInformationSection 
        formData={{
          fundManagerPosition: formData.fundManagerPosition,
          fundManagerWorkExperience: formData.fundManagerWorkExperience,
        }}
        onInputChange={handleInputChange}
      />

      <ContactInformationSection 
        formData={{
          fundManagerMobile: formData.fundManagerMobile,
          fundManagerEmail: formData.fundManagerEmail,
        }}
        onInputChange={handleInputChange}
      />

      <EducationCertificatesSection 
        formData={{
          fundManagerEducationDegree: formData.fundManagerEducationDegree,
          fundManagerFieldOfStudy: formData.fundManagerFieldOfStudy,
          fundManagerProfessionalCertificates: formData.fundManagerProfessionalCertificates,
        }}
        onInputChange={handleInputChange}
      />

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline">
          {t('fundManager.form.actions.cancel')}
        </Button>
        <Button type="submit">
          {t('fundManager.form.actions.save')}
        </Button>
      </div>
    </form>
  );
}
