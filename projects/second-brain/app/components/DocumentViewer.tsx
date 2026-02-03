'use client';

import { Document } from '@/lib/types';
import { getTypeColor } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface DocumentViewerProps {
  document: Document;
}

export default function DocumentViewer({ document }: DocumentViewerProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-700 pb-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{document.title}</h1>
            <p className="text-sm text-gray-400">{document.date}</p>
          </div>
          <span className={`text-sm px-3 py-1 rounded ${getTypeColor(document.type)}`}>
            {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto prose prose-invert max-w-none">
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className="text-2xl font-bold text-white mt-6 mb-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-bold text-gray-100 mt-5 mb-3">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-semibold text-gray-200 mt-4 mb-2">{children}</h3>,
            p: ({ children }) => <p className="text-gray-300 leading-relaxed mb-4">{children}</p>,
            li: ({ children }) => <li className="text-gray-300 ml-4 mb-1">{children}</li>,
            ul: ({ children }) => <ul className="list-disc my-4">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal my-4">{children}</ol>,
            code: ({ children }) => (
              <code className="bg-gray-800 text-gray-200 px-2 py-1 rounded text-sm">{children}</code>
            ),
            pre: ({ children }) => (
              <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 my-4">
                {children}
              </blockquote>
            ),
            a: ({ href, children }) => (
              <a href={href} className="text-blue-400 hover:text-blue-300 underline">
                {children}
              </a>
            ),
          }}
        >
          {document.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
