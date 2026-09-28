'use client';

import { PreferredShareholdersForm } from './components/preferred-shareholders-form';
import { Sidebar } from './components/sidebar';

export function Content() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <PreferredShareholdersForm />
      </div>
      <div className="lg:col-span-1">
        <Sidebar />
      </div>
    </div>
  );
}
