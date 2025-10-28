// components/FilterPanel.tsx
'use client';

import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import type { FilterOptions } from '@/types';

interface FilterPanelProps {
  sources: string[];
  onFilterChange: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export default function FilterPanel({ sources, onFilterChange, currentFilters }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFilterChange({ ...currentFilters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const activeFiltersCount = Object.keys(currentFilters).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* כותרת */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">סינונים</h3>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {isOpen ? 'סגור' : 'פתח'}
          </button>
        </div>
      </div>

      {/* תוכן הפילטרים */}
      {isOpen && (
        <div className="p-4 space-y-4">
          {/* מקור */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              מקור
            </label>
            <select
              value={currentFilters.source || ''}
              onChange={(e) => handleFilterChange('source', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">כל המקורות</option>
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>

          {/* סטטוס */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סטטוס
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentFilters.onlyNew === true}
                onChange={(e) => handleFilterChange('onlyNew', e.target.checked ? true : undefined)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">רק כתבות חדשות</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentFilters.onlyUnchecked === true}
                onChange={(e) => handleFilterChange('onlyUnchecked', e.target.checked ? true : undefined)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">רק כתבות שלא נבדקו</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentFilters.onlyUnmatched === true}
                onChange={(e) => handleFilterChange('onlyUnmatched', e.target.checked ? true : undefined)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">רק כתבות ללא התאמה</span>
            </label>
          </div>

          {/* תאריכים */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              מתאריך
            </label>
            <input
              type="datetime-local"
              value={currentFilters.publishedAfter || ''}
              onChange={(e) => handleFilterChange('publishedAfter', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              עד תאריך
            </label>
            <input
              type="datetime-local"
              value={currentFilters.publishedBefore || ''}
              onChange={(e) => handleFilterChange('publishedBefore', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* מגבלת תוצאות */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              מגבלת תוצאות
            </label>
            <input
              type="number"
              value={currentFilters.limit || ''}
              onChange={(e) => handleFilterChange('limit', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="ללא הגבלה"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* כפתור ניקוי */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              נקה סינונים
            </button>
          )}
        </div>
      )}
    </div>
  );
}
