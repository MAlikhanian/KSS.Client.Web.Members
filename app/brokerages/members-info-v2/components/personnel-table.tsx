'use client';

import { useMemo, useState } from 'react';
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
import { useTranslation } from '@/hooks/useTranslation';
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
}

export function PersonnelTable({ state, update, lang, canViewPersonalData }: PersonnelTableProps) {
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
          expandedContent: (person: MockPersonnel) => (
            <div className="divide-y divide-border">
              <MembershipEditForm person={person} lang={lang} />
              <EmploymentHistoryPanel person={person} />
              <DependentsPanel person={person} lang={lang} canViewPersonalData={canViewPersonalData} />
            </div>
          ),
        },
      },
      {
        id: 'fullName',
        header: t('columns.fullName'),
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.name[lang]}</span>,
        size: 200,
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
        size: 140,
      },
      {
        id: 'brokerageLocation',
        header: t('columns.brokerageLocation'),
        cell: ({ row }) => lookupLabel(STOCK_EXCHANGES, row.original.brokerageLocation),
        size: 180,
      },
      {
        id: 'businessUnit',
        header: t('columns.businessUnit'),
        cell: ({ row }) => lookupLabel(BUSINESS_UNITS, row.original.businessUnit),
        size: 160,
      },
      {
        id: 'position',
        header: t('columns.position'),
        cell: ({ row }) => lookupLabel(POSITIONS, row.original.position),
        size: 140,
      },
      {
        id: 'employmentStatus',
        header: t('columns.employmentStatus'),
        cell: ({ row }) => <EmploymentStatusBadge status={row.original.employmentStatus} />,
        size: 170,
      },
      {
        id: 'actions',
        header: t('columns.actions'),
        size: 110,
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
            </CardToolbar>
          </CardHeader>
          <CardTable>
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardTable>
          <CardFooter>
            <DataGridPagination sizes={PAGE_SIZES} />
          </CardFooter>
        </Card>
      </DataGrid>
    </>
  );
}
