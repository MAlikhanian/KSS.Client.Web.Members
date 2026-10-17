import type { MockPersonnel } from './personnel.mock';

// Folds Arabic/Persian letter and digit variants so a search matches however
// the name or id was typed.
export function normalizeSearch(text: string): string {
  return text
    .replace(/[\u064A\u0649]/g, '\u06CC')
    .replace(/\u0643/g, '\u06A9')
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/\u200C/g, ' ')
    .toLowerCase()
    .trim();
}

// Several values in one category are OR'ed; categories (and the search) are AND'ed.
export interface PersonnelFilter {
  q: string;
  status: string[];
  unit: string[];
  position: string[];
}

// Search covers full name, and national id only for viewers allowed to see it.
export function filterPersonnel(
  rows: MockPersonnel[],
  f: PersonnelFilter,
  canViewPersonalData: boolean,
): MockPersonnel[] {
  const q = normalizeSearch(f.q);
  return rows.filter((p) => {
    if (f.status.length && !f.status.includes(p.employmentStatus)) return false;
    if (f.unit.length && !(p.businessUnit !== null && f.unit.includes(p.businessUnit))) return false;
    if (f.position.length && !(p.position !== null && f.position.includes(p.position))) return false;
    if (!q) return true;
    const inName = normalizeSearch(p.name.fa).includes(q) || normalizeSearch(p.name.en).includes(q);
    const inId = canViewPersonalData && p.nationalId.includes(q);
    return inName || inId;
  });
}
