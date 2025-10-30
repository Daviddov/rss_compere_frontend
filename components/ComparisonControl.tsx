// components/ComparisonControl.tsx
'use client';

import React, { useState } from 'react';
import { Play, Calendar, Filter, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

interface ComparisonControlProps {
  sources: string[];
  onRunComparison: (options: ComparisonOptions) => Promise<void>;
  isLoading: boolean;
}

interface ComparisonOptions {
  mode: 'find-matches' | 'compare-quality';
  source?: string;
  fromDate?: string;
  toDate?: string;
  onlyNew?: boolean;
  onlyUnchecked?: boolean;
}

export default function ComparisonControl({ sources, onRunComparison, isLoading }: ComparisonControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'find-matches' | 'compare-quality'>('find-matches');
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [onlyNew, setOnlyNew] = useState(false);
  const [onlyUnchecked, setOnlyUnchecked] = useState(true);

  const handleRunComparison = async () => {
    const options: ComparisonOptions = {
      mode,
      source: selectedSource || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      onlyNew: mode === 'find-matches' ? onlyNew : undefined,
      onlyUnchecked: mode === 'compare-quality' ? onlyUnchecked : undefined,
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
        <h3 className="text-lg font-semibold text-gray-900">השוואות</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {isOpen ? 'הסתר' : 'הצג אפשרויות'}
        </button>
      </div>

      {/* Mode Selection */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('find-matches')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'find-matches'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🔍 מציאת התאמות
          </button>
          <button
            onClick={() => setMode('compare-quality')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'compare-quality'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ⭐ השוואת איכות
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-4 mt-4 pt-4 border-t border-gray-200">
          {/* Source Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">מקור (אופציונלי)</label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">כל המקורות</option>
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">טווח תאריכים</label>
            </div>
            
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setQuickDateRange(1)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                יום אחרון
              </button>
              <button
                onClick={() => setQuickDateRange(7)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                שבוע
              </button>
              <button
                onClick={() => setQuickDateRange(30)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                חודש
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">מתאריך</label>
                <input
                  type="datetime-local"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">עד תאריך</label>
                <input
                  type="datetime-local"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Mode-specific Options */}
          {mode === 'find-matches' && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyNew}
                onChange={(e) => setOnlyNew(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">רק כתבות חדשות</span>
            </label>
          )}

          {mode === 'compare-quality' && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyUnchecked}
                onChange={(e) => setOnlyUnchecked(e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">רק התאמות שלא נבדקו</span>
            </label>
          )}
        </div>
      )}

      {/* Run Button */}
      <button
        onClick={handleRunComparison}
        disabled={isLoading}
        className={`w-full mt-4 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
          mode === 'find-matches'
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {mode === 'find-matches' ? (
          <>
            <Sparkles className="w-5 h-5" />
            הרץ מציאת התאמות
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            הרץ השוואת איכות
          </>
        )}
      </button>
    </div>
  );
}