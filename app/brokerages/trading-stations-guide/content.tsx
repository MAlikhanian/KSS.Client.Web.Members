'use client';

import Link from 'next/link';
import { ChevronRight, ChevronDown, Plus, Trash2, Save } from 'lucide-react';
import { RiErrorWarningFill } from '@remixicon/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { useTranslation } from '@/hooks/useTranslation';
import { SectionHelp, GUIDE_TINT } from '@/app/components/company/guide-ui';
import {
  CompanyInformationSection,
  RegistrationLegalSection,
  NameHistoryGrid,
  EmailsGrid,
  PhonesGrid,
  AddressesGrid,
  StakeholdersGrid,
} from '@/components/common/company-info';
import { ManagerSummary } from '../trading-stations/components/manager-summary';
import {
  SAMPLE_BROKERAGE_NAME,
  sampleNameHistory,
  sampleRegistration,
  sampleEmails,
  samplePhones,
  sampleAddresses,
  sampleStakeholders,
  sampleStation,
  sampleStationTrader,
  sampleStationAddresses,
  sampleStationPhones,
} from './sample-data';

const NS = 'brokerages-trading-stations-guide';

export function TradingStationsGuideContent() {
  const { t } = useTranslation(NS);
  const { t: tTS } = useTranslation('brokerages-trading-stations');
  const noop = () => {};

  const quickStepsRaw = t('quickStart.steps', { returnObjects: true }) as unknown;
  const quickSteps = Array.isArray(quickStepsRaw) ? (quickStepsRaw as string[]) : [];
  const faqRaw = t('faq.items', { returnObjects: true }) as unknown;
  const faq = Array.isArray(faqRaw) ? (faqRaw as { q: string; a: string }[]) : [];

  return (
    <div className="space-y-5 lg:space-y-7.5">
      {/* Title card */}
      <Card className="bg-violet-50! dark:bg-violet-950/25! shadow-lg shadow-black/5">
        <CardContent className="py-5">
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle text={t('title')} />
              <ToolbarDescription>{t('subtitle')}</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button asChild>
                <Link href="/trading-stations">
                  <ChevronRight className="h-4 w-4" />
                  {t('entry.backToPage')}
                </Link>
              </Button>
            </ToolbarActions>
          </Toolbar>
        </CardContent>
      </Card>

      {/* Training banner */}
      <div className="rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-4 py-3 flex items-start gap-3 shadow-sm">
        <RiErrorWarningFill className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <span className="text-sm font-medium text-amber-900 dark:text-amber-200 leading-7">
          {t('demoBanner')}
        </span>
      </div>

      <div className={GUIDE_TINT}>
        <div className="space-y-5 lg:space-y-7.5">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle>{t('quickStart.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground leading-7">{t('quickStart.intro')}</p>
              <ol className="list-decimal pr-5 space-y-1 text-sm leading-7">
                {quickSteps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Selection (static read-only representation) */}
          <SectionHelp ns={NS} skey="selection" color="neutral" num="●" />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                {t('sections.selection.title')}
                <Badge variant="secondary">{t('labels.demoData')}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-w-md">
                <Label>{t('labels.brokerageField')}</Label>
                <Input value={SAMPLE_BROKERAGE_NAME} dir="rtl" disabled readOnly />
                <div className="pt-1">
                  <Badge variant="primary">
                    {t('labels.editMode')} {SAMPLE_BROKERAGE_NAME}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 1) Name history */}
          <SectionHelp ns={NS} skey="nameHistory" color="sky" num="۱" />
          <CompanyInformationSection titleKey="form.sections.nameHistory">
            <NameHistoryGrid
              nameHistory={sampleNameHistory}
              onAdd={noop}
              onEdit={noop}
              onDelete={noop}
              onDeleteTranslation={noop}
              disabled
              readOnly
            />
          </CompanyInformationSection>

          {/* 2) Registration & legal */}
          <SectionHelp ns={NS} skey="registrationLegal" color="indigo" num="۲" />
          <RegistrationLegalSection formData={sampleRegistration} onInputChange={noop} disabled />

          {/* 3) Emails */}
          <SectionHelp ns={NS} skey="emails" color="teal" num="۳" />
          <EmailsGrid emails={sampleEmails} onAdd={noop} onEdit={noop} onDelete={noop} disabled readOnly />

          {/* 4) Phones */}
          <SectionHelp ns={NS} skey="phones" color="cyan" num="۴" />
          <PhonesGrid phones={samplePhones} onAdd={noop} onEdit={noop} onDelete={noop} disabled readOnly />

          {/* 5) Addresses */}
          <SectionHelp ns={NS} skey="addresses" color="slate" num="۵" />
          <AddressesGrid
            addresses={sampleAddresses}
            onAdd={noop}
            onEdit={noop}
            onDelete={noop}
            disabled
            readOnly
          />

          {/* 6) Stakeholders */}
          <SectionHelp ns={NS} skey="stakeholders" color="emerald" num="۶" />
          <StakeholdersGrid
            stakeholders={sampleStakeholders}
            onAdd={noop}
            onEdit={noop}
            onDelete={noop}
            disabled
            readOnly
          />

          {/* 7) Trading stations — static facsimile (the real station card isn't reusable read-only) */}
          <SectionHelp ns={NS} skey="tradingStations" color="violet" num="۷" />
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  ۷
                </span>
                {tTS('form.sections.tradingStations', { defaultValue: 'ایستگاه‌های معاملاتی' })}
              </CardTitle>
              <Button type="button" variant="outline" size="sm" disabled>
                <Plus className="h-4 w-4 ml-1" />
                {tTS('form.actions.addStation', { defaultValue: 'افزودن ایستگاه' })}
              </Button>
            </CardHeader>
            <CardContent>
              {/* One sample station, expanded (read-only). */}
              <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3 flex-1">
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                    <span className="font-medium text-foreground">
                      {tTS('form.stationNumber', { number: 1, defaultValue: 'ایستگاه ۱' })}
                    </span>
                  </div>
                  <Button type="button" variant="ghost" size="sm" disabled className="text-red-500">
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div className="p-6 pt-0 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>{tTS('form.fields.stationType', { defaultValue: 'نوع ایستگاه' })}</Label>
                      <Input value={sampleStation.stationTypeName} disabled readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>{tTS('form.fields.activityType', { defaultValue: 'نوع فعالیت' })}</Label>
                      <Input value={sampleStation.activityTypeName} disabled readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>{tTS('form.fields.trader', { defaultValue: 'معامله‌گر' })}</Label>
                      <ManagerSummary personId={sampleStationTrader.id} pick={sampleStationTrader} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="demo-station-active" checked disabled />
                      <Label htmlFor="demo-station-active">
                        {tTS('form.fields.isActive', { defaultValue: 'فعال' })}
                      </Label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="button" disabled>
                      <Save className="h-4 w-4" />
                      {tTS('form.actions.save', { defaultValue: 'ذخیره ایستگاه' })}
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <AddressesGrid
                      title={tTS('form.fields.officeAddress', { defaultValue: 'آدرس' })}
                      addresses={sampleStationAddresses}
                      onAdd={noop}
                      onEdit={noop}
                      onDelete={noop}
                      disabled
                      readOnly
                    />
                    <PhonesGrid
                      title={tTS('form.fields.officePhone', { defaultValue: 'تلفن' })}
                      phones={sampleStationPhones}
                      onAdd={noop}
                      onEdit={noop}
                      onDelete={noop}
                      disabled
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>{t('faq.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {faq.map((item, i) => (
                <details key={i} className="rounded-lg border border-border/60 bg-background/40 p-3">
                  <summary className="cursor-pointer font-medium text-sm">{item.q}</summary>
                  <p className="text-sm text-muted-foreground leading-7 mt-2">{item.a}</p>
                </details>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
