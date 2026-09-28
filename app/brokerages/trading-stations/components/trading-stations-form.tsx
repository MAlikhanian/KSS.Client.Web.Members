'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BrokerageSelectionCard, DynamicSelect, useBrokerageContext } from '@/app/brokerages/components';
import { CompanyInfoView } from '@/components/common/company-info';
import { PersonSearch, type PersonSearchResult } from '@/components/common/person-search';
import { ManagerSummary } from './manager-summary';
import { useTranslation } from '@/hooks/useTranslation';
import { Plus, Trash2, ChevronDown, ChevronRight, Save } from 'lucide-react';

const PERSIAN_LANGUAGE_ID = 12;
const ENGLISH_LANGUAGE_ID = 10;

interface TradingStation {
  id: string;
  companyId: string;
  stationCode: string | null;
  branchId: string | null;
  activityTypeId: number | null;
  traderPersonId: string | null;
  isActive: boolean;
}

type StationRow = TradingStation & { _key: string };

/** A trading office (Branch) the station can belong to. */
interface OfficeOption {
  id: string;
  name: string;
}

interface BranchName {
  languageId: number;
  name: string;
}
interface Branch {
  id: string;
  branchCode: string | null;
  names: BranchName[];
}

export function TradingStationsForm() {
  const { t } = useTranslation('brokerages-trading-stations');
  const { selectedBrokerageId, setSelectedBrokerageId, isEditMode } = useBrokerageContext();
  const companyId = selectedBrokerageId;

  const [stations, setStations] = useState<StationRow[]>([]);
  const [draftCounter, setDraftCounter] = useState(0);
  const [officeOptions, setOfficeOptions] = useState<OfficeOption[]>([]);

  useEffect(() => {
    if (!companyId) {
      setStations([]);
      setOfficeOptions([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const [stationRes, officeRes] = await Promise.all([
          fetch(`/members/api/trading-stations/by-company/${companyId}`),
          fetch(`/members/api/branches/by-company/${companyId}`),
        ]);
        if (!cancelled && stationRes.ok) {
          const data: TradingStation[] = await stationRes.json();
          setStations(data.map((s) => ({ ...s, _key: s.id })));
        }
        if (!cancelled && officeRes.ok) {
          const branches: Branch[] = await officeRes.json();
          setOfficeOptions(
            branches.map((b) => ({
              id: b.id,
              name:
                b.names?.find((n) => n.languageId === PERSIAN_LANGUAGE_ID)?.name ??
                b.names?.find((n) => n.languageId === ENGLISH_LANGUAGE_ID)?.name ??
                b.branchCode ??
                b.id,
            })),
          );
        }
      } catch {
        if (!cancelled) {
          setStations([]);
          setOfficeOptions([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [companyId]);

  const addStation = () => {
    const key = `new-${draftCounter}`;
    setDraftCounter((c) => c + 1);
    setStations((prev) => [
      {
        _key: key,
        id: '',
        companyId,
        stationCode: null,
        branchId: null,
        activityTypeId: null,
        traderPersonId: null,
        isActive: true,
      },
      ...prev,
    ]);
  };

  const replaceStation = useCallback((key: string, saved: TradingStation) => {
    setStations((prev) => prev.map((s) => (s._key === key ? { ...saved, _key: saved.id } : s)));
  }, []);

  const removeStation = useCallback((key: string) => {
    setStations((prev) => prev.filter((s) => s._key !== key));
  }, []);

  return (
    <div className="space-y-6">
      {/* Brokerage selection — black/white border (matches general-information). */}
      <div
        className={
          '[&_div.rounded-xl.bg-card.bg-card]:border-black! ' +
          'dark:[&_div.rounded-xl.bg-card.bg-card]:border-white!'
        }
      >
        <BrokerageSelectionCard
          value={selectedBrokerageId}
          onValueChange={setSelectedBrokerageId}
          isEditMode={isEditMode}
        />
      </div>

      {/* Shared read-only company information block. */}
      <CompanyInfoView companyId={selectedBrokerageId} />

      {companyId && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">1</span>
              {t('form.sections.tradingStations', { defaultValue: 'Trading Stations' })}
            </CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addStation}>
              <Plus className="h-4 w-4 ml-1" />
              {t('form.actions.addStation', { defaultValue: 'Add Station' })}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>{t('form.noStations', { defaultValue: 'No trading stations added yet' })}</p>
                  <p className="text-sm">{t('form.clickAddToStart', { defaultValue: "Click 'Add Station' to get started" })}</p>
                </div>
              ) : (
                stations.map((s, i) => (
                  <StationCard
                    key={s._key}
                    row={s}
                    index={i}
                    companyId={companyId}
                    officeOptions={officeOptions}
                    onReplace={replaceStation}
                    onRemove={removeStation}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface StationCardProps {
  row: StationRow;
  index: number;
  companyId: string;
  officeOptions: OfficeOption[];
  onReplace: (key: string, saved: TradingStation) => void;
  onRemove: (key: string) => void;
}

function StationCard({ row, index, companyId, officeOptions, onReplace, onRemove }: StationCardProps) {
  const { t } = useTranslation('brokerages-trading-stations');
  const stationId = row.id;
  const [expanded, setExpanded] = useState(stationId === '');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    stationCode: row.stationCode ?? '',
    branchId: row.branchId,
    activityTypeId: row.activityTypeId,
    traderPersonId: row.traderPersonId,
    isActive: row.isActive,
  });
  const [traderPick, setTraderPick] = useState<PersonSearchResult | null>(null);

  const set = (patch: Partial<typeof form>) => setForm((p) => ({ ...p, ...patch }));

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    toast.custom(
      () => (
        <Alert variant="mono" icon={type === 'success' ? 'success' : 'destructive'}>
          <AlertIcon>
            {type === 'success' ? <RiCheckboxCircleFill /> : <RiErrorWarningFill />}
          </AlertIcon>
          <AlertTitle>{message}</AlertTitle>
        </Alert>
      ),
      { position: 'top-center' },
    );
  }, []);
  const toastOk = (m: string) => showToast(m, 'success');
  const toastErr = (m: string) => showToast(m, 'error');

  const saveCore = async () => {
    if (!form.branchId) {
      toastErr(t('form.messages.officeRequired', { defaultValue: 'Please select a trading office' }));
      return;
    }
    if (form.activityTypeId == null) {
      toastErr(t('form.messages.activityTypeRequired', { defaultValue: 'Please select a type of activity' }));
      return;
    }
    if (!form.traderPersonId) {
      toastErr(t('form.messages.traderRequired', { defaultValue: 'Please select a trader' }));
      return;
    }
    setSaving(true);
    try {
      const payload = {
        stationCode: form.stationCode.trim() || null,
        branchId: form.branchId,
        activityTypeId: form.activityTypeId,
        traderPersonId: form.traderPersonId,
      };
      const res = stationId
        ? await fetch(`/members/api/trading-stations/${stationId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...payload, isActive: form.isActive }),
          })
        : await fetch(`/members/api/trading-stations/by-company/${companyId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
      if (!res.ok) {
        const e = await res.json().catch(() => null);
        toastErr(e?.message || t('form.messages.saveError', { defaultValue: 'Failed to save' }));
        return;
      }
      const saved: TradingStation = await res.json();
      onReplace(row._key, saved);
      toastOk(stationId ? t('form.messages.updated', { defaultValue: 'Updated successfully' }) : t('form.messages.created', { defaultValue: 'Created successfully' }));
    } catch {
      toastErr(t('form.messages.saveError', { defaultValue: 'Failed to save' }));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!stationId) {
      onRemove(row._key);
      return;
    }
    try {
      const res = await fetch(`/members/api/trading-stations/${stationId}`, { method: 'DELETE' });
      if (res.ok) {
        onRemove(row._key);
        toastOk(t('form.messages.deleted', { defaultValue: 'Deleted successfully' }));
      } else {
        const e = await res.json().catch(() => null);
        toastErr(e?.message || t('form.messages.deleteError', { defaultValue: 'Failed to delete' }));
      }
    } catch {
      toastErr(t('form.messages.deleteError', { defaultValue: 'Failed to delete' }));
    }
  };

  const title = t('form.stationNumber', { number: index + 1, defaultValue: `Station ${index + 1}` });

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted transition-colors" onClick={() => setExpanded((e) => !e)}>
        <div className="flex items-center gap-3 flex-1">
          {expanded ? <ChevronDown className="h-5 w-5 text-gray-500" /> : <ChevronRight className="h-5 w-5 text-gray-500" />}
          <span className="font-medium text-foreground">{title}</span>
          {!stationId && (
            <span className="text-xs text-muted-foreground">({t('form.unsaved', { defaultValue: 'Unsaved' })})</span>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => { e.stopPropagation(); remove(); }}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={16} />
        </Button>
      </div>

      {expanded && (
        <div className="p-6 pt-0 space-y-6">
          {/* Core fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Station code (free-text, max 10) */}
            <div className="space-y-2">
              <Label>{t('form.fields.stationCode', { defaultValue: 'Station Code' })}</Label>
              <Input
                value={form.stationCode}
                onChange={(e) => set({ stationCode: e.target.value })}
                maxLength={10}
                dir="ltr"
              />
            </div>
            {/* Trading office (Branch) the station belongs to */}
            <div className="space-y-2">
              <Label>
                {t('form.fields.tradingOffice', { defaultValue: 'Trading Office' })}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={form.branchId ?? ''}
                onValueChange={(v) => set({ branchId: v || null })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('form.placeholders.tradingOffice', { defaultValue: 'Select trading office' })} />
                </SelectTrigger>
                <SelectContent>
                  {officeOptions.map((o) => (
                    <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DynamicSelect
              dataType="trading-station-activity-types"
              value={form.activityTypeId != null ? String(form.activityTypeId) : ''}
              onValueChange={(v) => set({ activityTypeId: v ? Number(v) : null })}
              label={t('form.fields.activityType', { defaultValue: 'Type of Activity' })}
              placeholder={t('form.placeholders.activityType', { defaultValue: 'Select type of activity' })}
              required
            />

            <PersonSearch
              label={t('form.fields.trader', { defaultValue: 'Trader' })}
              value={traderPick}
              required
              onSelect={(p) => {
                setTraderPick(p);
                set({ traderPersonId: p?.id ?? null });
              }}
            />
            <div className="space-y-2">
              <Label>{t('form.fields.selectedTrader', { defaultValue: 'Selected Trader' })}</Label>
              {form.traderPersonId ? (
                <ManagerSummary personId={form.traderPersonId} pick={traderPick} />
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </div>

            {stationId !== '' && (
              <div className="flex items-center gap-2">
                <Checkbox id={`active-${row._key}`} checked={form.isActive} onCheckedChange={(c) => set({ isActive: c === true })} />
                <Label htmlFor={`active-${row._key}`} className="cursor-pointer">
                  {t('form.fields.isActive', { defaultValue: 'Active' })}
                </Label>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="button" onClick={saveCore} disabled={saving}>
              <Save className="h-4 w-4" />
              {stationId
                ? t('form.actions.update', { defaultValue: 'Update' })
                : t('form.actions.save', { defaultValue: 'Save Station' })}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
