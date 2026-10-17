import type { MockPersonnel } from './personnel.mock';

// Folds Arabic/Persian letter and digit variants so a search matches however
// the name or id was typed.
export function normalizeSearch(text: string): string {
  return text
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/‌/g, ' ')
    .toLowerCase()
    .trim();
}

export interface PersonnelFilter {
  q: string;
  status: string;
  unit: string;
  position: string;
}

// Search covers full name, and national id only for viewers allowed to see it.
export function filterPersonnel(
  rows: MockPersonnel[],
  f: PersonnelFilter,
  canViewPersonalData: boolean,
): MockPersonnel[] {
  const q = normalizeSearch(f.q);
  return rows.filter((p) => {
    if (f.status && p.employmentStatus !== f.status) return false;
    if (f.unit && p.businessUnit !== f.unit) return false;
    if (f.position && p.position !== f.position) return false;
    if (!q) return true;
    const inName = normalizeSearch(p.name.fa).includes(q) || normalizeSearch(p.name.en).includes(q);
    const inId = canViewPersonalData && p.nationalId.includes(q);
    return inName || inId;
  });
}
