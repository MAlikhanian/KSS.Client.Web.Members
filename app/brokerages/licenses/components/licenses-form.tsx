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

interface LicenseData {
  id: string;
  nationalId: string;
  licenseTypeId: string;
  licenseType: string;
  newLicenseTypeId: string;
  licenseNo: string;
  licenseStatusId: string;
  licenseStatus: string;
  licenseStatusDescription: string;
  instituteTypeId: string;
  instituteType: string;
  instituteKindId: string;
  instituteKind: string;
  startDate: string;
  expireDate: string;
  isExpired: boolean;
  trusteeId: string;
  trusteeContractStart: string;
  trusteeContractExpire: string;
  industryCategory: string;
  signInIndustry: string;
}

interface LicensesFormData {
  licenses: LicenseData[];
}

interface LicensesFormProps {
  onDataUpdate?: (data: {
    totalLicenses: number;
    activeLicenses: number;
    expiredLicenses: number;
    uniqueLicenseTypes: number;
  }) => void;
}

export function LicensesForm({ onDataUpdate }: LicensesFormProps) {
  const { t } = useTranslation('brokerages-licenses');
  const { selectedBrokerageId, setSelectedBrokerageId, isEditMode } = useBrokerageContext();
  const [formData, setFormData] = useState<LicensesFormData>({
    licenses: [],
  });
  const [expandedLicenses, setExpandedLicenses] = useState<Set<string>>(new Set());

  const toggleLicense = (id: string) => {
    setExpandedLicenses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Calculate and update statistics whenever licenses data changes
  useEffect(() => {
    if (!onDataUpdate) return;

    const activeLicenses = formData.licenses.filter(license => 
      license.licenseStatusId === '1' && !license.isExpired
    ).length;

    const expiredLicenses = formData.licenses.filter(license => 
      license.isExpired
    ).length;

    const uniqueLicenseTypes = new Set(
      formData.licenses
        .map(license => license.licenseTypeId)
        .filter(id => id !== '')
    ).size;

    onDataUpdate({
      totalLicenses: formData.licenses.length,
      activeLicenses,
      expiredLicenses,
      uniqueLicenseTypes,
    });
  }, [formData.licenses, onDataUpdate]);

  // Load licenses data when brokerage is selected
  useEffect(() => {
    const loadLicensesData = async () => {
      if (!selectedBrokerageId) {
        setFormData(prev => ({ ...prev, licenses: [] }));
        return;
      }

      try {
        const response = await fetch(`/api/brokerages/${selectedBrokerageId}/licenses`);
        if (!response.ok) {
          throw new Error('Failed to load licenses');
        }
        
        const data: LicenseData[] = await response.json();
        
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, licenses: data }));
        } else {
          setFormData(prev => ({ ...prev, licenses: [] }));
        }
      } catch (error) {
        console.error('Error loading licenses data:', error);
        setFormData(prev => ({ ...prev, licenses: [] }));
      }
    };

    loadLicensesData();
  }, [selectedBrokerageId]);

  const handleLicenseChange = (id: string, field: keyof LicenseData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      licenses: prev.licenses.map((license) =>
        license.id === id ? { ...license, [field]: value } : license
      ),
    }));
  };

  const addLicense = () => {
    const newLicense: LicenseData = {
      id: Date.now().toString(),
      nationalId: '',
      licenseTypeId: '',
      licenseType: '',
      newLicenseTypeId: '',
      licenseNo: '',
      licenseStatusId: '',
      licenseStatus: '',
      licenseStatusDescription: '',
      instituteTypeId: '',
      instituteType: '',
      instituteKindId: '',
      instituteKind: '',
      startDate: '',
      expireDate: '',
      isExpired: false,
      trusteeId: '',
      trusteeContractStart: '',
      trusteeContractExpire: '',
      industryCategory: '',
      signInIndustry: '',
    };
    setFormData((prev) => ({
      ...prev,
      licenses: [newLicense, ...prev.licenses],
    }));
    setExpandedLicenses(prev => new Set(prev).add(newLicense.id));
  };

  const removeLicense = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      licenses: prev.licenses.filter((license) => license.id !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    console.log('Edit mode:', isEditMode);
    console.log('Total licenses:', formData.licenses.length);
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

      {/* Activity Licenses Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">1</span>
              {t('table.title')}
            </CardTitle>
            <Button type="button" onClick={addLicense} size="sm">
              <Plus size={16} className="mr-2" />
              {t('form.actions.addLicense')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {formData.licenses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>{t('form.noLicenses')}</p>
                <p className="text-sm">{t('form.clickAddToStart')}</p>
              </div>
            ) : (
              formData.licenses.map((license, index) => {
                const isExpanded = expandedLicenses.has(license.id);
                
                return (
                  <div key={license.id} className="border rounded-lg overflow-hidden">
                    {/* Collapsed Summary View */}
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => toggleLicense(license.id)}
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
                              {t('form.licenseNumber', { number: index + 1 })}
                            </span>
                            {license.licenseNo && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <FileText className="h-3 w-3" />
                                <span>{license.licenseNo}</span>
                              </div>
                            )}
                          </div>
                          {license.licenseType && (
                            <div className="mt-1 text-sm text-foreground">
                              {license.licenseType}
                            </div>
                          )}
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            {license.startDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{license.startDate}</span>
                              </div>
                            )}
                            {license.expireDate && (
                              <div className="flex items-center gap-1">
                                <span>{t('table.columns.expireDate')}: {license.expireDate}</span>
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
                          removeLicense(license.id);
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
                            <Label htmlFor={`nationalId-${license.id}`}>
                              {t('table.columns.nationalId')}
                            </Label>
                            <Input
                              id={`nationalId-${license.id}`}
                              value={license.nationalId}
                              onChange={(e) => handleLicenseChange(license.id, 'nationalId', e.target.value)}
                              placeholder={t('form.placeholders.nationalId')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`licenseTypeId-${license.id}`}>
                              {t('form.fields.licenseTypeId')}
                            </Label>
                            <Input
                              id={`licenseTypeId-${license.id}`}
                              value={license.licenseTypeId}
                              onChange={(e) => handleLicenseChange(license.id, 'licenseTypeId', e.target.value)}
                              placeholder={t('form.placeholders.licenseTypeId')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`licenseType-${license.id}`}>
                              {t('table.columns.licenseType')}
                            </Label>
                            <Input
                              id={`licenseType-${license.id}`}
                              value={license.licenseType}
                              onChange={(e) => handleLicenseChange(license.id, 'licenseType', e.target.value)}
                              placeholder={t('form.placeholders.licenseType')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`newLicenseTypeId-${license.id}`}>
                              {t('form.fields.newLicenseTypeId')}
                            </Label>
                            <Input
                              id={`newLicenseTypeId-${license.id}`}
                              value={license.newLicenseTypeId}
                              onChange={(e) => handleLicenseChange(license.id, 'newLicenseTypeId', e.target.value)}
                              placeholder={t('form.placeholders.newLicenseTypeId')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`licenseNo-${license.id}`}>
                              {t('table.columns.licenseNumber')} *
                            </Label>
                            <Input
                              id={`licenseNo-${license.id}`}
                              value={license.licenseNo}
                              onChange={(e) => handleLicenseChange(license.id, 'licenseNo', e.target.value)}
                              placeholder={t('form.placeholders.licenseNo')}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`licenseStatusId-${license.id}`}>
                              {t('form.fields.licenseStatusId')}
                            </Label>
                            <Input
                              id={`licenseStatusId-${license.id}`}
                              value={license.licenseStatusId}
                              onChange={(e) => handleLicenseChange(license.id, 'licenseStatusId', e.target.value)}
                              placeholder="1"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`licenseStatus-${license.id}`}>
                              {t('table.columns.status')}
                            </Label>
                            <Input
                              id={`licenseStatus-${license.id}`}
                              value={license.licenseStatus}
                              onChange={(e) => handleLicenseChange(license.id, 'licenseStatus', e.target.value)}
                              placeholder={t('form.placeholders.licenseStatus')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`instituteTypeId-${license.id}`}>
                              {t('form.fields.instituteTypeId')}
                            </Label>
                            <Input
                              id={`instituteTypeId-${license.id}`}
                              value={license.instituteTypeId}
                              onChange={(e) => handleLicenseChange(license.id, 'instituteTypeId', e.target.value)}
                              placeholder={t('form.placeholders.instituteTypeId')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`instituteType-${license.id}`}>
                              {t('table.columns.instituteType')}
                            </Label>
                            <Input
                              id={`instituteType-${license.id}`}
                              value={license.instituteType}
                              onChange={(e) => handleLicenseChange(license.id, 'instituteType', e.target.value)}
                              placeholder={t('form.placeholders.instituteType')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`instituteKindId-${license.id}`}>
                              {t('form.fields.instituteKindId')}
                            </Label>
                            <Input
                              id={`instituteKindId-${license.id}`}
                              value={license.instituteKindId}
                              onChange={(e) => handleLicenseChange(license.id, 'instituteKindId', e.target.value)}
                              placeholder={t('form.placeholders.instituteKindId')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`instituteKind-${license.id}`}>
                              {t('form.fields.instituteKind')}
                            </Label>
                            <Input
                              id={`instituteKind-${license.id}`}
                              value={license.instituteKind}
                              onChange={(e) => handleLicenseChange(license.id, 'instituteKind', e.target.value)}
                              placeholder={t('form.placeholders.instituteKind')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`startDate-${license.id}`}>
                              {t('table.columns.startDate')}
                            </Label>
                            <Input
                              id={`startDate-${license.id}`}
                              type="text"
                              value={license.startDate}
                              onChange={(e) => handleLicenseChange(license.id, 'startDate', e.target.value)}
                              placeholder="1403/01/01"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`expireDate-${license.id}`}>
                              {t('table.columns.expireDate')}
                            </Label>
                            <Input
                              id={`expireDate-${license.id}`}
                              type="text"
                              value={license.expireDate}
                              onChange={(e) => handleLicenseChange(license.id, 'expireDate', e.target.value)}
                              placeholder="1404/01/01"
                            />
                          </div>

                          <div className="space-y-2 flex items-center">
                            <input
                              id={`isExpired-${license.id}`}
                              type="checkbox"
                              checked={license.isExpired}
                              onChange={(e) => handleLicenseChange(license.id, 'isExpired', e.target.checked)}
                              className="mr-2"
                            />
                            <Label htmlFor={`isExpired-${license.id}`} className="cursor-pointer">
                              {t('table.columns.isExpired')}
                            </Label>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`trusteeId-${license.id}`}>
                              {t('form.fields.trusteeId')}
                            </Label>
                            <Input
                              id={`trusteeId-${license.id}`}
                              value={license.trusteeId}
                              onChange={(e) => handleLicenseChange(license.id, 'trusteeId', e.target.value)}
                              placeholder={t('form.placeholders.trusteeId')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`trusteeContractStart-${license.id}`}>
                              {t('form.fields.trusteeContractStart')}
                            </Label>
                            <Input
                              id={`trusteeContractStart-${license.id}`}
                              type="text"
                              value={license.trusteeContractStart}
                              onChange={(e) => handleLicenseChange(license.id, 'trusteeContractStart', e.target.value)}
                              placeholder="1403/01/01"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`trusteeContractExpire-${license.id}`}>
                              {t('form.fields.trusteeContractExpire')}
                            </Label>
                            <Input
                              id={`trusteeContractExpire-${license.id}`}
                              type="text"
                              value={license.trusteeContractExpire}
                              onChange={(e) => handleLicenseChange(license.id, 'trusteeContractExpire', e.target.value)}
                              placeholder="1404/01/01"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`industryCategory-${license.id}`}>
                              {t('form.fields.industryCategory')}
                            </Label>
                            <Input
                              id={`industryCategory-${license.id}`}
                              value={license.industryCategory}
                              onChange={(e) => handleLicenseChange(license.id, 'industryCategory', e.target.value)}
                              placeholder={t('form.placeholders.industryCategory')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`signInIndustry-${license.id}`}>
                              {t('form.fields.signInIndustry')}
                            </Label>
                            <Input
                              id={`signInIndustry-${license.id}`}
                              value={license.signInIndustry}
                              onChange={(e) => handleLicenseChange(license.id, 'signInIndustry', e.target.value)}
                              placeholder={t('form.placeholders.signInIndustry')}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`licenseStatusDescription-${license.id}`}>
                            {t('form.fields.licenseStatusDescription')}
                          </Label>
                          <Textarea
                            id={`licenseStatusDescription-${license.id}`}
                            value={license.licenseStatusDescription}
                            onChange={(e) => handleLicenseChange(license.id, 'licenseStatusDescription', e.target.value)}
                            placeholder={t('form.placeholders.licenseStatusDescription')}
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

