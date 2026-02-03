'use client';

export interface Document {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'journal' | 'concept' | 'system' | 'profile' | 'other';
  path: string;
}
