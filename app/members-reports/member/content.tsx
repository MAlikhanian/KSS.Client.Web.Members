'use client';

import { useState, useMemo, useCallback, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { CollapsibleSection } from '@/components/common/collapsible-section';
import { PersonInfoView } from '@/components/common/person-info/person-info-view';
import type {
  MemberEntityReport,
  CompanyPersonsReport,
  CompanyPersonRow,
} from '@/services/report-api';
import type { ReferenceData } from '@/app/components/person/edit/person-form';

// Language ids from KSS_Common.dbo.Language — used to pick relation-type names
// for the active UI locale (with a fa→en→any fallback).
const PERSIAN_LANGUAGE_ID = 12;
const ENGLISH_LANGUAGE_ID = 10;

// Sky hue — same glass tint family as the other members-reports pages.
const GLASS_WRAPPER =
  'space-y-5 lg:space-y-7.5 ' +
  '[&_div.rounded-xl.bg-card]:bg-sky-50/25! ' +
  '[&_div.rounded-xl.bg-card]:border-sky-100! ' +
  'dark:[&_div.rounded-xl.bg-card]:bg-sky-950/25! ' +
  'dark:[&_div.rounded-xl.bg-card]:border-sky-900! ' +
  '[&_div.rounded-xl.bg-card]:shadow-lg ' +
  '[&_div.rounded-xl.bg-card]:shadow-black/5';

// Emerald tint for a ROOT person who has related people nested under them, so
// they stand out from the sky-tinted childless rows. The `>` + doubled `.bg-card`
// selector targets only this node's own card (not its nested children) and wins
// over the page's sky tint on specificity.
const RELATION_HIGHLIGHT =
  '[&>div.rounded-xl.bg-card.bg-card]:bg-emerald-50/40! ' +
  '[&>div.rounded-xl.bg-card.bg-card]:border-emerald-300! ' +
  'dark:[&>div.rounded-xl.bg-card.bg-card]:bg-emerald-950/30! ' +
  'dark:[&>div.rounded-xl.bg-card.bg-card]:border-emerald-800!';

async function fetchEntities(): Promise<MemberEntityReport> {
  const res = await fetch('/members/api/members-reports/entities');
  if (!res.ok) throw new Error('Failed to load companies');
  return res.json();
}

async function fetchCompanyPersons(companyId: string): Promise<CompanyPersonsReport> {
  const res = await fetch(
    `/members/api/members-reports/company-persons?companyId=${encodeURIComponent(companyId)}`,
  );
  if (!res.ok) throw new Error('Failed to load people');
  return res.json();
}

/**
 * One person row in the report tree. Renders a collapsible whose header is the
 * person's name + national ID (and, for a nested relation, the relationship
 * type). Because {@link CollapsibleSection} mounts its children only when open,
 * the full profile and the related-person rows load lazily on expand. Recurses
 * into the person's relations; the backend has already cycle-guarded the tree.
 */
function PersonNode({
  node,
  resolveType,
  isRoot = false,
}: {
  node: CompanyPersonRow;
  resolveType: (typeId: number | null) => string | null;
  isRoot?: boolean;
}) {
  const { t } = useTranslation('members-reports');
  const name = node.fullName ?? t('unknownPerson', { defaultValue: 'Unnamed person' });
  const typeName = resolveType(node.relationshipTypeId);
  let title = node.nationalId ? `${name} — ${node.nationalId}` : name;
  if (typeName) title = `${title} · ${typeName}`;

  // Highlight root people that actually have related people nested under them.
  const highlight = isRoot && node.children.length > 0;

  return (
    <div className={highlight ? RELATION_HIGHLIGHT : undefined}>
      <CollapsibleSection title={title} defaultOpen={false}>
        <PersonInfoView personId={node.personId} defaultCollapsed={false} />
        {node.children.length > 0 && (
          <div className="space-y-4 ms-4 border-s ps-4">
            {node.children.map((child) => (
              <PersonNode key={child.personId} node={child} resolveType={resolveType} />
            ))}
          </div>
        )}
      </CollapsibleSection>
    </div>
  );
}

export function MembersReportContent() {
  const { t, i18n } = useTranslation('members-reports');
  const activeLanguageId = i18n.language === 'fa' ? PERSIAN_LANGUAGE_ID : ENGLISH_LANGUAGE_ID;
  const [companyId, setCompanyId] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Member companies (brokerages + funds) — same data source the brokerages +
  // funds report uses, so the dropdown lists exactly the member companies.
  const { data: entitiesData } = useQuery<MemberEntityReport>({
    queryKey: ['members-reports', 'member-entities'],
    queryFn: fetchEntities,
    staleTime: 60 * 1000,
  });
  const companies = entitiesData?.items ?? [];
  const selected = companies.find((c) => c.companyId === companyId);

  // People for the selected company — fetched only once a company is chosen.
  const {
    data: peopleData,
    isLoading: peopleLoading,
    isError: peopleError,
  } = useQuery<CompanyPersonsReport>({
    queryKey: ['members-reports', 'company-persons', companyId],
    queryFn: () => fetchCompanyPersons(companyId),
    enabled: !!companyId,
    staleTime: 60 * 1000,
  });
  const people = peopleData?.items ?? [];

  // Relationship-type names (Persian) for the nested relation row headers.
  const { data: referenceData } = useQuery<ReferenceData>({
    queryKey: ['person-reference-data'],
    queryFn: async () => {
      const r = await fetch('/api/person/reference');
      if (!r.ok) throw new Error('Failed to load reference data');
      return r.json();
    },
    staleTime: 5 * 60 * 1000,
  });
  const relationshipTypeNames = useMemo(() => {
    // Group translations per type, then pick the active locale → fa → en → any,
    // mirroring the backend name fallback so a label always renders.
    const byType = new Map<number, Array<{ languageId: number; name: string }>>();
    for (const tr of referenceData?.relationshipTypeTranslations ?? []) {
      const list = byType.get(tr.relationshipTypeId) ?? [];
      list.push({ languageId: tr.languageId, name: tr.name });
      byType.set(tr.relationshipTypeId, list);
    }
    const map = new Map<number, string>();
    byType.forEach((list, id) => {
      const pick =
        list.find((x) => x.languageId === activeLanguageId) ??
        list.find((x) => x.languageId === PERSIAN_LANGUAGE_ID) ??
        list.find((x) => x.languageId === ENGLISH_LANGUAGE_ID) ??
        list[0];
      if (pick?.name) map.set(id, pick.name);
    });
    return map;
  }, [referenceData, activeLanguageId]);
  const resolveType = useCallback(
    (typeId: number | null) => (typeId == null ? null : relationshipTypeNames.get(typeId) ?? null),
    [relationshipTypeNames],
  );

  const entityTypeLabel = (type: string) =>
    type === 'Fund'
      ? t('entityTypeFund', { defaultValue: 'Fund' })
      : t('entityTypeBrokerage', { defaultValue: 'Brokerage' });

  const handleExport = async () => {
    if (!companyId) return;
    try {
      setIsExporting(true);
      const res = await fetch(`/members/api/members-reports/company-persons/export?companyId=${encodeURIComponent(companyId)}`);
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'company-persons.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Excel export failed:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const message = (node: ReactNode, role?: 'status' | 'alert', tone?: 'error') => (
    <Card>
      <CardContent
        role={role}
        aria-live={role === 'alert' ? 'assertive' : role === 'status' ? 'polite' : undefined}
        aria-busy={role === 'status' ? true : undefined}
        className={cn(
          'py-10 text-center text-sm',
          tone === 'error' ? 'text-rose-800 dark:text-rose-300' : 'text-muted-foreground',
        )}
      >
        {node}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-5 lg:space-y-7.5">
      {/* Title */}
      <Card className="bg-sky-50/25! border-sky-100! dark:bg-sky-950/25! dark:border-sky-900! shadow-lg shadow-black/5">
        <CardContent className="py-5">
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle
                text={t('pageTitleMembers', { defaultValue: 'Members by Company' })}
              />
              <ToolbarDescription>
                {t('descMembers', {
                  defaultValue:
                    'Select a member company to view the people who have access to it, and expand a person to see their full profile.',
                })}
              </ToolbarDescription>
            </ToolbarHeading>
          </Toolbar>
        </CardContent>
      </Card>

      <div className={GLASS_WRAPPER}>
        {/* Company selector */}
        <Card>
          <CardContent className="py-5">
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-1 flex-1 min-w-[260px] max-w-md">
                <Label className="text-xs text-muted-foreground">
                  {t('memberCompanyLabel', { defaultValue: 'Member Company' })}
                </Label>
                <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={pickerOpen}
                      className="w-full justify-between"
                    >
                      {selected
                        ? `${selected.name}${selected.nationalId ? ` (${selected.nationalId})` : ''}`
                        : t('selectCompanyPlaceholder', { defaultValue: 'Select a member company' })}
                      <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder={t('searchCompanyPlaceholder', {
                          defaultValue: 'Search name or national ID…',
                        })}
                      />
                      <CommandList>
                        <CommandEmpty>
                          {t('noCompaniesFound', { defaultValue: 'No companies found.' })}
                        </CommandEmpty>
                        <CommandGroup>
                          {companies.map((c) => (
                            <CommandItem
                              key={`${c.entityType}-${c.companyId}`}
                              value={`${c.name} ${c.nationalId ?? ''}`}
                              onSelect={() => {
                                setCompanyId(c.companyId);
                                setPickerOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'me-2 h-4 w-4',
                                  companyId === c.companyId ? 'opacity-100' : 'opacity-0',
                                )}
                              />
                              <Badge
                                variant={c.entityType === 'Fund' ? 'secondary' : 'primary'}
                                appearance="light"
                                className="text-xs me-2"
                              >
                                {entityTypeLabel(c.entityType)}
                              </Badge>
                              <span className="flex-1">{c.name}</span>
                              {c.nationalId && (
                                <span className="text-xs text-muted-foreground font-mono">
                                  {c.nationalId}
                                </span>
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {companyId && peopleData && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground ms-auto">
                  <span>
                    {t('resultCount', { defaultValue: '{{count}} record(s)', count: people.length })}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    disabled={isExporting || people.length === 0}
                  >
                    {isExporting
                      ? t('exporting', { defaultValue: 'Exporting…' })
                      : t('exportExcel', { defaultValue: 'Export to Excel' })}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* States */}
        {!companyId &&
          message(t('selectCompanyPrompt', { defaultValue: 'Select a member company to view its people.' }))}

        {companyId && peopleLoading &&
          message(t('loading', { defaultValue: 'Loading…' }), 'status')}

        {companyId && peopleError &&
          message(t('errorLoading', { defaultValue: 'Failed to load the report.' }), 'alert', 'error')}

        {companyId && !peopleLoading && !peopleError && people.length === 0 &&
          message(t('noPeople', { defaultValue: 'No people found for this company.' }))}

        {companyId && !peopleLoading && !peopleError && people.length > 0 && (
          <div className="space-y-4">
            {people.map((p) => (
              <PersonNode key={p.personId} node={p} resolveType={resolveType} isRoot />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
