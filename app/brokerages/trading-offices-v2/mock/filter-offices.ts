import { normalizeSearch } from '../../members-info-v2/mock/filter-personnel';
import { CITIES, type MockOffice } from './offices.mock';

// Several values in one category are OR'ed; categories (and the search) are AND'ed.
export interface OfficeFilter {
  q: string;
  type: string[];
  province: string[];
  city: string[];
}

// Province and city are judged per ADDRESS: an office matches when at least one
// of its addresses is in a chosen province AND in a chosen city (either list may
// be empty, meaning any). An office with no address never matches a province or
// city filter. Each office appears once, however many addresses match.
function locationMatches(office: MockOffice, province: string[], city: string[]): boolean {
  if (!province.length && !city.length) return true;
  return office.addresses.some(
    (a) =>
      (!province.length || province.includes(a.provinceId)) &&
      (!city.length || city.includes(a.cityId)),
  );
}

// Search covers the office name, the office code and the manager's name.
export function filterOffices(rows: MockOffice[], f: OfficeFilter): MockOffice[] {
  const q = normalizeSearch(f.q);
  return rows.filter((o) => {
    if (f.type.length && !(o.typeId !== null && f.type.includes(o.typeId))) return false;
    if (!locationMatches(o, f.province, f.city)) return false;
    if (!q) return true;
    const texts = [o.name.fa, o.name.en, o.code ?? '', o.manager?.name.fa ?? '', o.manager?.name.en ?? ''];
    return texts.some((s) => normalizeSearch(s).includes(q));
  });
}

// The city options follow the chosen provinces, so a city whose province is no
// longer chosen is dropped from the selection as well.
export function citiesInProvinces(province: string[]): string[] {
  return Object.keys(CITIES).filter((c) => !province.length || province.includes(CITIES[c].provinceId));
}

export function pruneCities(province: string[], city: string[]): string[] {
  const allowed = new Set(citiesInProvinces(province));
  return city.filter((c) => allowed.has(c));
}
