'use client';

import { GeneralInformationForm, Sidebar } from './components';

export function GeneralInformationContent() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 lg:gap-7.5">
      <div className="col-span-3">
        <div className="grid gap-5 lg:gap-7.5">
          <GeneralInformationForm />
        </div>
      </div>
      <div className="col-span-1">
        <div className="grid gap-5 lg:gap-7.5">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
