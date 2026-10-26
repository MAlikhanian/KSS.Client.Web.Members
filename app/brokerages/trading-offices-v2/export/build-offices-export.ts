import type { ExportSheet } from '../../_preview-export/xlsx-export';
import { CITIES, OFFICE_TYPES, PROVINCES, type MockOffice } from '../mock/offices.mock';

export interface OfficesExportLabels {
  sheetOffices: string;
  sheetAddresses: string;
  name: string;
  type: string;
  code: string;
  manager: string;
  employeeCount: string;
  active: string;
  addressLabel: string;
  province: string;
  city: string;
  street: string;
  postalCode: string;
  primary: string;
  yes: string;
  no: string;
  notRecorded: string;
  unknown: string;
}

// The workbook sheets for the trading offices preview: one row per office (the
// caller passes every office matching the current search and filters), and one
// row per address of those offices. No national id is exported from this page.
export function buildOfficesSheets(rows: MockOffice[], lang: 'fa' | 'en', L: OfficesExportLabels): ExportSheet[] {
  const yesNo = (v: boolean) => (v ? L.yes : L.no);
  const type = (key: string | null) =>
    key === null ? L.notRecorded : (OFFICE_TYPES[key]?.[lang] ?? L.unknown);

  const offices: ExportSheet = {
    name: L.sheetOffices,
    columns: [
      { key: 'name', header: L.name, width: 26 },
      { key: 'type', header: L.type, width: 20 },
      { key: 'code', header: L.code, width: 14, text: true },
      { key: 'manager', header: L.manager, width: 24 },
      { key: 'employeeCount', header: L.employeeCount, width: 14 },
      { key: 'active', header: L.active, width: 10 },
    ],
    rows: rows.map((o) => ({
      name: o.name[lang],
      type: type(o.typeId),
      code: o.code ?? L.notRecorded,
      manager: o.manager?.name[lang] ?? L.notRecorded,
      employeeCount: o.employeeCount,
      active: yesNo(o.isActive),
    })),
  };

  const addresses: ExportSheet = {
    name: L.sheetAddresses,
    columns: [
      { key: 'office', header: L.name, width: 26 },
      { key: 'code', header: L.code, width: 14, text: true },
      { key: 'label', header: L.addressLabel, width: 18 },
      { key: 'province', header: L.province, width: 16 },
      { key: 'city', header: L.city, width: 16 },
      { key: 'street', header: L.street, width: 34 },
      { key: 'postalCode', header: L.postalCode, width: 14, text: true },
      { key: 'primary', header: L.primary, width: 10 },
    ],
    rows: rows.flatMap((o) =>
      o.addresses.map((a) => ({
        office: o.name[lang],
        code: o.code ?? L.notRecorded,
        label: a.label[lang],
        province: PROVINCES[a.provinceId]?.[lang] ?? L.unknown,
        city: CITIES[a.cityId]?.[lang] ?? L.unknown,
        street: a.street[lang],
        postalCode: a.postalCode,
        primary: yesNo(a.isPrimary),
      })),
    ),
  };
  return [offices, addresses];
}
