import { redirect } from 'next/navigation';

// The section landing lives at a sub-path (/members-reports/overview) so no tab
// path is a prefix of another (mirrors the brokerages section). The bare section
// root just redirects to the overview.
export default function MembersReportsRootPage() {
  redirect('/overview');
}
