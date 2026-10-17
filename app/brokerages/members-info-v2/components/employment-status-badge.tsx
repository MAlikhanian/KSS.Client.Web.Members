'use client';

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from '@/hooks/useTranslation';
import type { EmploymentStatus } from '../mock/personnel.mock';

const VARIANT: Record<EmploymentStatus, 'success' | 'secondary' | 'info' | 'warning' | 'outline'> = {
  active: 'success',
  ended: 'secondary',
  awaitingStart: 'info',
  missing: 'outline',
  conflict: 'warning',
};

// Missing and conflicting records are shown as their own states, never folded
// into Active/Ended, with a hint saying why the status could not be decided.
export function EmploymentStatusBadge({ status }: { status: EmploymentStatus }) {
  const { t } = useTranslation('brokerages-members-info-v2');
  const label = t(`status.${status}`);
  const badge = (
    <Badge variant={VARIANT[status]} appearance="light" size="sm">
      {label}
    </Badge>
  );
  if (status !== 'missing' && status !== 'conflict') return badge;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help">{badge}</span>
      </TooltipTrigger>
      <TooltipContent>{t(`status.hint.${status}`)}</TooltipContent>
    </Tooltip>
  );
}
