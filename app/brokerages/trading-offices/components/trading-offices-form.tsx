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
import { BrokerageSelectionCard, DynamicSelect, useBrokerageContext } from '@/app/brokerages/components';
import { CompanyInfoView } from '@/components/common/company-info';
import { AddressesGrid } from '@/components/common/company-info/addresses-grid';
import { PhonesGrid } from '@/components/common/company-info/phones-grid';
import { PersonSearch, type PersonSearchResult } from '@/components/common/person-search';
import { ManagerSummary } from './manager-summary';
import { useData } from '@/hooks/use-data';
import { useTranslation } from '@/hooks/useTranslation';
import { Plus, Trash2, ChevronDown, ChevronRight, Save } from 'lucide-react';

const FA = 12;

interface BranchName {
  languageId: number;
  name: string;
}

interface Branch {
  id: string;
  companyId: string;
  branchCode: string | null;
  branchTypeId: number | null;
  managerPersonId: string | null;
  employeeCount: number | null;
  isActive: boolean;
  names: BranchName[];
}

type BranchRow = Branch & { _key: string };

interface BranchAddressRow {
  id: string;
  labelId: number;
  countryId: number;
  regionId: number;
  cityId: number;
  postalCode: string;
  street1: string;
  street2: string | null;
  isPrimary: boolean;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}

interface BranchPhoneRow {
  id: string;
  labelId: number;
  countryId: number;
  phoneNumber: string;
  isPrimary: boolean;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}

