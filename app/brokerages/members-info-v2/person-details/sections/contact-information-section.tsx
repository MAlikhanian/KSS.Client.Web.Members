'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Star, StarOff, Trash2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { formatDateTime, localizeDigits } from '@/app/components/person/components/format-utils';
import type { SampleAddress, SampleContact, SampleLookup } from '../sample-person-details';

const PrimaryStar = ({ on }: { on: boolean }) =>
  on ? (
    <Star className="h-4 w-4 text-yellow-500 mx-auto fill-yellow-500" />
  ) : (
    <StarOff className="h-4 w-4 text-muted-foreground/40 mx-auto" />
  );

const RowActions = () => (
  <div className="flex items-center gap-1">
    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" disabled>
      <Pencil className="h-4 w-4" />
    </Button>
    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" disabled>
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);

interface ContactReplicaProps {
  emails: SampleContact[];
  phones: SampleContact[];
  addresses: SampleAddress[];
  emailLabels: SampleLookup;
  phoneLabels: SampleLookup;
  addressLabels: SampleLookup;
  countries: SampleLookup;
  regions: SampleLookup;
  cities: SampleLookup;
}

// Read-only replica of the person contact sections 4 (emails), 5 (phones) and
// 6 (addresses), each with the same title, number, colour, columns and
// disabled row actions as the current page, fed with sample data.
export function ContactInformationSectionReplica(p: ContactReplicaProps) {
  const { t, i18n } = useTranslation('person-contact');
  const { t: tAddr } = useTranslation('person-address');
  const locale = i18n.language === 'fa' ? 'fa-IR' : 'en-US';
  const lang = i18n.language === 'fa' ? 'fa' : 'en';
  const name = (map: SampleLookup, id: number) => map[id]?.[lang] ?? '';

  return (
    <div className="space-y-6">
      {/* Section 4 - Emails - purple badge */}
      <div className="[&_div.rounded-xl.bg-card.bg-card]:border-purple-500! dark:[&_div.rounded-xl.bg-card.bg-card]:border-purple-500!">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">4</span>
              {t('emailsTitle', { defaultValue: 'Emails' })}
              <Badge variant="outline">{p.emails.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {p.emails.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t('noEmails', { defaultValue: 'No emails registered' })}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>{t('common:type', { defaultValue: 'Type' })}</TableHead>
                      <TableHead>{t('emailAddress', { defaultValue: 'Email Address' })}</TableHead>
                      <TableHead>{t('common:createdAt', { defaultValue: 'Created At' })}</TableHead>
                      <TableHead>{t('common:updatedAt', { defaultValue: 'Last Modified' })}</TableHead>
                      <TableHead className="w-16 text-center">{t('common:primary', { defaultValue: 'Primary' })}</TableHead>
                      <TableHead className="w-20">{t('common:actions', { defaultValue: 'Actions' })}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {p.emails.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{(index + 1).toLocaleString(locale)}</TableCell>
                        {/* The current page lists email labels by their Persian names. */}
                        <TableCell>{p.emailLabels[item.labelId]?.fa || '-'}</TableCell>
                        <TableCell>{item.value}</TableCell>
                        <TableCell style={{ unicodeBidi: 'plaintext' }}>{formatDateTime(item.createdAt, locale)}</TableCell>
                        <TableCell style={{ unicodeBidi: 'plaintext' }}>{formatDateTime(item.updatedAt, locale)}</TableCell>
                        <TableCell><PrimaryStar on={item.isPrimary} /></TableCell>
                        <TableCell><RowActions /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 5 - Phones - teal badge */}
      <div className="[&_div.rounded-xl.bg-card.bg-card]:border-teal-500! dark:[&_div.rounded-xl.bg-card.bg-card]:border-teal-500!">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">5</span>
              {t('phonesTitle', { defaultValue: 'Phone Numbers' })}
              <Badge variant="outline">{p.phones.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {p.phones.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t('noPhones', { defaultValue: 'No phone numbers registered' })}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>{t('common:type', { defaultValue: 'Type' })}</TableHead>
                      <TableHead>{t('phoneNumber', { defaultValue: 'Phone Number' })}</TableHead>
                      <TableHead>{t('common:createdAt', { defaultValue: 'Created At' })}</TableHead>
                      <TableHead>{t('common:updatedAt', { defaultValue: 'Last Modified' })}</TableHead>
                      <TableHead className="w-16 text-center">{t('common:primary', { defaultValue: 'Primary' })}</TableHead>
                      <TableHead className="w-20">{t('common:actions', { defaultValue: 'Actions' })}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {p.phones.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{(index + 1).toLocaleString(locale)}</TableCell>
                        <TableCell>{name(p.phoneLabels, item.labelId) || '-'}</TableCell>
                        <TableCell>{localizeDigits(item.value, locale)}</TableCell>
                        <TableCell style={{ unicodeBidi: 'plaintext' }}>{formatDateTime(item.createdAt, locale)}</TableCell>
                        <TableCell style={{ unicodeBidi: 'plaintext' }}>{formatDateTime(item.updatedAt, locale)}</TableCell>
                        <TableCell><PrimaryStar on={item.isPrimary} /></TableCell>
                        <TableCell><RowActions /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 6 - Addresses - indigo badge */}
      <div className="[&_div.rounded-xl.bg-card.bg-card]:border-indigo-500! dark:[&_div.rounded-xl.bg-card.bg-card]:border-indigo-500!">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">6</span>
              {t('person-address:sectionTitle', { defaultValue: 'Addresses' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{tAddr('sectionTitle', { defaultValue: 'Addresses' })}</span>
                <Badge variant="secondary">{p.addresses.length}</Badge>
              </div>
            </div>
            {p.addresses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {tAddr('noItems', { defaultValue: 'No addresses registered' })}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{tAddr('common:label', { defaultValue: 'Label' })}</TableHead>
                    <TableHead>{tAddr('location', { defaultValue: 'Country / Province / City' })}</TableHead>
                    <TableHead>{tAddr('address', { defaultValue: 'Address' })}</TableHead>
                    <TableHead>{tAddr('postalCode', { defaultValue: 'Postal Code' })}</TableHead>
                    <TableHead>{tAddr('common:createdAt', { defaultValue: 'Created At' })}</TableHead>
                    <TableHead>{tAddr('common:updatedAt', { defaultValue: 'Last Modified' })}</TableHead>
                    <TableHead className="w-16 text-center">{tAddr('common:primary', { defaultValue: 'Primary' })}</TableHead>
                    <TableHead className="w-24">{tAddr('common:actions', { defaultValue: 'Actions' })}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {p.addresses.map((addr) => (
                    <TableRow key={addr.id}>
                      <TableCell>{name(p.addressLabels, addr.labelId)}</TableCell>
                      <TableCell>
                        {[name(p.countries, addr.countryId), name(p.regions, addr.regionId), name(p.cities, addr.cityId)]
                          .filter(Boolean)
                          .join(' / ')}
                      </TableCell>
                      <TableCell>
                        {/* The current page shows the Persian street lines whatever the page language. */}
                        <div>{localizeDigits(addr.street1, locale)}</div>
                        {addr.street2 && <div>{localizeDigits(addr.street2, locale)}</div>}
                      </TableCell>
                      <TableCell>
                        {localizeDigits(addr.postalCode.length === 10
                          ? `${addr.postalCode.slice(0, 5)}-${addr.postalCode.slice(5)}`
                          : addr.postalCode, locale)}
                      </TableCell>
                      <TableCell style={{ unicodeBidi: 'plaintext' }}>{formatDateTime(addr.createdAt, locale)}</TableCell>
                      <TableCell style={{ unicodeBidi: 'plaintext' }}>{formatDateTime(addr.updatedAt, locale)}</TableCell>
                      <TableCell><PrimaryStar on={addr.isPrimary} /></TableCell>
                      <TableCell><RowActions /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
