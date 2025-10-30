// components/FetchControl.tsx
'use client';

import React, { useState } from 'react';
import { Download, CheckSquare, Square } from 'lucide-react';

interface FetchControlProps {
  sources: string[];
  onFetch: (selectedSources: string[], withContent: boolean) => Promise<void>;
  isLoading: boolean;
}

export default function FetchControl({ sources, onFetch, isLoading }: FetchControlProps) {
  const [selectedSources, setSelectedSources] = useState<string[]>(sources);
  const [isOpen, setIsOpen] = useState(false);
  const [withContent, setWithContent] = useState(true);

  const handleToggleSource = (source: string) => {
    if (selectedSources.includes(source)) {
      setSelectedSources(selectedSources.filter(s => s !== source));
    } else {
      setSelectedSources([...selectedSources, source]);
    }
  };

  const handleSelectAll = () => {
    setSelectedSources(sources);
  };

  const handleSelectNone = () => {
    setSelectedSources([]);
  };

  const handleFetch = async () => {
    if (selectedSources.length === 0) {
      alert('❌ יש לבחור לפחות מקור אחד');
      return;
    }
    await onFetch(selectedSources, withContent);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">שליפת כתבות</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {isOpen ? 'סגור' : 'פתח'}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
            >
              בחר הכל
            </button>
            <button
              onClick={handleSelectNone}
              className="px-3 py-1 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
            >
              בטל בחירה
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {sources.map((source) => (
              <label
                key={source}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedSources.includes(source)}
                  onChange={() => handleToggleSource(source)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-gray-900">{source}</span>
                {selectedSources.includes(source) ? (
                  <CheckSquare className="w-4 h-4 text-blue-600 ml-auto" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400 ml-auto" />
                )}
              </label>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={withContent}
                onChange={(e) => setWithContent(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">שלוף גם תוכן מלא (לוקח יותר זמן)</span>
            </label>
            <p className="text-xs text-gray-500 mt-1 mr-6">
              {withContent ? 'יבצע scraping מלא של כל כתבה' : 'ישלוף רק כותרות וסיכומים'}
            </p>
          </div>

          <button
            onClick={handleFetch}
            disabled={isLoading || selectedSources.length === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
          >
            <Download className="w-5 h-5" />
            {isLoading ? 'שולף...' : `שלוף מ-${selectedSources.length} מקורות${withContent ? ' (עם תוכן)' : ''}`}
          </button>
        </div>
      )}
    </div>
  );
}