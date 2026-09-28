import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { saveBranch, deleteBranch } from '@/services/branch-api';
import { apiErrorResponse } from '@/lib/api-error';

/** PUT /api/branches/{id} — update a branch's core fields + names. */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    const result = await saveBranch(session.accessToken, { ...body, id });
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error, 'saving branch');
  }
}

/** DELETE /api/branches/{id} — delete a branch (cascades to children). */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    await deleteBranch(session.accessToken, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiErrorResponse(error, 'deleting branch');
  }
}
