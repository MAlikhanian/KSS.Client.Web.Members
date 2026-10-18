'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { OFFICE_TYPES, type MockOffice, type MockOfficeManager } from '../mock/offices.mock';

interface OfficeEditFormProps {
  office: MockOffice;
  // The people offered as manager. Stage 1: the brokerage's sample managers,
  // in place of the person search, so the page reads nothing.
  managers: MockOfficeManager[];
  lang: 'fa' | 'en';
}

// Inline, in the expanded row: the same core fields as the current page (name,
// code, type, employee count, manager, active). Stage 1: Save is a MOCK -
// nothing is sent anywhere. There is no Delete on this page.
export function OfficeEditForm({ office, managers, lang }: OfficeEditFormProps) {
  const { t } = useTranslation('brokerages-trading-offices-v2');
  const { t: tOld } = useTranslation('brokerages-trading-offices');
  const [nameFa, setNameFa] = useState('');
  const [code, setCode] = useState('');
  const [typeId, setTypeId] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');
  const [managerId, setManagerId] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setNameFa(office.name.fa);
    setCode(office.code ?? '');
    setTypeId(office.typeId && OFFICE_TYPES[office.typeId] ? office.typeId : '');
    setEmployeeCount(office.employeeCount === null ? '' : String(office.employeeCount));
    setManagerId(office.manager?.personId ?? '');
    setIsActive(office.isActive);
  }, [office]);

  const save = () => {
    toast.custom(
      () => (
        <Alert variant="mono" icon="success">
          <AlertIcon><RiCheckboxCircleFill /></AlertIcon>
          <AlertTitle>{t('edit.mockSaved')}</AlertTitle>
        </Alert>
      ),
      { position: 'top-center', duration: 3000 },
    );
  };

  const fid = (name: string) => `v2-office-${office.id}-${name}`;

  return (
    <div className="space-y-4 px-6 py-4">
      <div className="text-sm font-medium text-foreground">{t('edit.title')}</div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor={fid('name')}>
            {tOld('form.fields.nameFa')}
            <span className="ms-1 text-red-500">*</span>
          </Label>
          <Input id={fid('name')} value={nameFa} onChange={(e) => setNameFa(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={fid('code')}>{tOld('form.fields.branchCode')}</Label>
          <Input id={fid('code')} value={code} onChange={(e) => setCode(e.target.value)} dir="ltr" />
        </div>
        <div className="space-y-2">
          <Label htmlFor={fid('type')}>
            {tOld('form.fields.officeType')}
            <span className="ms-1 text-red-500">*</span>
          </Label>
          <Select value={typeId} onValueChange={setTypeId}>
            <SelectTrigger id={fid('type')}>
              <SelectValue placeholder={tOld('form.placeholders.officeType')} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(OFFICE_TYPES).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label[lang]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={fid('employees')}>{tOld('form.fields.employeeCount')}</Label>
          <Input
            id={fid('employees')}
            type="number"
            min={0}
            value={employeeCount}
            onChange={(e) => setEmployeeCount(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={fid('manager')}>
            {tOld('form.fields.officeManagerName')}
            <span className="ms-1 text-red-500">*</span>
          </Label>
          <Select value={managerId} onValueChange={setManagerId}>
            <SelectTrigger id={fid('manager')}>
              <SelectValue placeholder={t('edit.managerPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {managers.map((m) => (
                <SelectItem key={m.personId} value={m.personId}>{m.name[lang]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 pt-6">
          <Checkbox id={fid('active')} checked={isActive} onCheckedChange={(c) => setIsActive(c === true)} />
          <Label htmlFor={fid('active')} className="cursor-pointer">{tOld('form.fields.isActive')}</Label>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 border-t pt-4">
        <span className="text-xs text-muted-foreground">{t('edit.mockNotice')}</span>
        <Button type="button" onClick={save}>
          {tOld('form.actions.update')}
        </Button>
      </div>
    </div>
  );
}
