import { getDocuments } from '@/lib/documents';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const documents = await getDocuments();
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json([], { status: 200 });
  }
}
