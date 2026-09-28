import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { getPersonnelByPosition } from '@/services/report-api';

// GET /api/members-reports/personnel-by-position — proxies the industry-wide
// personnel-by-position report from KSS.Service.Report.SEBA_ERP_Members.
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const report = await getPersonnelByPosition(session.accessToken);
    return NextResponse.json(report);
  } catch (error) {
    console.error('Error fetching personnel-by-position report:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Something went wrong.' },
      { status: 500 },
    );
  }
}
