'use client';

import { useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  ColumnDef,
  ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTable, CardToolbar } from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CollapsibleSection } from '@/components/common/collapsible-section';
import { useBrokerages } from '@/hooks/use-brokerages';
import { useTranslation } from '@/hooks/useTranslation';
import { ExportButton } from '../../_preview-export/export-button';
import { downloadXlsx, exportFileName, exportLayer, newExportId } from '../../_preview-export/xlsx-export';
import { buildPersonnelSheets } from '../export/build-personnel-export';
import {
  BUSINESS_UNITS,
  POSITIONS,
  STOCK_EXCHANGES,
  buildMockPersonnel,
  type MockPersonnel,
} from '../mock/personnel.mock';
import { filterPersonnel } from '../mock/filter-personnel';
import { PAGE_SIZES, type PersonnelQueryState } from '../hooks/use-personnel-query-state';
import { DependentsPanel } from './dependents-panel';
import { EmploymentHistoryPanel } from './employment-history-panel';
import { EmploymentStatusBadge } from './employment-status-badge';
import { MembershipEditForm } from './membership-edit-form';
import { PersonnelFilters } from './personnel-filters';

type Lookup = Record<string, { fa: string; en: string }>;

interface PersonnelTableProps {
  state: PersonnelQueryState;
  update: (patch: Partial<PersonnelQueryState>) => void;
  lang: 'fa' | 'en';
  canViewPersonalData: boolean;
  exportIdLast4?: boolean;
}

