import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { saveTradingStation, deleteTradingStation } from '@/services/trading-station-api';
import { apiErrorResponse } from '@/lib/api-error';

/** PUT /api/trading-stations/{id} — update a trading station's core fields. */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    const result = await saveTradingStation(session.accessToken, { ...body, id });
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error, 'saving trading station');
  }
}

/** DELETE /api/trading-stations/{id} — delete a trading station (cascades to children). */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    await deleteTradingStation(session.accessToken, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiErrorResponse(error, 'deleting trading station');
  }
}
