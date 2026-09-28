'use client';

import { FundManagerForm, Sidebar } from './components';

export function FundManagerContent() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 lg:gap-7.5">
      <div className="col-span-3">
        <div className="grid gap-5 lg:gap-7.5">
          <FundManagerForm />
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
