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
import { Badge } from '@/components/ui/badge';
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
import { downloadXlsx, exportFileName, newExportId } from '../../_preview-export/xlsx-export';
import { buildOfficesSheets } from '../export/build-offices-export';
import { OFFICE_TYPES, buildMockOffices, type MockOffice } from '../mock/offices.mock';
import { filterOffices } from '../mock/filter-offices';
import { PAGE_SIZES, type OfficesQueryState } from '../hooks/use-offices-query-state';
import { OfficeAddressesPanel, OfficeManagerPanel, OfficePhonesPanel } from './office-details-panels';
import { OfficeEditForm } from './office-edit-form';
import { OfficesFilters } from './offices-filters';

interface OfficesTableProps {
  state: OfficesQueryState;
  update: (patch: Partial<OfficesQueryState>) => void;
  lang: 'fa' | 'en';
}

export function OfficesTable({ state, update, lang }: OfficesTableProps) {
  const { t } = useTranslation('brokerages-trading-offices-v2');
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const all = useMemo(() => buildMockOffices(state.brokerageId), [state.brokerageId]);
  const managers = useMemo(
    () => all.flatMap((o) => (o.manager ? [o.manager] : [])),
    [all],
  );

  const filtered = useMemo(
    () => filterOffices(all, { q: state.q, type: state.type, province: state.province, city: state.city }),
    [all, state.q, state.type, state.province, state.city],
  );

  const { data: session } = useSession();
  // Same cached query as the brokerage picker: no extra request.
  const { brokerages } = useBrokerages();

  // Every office matching the current search and filters, across all pages.
  const exportXlsx = async () => {
    const now = new Date();
    const exportId = newExportId(now.getTime());
    const code = brokerages.find((b) => b.id === state.brokerageId)?.code || state.brokerageId;
    await downloadXlsx({
      fileName: exportFileName('TradingOffices', code, now, exportId),
      header: t('export.header', { user: session?.user?.id ?? '-', time: now.toISOString(), id: exportId }),
      rightToLeft: lang === 'fa',
      sheets: buildOfficesSheets(filtered, lang, {
        sheetOffices: t('export.sheetOffices'),
        sheetAddresses: t('export.sheetAddresses'),
        name: t('columns.name'),
        type: t('columns.type'),
        code: t('columns.code'),
        manager: t('columns.manager'),
        employeeCount: t('export.employeeCount'),
        active: t('export.active'),
        addressLabel: t('addresses.columns.label'),
        province: t('addresses.columns.province'),
        city: t('addresses.columns.city'),
        street: t('addresses.columns.street'),
        postalCode: t('addresses.columns.postalCode'),
        primary: t('addresses.primary'),
        yes: t('export.yes'),
        no: t('export.no'),
        notRecorded: t('values.notRecorded'),
        unknown: t('values.unknown'),
      }),
    });
  };

  const columns = useMemo<ColumnDef<MockOffice>[]>(() => {
    const muted = (text: string) => <span className="text-muted-foreground">{text}</span>;

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
            aria-label={t('actions.details')}
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
          expandedContent: (office: MockOffice) => (
            <div className="sticky start-0 w-[100cqw] divide-y divide-border">
              <OfficeEditForm office={office} managers={managers} lang={lang} />
              {/* The core fields stay open; addresses, phones and the manager's
                  details sit in one collapsible box that starts collapsed. */}
              <div className="px-6 py-4">
                <CollapsibleSection title={t('details.title')} defaultOpen={false}>
                  <OfficeAddressesPanel office={office} lang={lang} />
                  <OfficePhonesPanel office={office} lang={lang} />
                  <OfficeManagerPanel office={office} lang={lang} />
                </CollapsibleSection>
              </div>
            </div>
          ),
        },
      },
      {
        id: 'name',
        header: t('columns.name'),
        size: 240,
        cell: ({ row }) => (
          <span className="flex items-center gap-2">
            <span className="font-medium text-foreground">{row.original.name[lang]}</span>
            {/* Inactive offices are listed with the others and marked, not hidden. */}
            {!row.original.isActive && (
              <Badge variant="outline" size="sm">{t('values.inactive')}</Badge>
            )}
          </span>
        ),
      },
      {
        id: 'type',
        header: t('columns.type'),
        size: 170,
        cell: ({ row }) => {
          const key = row.original.typeId;
          if (key === null) return muted(t('values.notRecorded'));
          const hit = OFFICE_TYPES[key];
          return hit ? hit[lang] : muted(t('values.unknown'));
        },
      },
      {
        id: 'code',
        header: t('columns.code'),
        size: 130,
        cell: ({ row }) =>
          row.original.code ? (
            <span className="font-mono" dir="ltr">{row.original.code}</span>
          ) : (
            muted(t('values.notRecorded'))
          ),
      },
      {
        id: 'manager',
        header: t('columns.manager'),
        size: 200,
        // Name only here; the manager's other details are in the expanded row.
        cell: ({ row }) => row.original.manager?.name[lang] ?? muted(t('values.notRecorded')),
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
                  // Opens the row for editing; never closes it, and never
                  // reaches anything listening on the row itself.
                  onClick={(e) => {
                    e.stopPropagation();
                    row.toggleExpanded(true);
                  }}
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
  }, [t, lang, managers]);

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
    <DataGrid
      table={table}
      recordCount={filtered.length}
      emptyMessage={t('table.empty')}
      tableLayout={{ headerSticky: true }}
    >
      <Card>
        <CardHeader className="flex-wrap gap-2.5 py-3.5">
          <OfficesFilters state={state} update={update} lang={lang} />
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
  );
}
