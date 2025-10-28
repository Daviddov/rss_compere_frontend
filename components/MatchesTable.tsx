// components/MatchesTable.tsx
'use client';

import React from 'react';
import { ExternalLink, Clock, Trophy } from 'lucide-react';
import type { Match } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

interface MatchesTableProps {
  matches: Match[];
}

export default function MatchesTable({ matches }: MatchesTableProps) {
  const formatTimeDiff = (seconds: number | null) => {
    if (!seconds) return '-';
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} ימים`;
    if (hours > 0) return `${hours} שעות`;
    return `${minutes} דקות`;
  };

  if (matches.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-gray-400 text-6xl mb-4">🔗</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">אין התאמות</h3>
        <p className="text-gray-600">לא נמצאו התאמות בין כתבות</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                כתבה 1
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                ←→
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                כתבה 2
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                טובה יותר
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                הפרש זמן
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                תאריך התאמה
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {matches.map((match) => {
              const isBetter1 = match.betterArticleId === match.article1Id;
              const isBetter2 = match.betterArticleId === match.article2Id;

              return (
                <tr key={match.matchId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      {isBetter1 && <Trophy className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />}
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                          {match.article1Title}
                        </div>
                        <a
                          href={match.article1Link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          קישור
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                      <span className="text-blue-600 font-bold">⟷</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      {isBetter2 && <Trophy className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />}
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                          {match.article2Title}
                        </div>
                        <a
                          href={match.article2Link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          קישור
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      isBetter1 ? 'bg-yellow-100 text-yellow-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      <Trophy className="w-3 h-3" />
                      כתבה {isBetter1 ? '1' : '2'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-3 h-3" />
                      {formatTimeDiff(match.publishedDiffSeconds)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {match.createdAt ? formatDistanceToNow(new Date(match.createdAt), { 
                      addSuffix: true, 
                      locale: he 
                    }) : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
