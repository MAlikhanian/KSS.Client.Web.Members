import { useQuery } from '@tanstack/react-query';
import type { SoftwareCatalogItemDto } from '@/services/company-api';

const fetchSoftwareCatalog = async (): Promise<SoftwareCatalogItemDto[]> => {
  const response = await fetch('/api/company/software');

  if (!response.ok) {
    throw new Error('failed');
  }

  return response.json();
};

/**
 * Read-only software catalog (`/api/company/software`) — active software
 * products joined with their provider company. Used by `CompanySoftwareForm`
 * to build the provider dropdown (distinct companies) and to filter the
 * software dropdown per row to the selected provider's products. The catalog
 * itself is admin/DB-managed — there is no in-app add/edit, so this is just a
 * cached read.
 */
export function useSoftwareCatalog() {
  return useQuery({
    queryKey: ['software-catalog'],
    queryFn: fetchSoftwareCatalog,
  });
}