export function PersonnelTable({ state, update, lang, canViewPersonalData, exportIdLast4 = false }: PersonnelTableProps) {
  const { t } = useTranslation('brokerages-members-info-v2');
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const all = useMemo(() => buildMockPersonnel(state.brokerageId), [state.brokerageId]);

  const filtered = useMemo(
    () =>
      filterPersonnel(
        all,
        { q: state.q, status: state.status, unit: state.unit, position: state.position },
        canViewPersonalData,
      ),
    [all, state.q, state.status, state.unit, state.position, canViewPersonalData],
  );

  const { data: session } = useSession();
  // Same cached query as the brokerage picker: no extra request.
  const { brokerages } = useBrokerages();

  // Every row matching the current search and filters, across all pages.
  const exportXlsx = async () => {
    const now = new Date();
    const exportId = newExportId(now.getTime());
    const code = brokerages.find((b) => b.id === state.brokerageId)?.code || state.brokerageId;
    const layer = exportLayer({ canViewPersonalData, maskMemberIdLast4: exportIdLast4 });
    await downloadXlsx({
      fileName: exportFileName('Personnel', code, now, exportId),
      header: t('export.header', { user: session?.user?.id ?? '-', time: now.toISOString(), id: exportId }),
      rightToLeft: lang === 'fa',
      sheets: buildPersonnelSheets(filtered, layer, lang, {
        sheetPersonnel: t('export.sheetPersonnel'),
        sheetDependents: t('export.sheetDependents'),
        fullName: t('columns.fullName'),
        nationalId: t('columns.nationalId'),
        brokerageLocation: t('columns.brokerageLocation'),
        businessUnit: t('columns.businessUnit'),
        position: t('columns.position'),
        employmentStatus: t('columns.employmentStatus'),
        dependentName: t('export.dependentName'),
        relationship: t('dependents.columns.relationship'),
        dependentNationalId: t('export.dependentNationalId'),
        dateOfBirth: t('dependents.columns.dateOfBirth'),
        active: t('export.active'),
        yes: t('export.yes'),
        no: t('export.no'),
        notRecorded: t('values.notRecorded'),
        unknown: t('values.unknown'),
        status: (s) => t(`status.${s}`),
      }),
    });
  };

  const columns = useMemo<ColumnDef<MockPersonnel>[]>(() => {
    const lookupLabel = (map: Lookup, key: string | null) => {
      if (key === null) return <span className="text-muted-foreground">{t('values.notRecorded')}</span>;
      const hit = map[key];
      if (!hit) return <span className="text-muted-foreground">{t('values.unknown')}</span>;
      return hit[lang];
    };

    return [
      {
        id: 'expand',
        header: () => null,
        size: 44,
        cell: ({ row }) => (
          <Button
            type="button"
            variant="ghost"
            mode="icon"
            size="sm"
            onClick={row.getToggleExpandedHandler()}
            aria-label={t('actions.dependents')}
            aria-expanded={row.getIsExpanded()}
          >
            {row.getIsExpanded() ? (
              <ChevronDown className="size-4" />
            ) : lang === 'fa' ? (
              <ChevronLeft className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </Button>
        ),
        meta: {
          // The panel is exactly as wide as the visible table area (100cqw of the
          // @container around the scroll area) and sticks to its inline start, so
          // its form and Save button stay fully on screen when the table scrolls
          // sideways on a narrow screen.
          expandedContent: (person: MockPersonnel) => (
            <div className="sticky start-0 w-[100cqw] divide-y divide-border">
              <MembershipEditForm person={person} lang={lang} />
              {/* As on the current page: the membership fields stay open, and the
                  person details below them sit in one collapsible box that
                  starts collapsed. */}
              <div className="px-6 py-4">
                <CollapsibleSection title={t('details.title')} defaultOpen={false}>
                  <EmploymentHistoryPanel person={person} />
                  <DependentsPanel person={person} lang={lang} canViewPersonalData={canViewPersonalData} />
                </CollapsibleSection>
              </div>
            </div>
          ),
        },
      },
      {
        id: 'fullName',
        header: t('columns.fullName'),
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.name[lang]}</span>,
        size: 180,
      },
      {
        id: 'nationalId',
        header: t('columns.nationalId'),
        cell: ({ row }) =>
          canViewPersonalData ? (
            <span className="font-mono" dir="ltr">{row.original.nationalId}</span>
          ) : (
            <span className="text-muted-foreground">{t('values.restricted')}</span>
          ),
        size: 130,
      },
      {
        id: 'brokerageLocation',
        header: t('columns.brokerageLocation'),
        cell: ({ row }) => lookupLabel(STOCK_EXCHANGES, row.original.brokerageLocation),
        size: 160,
      },
      {
        id: 'businessUnit',
        header: t('columns.businessUnit'),
        cell: ({ row }) => lookupLabel(BUSINESS_UNITS, row.original.businessUnit),
        size: 150,
      },
      {
        id: 'position',
        header: t('columns.position'),
        cell: ({ row }) => lookupLabel(POSITIONS, row.original.position),
        size: 130,
      },
      {
        id: 'employmentStatus',
        header: t('columns.employmentStatus'),
        cell: ({ row }) => <EmploymentStatusBadge status={row.original.employmentStatus} />,
        size: 160,
      },
      {
        id: 'actions',
        header: t('columns.actions'),
        size: 100,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  mode="icon"
                  size="sm"
                  onClick={() => row.toggleExpanded(true)}
                  aria-label={t('actions.edit')}
                >
                  <Pencil className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('actions.edit')}</TooltipContent>
            </Tooltip>
          </div>
        ),
      },
    ];
  }, [t, lang, canViewPersonalData]);

  // Page index and size come from the URL so they survive navigation.
  const pageCount = Math.max(1, Math.ceil(filtered.length / state.size));
  const pagination: PaginationState = {
    pageIndex: Math.min(state.page, pageCount) - 1,
    pageSize: state.size,
  };

  const table = useReactTable({
    columns,
    data: filtered,
    pageCount,
    getRowId: (row) => row.id,
    state: { pagination, expanded },
    onPaginationChange: (updater) => {
      const next = typeof updater === 'function' ? updater(pagination) : updater;
      if (next.pageSize !== state.size) update({ size: next.pageSize });
      else update({ page: next.pageIndex + 1 });
    },
    onExpandedChange: setExpanded,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    autoResetPageIndex: false,
  });

  return (
    <>
      <DataGrid
        table={table}
        recordCount={filtered.length}
        emptyMessage={t('table.empty')}
        tableLayout={{ headerSticky: true }}
      >
        <Card>
          <CardHeader className="flex-wrap gap-2.5 py-3.5">
            <PersonnelFilters
              state={state}
              update={update}
              lang={lang}
              canViewPersonalData={canViewPersonalData}
            />
            <CardToolbar>
              <span className="text-sm text-muted-foreground">
                {t('table.count', { count: filtered.length, total: all.length })}
              </span>
              <ExportButton
                label={t('export.button')}
                errorMessage={t('export.error')}
                disabled={filtered.length === 0}
                onExport={exportXlsx}
              />
            </CardToolbar>
          </CardHeader>
          <CardTable>
            <div className="@container">
              <ScrollArea>
                <DataGridTable />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </CardTable>
          <CardFooter>
            <DataGridPagination sizes={PAGE_SIZES} />
          </CardFooter>
        </Card>
      </DataGrid>
    </>
  );
}
