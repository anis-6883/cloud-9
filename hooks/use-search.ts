'use client';

import { useContext } from 'react';
import { SearchContext } from '@/lib/context/search-context';

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
