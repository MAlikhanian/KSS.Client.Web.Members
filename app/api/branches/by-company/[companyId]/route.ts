import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { getBranchesByCompany, createBranch } from '@/services/branch-api';
import { apiErrorResponse } from '@/lib/api-error';

/** GET /api/branches/by-company/{companyId} — branches (with names) for a company. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ companyId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { companyId } = await params;
    return NextResponse.json(await getBranchesByCompany(session.accessToken, companyId));
  } catch (error) {
    return apiErrorResponse(error, 'fetching branches');
  }
}

/** POST /api/branches/by-company/{companyId} — create a branch (companyId from route). */
export async function POST(req: NextRequest, { params }: { params: Promise<{ companyId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { companyId } = await params;
    const body = await req.json();
    const result = await createBranch(session.accessToken, { ...body, companyId });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error, 'creating branch');
  }
}
