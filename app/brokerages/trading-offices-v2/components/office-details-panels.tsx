'use client';

import { MapPin, Phone, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
import { CITIES, PROVINCES, type MockOffice } from '../mock/offices.mock';

interface PanelProps {
  office: MockOffice;
  lang: 'fa' | 'en';
}

// Read-only. Addresses and phones are listed as recorded, the primary one
// marked; editing them is not part of this preview.
export function OfficeAddressesPanel({ office, lang }: PanelProps) {
  const { t } = useTranslation('brokerages-trading-offices-v2');

  if (office.addresses.length === 0) {
    return (
      <div className="flex items-center gap-2 px-6 py-4 text-sm text-muted-foreground">
        <MapPin className="size-4" />
        {t('addresses.none')}
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      <div className="mb-2 text-sm font-medium text-foreground">
        {t('addresses.title', { count: office.addresses.length })}
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted-foreground">
            <th className="py-1.5 text-start font-normal">{t('addresses.columns.label')}</th>
            <th className="py-1.5 text-start font-normal">{t('addresses.columns.province')}</th>
            <th className="py-1.5 text-start font-normal">{t('addresses.columns.city')}</th>
            <th className="py-1.5 text-start font-normal">{t('addresses.columns.street')}</th>
            <th className="py-1.5 text-start font-normal">{t('addresses.columns.postalCode')}</th>
          </tr>
        </thead>
        <tbody>
          {office.addresses.map((a) => (
            <tr key={a.id} className="border-t border-border">
              <td className="py-1.5">
                {a.label[lang]}
                {a.isPrimary && (
                  <Badge variant="primary" appearance="light" size="xs" className="ms-2">
                    {t('addresses.primary')}
                  </Badge>
                )}
              </td>
              <td className="py-1.5">{PROVINCES[a.provinceId]?.[lang] ?? a.provinceId}</td>
              <td className="py-1.5">{CITIES[a.cityId]?.[lang] ?? a.cityId}</td>
              <td className="py-1.5">{a.street[lang]}</td>
              <td className="py-1.5"><span className="font-mono" dir="ltr">{a.postalCode}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function OfficePhonesPanel({ office, lang }: PanelProps) {
  const { t } = useTranslation('brokerages-trading-offices-v2');

  if (office.phones.length === 0) {
    return (
      <div className="flex items-center gap-2 px-6 py-4 text-sm text-muted-foreground">
        <Phone className="size-4" />
        {t('phones.none')}
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      <div className="mb-2 text-sm font-medium text-foreground">
        {t('phones.title', { count: office.phones.length })}
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted-foreground">
            <th className="py-1.5 text-start font-normal">{t('phones.columns.label')}</th>
            <th className="py-1.5 text-start font-normal">{t('phones.columns.number')}</th>
          </tr>
        </thead>
        <tbody>
          {office.phones.map((p) => (
            <tr key={p.id} className="border-t border-border">
              <td className="py-1.5">
                {p.label[lang]}
                {p.isPrimary && (
                  <Badge variant="primary" appearance="light" size="xs" className="ms-2">
                    {t('phones.primary')}
                  </Badge>
                )}
              </td>
              <td className="py-1.5"><span className="font-mono" dir="ltr">{p.number}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function OfficeManagerPanel({ office, lang }: PanelProps) {
  const { t } = useTranslation('brokerages-trading-offices-v2');
  const m = office.manager;

  if (!m) {
    return (
      <div className="flex items-center gap-2 px-6 py-4 text-sm text-muted-foreground">
        <UserRound className="size-4" />
        {t('manager.none')}
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      <div className="mb-2 text-sm font-medium text-foreground">{t('manager.title')}</div>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-muted-foreground">{t('manager.name')}</dt>
          <dd>{m.name[lang]}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t('manager.nationalId')}</dt>
          <dd><span className="font-mono" dir="ltr">{m.nationalId}</span></dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t('manager.mobile')}</dt>
          <dd><span className="font-mono" dir="ltr">{m.mobile}</span></dd>
        </div>
      </dl>
    </div>
  );
}
