'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrokerageSelectionCard, useBrokerageContext } from '@/app/brokerages/components';
import { useTranslation } from '@/hooks/useTranslation';
import { Plus, Trash2, FileText } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PersonData {
  id: string;
  fullName: string;
  position: string;
}

interface VolunteerData {
  id: string;
  personId: string;
  personName: string;
  type: 'workingGroup' | 'board';
  formDocument: File | null;
  formDocumentName: string;
}

interface RepresentativeData {
  id: string;
  personId: string;
  personName: string;
  type: 'workingGroup' | 'board';
}

interface AssociationCooperationFormData {
  volunteers: VolunteerData[];
  representatives: RepresentativeData[];
}

interface AssociationCooperationFormProps {
  onDataUpdate?: (data: {
    totalVolunteers: number;
    totalRepresentatives: number;
    workingGroupVolunteers: number;
    boardVolunteers: number;
  }) => void;
}

export function AssociationCooperationForm({ onDataUpdate }: AssociationCooperationFormProps) {
  const { t } = useTranslation('brokerages-association');
  const { selectedBrokerageId, setSelectedBrokerageId, isEditMode } = useBrokerageContext();
  const [formData, setFormData] = useState<AssociationCooperationFormData>({
    volunteers: [],
    representatives: [],
  });
  const [relatedPersons, setRelatedPersons] = useState<PersonData[]>([]);

  // Calculate statistics
  useEffect(() => {
    if (!onDataUpdate) return;

    const workingGroupVolunteers = formData.volunteers.filter(v => v.type === 'workingGroup').length;
    const boardVolunteers = formData.volunteers.filter(v => v.type === 'board').length;

    onDataUpdate({
      totalVolunteers: formData.volunteers.length,
      totalRepresentatives: formData.representatives.length,
      workingGroupVolunteers,
      boardVolunteers,
    });
  }, [formData.volunteers, formData.representatives, onDataUpdate]);

  // Load related persons from the related-parties data
  useEffect(() => {
    const loadRelatedPersons = async () => {
      if (!selectedBrokerageId) {
        setRelatedPersons([]);
        return;
      }

      // Mock data - replace with actual API call
      const mockPersons: PersonData[] = [
        { id: '1', fullName: 'علی احمدی', position: 'مدیر عامل' },
        { id: '2', fullName: 'محمد رضایی', position: 'معاون مالی' },
        { id: '3', fullName: 'فاطمه کریمی', position: 'مدیر اجرایی' },
      ];
      
      setRelatedPersons(mockPersons);
    };

    loadRelatedPersons();
  }, [selectedBrokerageId]);

  const addVolunteer = (type: 'workingGroup' | 'board') => {
    const newVolunteer: VolunteerData = {
      id: Date.now().toString(),
      personId: '',
      personName: '',
      type,
      formDocument: null,
      formDocumentName: '',
    };
    setFormData((prev) => ({
      ...prev,
      volunteers: [...prev.volunteers, newVolunteer],
    }));
  };

  const removeVolunteer = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      volunteers: prev.volunteers.filter((v) => v.id !== id),
    }));
  };

  const addRepresentative = (type: 'workingGroup' | 'board') => {
    const newRepresentative: RepresentativeData = {
      id: Date.now().toString(),
      personId: '',
      personName: '',
      type,
    };
    setFormData((prev) => ({
      ...prev,
      representatives: [...prev.representatives, newRepresentative],
    }));
  };

  const removeRepresentative = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      representatives: prev.representatives.filter((r) => r.id !== id),
    }));
  };

  const handleVolunteerPersonChange = (id: string, personId: string) => {
    const person = relatedPersons.find(p => p.id === personId);
    setFormData((prev) => ({
      ...prev,
      volunteers: prev.volunteers.map((v) =>
        v.id === id ? { ...v, personId, personName: person?.fullName || '' } : v
      ),
    }));
  };

  const handleRepresentativePersonChange = (id: string, personId: string) => {
    const person = relatedPersons.find(p => p.id === personId);
    setFormData((prev) => ({
      ...prev,
      representatives: prev.representatives.map((r) =>
        r.id === id ? { ...r, personId, personName: person?.fullName || '' } : r
      ),
    }));
  };

  const handleFileUpload = (id: string, file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      volunteers: prev.volunteers.map((v) =>
        v.id === id ? { ...v, formDocument: file, formDocumentName: file?.name || '' } : v
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Brokerage Selection */}
      <BrokerageSelectionCard
        value={selectedBrokerageId}
        onValueChange={setSelectedBrokerageId}
        isEditMode={isEditMode}
        required
      />

      {/* Volunteers Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">1</span>
            {t('form.sections.volunteers')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Working Group Volunteers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{t('form.sections.workingGroupVolunteers')}</h3>
              <Button type="button" onClick={() => addVolunteer('workingGroup')} size="sm">
                <Plus size={16} className="mr-2" />
                {t('form.actions.addVolunteer')}
              </Button>
            </div>
            {formData.volunteers.filter(v => v.type === 'workingGroup').map((volunteer) => (
              <div key={volunteer.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t('form.fields.person')}</Label>
                      <Select
                        value={volunteer.personId}
                        onValueChange={(value) => handleVolunteerPersonChange(volunteer.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('form.placeholders.selectPerson')} />
                        </SelectTrigger>
                        <SelectContent>
                          {relatedPersons.map((person) => (
                            <SelectItem key={person.id} value={person.id}>
                              {person.fullName} - {person.position}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t('form.fields.volunteerForm')}</Label>
                      <div className="flex gap-2">
                        <Input
                          type="file"
                          onChange={(e) => handleFileUpload(volunteer.id, e.target.files?.[0] || null)}
                          className="flex-1"
                        />
                        {volunteer.formDocumentName && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span className="truncate max-w-xs">{volunteer.formDocumentName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVolunteer(volunteer.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Board Volunteers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{t('form.sections.boardVolunteers')}</h3>
              <Button type="button" onClick={() => addVolunteer('board')} size="sm">
                <Plus size={16} className="mr-2" />
                {t('form.actions.addVolunteer')}
              </Button>
            </div>
            {formData.volunteers.filter(v => v.type === 'board').map((volunteer) => (
              <div key={volunteer.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t('form.fields.person')}</Label>
                      <Select
                        value={volunteer.personId}
                        onValueChange={(value) => handleVolunteerPersonChange(volunteer.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('form.placeholders.selectPerson')} />
                        </SelectTrigger>
                        <SelectContent>
                          {relatedPersons.map((person) => (
                            <SelectItem key={person.id} value={person.id}>
                              {person.fullName} - {person.position}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t('form.fields.volunteerForm')}</Label>
                      <div className="flex gap-2">
                        <Input
                          type="file"
                          onChange={(e) => handleFileUpload(volunteer.id, e.target.files?.[0] || null)}
                          className="flex-1"
                        />
                        {volunteer.formDocumentName && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span className="truncate max-w-xs">{volunteer.formDocumentName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVolunteer(volunteer.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Representatives Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">2</span>
            {t('form.sections.representatives')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Working Group Representatives */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{t('form.sections.workingGroupRepresentatives')}</h3>
              <Button type="button" onClick={() => addRepresentative('workingGroup')} size="sm">
                <Plus size={16} className="mr-2" />
                {t('form.actions.addRepresentative')}
              </Button>
            </div>
            {formData.representatives.filter(r => r.type === 'workingGroup').map((representative) => (
              <div key={representative.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="space-y-2">
                      <Label>{t('form.fields.person')}</Label>
                      <Select
                        value={representative.personId}
                        onValueChange={(value) => handleRepresentativePersonChange(representative.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('form.placeholders.selectPerson')} />
                        </SelectTrigger>
                        <SelectContent>
                          {relatedPersons.map((person) => (
                            <SelectItem key={person.id} value={person.id}>
                              {person.fullName} - {person.position}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRepresentative(representative.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Board Representatives */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{t('form.sections.boardRepresentatives')}</h3>
              <Button type="button" onClick={() => addRepresentative('board')} size="sm">
                <Plus size={16} className="mr-2" />
                {t('form.actions.addRepresentative')}
              </Button>
            </div>
            {formData.representatives.filter(r => r.type === 'board').map((representative) => (
              <div key={representative.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="space-y-2">
                      <Label>{t('form.fields.person')}</Label>
                      <Select
                        value={representative.personId}
                        onValueChange={(value) => handleRepresentativePersonChange(representative.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('form.placeholders.selectPerson')} />
                        </SelectTrigger>
                        <SelectContent>
                          {relatedPersons.map((person) => (
                            <SelectItem key={person.id} value={person.id}>
                              {person.fullName} - {person.position}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRepresentative(representative.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline">
          {t('form.actions.cancel')}
        </Button>
        <Button type="submit">
          {t('form.actions.save')}
        </Button>
      </div>
    </form>
  );
}

