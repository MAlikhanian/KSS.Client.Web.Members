'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrokerageSelectionCard, useBrokerageContext } from '@/app/brokerages/components';
import { useTranslation } from '@/hooks/useTranslation';
import { Plus, Trash2, FileText } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface CommitteeData {
  id: string;
  name: string;
  isActive: boolean;
  document: File | null;
  documentName: string;
  isDefault: boolean;
}

interface BoardCommitteesFormData {
  committees: CommitteeData[];
}

interface BoardCommitteesFormProps {
  onDataUpdate?: (data: {
    totalCommittees: number;
    activeCommittees: number;
    totalDocuments: number;
  }) => void;
}

const DEFAULT_COMMITTEES = [
  'form.committees.audit',
  'form.committees.credit',
  'form.committees.risk',
  'form.committees.hr',
];

export function BoardCommitteesForm({ onDataUpdate }: BoardCommitteesFormProps) {
  const { t } = useTranslation('brokerages-board-committees');
  const { selectedBrokerageId, setSelectedBrokerageId, isEditMode } = useBrokerageContext();
  const [formData, setFormData] = useState<BoardCommitteesFormData>({
    committees: DEFAULT_COMMITTEES.map((name, index) => ({
      id: `default-${index}`,
      name,
      isActive: false,
      document: null,
      documentName: '',
      isDefault: true,
    })),
  });

  // Calculate statistics
  useEffect(() => {
    if (!onDataUpdate) return;

    const activeCommittees = formData.committees.filter(c => c.isActive).length;
    const totalDocuments = formData.committees.filter(c => c.documentName !== '').length;

    onDataUpdate({
      totalCommittees: formData.committees.length,
      activeCommittees,
      totalDocuments,
    });
  }, [formData.committees, onDataUpdate]);

  const handleCommitteeToggle = (id: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      committees: prev.committees.map((c) =>
        c.id === id ? { ...c, isActive: checked } : c
      ),
    }));
  };

  const handleFileUpload = (id: string, file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      committees: prev.committees.map((c) =>
        c.id === id ? { ...c, document: file, documentName: file?.name || '' } : c
      ),
    }));
  };

  const addCustomCommittee = () => {
    const newCommittee: CommitteeData = {
      id: Date.now().toString(),
      name: '',
      isActive: true,
      document: null,
      documentName: '',
      isDefault: false,
    };
    setFormData((prev) => ({
      ...prev,
      committees: [...prev.committees, newCommittee],
    }));
  };

  const removeCommittee = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      committees: prev.committees.filter((c) => c.id !== id),
    }));
  };

  const handleCommitteeNameChange = (id: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      committees: prev.committees.map((c) =>
        c.id === id ? { ...c, name } : c
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

      {/* Board Committees Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">1</span>
              {t('form.sections.committees')}
            </CardTitle>
            <Button type="button" onClick={addCustomCommittee} size="sm">
              <Plus size={16} className="mr-2" />
              {t('form.actions.addOtherCommittee')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.committees.map((committee) => (
              <div key={committee.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center pt-2">
                    <Checkbox
                      id={`committee-${committee.id}`}
                      checked={committee.isActive}
                      onCheckedChange={(checked) => handleCommitteeToggle(committee.id, checked as boolean)}
                    />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    {committee.isDefault ? (
                      <Label htmlFor={`committee-${committee.id}`} className="text-base font-medium cursor-pointer">
                        {t(committee.name)}
                      </Label>
                    ) : (
                      <div className="space-y-2">
                        <Label>{t('form.fields.committeeName')}</Label>
                        <Input
                          value={committee.name}
                          onChange={(e) => handleCommitteeNameChange(committee.id, e.target.value)}
                          placeholder={t('form.placeholders.committeeName')}
                        />
                      </div>
                    )}

                    {committee.isActive && (
                      <div className="space-y-2">
                        <Label>{t('form.fields.meetingMinutes')}</Label>
                        <div className="flex gap-2">
                          <Input
                            type="file"
                            onChange={(e) => handleFileUpload(committee.id, e.target.files?.[0] || null)}
                            className="flex-1"
                            accept=".pdf,.doc,.docx"
                          />
                          {committee.documentName && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <FileText className="h-4 w-4" />
                              <span className="truncate max-w-xs">{committee.documentName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {!committee.isDefault && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCommittee(committee.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
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

