import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import {
  getBranchContacts,
  addBranchAddress,
  updateBranchAddress,
  deleteBranchAddress,
  addBranchPhone,
  updateBranchPhone,
  deleteBranchPhone,
} from '@/services/branch-api';
import { apiErrorResponse } from '@/lib/api-error';

/** GET /api/branches/{branchId}/contacts — addresses + phones for a branch. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const languageId = parseInt(searchParams.get('languageId') || '12');
    return NextResponse.json(await getBranchContacts(session.accessToken, id, languageId));
  } catch (error) {
    return apiErrorResponse(error, 'fetching branch contacts');
  }
}

/** POST — add one address or phone. Body: { type: 'address'|'phone', languageId?, ...fields }. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    const { type, languageId = 12, ...data } = body;
    let result;
    if (type === 'address') result = await addBranchAddress(session.accessToken, id, data, languageId);
    else if (type === 'phone') result = await addBranchPhone(session.accessToken, id, data);
    else return NextResponse.json({ message: 'Invalid type' }, { status: 400 });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error, 'adding branch contact');
  }
}

/** PUT — update one address or phone. Body: { type, itemId, languageId?, ...fields }. */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    await params;
    const body = await req.json();
    const { type, itemId, languageId = 12, ...data } = body;
    if (!type || !itemId) {
      return NextResponse.json({ message: 'type and itemId required' }, { status: 400 });
    }
    let result;
    if (type === 'address') result = await updateBranchAddress(session.accessToken, itemId, data, languageId);
    else if (type === 'phone') result = await updateBranchPhone(session.accessToken, itemId, data);
    else return NextResponse.json({ message: 'Invalid type' }, { status: 400 });
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error, 'updating branch contact');
  }
}

/** DELETE /api/branches/{branchId}/contacts?type=address|phone&itemId=... */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    await params;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const itemId = searchParams.get('itemId');
    if (!type || !itemId) {
      return NextResponse.json({ message: 'type and itemId required' }, { status: 400 });
    }
    if (type === 'address') await deleteBranchAddress(session.accessToken, itemId);
    else if (type === 'phone') await deleteBranchPhone(session.accessToken, itemId);
    else return NextResponse.json({ message: 'Invalid type' }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiErrorResponse(error, 'deleting branch contact');
  }
}
