import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { getBrokerageProfile } from '@/services/report-api';

// GET /api/members-reports/brokerage-profile?companyId=… — proxies one
// brokerage's structural profile from KSS.Service.Report.SEBA_ERP_Members.
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
    const report = await getBrokerageProfile(session.accessToken, companyId);
    return NextResponse.json(report);
  } catch (error) {
    console.error('Error fetching brokerage-profile report:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Something went wrong.' },
      { status: 500 },
    );
  }
}
