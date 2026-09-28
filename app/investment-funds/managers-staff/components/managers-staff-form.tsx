'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { RelatedPersonsSection } from './related-persons-section';
import { DependentsSection } from './dependents-section';
import { FundSelectionCard, useFundContext } from '../../components';

export interface ManagersStaffFormData {
  // Related Persons Information
  personFullName: string;
  personGender: string;
  personFatherName: string;
  personDateOfBirth: string;
  personNationalId: string;
  personWorkCity: string;
  personWorkUnit: string;
  personPosition: string;
  personAge: string;
  employmentStartDate: string;
  personEducationDegree: string;
  personFieldOfStudy: string;
  personProfessionalCertificates: string;
  personHomeAddress: string;
  personPostalCode: string;
  personMobile: string;
  personEmail: string;
  
  // Dependents Information
  dependentFullName: string;
  dependentFatherName: string;
  dependentDateOfBirth: string;
  dependentNationalId: string;
  dependentPostalCode: string;
  dependentHomeAddress: string;
  dependentPhone: string;
}

export function ManagersStaffForm() {
  const { t } = useTranslation('investment-funds');
  const { selectedFundId, setSelectedFundId, isEditMode, clearSelection } = useFundContext();
  
  const [formData, setFormData] = useState<ManagersStaffFormData>({
    // Related Persons Information
    personFullName: '',
    personGender: '',
    personFatherName: '',
    personDateOfBirth: '',
    personNationalId: '',
    personWorkCity: '',
    personWorkUnit: '',
    personPosition: '',
    personAge: '',
    employmentStartDate: '',
    personEducationDegree: '',
    personFieldOfStudy: '',
    personProfessionalCertificates: '',
    personHomeAddress: '',
    personPostalCode: '',
    personMobile: '',
    personEmail: '',
    
    // Dependents Information
    dependentFullName: '',
    dependentFatherName: '',
    dependentDateOfBirth: '',
    dependentNationalId: '',
    dependentPostalCode: '',
    dependentHomeAddress: '',
    dependentPhone: '',
  });

  const handleInputChange = (field: keyof ManagersStaffFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving managers & staff data:', formData);
    // TODO: Implement save functionality
  };

  const handleSubmit = () => {
    console.log('Submitting managers & staff data:', formData);
    // TODO: Implement submit functionality
  };

  return (
    <div className="space-y-6">
      {/* Fund Selection Card */}
      <FundSelectionCard
        value={selectedFundId}
        onValueChange={setSelectedFundId}
        isEditMode={isEditMode}
        onNewFund={clearSelection}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('managersStaff.form.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('managersStaff.toolbar.description')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave}>
            {t('managersStaff.toolbar.saveDraft')}
          </Button>
          <Button onClick={handleSubmit}>
            {t('managersStaff.toolbar.submit')}
          </Button>
        </div>
      </div>

      <RelatedPersonsSection 
        formData={formData}
        onInputChange={handleInputChange}
      />

      <DependentsSection 
        formData={formData}
        onInputChange={handleInputChange}
      />
    </div>
  );
}
