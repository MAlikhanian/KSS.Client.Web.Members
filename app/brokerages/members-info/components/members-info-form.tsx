'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import {
  BrokerageSelectionCard,
  DynamicSelect,
  useBrokerageContext,
} from '@/app/brokerages/components';
import { CompanyInfoView } from '@/components/common/company-info';
import {
  PersonSearch,
  type PersonSearchResult,
} from '@/components/common/person-search';
import { useTranslation } from '@/hooks/useTranslation';
import { translateApiError } from '@/lib/format-utils';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

import { PersonInfoView } from '@/components/common/person-info';

interface MembershipRow {
  // Local UI handle (the membership Id from the backend, OR a synthetic id
  // for unsaved rows).
  rowId: string;
  // Existing Members.Person.Id (null = unsaved).
  id: string | null;
  // The picked person (links into KSS_Person.Person.Id).
  personId: string;
  // Business fields stored in Members.Person.
  bourseCode: string;
  personStatusId: number;
  description: string;
  workLocationId: string;
  stockExchangeId: string;
}

function newEmptyMembership(): MembershipRow {
  return {
    rowId: `new-${Date.now()}-${Math.random()}`,
    id: null,
    personId: '',
    bourseCode: '',
    personStatusId: 1,
    description: '',
    workLocationId: '',
    stockExchangeId: '',
  };
}

function showSuccess(message: string) {
  toast.custom(
    () => (
      <Alert variant="mono" icon="success">
        <AlertIcon><RiCheckboxCircleFill /></AlertIcon>
        <AlertTitle>{message}</AlertTitle>
      </Alert>
    ),
    { position: 'top-center', duration: 3000 },
  );
}

function showError(message: string) {
  toast.custom(
    () => (
      <Alert variant="mono" icon="destructive">
        <AlertIcon><RiErrorWarningFill /></AlertIcon>
        <AlertTitle>{message}</AlertTitle>
      </Alert>
    ),
    { position: 'top-center', duration: 4000 },
  );
}

