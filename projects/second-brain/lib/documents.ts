import fs from 'fs';
import path from 'path';

export interface Document {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'journal' | 'concept' | 'system' | 'profile' | 'other';
  path: string;
}

const BRAIN_PATH = path.join(process.cwd(), '..', 'brain');

function getDocumentType(filename: string): Document['type'] {
  if (filename.includes('journal')) return 'journal';
  if (filename.includes('concept') || filename.includes('system')) return 'system';
  if (filename.includes('profile')) return 'profile';
  return 'other';
}

export async function getDocuments(): Promise<Document[]> {
  try {
    if (!fs.existsSync(BRAIN_PATH)) {
      return [];
    }

    const files = fs.readdirSync(BRAIN_PATH).filter(f => f.endsWith('.md'));
    
    const documents: Document[] = files.map(file => {
      const filePath = path.join(BRAIN_PATH, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const title = file.replace('.md', '').replace(/-/g, ' ');
      
      // Extract date from filename (YYYY-MM-DD format)
      const dateMatch = file.match(/\d{4}-\d{2}-\d{2}/);
      const date = dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0];
      
      return {
        id: file.replace('.md', ''),
        title,
        content,
        date,
        type: getDocumentType(file),
        path: filePath,
      };
    });

    return documents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error reading documents:', error);
    return [];
  }
}

export async function getDocument(id: string): Promise<Document | null> {
  const documents = await getDocuments();
  return documents.find(d => d.id === id) || null;
}

export function getTypeColor(type: Document['type']): string {
  switch (type) {
    case 'journal': return 'bg-blue-100 text-blue-800';
    case 'concept': return 'bg-purple-100 text-purple-800';
    case 'system': return 'bg-green-100 text-green-800';
    case 'profile': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
