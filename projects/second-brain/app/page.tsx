'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DocumentList from './components/DocumentList';
import DocumentViewer from './components/DocumentViewer';
import { Document } from '@/lib/documents';

function BrainContent() {
  const searchParams = useSearchParams();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const docId = searchParams.get('doc');

  useEffect(() => {
    async function loadDocuments() {
      try {
        const res = await fetch('/api/documents');
        const data = await res.json();
        setDocuments(data);

        if (docId) {
          const doc = data.find((d: Document) => d.id === docId);
          setSelectedDoc(doc);
        } else if (data.length > 0) {
          setSelectedDoc(data[0]);
        }
      } catch (error) {
        console.error('Failed to load documents:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, [docId]);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-700 bg-gray-800 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white mb-4">🧠 2nd Brain</h1>
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Document List */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">Loading documents...</p>
              </div>
            ) : (
              <DocumentList
                documents={documents}
                selectedId={selectedDoc?.id}
                searchQuery={searchQuery}
              />
            )}
          </div>

          {/* Stats */}
          <div className="border-t border-gray-700 p-4 text-xs text-gray-400">
            <p>{documents.length} document{documents.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-950 flex flex-col">
          {selectedDoc ? (
            <div className="p-8 h-full overflow-y-auto">
              <DocumentViewer document={selectedDoc} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <p className="text-lg">Welcome to your 2nd Brain</p>
                <p className="text-sm mt-2">Select a document to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="bg-gray-900 min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <BrainContent />
    </Suspense>
  );
}
