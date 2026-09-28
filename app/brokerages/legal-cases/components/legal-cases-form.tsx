'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrokerageSelectionCard, useBrokerageContext } from '@/app/brokerages/components';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/useTranslation';
import { Plus, Trash2, ChevronDown, ChevronRight, FileText, Upload, Gavel } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LegalCaseData {
  id: string;
  caseNumber: string;
  caseType: string;
  caseStatus: 'ongoing' | 'closed';
  plaintiff: string;
  defendant: string;
  court: string;
  filingDate: string;
  closingDate: string;
  caseDescription: string;
  documents: File[];
  documentNames: string[];
}

interface LegalCasesFormData {
  cases: LegalCaseData[];
}

interface LegalCasesFormProps {
  onDataUpdate?: (data: {
    totalCases: number;
    ongoingCases: number;
    closedCases: number;
    totalDocuments: number;
  }) => void;
}

export function LegalCasesForm({ onDataUpdate }: LegalCasesFormProps) {
  const { t } = useTranslation('brokerages-legal-cases');
  const { selectedBrokerageId, setSelectedBrokerageId, isEditMode } = useBrokerageContext();
  const [formData, setFormData] = useState<LegalCasesFormData>({
    cases: [],
  });
  const [expandedCases, setExpandedCases] = useState<Set<string>>(new Set());

  const toggleCase = (id: string) => {
    setExpandedCases(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Calculate statistics
  useEffect(() => {
    if (!onDataUpdate) return;

    const ongoingCases = formData.cases.filter(c => c.caseStatus === 'ongoing').length;
    const closedCases = formData.cases.filter(c => c.caseStatus === 'closed').length;
    const totalDocuments = formData.cases.reduce((sum, c) => sum + c.documents.length, 0);

    onDataUpdate({
      totalCases: formData.cases.length,
      ongoingCases,
      closedCases,
      totalDocuments,
    });
  }, [formData.cases, onDataUpdate]);

  const handleCaseChange = (id: string, field: keyof LegalCaseData, value: string | boolean | File[] | string[] | 'ongoing' | 'closed') => {
    setFormData((prev) => ({
      ...prev,
      cases: prev.cases.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    }));
  };

  const addCase = () => {
    const newCase: LegalCaseData = {
      id: Date.now().toString(),
      caseNumber: '',
      caseType: '',
      caseStatus: 'ongoing',
      plaintiff: '',
      defendant: '',
      court: '',
      filingDate: '',
      closingDate: '',
      caseDescription: '',
      documents: [],
      documentNames: [],
    };
    setFormData((prev) => ({
      ...prev,
      cases: [newCase, ...prev.cases],
    }));
    setExpandedCases(prev => new Set(prev).add(newCase.id));
  };

  const removeCase = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      cases: prev.cases.filter((c) => c.id !== id),
    }));
  };

  const handleFileUpload = (id: string, files: FileList | null) => {
    if (!files) return;
    
    const filesArray = Array.from(files);
    const fileNames = filesArray.map(f => f.name);
    
    setFormData((prev) => ({
      ...prev,
      cases: prev.cases.map((c) =>
        c.id === id ? {
          ...c,
          documents: [...c.documents, ...filesArray],
          documentNames: [...c.documentNames, ...fileNames],
        } : c
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

      {/* Legal Cases Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">1</span>
              {t('form.sections.legalCases')}
            </CardTitle>
            <Button type="button" onClick={addCase} size="sm">
              <Plus size={16} className="mr-2" />
              {t('form.actions.addCase')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {formData.cases.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>{t('form.noCases')}</p>
                <p className="text-sm">{t('form.clickAddToStart')}</p>
              </div>
            ) : (
              formData.cases.map((legalCase, index) => {
                const isExpanded = expandedCases.has(legalCase.id);
                
                return (
                  <div key={legalCase.id} className="border rounded-lg overflow-hidden">
                    {/* Collapsed Summary View */}
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => toggleCase(legalCase.id)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto hover:bg-transparent"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-500" />
                          )}
                        </Button>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-foreground">
                              {t('form.caseNumber', { number: index + 1 })}
                            </span>
                            {legalCase.caseNumber && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Gavel className="h-3 w-3" />
                                <span>{legalCase.caseNumber}</span>
                              </div>
                            )}
                            <span className={`text-xs px-2 py-1 rounded ${legalCase.caseStatus === 'ongoing' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                              {legalCase.caseStatus === 'ongoing' ? t('form.statuses.ongoing') : t('form.statuses.closed')}
                            </span>
                          </div>
                          {legalCase.caseType && (
                            <div className="mt-1 text-sm text-foreground">
                              {legalCase.caseType}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCase(legalCase.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                    {/* Expanded Details View */}
                    {isExpanded && (
                      <div className="p-6 pt-0 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`caseNumber-${legalCase.id}`}>
                              {t('form.fields.caseNumber')} *
                            </Label>
                            <Input
                              id={`caseNumber-${legalCase.id}`}
                              value={legalCase.caseNumber}
                              onChange={(e) => handleCaseChange(legalCase.id, 'caseNumber', e.target.value)}
                              placeholder={t('form.placeholders.caseNumber')}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`caseType-${legalCase.id}`}>
                              {t('form.fields.caseType')}
                            </Label>
                            <Input
                              id={`caseType-${legalCase.id}`}
                              value={legalCase.caseType}
                              onChange={(e) => handleCaseChange(legalCase.id, 'caseType', e.target.value)}
                              placeholder={t('form.placeholders.caseType')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`caseStatus-${legalCase.id}`}>
                              {t('form.fields.caseStatus')}
                            </Label>
                            <Select
                              value={legalCase.caseStatus}
                              onValueChange={(value: 'ongoing' | 'closed') => handleCaseChange(legalCase.id, 'caseStatus', value)}
                            >
                              <SelectTrigger id={`caseStatus-${legalCase.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ongoing">{t('form.statuses.ongoing')}</SelectItem>
                                <SelectItem value="closed">{t('form.statuses.closed')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`plaintiff-${legalCase.id}`}>
                              {t('form.fields.plaintiff')}
                            </Label>
                            <Input
                              id={`plaintiff-${legalCase.id}`}
                              value={legalCase.plaintiff}
                              onChange={(e) => handleCaseChange(legalCase.id, 'plaintiff', e.target.value)}
                              placeholder={t('form.placeholders.plaintiff')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`defendant-${legalCase.id}`}>
                              {t('form.fields.defendant')}
                            </Label>
                            <Input
                              id={`defendant-${legalCase.id}`}
                              value={legalCase.defendant}
                              onChange={(e) => handleCaseChange(legalCase.id, 'defendant', e.target.value)}
                              placeholder={t('form.placeholders.defendant')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`court-${legalCase.id}`}>
                              {t('form.fields.court')}
                            </Label>
                            <Input
                              id={`court-${legalCase.id}`}
                              value={legalCase.court}
                              onChange={(e) => handleCaseChange(legalCase.id, 'court', e.target.value)}
                              placeholder={t('form.placeholders.court')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`filingDate-${legalCase.id}`}>
                              {t('form.fields.filingDate')}
                            </Label>
                            <Input
                              id={`filingDate-${legalCase.id}`}
                              type="text"
                              value={legalCase.filingDate}
                              onChange={(e) => handleCaseChange(legalCase.id, 'filingDate', e.target.value)}
                              placeholder="1403/01/01"
                            />
                          </div>

                          {legalCase.caseStatus === 'closed' && (
                            <div className="space-y-2">
                              <Label htmlFor={`closingDate-${legalCase.id}`}>
                                {t('form.fields.closingDate')}
                              </Label>
                              <Input
                                id={`closingDate-${legalCase.id}`}
                                type="text"
                                value={legalCase.closingDate}
                                onChange={(e) => handleCaseChange(legalCase.id, 'closingDate', e.target.value)}
                                placeholder="1404/01/01"
                              />
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`caseDescription-${legalCase.id}`}>
                            {t('form.fields.caseDescription')}
                          </Label>
                          <Textarea
                            id={`caseDescription-${legalCase.id}`}
                            value={legalCase.caseDescription}
                            onChange={(e) => handleCaseChange(legalCase.id, 'caseDescription', e.target.value)}
                            placeholder={t('form.placeholders.caseDescription')}
                            rows={4}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>{t('form.fields.documents')}</Label>
                          <div className="flex gap-2">
                            <Input
                              type="file"
                              multiple
                              onChange={(e) => handleFileUpload(legalCase.id, e.target.files)}
                              className="flex-1"
                            />
                            <Button type="button" variant="outline" size="sm">
                              <Upload size={16} className="mr-2" />
                              {t('form.actions.upload')}
                            </Button>
                          </div>
                          {legalCase.documentNames.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {legalCase.documentNames.map((name, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <FileText className="h-4 w-4" />
                                  <span>{name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
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