export function TradingOfficesForm() {
  const { t } = useTranslation('brokerages-trading-offices');
  const { selectedBrokerageId, setSelectedBrokerageId, isEditMode } = useBrokerageContext();
  const companyId = selectedBrokerageId;

  const [branches, setBranches] = useState<BranchRow[]>([]);
  const [draftCounter, setDraftCounter] = useState(0);

  const { data: addressLabels } = useData('address-labels');
  const { data: phoneLabels } = useData('phone-labels');
  const addressLabelOptions = addressLabels.map((l) => ({ id: Number(l.id), name: l.name }));
  const phoneLabelOptions = phoneLabels.map((l) => ({ id: Number(l.id), name: l.name }));

  useEffect(() => {
    if (!companyId) {
      setBranches([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/members/api/branches/by-company/${companyId}`);
        if (!res.ok) throw new Error('load failed');
        const data: Branch[] = await res.json();
        if (!cancelled) setBranches(data.map((b) => ({ ...b, _key: b.id })));
      } catch {
        if (!cancelled) setBranches([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [companyId]);

  const addBranch = () => {
    const key = `new-${draftCounter}`;
    setDraftCounter((c) => c + 1);
    setBranches((prev) => [
      {
        _key: key,
        id: '',
        companyId,
        branchCode: null,
        branchTypeId: null,
        managerPersonId: null,
        employeeCount: null,
        isActive: true,
        names: [],
      },
      ...prev,
    ]);
  };

  const replaceBranch = useCallback((key: string, saved: Branch) => {
    setBranches((prev) => prev.map((b) => (b._key === key ? { ...saved, _key: saved.id } : b)));
  }, []);

  const removeBranch = useCallback((key: string) => {
    setBranches((prev) => prev.filter((b) => b._key !== key));
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
              {t('form.sections.tradingOffices', { defaultValue: 'Trading Offices' })}
            </CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addBranch}>
              <Plus className="h-4 w-4 ml-1" />
              {t('form.actions.addOffice', { defaultValue: 'Add Office' })}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {branches.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>{t('form.noOffices', { defaultValue: 'No trading offices added yet' })}</p>
                  <p className="text-sm">{t('form.clickAddToStart', { defaultValue: "Click 'Add Office' to get started" })}</p>
                </div>
              ) : (
                branches.map((b, i) => (
                  <BranchCard
                    key={b._key}
                    row={b}
                    index={i}
                    companyId={companyId}
                    addressLabelOptions={addressLabelOptions}
                    phoneLabelOptions={phoneLabelOptions}
                    onReplace={replaceBranch}
                    onRemove={removeBranch}
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

interface BranchCardProps {
  row: BranchRow;
  index: number;
  companyId: string;
  addressLabelOptions: { id: number; name: string }[];
  phoneLabelOptions: { id: number; name: string }[];
  onReplace: (key: string, saved: Branch) => void;
  onRemove: (key: string) => void;
}

function BranchCard({ row, index, companyId, addressLabelOptions, phoneLabelOptions, onReplace, onRemove }: BranchCardProps) {
  const { t } = useTranslation('brokerages-trading-offices');
  const branchId = row.id;
  const [expanded, setExpanded] = useState(branchId === '');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    branchCode: row.branchCode ?? '',
    branchTypeId: row.branchTypeId,
    managerPersonId: row.managerPersonId,
    employeeCount: row.employeeCount,
    isActive: row.isActive,
    nameFa: row.names.find((n) => n.languageId === FA)?.name ?? '',
  });
  const [managerPick, setManagerPick] = useState<PersonSearchResult | null>(null);
  const [contacts, setContacts] = useState<{ addresses: BranchAddressRow[]; phones: BranchPhoneRow[] }>({ addresses: [], phones: [] });

  const set = (patch: Partial<typeof form>) => setForm((p) => ({ ...p, ...patch }));

  // Message banner — same style as the company edit forms.
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

  const reloadContacts = useCallback(async () => {
    if (!branchId) return;
    try {
      const res = await fetch(`/members/api/branches/${branchId}/contacts`);
      if (res.ok) setContacts(await res.json());
    } catch {
      /* ignore */
    }
  }, [branchId]);

  useEffect(() => {
    if (expanded && branchId) reloadContacts();
  }, [expanded, branchId, reloadContacts]);

  const buildNames = (): BranchName[] => {
    const arr: BranchName[] = [];
    if (form.nameFa.trim()) arr.push({ languageId: FA, name: form.nameFa.trim() });
    return arr;
  };

  const saveCore = async () => {
    if (!form.nameFa.trim()) {
      toastErr(t('form.messages.nameRequired', { defaultValue: 'Please enter the office name' }));
      return;
    }
    if (form.branchTypeId == null) {
      toastErr(t('form.messages.officeTypeRequired', { defaultValue: 'Please select an office type' }));
      return;
    }
    if (!form.managerPersonId) {
      toastErr(t('form.messages.managerRequired', { defaultValue: 'Please select a branch manager' }));
      return;
    }
    setSaving(true);
    try {
      const payload = {
        branchCode: form.branchCode.trim() || null,
        branchTypeId: form.branchTypeId,
        managerPersonId: form.managerPersonId,
        employeeCount: form.employeeCount,
        names: buildNames(),
      };
      const res = branchId
        ? await fetch(`/members/api/branches/${branchId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...payload, isActive: form.isActive }),
          })
        : await fetch(`/members/api/branches/by-company/${companyId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
      if (!res.ok) {
        const e = await res.json().catch(() => null);
        toastErr(e?.message || t('form.messages.saveError', { defaultValue: 'Failed to save' }));
        return;
      }
      const saved: Branch = await res.json();
      onReplace(row._key, saved);
      toastOk(branchId ? t('form.messages.updated', { defaultValue: 'Updated successfully' }) : t('form.messages.created', { defaultValue: 'Created successfully' }));
    } catch {
      toastErr(t('form.messages.saveError', { defaultValue: 'Failed to save' }));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!branchId) {
      onRemove(row._key);
      return;
    }
    try {
      const res = await fetch(`/members/api/branches/${branchId}`, { method: 'DELETE' });
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

  // ---- contact (address/phone) handlers ----
  const sendContact = async (method: 'POST' | 'PUT', body: Record<string, unknown>, okMsg: string) => {
    const res = await fetch(`/members/api/branches/${branchId}/contacts`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      await reloadContacts();
      toastOk(okMsg);
    } else {
      const e = await res.json().catch(() => null);
      toastErr(e?.message || t('form.messages.saveError', { defaultValue: 'Failed to save' }));
    }
  };

  const deleteContact = async (type: 'address' | 'phone', itemId: string) => {
    const res = await fetch(`/members/api/branches/${branchId}/contacts?type=${type}&itemId=${itemId}`, { method: 'DELETE' });
    if (res.ok) {
      await reloadContacts();
      toastOk(t('form.messages.deleted', { defaultValue: 'Deleted successfully' }));
    } else {
      const e = await res.json().catch(() => null);
      toastErr(e?.message || t('form.messages.deleteError', { defaultValue: 'Failed to delete' }));
    }
  };

  const createdMsg = t('form.messages.created', { defaultValue: 'Created successfully' });
  const updatedMsg = t('form.messages.updated', { defaultValue: 'Updated successfully' });

  const addressItems = contacts.addresses.map((a) => ({
    id: a.id, labelId: a.labelId, labelName: '', countryId: a.countryId, regionId: a.regionId,
    cityId: a.cityId, postalCode: a.postalCode, street1: a.street1, street2: a.street2,
    isPrimary: a.isPrimary, isVerified: a.isVerified, createdAt: a.createdAt, updatedAt: a.updatedAt,
  }));
  const phoneItems = contacts.phones.map((p) => ({
    id: p.id, labelId: p.labelId, labelName: '', countryId: p.countryId, phoneNumber: p.phoneNumber,
    isPrimary: p.isPrimary, isVerified: p.isVerified, createdAt: p.createdAt, updatedAt: p.updatedAt,
  }));

  const title = form.nameFa.trim() || t('form.officeNumber', { number: index + 1, defaultValue: `Office ${index + 1}` });

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted transition-colors" onClick={() => setExpanded((e) => !e)}>
        <div className="flex items-center gap-3 flex-1">
          {expanded ? <ChevronDown className="h-5 w-5 text-gray-500" /> : <ChevronRight className="h-5 w-5 text-gray-500" />}
          <span className="font-medium text-foreground">{title}</span>
          {!branchId && (
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
            <div className="space-y-2">
              <Label>
                {t('form.fields.nameFa', { defaultValue: 'Name (Persian)' })}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input value={form.nameFa} onChange={(e) => set({ nameFa: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t('form.fields.branchCode', { defaultValue: 'Branch Code' })}</Label>
              <Input value={form.branchCode} onChange={(e) => set({ branchCode: e.target.value })} dir="ltr" />
            </div>

            <DynamicSelect
              dataType="branch-types"
              value={form.branchTypeId != null ? String(form.branchTypeId) : ''}
              onValueChange={(v) => set({ branchTypeId: v ? Number(v) : null })}
              label={t('form.fields.officeType', { defaultValue: 'Office Type' })}
              placeholder={t('form.placeholders.officeType', { defaultValue: 'Select office type' })}
              required
            />
            <div className="space-y-2">
              <Label>{t('form.fields.employeeCount', { defaultValue: 'Number of Employees' })}</Label>
              <Input
                type="number"
                value={form.employeeCount ?? ''}
                onChange={(e) => set({ employeeCount: e.target.value === '' ? null : Number(e.target.value) })}
              />
            </div>

            <PersonSearch
              label={t('form.fields.officeManagerName', { defaultValue: 'Branch Manager' })}
              value={managerPick}
              required
              onSelect={(p) => {
                setManagerPick(p);
                set({ managerPersonId: p?.id ?? null });
              }}
            />
            <div className="space-y-2">
              <Label>{t('form.fields.selectedManager', { defaultValue: 'Selected Manager' })}</Label>
              {form.managerPersonId ? (
                <ManagerSummary personId={form.managerPersonId} pick={managerPick} />
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </div>

            {branchId !== '' && (
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
              {branchId
                ? t('form.actions.update', { defaultValue: 'Update' })
                : t('form.actions.save', { defaultValue: 'Save Branch' })}
            </Button>
          </div>

          {/* Addresses + phones (only once the branch exists) */}
          {branchId ? (
            <div className="space-y-6">
              <AddressesGrid
                title={t('form.fields.address', { defaultValue: 'Address' })}
                addresses={addressItems}
                labelOptions={addressLabelOptions}
                showCountBadge={false}
                showSectionNumber={false}
                onAdd={(data) => sendContact('POST', { type: 'address', ...data }, createdMsg)}
                onEdit={(id, data) => sendContact('PUT', { type: 'address', itemId: id, ...data }, updatedMsg)}
                onDelete={(id) => deleteContact('address', id)}
              />
              <PhonesGrid
                title={t('form.fields.phone', { defaultValue: 'Phone' })}
                phones={phoneItems}
                labelOptions={phoneLabelOptions}
                showCountBadge={false}
                showSectionNumber={false}
                onAdd={(data) => sendContact('POST', { type: 'phone', ...data }, createdMsg)}
                onEdit={(id, data) => sendContact('PUT', { type: 'phone', itemId: id, ...data }, updatedMsg)}
                onDelete={(id) => deleteContact('phone', id)}
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t('form.saveFirstForContacts', { defaultValue: 'Save the branch first to add addresses and phones.' })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