export function MembersInfoForm() {
  const { t, i18n } = useTranslation('brokerages-members-info');
  const { selectedBrokerageId, setSelectedBrokerageId, isEditMode } = useBrokerageContext();
  const langId = i18n.language === 'fa' ? 12 : 10;

  // ───────────────────────────────────────────────────────────────────
  // Related Persons state
  // ───────────────────────────────────────────────────────────────────
  const [memberships, setMemberships] = useState<MembershipRow[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [pickerSelections, setPickerSelections] = useState<Record<string, PersonSearchResult | null>>({});
  // Person name + national id per personId, shown on the collapsed row header.
  // Seeded from the picker on selection; resolved from the Person service for
  // rows loaded from the backend (which carry only personId).
  const [personInfoMap, setPersonInfoMap] = useState<Record<string, { name: string; nationalId: string }>>({});

  const toggleExpanded = (rowId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  };

  // Load memberships when brokerage changes.
  useEffect(() => {
    if (!selectedBrokerageId) {
      setMemberships([]);
      setPickerSelections({});
      return;
    }
    let cancelled = false;
    fetch(`/api/brokerages/${selectedBrokerageId}/related-persons`)
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: Array<Record<string, unknown>>) => {
        if (cancelled) return;
        const mapped: MembershipRow[] = rows.map((r) => ({
          rowId: String(r.id ?? `new-${Math.random()}`),
          id: r.id ? String(r.id) : null,
          personId: String(r.personId ?? ''),
          bourseCode: String(r.bourseCode ?? ''),
          personStatusId: Number(r.personStatusId ?? 1),
          description: r.description ? String(r.description) : '',
          workLocationId: r.workLocationId != null ? String(r.workLocationId) : '',
          stockExchangeId: r.stockExchangeId != null ? String(r.stockExchangeId) : '',
        }));
        setMemberships(mapped);
      })
      .catch(() => {
        if (!cancelled) setMemberships([]);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedBrokerageId]);

  // Resolve display names (name + national id) for any membership personId not
  // yet in the map — covers rows loaded from the backend, which carry only the
  // personId. Picked rows are seeded synchronously in handlePickPerson.
  useEffect(() => {
    const ids = Array.from(new Set(memberships.map((m) => m.personId).filter(Boolean)));
    const missing = ids.filter((id) => !personInfoMap[id]);
    if (missing.length === 0) return;
    let cancelled = false;
    (async () => {
      const resolved = await Promise.all(
        missing.map(async (id) => {
          try {
            const r = await fetch(`/api/person/${id}`);
            if (!r.ok) return [id, { name: '', nationalId: '' }] as const;
            const p: {
              translations?: Array<{ languageId: number; firstName?: string; lastName?: string }>;
              nationalId?: string;
            } = await r.json();
            const tr =
              p.translations?.find((x) => x.languageId === langId) ?? p.translations?.[0];
            const name = tr ? `${tr.firstName ?? ''} ${tr.lastName ?? ''}`.trim() : '';
            return [id, { name, nationalId: p.nationalId ?? '' }] as const;
          } catch {
            return [id, { name: '', nationalId: '' }] as const;
          }
        }),
      );
      if (cancelled) return;
      setPersonInfoMap((prev) => {
        const next = { ...prev };
        resolved.forEach(([id, info]) => {
          next[id] = info;
        });
        return next;
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [memberships, langId, personInfoMap]);

  const updateMembership = <K extends keyof MembershipRow>(rowId: string, field: K, value: MembershipRow[K]) => {
    setMemberships((prev) => prev.map((m) => (m.rowId === rowId ? { ...m, [field]: value } : m)));
  };

  const addMembership = () => {
    const row = newEmptyMembership();
    setMemberships((prev) => [...prev, row]);
    setExpanded((prev) => new Set(prev).add(row.rowId));
  };

  const removeMembership = (rowId: string) => {
    setMemberships((prev) => prev.filter((m) => m.rowId !== rowId));
  };

  const handlePickPerson = (rowId: string, person: PersonSearchResult | null) => {
    setPickerSelections((prev) => ({ ...prev, [rowId]: person }));
    updateMembership(rowId, 'personId', person?.id ?? '');
    if (person) {
      const tr = person.translations?.find((x) => x.languageId === langId) ?? person.translations?.[0];
      const name = tr ? `${tr.firstName ?? ''} ${tr.lastName ?? ''}`.trim() : '';
      setPersonInfoMap((prev) => ({
        ...prev,
        [person.id]: { name, nationalId: person.nationalId ?? '' },
      }));
    }
  };

  const saveMembership = async (row: MembershipRow) => {
    if (!selectedBrokerageId) {
      showError(t('form.messages.brokerageRequired', { defaultValue: 'Please select a brokerage first' }));
      return;
    }
    if (!row.personId) {
      showError(t('form.messages.personRequired', { defaultValue: 'Please pick a person' }));
      return;
    }
    // Stock exchange, work location and status are required. Bourse code and
    // description are optional.
    if (
      !row.stockExchangeId ||
      !row.workLocationId ||
      !row.personStatusId
    ) {
      showError(t('form.messages.allFieldsRequired', { defaultValue: 'Please complete all required fields' }));
      return;
    }
    try {
      const res = await fetch(`/api/brokerages/${selectedBrokerageId}/related-persons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // No id sent — the backend upserts by the natural key (brokerage + person)
          // and owns the GUID; a client id is never honored.
          personId: row.personId,
          personStatusId: row.personStatusId,
          bourseCode: row.bourseCode,
          description: row.description || null,
          workLocationId: row.workLocationId ? Number(row.workLocationId) : null,
          stockExchangeId: row.stockExchangeId ? Number(row.stockExchangeId) : null,
        }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || 'Failed to save');
      }
      const saved = await res.json();
      setMemberships((prev) =>
        prev.map((m) => (m.rowId === row.rowId ? { ...m, id: String(saved.id), rowId: String(saved.id) } : m)),
      );
      showSuccess(t('form.messages.itemSaved', { defaultValue: 'Saved successfully' }));
    } catch (err) {
      const msg = err instanceof Error ? translateApiError(err.message, t) : t('form.messages.saveFailed', { defaultValue: 'Save failed' });
      showError(msg);
    }
  };

  const deleteMembershipRow = async (row: MembershipRow) => {
    if (!row.id) {
      // unsaved — just drop locally
      removeMembership(row.rowId);
      return;
    }
    try {
      const res = await fetch(
        `/api/brokerages/${selectedBrokerageId}/related-persons?membershipId=${row.id}`,
        { method: 'DELETE' },
      );
      if (!res.ok) throw new Error('Delete failed');
      removeMembership(row.rowId);
      showSuccess(t('form.messages.itemDeleted', { defaultValue: 'Deleted successfully' }));
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  // ───────────────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────────────
  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      {/* Brokerage Selection Card — black/white border override (matches general-information). */}
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

      {/* Shared read-only company information block (same as /company/view). */}
      <CompanyInfoView companyId={selectedBrokerageId} />

        {/* ────────── Related Persons ────────── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">1</span>
              {t('form.sections.relatedPersons', { defaultValue: 'Staff and Related Persons' })}
            </CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addMembership}>
              <Plus className="h-4 w-4 ml-1" />
              {t('form.actions.addPerson', { defaultValue: 'Add Staff' })}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {memberships.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>{t('form.noRelatedPersons', { defaultValue: 'No related persons added yet' })}</p>
                  <p className="text-sm">{t('form.clickAddToStart', { defaultValue: 'Click "Add Person" to get started' })}</p>
                </div>
              ) : (
                memberships.map((row, idx) => {
                  const isOpen = expanded.has(row.rowId);
                  return (
                    <div key={row.rowId} className="border rounded-lg overflow-hidden">
                      {/* Collapsed header */}
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => toggleExpanded(row.rowId)}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <Button type="button" variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent">
                            {isOpen ? <ChevronDown className="h-5 w-5 text-gray-500" /> : <ChevronRight className="h-5 w-5 text-gray-500" />}
                          </Button>
                          <div className="flex-1">
                            <span className="font-medium text-foreground">
                              {row.personId
                                ? (() => {
                                    const info = personInfoMap[row.personId];
                                    const parts = [info?.name?.trim(), info?.nationalId?.trim()].filter(Boolean);
                                    return parts.length > 0
                                      ? `#${idx + 1} · ${parts.join(' · ')}`
                                      : `#${idx + 1} · ${t('form.loadingPerson', { defaultValue: 'Loading…' })}`;
                                  })()
                                : t('form.personNumber', { number: idx + 1, defaultValue: `Person ${idx + 1}` })}
                            </span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMembershipRow(row);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>

                      {/* Expanded body */}
                      {isOpen && (
                        <div className="p-6 pt-0 space-y-6">
                          {/* MEMBERSHIP BUSINESS FIELDS */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Row 1: person · bourse code · stock exchange */}
                            <PersonSearch
                              onSelect={(p) => handlePickPerson(row.rowId, p)}
                              value={pickerSelections[row.rowId] ?? null}
                              required
                              label={t('form.fields.pickPerson', { defaultValue: 'Pick a person' })}
                            />

                            <div className="space-y-2">
                              <Label htmlFor={`bourseCode-${row.rowId}`}>
                                {t('form.fields.bourseCode', { defaultValue: 'Bourse Code' })}
                              </Label>
                              <Input
                                id={`bourseCode-${row.rowId}`}
                                value={row.bourseCode}
                                onChange={(e) => updateMembership(row.rowId, 'bourseCode', e.target.value)}
                                placeholder={t('form.placeholders.bourseCode', { defaultValue: 'Enter bourse code' })}
                                maxLength={12}
                              />
                            </div>

                            <DynamicSelect
                              dataType="stock-exchanges"
                              value={row.stockExchangeId}
                              onValueChange={(v) => updateMembership(row.rowId, 'stockExchangeId', v)}
                              label={t('form.fields.stockExchange', { defaultValue: 'Stock Exchange' })}
                              placeholder={t('form.placeholders.stockExchange', { defaultValue: 'Select stock exchange' })}
                              required
                            />

                            {/* Row 2: work location · membership status */}
                            <DynamicSelect
                              dataType="work-locations"
                              value={row.workLocationId}
                              onValueChange={(v) => updateMembership(row.rowId, 'workLocationId', v)}
                              label={t('form.fields.workLocation', { defaultValue: 'Work Location' })}
                              placeholder={t('form.placeholders.workLocation', { defaultValue: 'Select work location' })}
                              required
                            />

                            <DynamicSelect
                              dataType="person-statuses"
                              value={row.personStatusId ? String(row.personStatusId) : ''}
                              onValueChange={(v) => updateMembership(row.rowId, 'personStatusId', Number(v))}
                              label={t('form.fields.personStatus', { defaultValue: 'Membership Status' })}
                              placeholder={t('form.placeholders.personStatus', { defaultValue: 'Select status' })}
                              required
                            />

                            {/* Row 3: description (full width) */}
                            <div className="space-y-2 md:col-span-2 lg:col-span-3">
                              <Label htmlFor={`description-${row.rowId}`}>
                                {t('form.fields.description', { defaultValue: 'Description' })}
                              </Label>
                              <Textarea
                                id={`description-${row.rowId}`}
                                value={row.description}
                                onChange={(e) => updateMembership(row.rowId, 'description', e.target.value)}
                                placeholder={t('form.placeholders.description', { defaultValue: 'Enter description' })}
                                rows={2}
                              />
                            </div>
                          </div>

                          {/* FULL PERSON INFO — read-only, collapsed; all person
                              items (name, personal, contact, employment,
                              education + certificates, relationships, documents,
                              status), like the company-info collapse. */}
                          {row.personId && <PersonInfoView personId={row.personId} />}

                          {/* Save button */}
                          <div className="flex justify-end space-x-4 pt-4 border-t mt-4">
                            <Button type="button" onClick={() => saveMembership(row)}>
                              {t('form.actions.save', { defaultValue: 'Save' })}
                            </Button>
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
    </form>
  );
}
