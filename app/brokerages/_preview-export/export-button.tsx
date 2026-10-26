'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { RiErrorWarningFill } from '@remixicon/react';
import { FileSpreadsheet, Loader2 } from 'lucide-react';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ExportButtonProps {
  label: string;
  errorMessage: string;
  disabled?: boolean;
  // Builds and downloads the file; the workbook library loads on first use.
  onExport: () => Promise<void>;
}

export function ExportButton({ label, errorMessage, disabled, onExport }: ExportButtonProps) {
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      await onExport();
    } catch {
      toast.custom(
        () => (
          <Alert variant="mono" icon="destructive">
            <AlertIcon><RiErrorWarningFill /></AlertIcon>
            <AlertTitle>{errorMessage}</AlertTitle>
          </Alert>
        ),
        { position: 'top-center', duration: 4000 },
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={run} disabled={disabled || busy}>
      {busy ? <Loader2 className="size-4 animate-spin" /> : <FileSpreadsheet className="size-4" />}
      {label}
    </Button>
  );
}
