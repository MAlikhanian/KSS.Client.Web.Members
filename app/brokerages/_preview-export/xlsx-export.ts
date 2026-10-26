import type ExcelJSModule from 'exceljs';

// Excel export for the preview pages. The workbook library is loaded only when
// an export actually runs (dynamic import in downloadXlsx), so the page bundles
// never carry it. Building the workbook is separate from delivering the file,
// so a later stage can swap the browser download for a server-side export.

export type CellValue = string | number | null;

export interface ExportColumn {
  key: string;
  header: string;
  width?: number;
  // Stored as a TEXT cell, so ids keep their leading zeros.
  text?: boolean;
}

export interface ExportSheet {
  name: string;
  columns: ExportColumn[];
  rows: Record<string, CellValue>[];
}

export interface ExportSpec {
  fileName: string;
  // Confidentiality notice, written as row 1 of every sheet.
  header: string;
  rightToLeft?: boolean;
  sheets: ExportSheet[];
}

// What an export log entry records: who, when, what, how many. Never the data.
export interface ExportLogEntry {
  exportId: string;
  at: string; // ISO time
  userId: string;
  page: string;
  filter: Record<string, string | string[]>;
  rowCount: number;
  sensitiveIncluded: boolean;
}

// What the viewer may export, decided in ONE place. Personal data is binary:
// without access, no national id leaves the page in any form (not even its
// last four digits) and there are no dependents. With access, the full id as
// text plus the dependents. The last-4 option is off by default and, when on,
// shortens the member's own id only; dependents are never partly shown.
export interface ExportPermissions {
  canViewPersonalData: boolean;
  maskMemberIdLast4?: boolean;
}

export interface ExportLayer {
  memberId: 'none' | 'full' | 'last4';
  dependents: boolean;
}

export function exportLayer(p: ExportPermissions): ExportLayer {
  if (!p.canViewPersonalData) return { memberId: 'none', dependents: false };
  return { memberId: p.maskMemberIdLast4 ? 'last4' : 'full', dependents: true };
}

// A value that starts with = + - @ (or a tab / carriage return) could be read
// as a formula by a spreadsheet; it is written with a leading apostrophe.
export function guardCell(value: CellValue): CellValue {
  if (typeof value !== 'string') return value;
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

// Shows only the last four characters, for viewers who may not see the full id.
export function maskLast4(value: string): string {
  return value.length <= 4 ? value : '*'.repeat(value.length - 4) + value.slice(-4);
}

// Time-ordered unique id (UUIDv7) for each export.
export function newExportId(now: number = Date.now()): string {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  let t = now;
  for (let i = 5; i >= 0; i--) {
    b[i] = t % 256;
    t = Math.floor(t / 256);
  }
  b[6] = (b[6] & 0x0f) | 0x70;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

// <prefix>_<code>_<yyyy-mm-dd>_<exportId>.xlsx, the date in the viewer's local
// calendar day. Characters a file name cannot hold are replaced.
export function exportFileName(prefix: string, code: string, date: Date, exportId: string): string {
  const day = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const safe = (s: string) => s.replace(/[\\/:*?"<>|\s]+/g, '-') || 'unknown';
  return `${safe(prefix)}_${safe(code)}_${day}_${exportId}.xlsx`;
}

export function buildWorkbook(ExcelJS: typeof ExcelJSModule, spec: ExportSpec): ExcelJSModule.Workbook {
  const wb = new ExcelJS.Workbook();
  for (const sheet of spec.sheets) {
    const ws = wb.addWorksheet(sheet.name.slice(0, 31), {
      views: [{ rightToLeft: !!spec.rightToLeft, state: 'frozen', ySplit: 2 }],
    });
    ws.columns = sheet.columns.map((c) => ({ key: c.key, width: c.width ?? 18 }));

    const notice = ws.getRow(1);
    notice.getCell(1).value = spec.header;
    notice.font = { bold: true, color: { argb: 'FFC00000' } };
    if (sheet.columns.length > 1) ws.mergeCells(1, 1, 1, sheet.columns.length);

    const head = ws.getRow(2);
    sheet.columns.forEach((c, i) => {
      head.getCell(i + 1).value = c.header;
    });
    head.font = { bold: true };

    for (const r of sheet.rows) {
      const row = ws.addRow([]);
      sheet.columns.forEach((c, i) => {
        const cell = row.getCell(i + 1);
        const raw = r[c.key] ?? null;
        if (c.text) {
          cell.numFmt = '@';
          cell.value = raw === null ? null : String(guardCell(String(raw)));
        } else {
          cell.value = guardCell(raw);
        }
      });
    }
  }
  return wb;
}

// Direct download in the browser; nothing is uploaded or stored anywhere.
export async function downloadXlsx(spec: ExportSpec): Promise<void> {
  const { default: ExcelJS } = await import('exceljs');
  const buffer = await buildWorkbook(ExcelJS, spec).xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = spec.fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
