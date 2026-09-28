'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrokerageSelectionCard, useBrokerageContext } from '@/app/brokerages/components';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/useTranslation';
import { Plus, Trash2, ChevronDown, ChevronRight, FileText, Calendar } from 'lucide-react';

interface ApprovalData {
  id: string;
  technicalApprovalId: string;
  technicalApprovalIdName: string;
  featureName: string;
  contractorId: string;
  contractorName: string;
  approvalNum: string;
  approvalDate: string;
  versionNum: string;
  statusId: string;
  statusName: string;
  description: string;
  validityDate: string;
  isExpired: boolean;
}

interface ApprovalsFormData {
  approvals: ApprovalData[];
}

interface ApprovalsFormProps {
  onDataUpdate?: (data: {
    totalApprovals: number;
    activeApprovals: number;
    expiredApprovals: number;
    uniqueContractors: number;
  }) => void;
}

export function ApprovalsForm({ onDataUpdate }: ApprovalsFormProps) {
  const { t } = useTranslation('brokerages-approvals');
  const { selectedBrokerageId, setSelectedBrokerageId, isEditMode } = useBrokerageContext();
  const [formData, setFormData] = useState<ApprovalsFormData>({
    approvals: [],
  });
  const [expandedApprovals, setExpandedApprovals] = useState<Set<string>>(new Set());

  const toggleApproval = (id: string) => {
    setExpandedApprovals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Calculate and update statistics whenever approvals data changes
  useEffect(() => {
    if (!onDataUpdate) return;

    const activeApprovals = formData.approvals.filter(approval => 
      approval.statusId === '0' && !approval.isExpired
    ).length;

    const expiredApprovals = formData.approvals.filter(approval => 
      approval.isExpired
    ).length;

    const uniqueContractors = new Set(
      formData.approvals
        .map(approval => approval.contractorId)
        .filter(id => id !== '')
    ).size;

    onDataUpdate({
      totalApprovals: formData.approvals.length,
      activeApprovals,
      expiredApprovals,
      uniqueContractors,
    });
  }, [formData.approvals, onDataUpdate]);

  // Load approvals data when brokerage is selected
  useEffect(() => {
    const loadApprovalsData = async () => {
      if (!selectedBrokerageId) {
        setFormData(prev => ({ ...prev, approvals: [] }));
        return;
      }

      try {
        const response = await fetch(`/api/brokerages/${selectedBrokerageId}/approvals`);
        if (!response.ok) {
          throw new Error('Failed to load approvals');
        }
        
        const data: ApprovalData[] = await response.json();
        
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, approvals: data }));
        } else {
          setFormData(prev => ({ ...prev, approvals: [] }));
        }
      } catch (error) {
        console.error('Error loading approvals data:', error);
        setFormData(prev => ({ ...prev, approvals: [] }));
      }
    };

    loadApprovalsData();
  }, [selectedBrokerageId]);

  const handleApprovalChange = (id: string, field: keyof ApprovalData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      approvals: prev.approvals.map((approval) =>
        approval.id === id ? { ...approval, [field]: value } : approval
      ),
    }));
  };

  const addApproval = () => {
    const newApproval: ApprovalData = {
      id: Date.now().toString(),
      technicalApprovalId: '',
      technicalApprovalIdName: '',
      featureName: '',
      contractorId: '',
      contractorName: '',
      approvalNum: '',
      approvalDate: '',
      versionNum: '',
      statusId: '',
      statusName: '',
      description: '',
      validityDate: '',
      isExpired: false,
    };
    setFormData((prev) => ({
      ...prev,
      approvals: [newApproval, ...prev.approvals],
    }));
    setExpandedApprovals(prev => new Set(prev).add(newApproval.id));
  };

  const removeApproval = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      approvals: prev.approvals.filter((approval) => approval.id !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    console.log('Edit mode:', isEditMode);
    console.log('Total approvals:', formData.approvals.length);
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

      {/* Technical Approvals Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">1</span>
              {t('table.title')}
            </CardTitle>
            <Button type="button" onClick={addApproval} size="sm">
              <Plus size={16} className="mr-2" />
              {t('form.actions.addApproval')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {formData.approvals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>{t('form.noApprovals')}</p>
                <p className="text-sm">{t('form.clickAddToStart')}</p>
              </div>
            ) : (
              formData.approvals.map((approval, index) => {
                const isExpanded = expandedApprovals.has(approval.id);
                
                return (
                  <div key={approval.id} className="border rounded-lg overflow-hidden">
                    {/* Collapsed Summary View */}
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => toggleApproval(approval.id)}
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
                              {t('form.approvalNumber', { number: index + 1 })}
                            </span>
                            {approval.approvalNum && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <FileText className="h-3 w-3" />
                                <span>{approval.approvalNum}</span>
                              </div>
                            )}
                          </div>
                          {approval.technicalApprovalIdName && (
                            <div className="mt-1 text-sm text-foreground">
                              {approval.technicalApprovalIdName}
                            </div>
                          )}
                          {approval.featureName && (
                            <div className="mt-1 text-sm text-muted-foreground">
                              {approval.featureName}
                            </div>
                          )}
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            {approval.versionNum && (
                              <div className="flex items-center gap-1">
                                <span>{t('table.columns.version')}: {approval.versionNum}</span>
                              </div>
                            )}
                            {approval.approvalDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{approval.approvalDate}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeApproval(approval.id);
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
                            <Label htmlFor={`technicalApprovalId-${approval.id}`}>
                              {t('form.fields.technicalApprovalId')}
                            </Label>
                            <Input
                              id={`technicalApprovalId-${approval.id}`}
                              value={approval.technicalApprovalId}
                              onChange={(e) => handleApprovalChange(approval.id, 'technicalApprovalId', e.target.value)}
                              placeholder={t('form.placeholders.technicalApprovalId')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`technicalApprovalIdName-${approval.id}`}>
                              {t('form.fields.technicalApprovalIdName')}
                            </Label>
                            <Input
                              id={`technicalApprovalIdName-${approval.id}`}
                              value={approval.technicalApprovalIdName}
                              onChange={(e) => handleApprovalChange(approval.id, 'technicalApprovalIdName', e.target.value)}
                              placeholder={t('form.placeholders.technicalApprovalIdName')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`featureName-${approval.id}`}>
                              {t('form.fields.featureName')}
                            </Label>
                            <Input
                              id={`featureName-${approval.id}`}
                              value={approval.featureName}
                              onChange={(e) => handleApprovalChange(approval.id, 'featureName', e.target.value)}
                              placeholder={t('form.placeholders.featureName')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`contractorId-${approval.id}`}>
                              {t('form.fields.contractorId')}
                            </Label>
                            <Input
                              id={`contractorId-${approval.id}`}
                              value={approval.contractorId}
                              onChange={(e) => handleApprovalChange(approval.id, 'contractorId', e.target.value)}
                              placeholder={t('form.placeholders.contractorId')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`contractorName-${approval.id}`}>
                              {t('form.fields.contractorName')}
                            </Label>
                            <Input
                              id={`contractorName-${approval.id}`}
                              value={approval.contractorName}
                              onChange={(e) => handleApprovalChange(approval.id, 'contractorName', e.target.value)}
                              placeholder={t('form.placeholders.contractorName')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`approvalNum-${approval.id}`}>
                              {t('table.columns.approvalNumber')} *
                            </Label>
                            <Input
                              id={`approvalNum-${approval.id}`}
                              value={approval.approvalNum}
                              onChange={(e) => handleApprovalChange(approval.id, 'approvalNum', e.target.value)}
                              placeholder={t('form.placeholders.approvalNum')}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`approvalDate-${approval.id}`}>
                              {t('table.columns.issueDate')}
                            </Label>
                            <Input
                              id={`approvalDate-${approval.id}`}
                              type="text"
                              value={approval.approvalDate}
                              onChange={(e) => handleApprovalChange(approval.id, 'approvalDate', e.target.value)}
                              placeholder="1403/01/01"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`versionNum-${approval.id}`}>
                              {t('table.columns.version')}
                            </Label>
                            <Input
                              id={`versionNum-${approval.id}`}
                              value={approval.versionNum}
                              onChange={(e) => handleApprovalChange(approval.id, 'versionNum', e.target.value)}
                              placeholder="1.0.0"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`statusId-${approval.id}`}>
                              {t('form.fields.statusId')}
                            </Label>
                            <Input
                              id={`statusId-${approval.id}`}
                              value={approval.statusId}
                              onChange={(e) => handleApprovalChange(approval.id, 'statusId', e.target.value)}
                              placeholder="0"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`statusName-${approval.id}`}>
                              {t('form.fields.statusName')}
                            </Label>
                            <Input
                              id={`statusName-${approval.id}`}
                              value={approval.statusName}
                              onChange={(e) => handleApprovalChange(approval.id, 'statusName', e.target.value)}
                              placeholder={t('form.placeholders.statusName')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`validityDate-${approval.id}`}>
                              {t('table.columns.validityDate')}
                            </Label>
                            <Input
                              id={`validityDate-${approval.id}`}
                              type="text"
                              value={approval.validityDate}
                              onChange={(e) => handleApprovalChange(approval.id, 'validityDate', e.target.value)}
                              placeholder="1404/01/01"
                            />
                          </div>

                          <div className="space-y-2 flex items-center">
                            <input
                              id={`isExpired-${approval.id}`}
                              type="checkbox"
                              checked={approval.isExpired}
                              onChange={(e) => handleApprovalChange(approval.id, 'isExpired', e.target.checked)}
                              className="mr-2"
                            />
                            <Label htmlFor={`isExpired-${approval.id}`} className="cursor-pointer">
                              {t('table.columns.isExpired')}
                            </Label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`description-${approval.id}`}>
                            {t('form.fields.description')}
                          </Label>
                          <Textarea
                            id={`description-${approval.id}`}
                            value={approval.description}
                            onChange={(e) => handleApprovalChange(approval.id, 'description', e.target.value)}
                            placeholder={t('form.placeholders.description')}
                            rows={3}
                          />
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

