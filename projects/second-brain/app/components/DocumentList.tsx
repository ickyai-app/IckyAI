'use client';

import { Document, getTypeColor } from '@/lib/documents';
import Link from 'next/link';

interface DocumentListProps {
  documents: Document[];
  selectedId?: string;
  searchQuery?: string;
}

export default function DocumentList({ documents, selectedId, searchQuery }: DocumentListProps) {
  const filtered = searchQuery
    ? documents.filter(
        doc =>
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : documents;

  return (
    <div className="space-y-2">
      {filtered.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">No documents found</p>
        </div>
      ) : (
        filtered.map(doc => (
          <Link
            key={doc.id}
            href={`/?doc=${doc.id}`}
            className={`block p-3 rounded-lg transition-all ${
              selectedId === doc.id
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-800 hover:bg-gray-700 text-gray-100'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate text-sm">{doc.title}</h3>
                <p className="text-xs opacity-70 mt-1">{doc.date}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${getTypeColor(doc.type)}`}>
                {doc.type}
              </span>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
