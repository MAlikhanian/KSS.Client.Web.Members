import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { getCompanyPersonsReport } from '@/services/report-api';

// GET /api/members-reports/company-persons?companyId=… — proxies the persons
// attached to a single member company (its access-holders) from
// KSS.Service.Report.SEBA_ERP_Members, attaching the session JWT.
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

    const report = await getCompanyPersonsReport(session.accessToken, companyId);
    return NextResponse.json(report);
  } catch (error) {
    console.error('Error fetching company-persons report:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Something went wrong.' },
      { status: 500 },
    );
  }
}
