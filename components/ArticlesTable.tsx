// components/ArticlesTable.tsx
'use client';

import React, { useState } from 'react';
import { ExternalLink, Check, X, Calendar, Sparkles, CheckCircle } from 'lucide-react';
import type { Article } from '@/types';
import { format } from 'date-fns';

interface ArticlesTableProps {
  articles: Article[];
  onSelect?: (articleIds: number[]) => void;
  selectable?: boolean;
}

export default function ArticlesTable({ articles, onSelect, selectable = false }: ArticlesTableProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = articles.map(a => a.id);
      setSelectedIds(allIds);
      onSelect?.(allIds);
    } else {
      setSelectedIds([]);
      onSelect?.([]);
    }
  };

  const handleSelectOne = (id: number) => {
    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter(sid => sid !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelected);
    onSelect?.(newSelected);
  };

  const getSourceBadgeColor = (source: string) => {
    const colors: Record<string, string> = {
      kikar: 'bg-blue-100 text-blue-700',
      bhol: 'bg-purple-100 text-purple-700',
      jdn: 'bg-green-100 text-green-700',
    };
    return colors[source.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  if (articles.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-gray-400 text-6xl mb-4">📰</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">אין כתבות</h3>
        <p className="text-gray-600">לא נמצאו כתבות בהתאם לסינון שנבחר</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {selectable && (
                <th className="px-4 py-3 text-right">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === articles.length && articles.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">מקור</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">כותרת</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">סטטוס</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">תאריך</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                {selectable && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(article.id)}
                      onChange={() => handleSelectOne(article.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSourceBadgeColor(article.source)}`}>
                    {article.source}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="max-w-md">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{article.title}</p>
                    {article.summary && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{article.summary}</p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {article.is_new === 1 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        <Sparkles className="w-3 h-3" />
                        חדש
                      </span>
                    )}
                    {article.checked === 1 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3" />
                        נבדק
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        <X className="w-3 h-3" />
                        לא נבדק
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {article.published ? (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(article.published), 'dd/MM/yyyy HH:mm')}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}