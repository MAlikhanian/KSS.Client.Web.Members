'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import {
  MEMBERSHIP_STATUSES,
  STOCK_EXCHANGES,
  WORK_LOCATIONS,
  type MockPersonnel,
} from '../mock/personnel.mock';

type Lookup = Record<string, { fa: string; en: string }>;

// Stage 1 uses mock lookups so the page reads nothing beyond the brokerage list.
function MockSelect(props: {
  id: string;
  label: string;
  placeholder: string;
  options: Lookup;
  lang: 'fa' | 'en';
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.id}>{props.label}</Label>
      <Select value={props.value} onValueChange={props.onChange}>
        <SelectTrigger id={props.id}>
          <SelectValue placeholder={props.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(props.options).map(([key, label]) => (
            <SelectItem key={key} value={key}>{label[props.lang]}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface MembershipEditFormProps {
  person: MockPersonnel;
  lang: 'fa' | 'en';
}

// Inline, in the expanded row, as on the current page: the same membership
// fields (bourse code, stock exchange, work location, membership status,
// description). Stage 1: Save is a MOCK - nothing is sent anywhere.
export function MembershipEditForm({ person, lang }: MembershipEditFormProps) {
  const { t } = useTranslation('brokerages-members-info-v2');
  const { t: tOld } = useTranslation('brokerages-members-info');
  const [bourseCode, setBourseCode] = useState('');
  const [stockExchangeId, setStockExchangeId] = useState('');
  const [workLocationId, setWorkLocationId] = useState('');
  const [personStatusId, setPersonStatusId] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setBourseCode(person.bourseCode);
    setDescription(person.description);
    setStockExchangeId(person.brokerageLocation ?? '');
    setWorkLocationId('');
    setPersonStatusId('');
  }, [person]);

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

  return (
    <div className="space-y-4 px-6 py-4">
      <div className="text-sm font-medium text-foreground">{t('edit.title')}</div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="v2-bourseCode">{tOld('form.fields.bourseCode')}</Label>
              <Input
                id="v2-bourseCode"
                value={bourseCode}
                onChange={(e) => setBourseCode(e.target.value)}
                maxLength={12}
              />
            </div>
            <MockSelect
              id="v2-stockExchange"
              label={tOld('form.fields.stockExchange')}
              placeholder={tOld('form.placeholders.stockExchange')}
              options={STOCK_EXCHANGES}
              lang={lang}
              value={stockExchangeId}
              onChange={setStockExchangeId}
            />
            <MockSelect
              id="v2-workLocation"
              label={tOld('form.fields.workLocation')}
              placeholder={tOld('form.placeholders.workLocation')}
              options={WORK_LOCATIONS}
              lang={lang}
              value={workLocationId}
              onChange={setWorkLocationId}
            />
            <MockSelect
              id="v2-personStatus"
              label={tOld('form.fields.personStatus')}
              placeholder={tOld('form.placeholders.personStatus')}
              options={MEMBERSHIP_STATUSES}
              lang={lang}
              value={personStatusId}
              onChange={setPersonStatusId}
            />
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="v2-description">{tOld('form.fields.description')}</Label>
              <Textarea
                id="v2-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
          </div>
      <div className="flex items-center justify-between gap-4 border-t pt-4">
        <span className="text-xs text-muted-foreground">{t('edit.mockNotice')}</span>
        <Button type="button" onClick={save}>
          {tOld('form.actions.save')}
        </Button>
      </div>
    </div>
  );
}
