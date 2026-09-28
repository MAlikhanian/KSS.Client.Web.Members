import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { getFundReport } from '@/services/report-api';

// GET /api/members-reports/fund-report?companyId=… — proxies one fund's
// structural report from KSS.Service.Report.SEBA_ERP_Members.
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const companyId = request.nextUrl.searchParams.get('companyId');
    if (!companyId) {
      return NextResponse.json({ message: 'companyId is required' }, { status: 400 });
    }
    const report = await getFundReport(session.accessToken, companyId);
    return NextResponse.json(report);
  } catch (error) {
    console.error('Error fetching fund-report:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Something went wrong.' },
      { status: 500 },
    );
  }
}
