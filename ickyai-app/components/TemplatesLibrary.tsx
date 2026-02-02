'use client';

import { useState, useEffect } from 'react';

interface Template {
  id: number;
  name: string;
  subject: string;
  body: string;
}

interface TemplatesLibraryProps {
  userId?: number;
}

export default function TemplatesLibrary({ userId }: TemplatesLibraryProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/templates', {
          headers: { 'x-user-id': userId.toString() }
        });
        if (response.ok) {
          const data = await response.json();
          setTemplates(data.templates || []);
          if (data.templates && data.templates.length > 0) {
            setSelectedTemplate(data.templates[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplates();
  }, [userId]);

  const copyToClipboard = (text: string, templateId: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(templateId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-3xl font-bold text-white mb-6">📧 Email Templates Library</h2>

      {templates.length === 0 ? (
        <div className="bg-gray-800 p-12 rounded-xl shadow-lg text-center border border-gray-700">
          <p className="text-gray-400 text-lg">No templates available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl shadow-lg p-4 space-y-2 h-fit sticky top-24 border border-gray-700">
              <h3 className="font-bold text-lg mb-4 text-white">Templates</h3>
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={selectedTemplate?.id === template.id
                    ? 'w-full text-left p-3 rounded-lg bg-blue-900 border-l-4 border-blue-500 transition'
                    : 'w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-gray-300'
                  }
                >
                  <p className="font-medium text-white text-sm truncate">
                    {template.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {template.subject}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Template Preview */}
          <div className="lg:col-span-2">
            {selectedTemplate ? (
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-white">{selectedTemplate.name}</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 block mb-2">
                      Subject
                    </label>
                    <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
                      <p className="text-gray-200 break-words">{selectedTemplate.subject}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedTemplate.subject, selectedTemplate.id)}
                      className="mt-2 text-xs bg-blue-900 hover:bg-blue-800 text-blue-300 px-3 py-1 rounded transition"
                    >
                      {copiedId === selectedTemplate.id ? '✅ Copied!' : '📋 Copy'}
                    </button>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 block mb-2">
                      Email Body
                    </label>
                    <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 max-h-96 overflow-y-auto">
                      <p className="text-gray-200 whitespace-pre-wrap text-sm leading-relaxed">
                        {selectedTemplate.body}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedTemplate.body, selectedTemplate.id + 1000)}
                      className="mt-2 text-xs bg-green-900 hover:bg-green-800 text-green-300 px-3 py-1 rounded transition"
                    >
                      {copiedId === selectedTemplate.id + 1000 ? '✅ Copied!' : '📋 Copy'}
                    </button>
                  </div>

                  <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
                    <h4 className="font-semibold text-blue-300 mb-2">Variables you can use:</h4>
                    <ul className="text-sm text-blue-200 space-y-1">
                      <li>• <code className="bg-blue-800 px-2 py-1 rounded">{'{{contact_name}}'}</code> - Recipient name</li>
                      <li>• <code className="bg-blue-800 px-2 py-1 rounded">{'{{company_name}}'}</code> - Company name</li>
                      <li>• <code className="bg-blue-800 px-2 py-1 rounded">{'{{date}}'}</code> - Today's date</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-700">
                <p className="text-gray-400">Select a template to preview</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
