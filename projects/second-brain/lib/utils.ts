'use client';

import { Document } from './documents';

export function getTypeColor(type: Document['type']): string {
  switch (type) {
    case 'journal': return 'bg-blue-100 text-blue-800';
    case 'concept': return 'bg-purple-100 text-purple-800';
    case 'system': return 'bg-green-100 text-green-800';
    case 'profile': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
