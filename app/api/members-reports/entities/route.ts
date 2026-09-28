import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { getMemberEntitiesReport } from '@/services/report-api';

// GET /api/members-reports/entities — proxies the combined brokerages + funds
// report from KSS.Service.Report.SEBA_ERP_Members, attaching the session JWT.
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const report = await getMemberEntitiesReport(session.accessToken);
    return NextResponse.json(report);
  } catch (error) {
    console.error('Error fetching member-entities report:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Something went wrong.' },
      { status: 500 },
    );
  }
}
