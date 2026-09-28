'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { PersonSearch, type PersonSearchResult } from '@/components/common/person-search';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';

interface FundRole {
  id: number;
  code: string;
  name: string;
}

interface FundRolePersonRow {
  id: string;
  fundId: string;
  personId: string;
  fundRoleId: number;
  isActive: boolean;
}

interface PhoneRow {
  id: string;
  personId: string;
  phoneNumber?: string;
  isPrimary?: boolean;
}

interface FundOrgansSectionProps {
  /**
   * Fund row id (Members service). When null, the Fund hasn't been
   * created yet; the section renders disabled with a "save fund first"
   * hint.
   */
  fundId: string | null;
  /** Read-only on this page when caller lacks edit access. */
  isReadOnly?: boolean;
}

const PERSIAN_LANGUAGE_ID = 12;
const ENGLISH_LANGUAGE_ID = 10;

export function FundOrgansSection({ fundId, isReadOnly = false }: FundOrgansSectionProps) {
  const { t, i18n } = useTranslation('investment-funds');
  const langId = i18n.language === 'fa' ? PERSIAN_LANGUAGE_ID : ENGLISH_LANGUAGE_ID;

  const [roles, setRoles] = useState<FundRole[]>([]);
  const [rows, setRows] = useState<FundRolePersonRow[]>([]);
  const [phonesByPerson, setPhonesByPerson] = useState<Record<string, string>>({});
  const [personsById, setPersonsById] = useState<Record<string, PersonSearchResult>>({});

  // 1) Load the 4 role types once.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/common/fund-roles?languageId=${langId}`);
        if (res.ok) setRoles(await res.json());
      } catch {
        /* ignore */
      }
    })();
  }, [langId]);

  // 2) Load existing organ assignments for this fund.
  const reload = useCallback(async () => {
    if (!fundId) {
      setRows([]);
      return;
    }
    try {
      const res = await fetch(`/api/funds/${fundId}/role-persons`);
      if (res.ok) setRows(await res.json());
    } catch {
      /* ignore */
    }
  }, [fundId]);

  useEffect(() => {
    reload();
  }, [reload]);

  // 3) For each assigned person, fetch their primary phone (read-only display).
  useEffect(() => {
    const uniqueIds = Array.from(new Set(rows.map((r) => r.personId)));
    const missing = uniqueIds.filter((id) => phonesByPerson[id] === undefined);
    if (missing.length === 0) return;
    missing.forEach(async (personId) => {
      try {
        const res = await fetch(`/api/person/phone?personId=${personId}`);
        if (!res.ok) return;
        const phones: PhoneRow[] = await res.json();
        const primary =
          phones.find((p) => p.isPrimary)?.phoneNumber ||
          phones[0]?.phoneNumber ||
          '';
        setPhonesByPerson((prev) => ({ ...prev, [personId]: primary }));
      } catch {
        /* ignore */
      }
    });
  }, [rows, phonesByPerson]);

  // 4) For each assigned person, fetch their full record so PersonSearch can
  //    display the name + nationalId instead of a Guid stub.
  useEffect(() => {
    const uniqueIds = Array.from(new Set(rows.map((r) => r.personId)));
    const missing = uniqueIds.filter((id) => personsById[id] === undefined);
    if (missing.length === 0) return;
    missing.forEach(async (personId) => {
      try {
        const res = await fetch(`/api/person/${personId}`);
        if (!res.ok) return;
        const person = await res.json();
        setPersonsById((prev) => ({
          ...prev,
          [personId]: {
            id: person.id,
            nationalId: person.nationalId || '',
            translations: person.translations || [],
          },
        }));
      } catch {
        /* ignore */
      }
    });
  }, [rows, personsById]);

  const assignedRow = (roleId: number) =>
    rows.find((r) => r.fundRoleId === roleId && r.isActive);

  const handleSelect = async (roleId: number, person: PersonSearchResult | null) => {
    if (!fundId || !person) return;
    const existing = assignedRow(roleId);

    try {
      // One person per role on this fund: remove an existing different assignment first.
      if (existing && existing.personId !== person.id) {
        await fetch(`/api/funds/${fundId}/role-persons`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: existing.id }),
        });
      }

      if (!existing || existing.personId !== person.id) {
        const r = await fetch(`/api/funds/${fundId}/role-persons`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ personId: person.id, fundRoleId: roleId }),
        });
        if (!r.ok) throw new Error('assign failed');
      }
      await reload();
    } catch {
      toast.error(
        t('generalInformation.form.errors.organAssignFailed', {
          defaultValue: 'Organ assignment failed',
        }),
      );
    }
  };

  const handleRemove = async (roleId: number) => {
    if (!fundId) return;
    const existing = assignedRow(roleId);
    if (!existing) return;
    try {
      await fetch(`/api/funds/${fundId}/role-persons`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: existing.id }),
      });
      await reload();
    } catch {
      toast.error(
        t('generalInformation.form.errors.organRemoveFailed', {
          defaultValue: 'Organ removal failed',
        }),
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
            5
          </span>
          {t('generalInformation.form.sections.fundOrgans', { defaultValue: 'Fund Organs (Key Roles)' })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!fundId ? (
          <p className="text-sm text-muted-foreground">
            {t('generalInformation.form.messages.saveFundFirst', {
              defaultValue: 'Save the fund first to assign organ roles.',
            })}
          </p>
        ) : (
          <div className="space-y-4">
            {roles.map((role) => {
              const row = assignedRow(role.id);
              const selectedValue: PersonSearchResult | null = row
                ? personsById[row.personId] ?? { id: row.personId, nationalId: '', translations: [] }
                : null;
              const mobile = row ? phonesByPerson[row.personId] ?? '' : '';
              return (
                <div
                  key={role.id}
                  className="border rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="space-y-2">
                    <Label className="font-semibold">{role.name}</Label>
                    <PersonSearch
                      label={t('generalInformation.form.placeholders.selectOrganPerson', {
                        defaultValue: 'Select person',
                      })}
                      value={selectedValue}
                      onSelect={(p) => handleSelect(role.id, p)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      {t('generalInformation.form.fields.organMobile', {
                        defaultValue: 'Mobile',
                      })}
                    </Label>
                    <Input
                      value={mobile}
                      readOnly
                      placeholder={t('generalInformation.form.placeholders.organMobileFromPerson', {
                        defaultValue: 'Read from person\'s profile',
                      })}
                    />
                  </div>
                  <div className="flex items-end">
                    {row && !isReadOnly && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleRemove(role.id)}
                      >
                        <Trash2 className="h-4 w-4 ml-1" />
                        {t('common:remove', { defaultValue: 'Remove' })}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
