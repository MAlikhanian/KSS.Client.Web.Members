import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import {
  listPersonStatusErp,
  listPersonStatusTranslationsErp,
} from '@/services/erp-members-api';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const [statuses, translations] = await Promise.all([
      listPersonStatusErp(session.accessToken),
      listPersonStatusTranslationsErp(session.accessToken),
    ]);
    return NextResponse.json({ statuses, translations });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Something went wrong.' },
      { status: 500 },
    );
  }
}
