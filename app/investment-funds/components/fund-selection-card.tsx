'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { CompanySelect } from '@/components/common/company-select';
import { useInvestmentFunds } from '@/hooks/use-investment-funds';

interface FundSelectionCardProps {
  value: string;
  onValueChange: (value: string) => void;
  isEditMode?: boolean;
  onNewFund?: () => void;
  required?: boolean;
  disabled?: boolean;
}

export function FundSelectionCard({
  value,
  onValueChange,
  isEditMode = false,
  onNewFund,
  required = false,
  disabled = false,
}: FundSelectionCardProps) {
  const { t } = useTranslation('investment-funds');
  const { investmentFunds } = useInvestmentFunds();
  
  const selectedFund = investmentFunds.find(fund => fund.id === value);
  const fundName = selectedFund?.name || '';

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>
          {t('common.selectFund.title', { 
            defaultValue: 'Select Investment Fund'
          })}
        </CardTitle>
        <CardDescription className="mx-auto max-w-2xl">
          {t('common.selectFund.description', { 
            defaultValue: 'Choose an existing fund to edit, or leave the field empty to register a new one.'
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <CompanySelect
              source="fund"
              value={value}
              onValueChange={onValueChange}
              placeholder={t('common.selectFund.placeholder', {
                defaultValue: 'Select a fund to edit...'
              })}
              label={t('common.selectFund.label', {
                defaultValue: 'Investment Fund'
              })}
              required={required}
              disabled={disabled}
            />
          </div>
          {value && onNewFund && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onNewFund}
            >
              {t('common.selectFund.newFund', {
                defaultValue: 'New Fund'
              })}
            </Button>
          )}
        </div>
        {isEditMode && fundName && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-950 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <span className="font-semibold">
                {t('common.selectFund.editMode', {
                  defaultValue: 'Edit mode:'
                })}
              </span>{' '}
              {fundName}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

