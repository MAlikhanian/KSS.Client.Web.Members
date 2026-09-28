'use client';

import Link from 'next/link';
import { ChevronRight, Save } from 'lucide-react';
import { RiErrorWarningFill } from '@remixicon/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { BrokerageDomainSection } from '../general-information/components/brokerage-domain-section';
import {
  SAMPLE_BROKERAGE_NAME,
  sampleNameHistory,
  sampleRegistration,
  sampleEmails,
  samplePhones,
  sampleAddresses,
  sampleStakeholders,
  sampleBrokerageDomain,
} from './sample-data';

const NS = 'brokerages-general-info-guide';

export function GeneralInformationGuideContent() {
  const { t } = useTranslation(NS);
  const { t: tBGI } = useTranslation('brokerages-general-info');
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
                <Link href="/general-information">
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

          {/* 7) Brokerage-specific (SEO) — the only editable section on the real page */}
          <SectionHelp ns={NS} skey="brokerageDomain" color="violet" num="۷" />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  ۷
                </span>
                {tBGI('form.sections.brokerageDomain', { defaultValue: 'Brokerage Specialized Information' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BrokerageDomainSection
                formData={sampleBrokerageDomain}
                onInputChange={noop}
                disabled
                hideHeader
              />
            </CardContent>
          </Card>

          {/* Operations (static, disabled) — mirrors the real operations card. */}
          <SectionHelp ns={NS} skey="operations" color="slate" num="✓" />
          <Card>
            <CardHeader>
              <CardTitle>{tBGI('form.sections.operations', { defaultValue: 'Operations' })}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end">
                <Button type="button" disabled>
                  <Save className="h-4 w-4" />
                  {tBGI('form.actions.update', { defaultValue: 'Update' })}
                </Button>
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
