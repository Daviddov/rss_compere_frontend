// components/ComparisonControl.tsx
'use client';

import React, { useState } from 'react';
import { Play, Calendar, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface ComparisonControlProps {
  sources: string[];
  onRunComparison: (options: ComparisonOptions) => Promise<void>;
  isLoading: boolean;
}

interface ComparisonOptions {
  sources?: string[];
  competitorSources?: string[];
  fromDate?: string;
  toDate?: string;
  onlyUnmatched?: boolean;
  onlyUnchecked?: boolean;
  maxArticlesPerSource?: number;
}

export default function ComparisonControl({ sources, onRunComparison, isLoading }: ComparisonControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [competitorSources, setCompetitorSources] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [onlyUnmatched, setOnlyUnmatched] = useState(true);
  const [onlyUnchecked, setOnlyUnchecked] = useState(true);
  const [maxArticles, setMaxArticles] = useState<number>(100);

  const handleToggleSource = (source: string, isCompetitor: boolean = false) => {
    if (isCompetitor) {
      if (competitorSources.includes(source)) {
        setCompetitorSources(competitorSources.filter(s => s !== source));
      } else {
        setCompetitorSources([...competitorSources, source]);
      }
    } else {
      if (selectedSources.includes(source)) {
        setSelectedSources(selectedSources.filter(s => s !== source));
      } else {
        setSelectedSources([...selectedSources, source]);
      }
    }
  };

  const handleRunComparison = async () => {
    const options: ComparisonOptions = {
      sources: selectedSources.length > 0 ? selectedSources : undefined,
      competitorSources: competitorSources.length > 0 ? competitorSources : undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      onlyUnmatched,
      onlyUnchecked,
      maxArticlesPerSource: maxArticles,
    };

    await onRunComparison(options);
  };

  const setQuickDateRange = (days: number) => {
    const now = new Date();
    const past = new Date(now);
    past.setDate(past.getDate() - days);
    
    setFromDate(format(past, "yyyy-MM-dd'T'HH:mm"));
    setToDate(format(now, "yyyy-MM-dd'T'HH:mm"));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">הגדרות השוואה מתקדמות</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {isOpen ? 'סגור' : 'פתח'}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-6">
          {/* טווח תאריכים */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">טווח תאריכים</label>
            </div>
            
            {/* כפתורים מהירים */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setQuickDateRange(1)}
                className="px-3 py-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
              >
                24 שעות אחרונות
              </button>
              <button
                onClick={() => setQuickDateRange(7)}
                className="px-3 py-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
              >
                שבוע אחרון
              </button>
              <button
                onClick={() => setQuickDateRange(30)}
                className="px-3 py-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
              >
                חודש אחרון
              </button>
              <button
                onClick={() => { setFromDate(''); setToDate(''); }}
                className="px-3 py-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
              >
                נקה
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">מתאריך</label>
                <input
                  type="datetime-local"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">עד תאריך</label>
                <input
                  type="datetime-local"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* בחירת מקורות להשוואה */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">מקורות להשוואה (אופציונלי)</label>
            </div>
            <div className="text-xs text-gray-500 mb-2">
              השאר ריק כדי לבדוק את כל המקורות
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-lg">
              {sources.map((source) => (
                <label
                  key={source}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:bg-white p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedSources.includes(source)}
                    onChange={() => handleToggleSource(source, false)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{source}</span>
                </label>
              ))}
            </div>
          </div>

          {/* מקורות מתחרים */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">מקורות מתחרים (אופציונלי)</label>
            </div>
            <div className="text-xs text-gray-500 mb-2">
              בחר מקורות ספציפיים להשוואה מולם
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-lg">
              {sources.map((source) => (
                <label
                  key={source}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:bg-white p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={competitorSources.includes(source)}
                    onChange={() => handleToggleSource(source, true)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700">{source}</span>
                </label>
              ))}
            </div>
          </div>

          {/* אפשרויות נוספות */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">אפשרויות נוספות</label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyUnmatched}
                onChange={(e) => setOnlyUnmatched(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">רק כתבות ללא התאמה קודמת</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyUnchecked}
                onChange={(e) => setOnlyUnchecked(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">רק כתבות שלא נבדקו</span>
            </label>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                מקסימום כתבות למקור (0 = ללא הגבלה)
              </label>
              <input
                type="number"
                value={maxArticles}
                onChange={(e) => setMaxArticles(parseInt(e.target.value) || 0)}
                min="0"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* כפתור הרצה */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleRunComparison}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
            >
              <Play className="w-5 h-5" />
              {isLoading ? 'מריץ השוואה...' : 'הרץ השוואה מתקדמת'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
