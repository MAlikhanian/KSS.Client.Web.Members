import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { getTradingStationsByCompany, createTradingStation } from '@/services/trading-station-api';
import { apiErrorResponse } from '@/lib/api-error';

/** GET /api/trading-stations/by-company/{companyId} — trading stations for a company. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ companyId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { companyId } = await params;
    return NextResponse.json(await getTradingStationsByCompany(session.accessToken, companyId));
  } catch (error) {
    return apiErrorResponse(error, 'fetching trading stations');
  }
}

/** POST /api/trading-stations/by-company/{companyId} — create a trading station (companyId from route). */
export async function POST(req: NextRequest, { params }: { params: Promise<{ companyId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { companyId } = await params;
    const body = await req.json();
    const result = await createTradingStation(session.accessToken, { ...body, companyId });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error, 'creating trading station');
  }
}
