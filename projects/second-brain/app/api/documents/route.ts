import { getDocuments } from '@/lib/documents';

export async function GET() {
  try {
    const documents = await getDocuments();
    return Response.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return Response.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}
