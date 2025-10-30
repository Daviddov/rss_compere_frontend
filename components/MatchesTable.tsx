// components/MatchesTable.tsx
"use client";

import React from "react";
import { ExternalLink, Clock, Trophy } from "lucide-react";
import type { Match } from "@/types";
import { format, formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";

interface MatchesTableProps {
  matches: Match[];
}

export default function MatchesTable({ matches }: MatchesTableProps) {
  const formatTimeDiff = (seconds: number | null) => {
    if (!seconds) return "-";
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} ימים`;
    if (hours > 0) return `${hours} שעות`;
    return `${minutes} דקות`;
  };

  const getSourceBadgeColor = (source: string) => {
    const colors: Record<string, string> = {
      kikar: "bg-blue-100 text-blue-700",
      bhol: "bg-purple-100 text-purple-700",
      jdn: "bg-green-100 text-green-700",
    };
    return colors[source.toLowerCase()] || "bg-gray-100 text-gray-700";
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
    <div className="space-y-4">
      {matches.map((match) => {
        const isBetter1 = match.betterArticleId === match.article1Id;
        const hasQualityCheck = match.betterArticleId !== null;

        return (
          <div
            key={match.matchId}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* כתבה 1 */}
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  {hasQualityCheck && isBetter1 && (
                    <Trophy className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${getSourceBadgeColor(
                        match.article1Source
                      )}`}
                    >
                      {match.article1Source}
                    </span>

                    <h4 className="text-sm font-medium mb-2">
                      {match.article1Title}
                    </h4>

                    <a
                      href={match.article1Link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-3 h-3" />
                      קישור לכתבה
                    </a>
                  </div>
                </div>

                <div className="text-center text-gray-400 font-bold">⟷</div>
              </div>

              {/* כתבה 2 */}
              <div className="space-y-3 lg:col-start-2">
                <div className="flex items-start gap-2">
                  {hasQualityCheck && !isBetter1 && (
                    <Trophy className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${getSourceBadgeColor(
                        match.article2Source
                      )}`}
                    >
                      {match.article2Source}
                    </span>

                    <h4 className="text-sm font-medium mb-2">
                      {match.article2Title}
                    </h4>

                    <a
                      href={match.article2Link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-3 h-3" />
                      קישור לכתבה
                    </a>
                  </div>
                </div>
              </div>

              {/* מטא-נתונים */}
              <div className="lg:col-span-2 space-y-2 pt-3 border-t border-gray-100">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">הפרש זמן:</span>
                    <span className="font-medium text-gray-900">
                      {formatTimeDiff(match.publishedDiffSeconds)}
                    </span>
                  </div>

                  {!hasQualityCheck && (
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                        ממתין לבדיקת איכות
                      </span>
                    </div>
                  )}

                  {hasQualityCheck && match.reason && (
                    <div className="flex-1">
                      <span className="text-gray-600 text-xs">סיבה:</span>
                      <span className="text-gray-900 text-xs mr-1">{match.reason}</span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  נוצרה: {format(new Date(match.createdAt), "dd/MM/yyyy HH:mm", { locale: he })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}