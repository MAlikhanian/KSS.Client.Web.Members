import { maskLast4, type ExportLayer, type ExportSheet } from '../../_preview-export/xlsx-export';
import {
  BUSINESS_UNITS,
  POSITIONS,
  STOCK_EXCHANGES,
  type MockPersonnel,
} from '../mock/personnel.mock';

type Lookup = Record<string, { fa: string; en: string }>;

export interface PersonnelExportLabels {
  sheetPersonnel: string;
  sheetDependents: string;
  fullName: string;
  nationalId: string;
  brokerageLocation: string;
  businessUnit: string;
  position: string;
  employmentStatus: string;
  dependentName: string;
  relationship: string;
  dependentNationalId: string;
  dateOfBirth: string;
  active: string;
  yes: string;
  no: string;
  notRecorded: string;
  unknown: string;
  status: (status: MockPersonnel['employmentStatus']) => string;
}

// The workbook sheets for the personnel preview: the rows given (the caller
// passes every row matching the current search and filters, not one page), with
// the national id and the dependents only as far as the layer allows.
export function buildPersonnelSheets(
  rows: MockPersonnel[],
  layer: ExportLayer,
  lang: 'fa' | 'en',
  L: PersonnelExportLabels,
): ExportSheet[] {
  const lookup = (map: Lookup, key: string | null) =>
    key === null ? L.notRecorded : (map[key]?.[lang] ?? L.unknown);
  const memberId = (id: string) => (layer.memberId === 'last4' ? maskLast4(id) : id);

  const personnel: ExportSheet = {
    name: L.sheetPersonnel,
    columns: [
      { key: 'fullName', header: L.fullName, width: 26 },
      ...(layer.memberId === 'none' ? [] : [{ key: 'nationalId', header: L.nationalId, width: 16, text: true }]),
      { key: 'brokerageLocation', header: L.brokerageLocation, width: 26 },
      { key: 'businessUnit', header: L.businessUnit, width: 20 },
      { key: 'position', header: L.position, width: 16 },
      { key: 'employmentStatus', header: L.employmentStatus, width: 22 },
    ],
    rows: rows.map((p) => ({
      fullName: p.name[lang],
      ...(layer.memberId === 'none' ? {} : { nationalId: memberId(p.nationalId) }),
      brokerageLocation: lookup(STOCK_EXCHANGES, p.brokerageLocation),
      businessUnit: lookup(BUSINESS_UNITS, p.businessUnit),
      position: lookup(POSITIONS, p.position),
      employmentStatus: L.status(p.employmentStatus),
    })),
  };
  if (!layer.dependents) return [personnel];

  const dependents: ExportSheet = {
    name: L.sheetDependents,
    columns: [
      { key: 'fullName', header: L.fullName, width: 26 },
      { key: 'nationalId', header: L.nationalId, width: 16, text: true },
      { key: 'dependentName', header: L.dependentName, width: 26 },
      { key: 'relationship', header: L.relationship, width: 18 },
      { key: 'dependentNationalId', header: L.dependentNationalId, width: 16, text: true },
      { key: 'dateOfBirth', header: L.dateOfBirth, width: 14, text: true },
      { key: 'active', header: L.active, width: 10 },
    ],
    rows: rows.flatMap((p) =>
      p.dependents.map((d) => ({
        fullName: p.name[lang],
        nationalId: memberId(p.nationalId),
        dependentName: d.name[lang],
        relationship: d.relationship[lang],
        // Dependents' own ids are never shortened: they are shown whole or not at all.
        dependentNationalId: d.nationalId,
        dateOfBirth: d.dateOfBirth,
        active: d.isActive ? L.yes : L.no,
      })),
    ),
  };
  return [personnel, dependents];
}
