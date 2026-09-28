'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { CompanySelect } from '@/components/common/company-select';
import { useBrokerages } from '@/hooks/use-brokerages';

interface BrokerageSelectionCardProps {
  value: string;
  onValueChange: (value: string) => void;
  isEditMode?: boolean;
  required?: boolean;
  disabled?: boolean;
}

export function BrokerageSelectionCard({
  value,
  onValueChange,
  isEditMode = false,
  required = false,
  disabled = false,
}: BrokerageSelectionCardProps) {
  const { t } = useTranslation('brokerages-common');
  const { brokerages } = useBrokerages();
  
  const selectedBrokerage = brokerages.find(brokerage => brokerage.id === value);
  const brokerageName = selectedBrokerage?.name || '';

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>
          {t('selectBrokerage.title', { 
            defaultValue: 'Select Brokerage'
          })}
        </CardTitle>
        <CardDescription className="mx-auto max-w-2xl">
          {t('selectBrokerage.description', {
            defaultValue: 'To edit information, select a brokerage from the list.'
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <CompanySelect
              source="brokerage"
              value={value}
              onValueChange={onValueChange}
              placeholder={t('selectBrokerage.placeholder', {
                defaultValue: 'Select brokerage to edit...'
              })}
              label={t('selectBrokerage.label', {
                defaultValue: 'Brokerage'
              })}
              required={required}
              disabled={disabled}
            />
          </div>
          {/* New brokerage button hidden — users can only access assigned brokerages */}
        </div>
        {isEditMode && brokerageName && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-950 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <span className="font-semibold">
                {t('selectBrokerage.editMode', {
                  defaultValue: 'Edit Mode:'
                })}
              </span>{' '}
              {brokerageName}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

