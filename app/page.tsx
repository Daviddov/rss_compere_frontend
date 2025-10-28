// app/page.tsx
'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { 
  FileText, 
  Link2, 
  RefreshCw, 
  Download, 
  Play, 
  Sparkles,
  CheckCircle,
  XCircle,
  TrendingUp,
  Database,
  Activity
} from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import ArticlesTable from '@/components/ArticlesTable';
import MatchesTable from '@/components/MatchesTable';
import Charts from '@/components/Charts';
import FilterPanel from '@/components/FilterPanel';
import * as api from '@/lib/api';
import type { FilterOptions, SourceComparison } from '@/types';

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'articles' | 'matches' | 'analytics'>('overview');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // טעינת נתונים
  const { data: stats, mutate: mutateStats } = useSWR('stats', api.getStats, { 
    refreshInterval: 10000 // רענון כל 10 שניות
  });
  
  const { data: articles, mutate: mutateArticles } = useSWR(
    ['articles', filters], 
    () => api.getArticles(filters),
    { refreshInterval: 10000 }
  );
  
  const { data: matches, mutate: mutateMatches } = useSWR('matches', api.getMatches, {
    refreshInterval: 10000
  });
  
  const { data: sources } = useSWR('sources', api.getSources);

  // חישוב נתוני גרפים
  const sourceComparison: SourceComparison[] = React.useMemo(() => {
    if (!articles || !sources) return [];
    
    return sources.map(source => {
      const sourceArticles = articles.filter(a => a.source === source);
      const checked = sourceArticles.filter(a => a.checked === 1).length;
      const newCount = sourceArticles.filter(a => a.is_new === 1).length;
      
      // חישוב התאמות למקור זה
      const sourceMatches = matches?.filter(m => 
        articles.find(a => a.id === m.article1Id && a.source === source) ||
        articles.find(a => a.id === m.article2Id && a.source === source)
      ).length || 0;

      return {
        source,
        total: sourceArticles.length,
        checked,
        matches: sourceMatches,
        new: newCount,
      };
    });
  }, [articles, sources, matches]);

  // פעולות
  const handleFetchArticles = async () => {
    setIsLoading(true);
    try {
      await api.fetchArticles();
      await mutateArticles();
      await mutateStats();
      alert('✅ כתבות נשלפו בהצלחה!');
    } catch (error) {
      alert('❌ שגיאה בשליפת כתבות');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunComparison = async () => {
    setIsLoading(true);
    try {
      const result = await api.runNewComparison();
      await mutateArticles();
      await mutateMatches();
      await mutateStats();
      alert(`✅ השוואה הושלמה!\nנבדקו: ${result.totalComparisons}\nהתאמות: ${result.totalMatches}`);
    } catch (error) {
      alert('❌ שגיאה בהרצת השוואה');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsChecked = async () => {
    if (selectedArticles.length === 0) return;
    setIsLoading(true);
    try {
      await api.markArticlesAsChecked(selectedArticles);
      await mutateArticles();
      await mutateStats();
      setSelectedArticles([]);
      alert(`✅ ${selectedArticles.length} כתבות סומנו כנבדקו`);
    } catch (error) {
      alert('❌ שגיאה בסימון כתבות');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAllAsNew = async () => {
    if (!confirm('האם לסמן את כל הכתבות כחדשות?')) return;
    setIsLoading(true);
    try {
      await api.markAllAsNew();
      await mutateArticles();
      await mutateStats();
      alert('✅ כל הכתבות סומנו כחדשות');
    } catch (error) {
      alert('❌ שגיאה בסימון כתבות');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArticles = async () => {
    if (selectedArticles.length === 0) return;
    if (!confirm(`האם למחוק ${selectedArticles.length} כתבות?`)) return;
    setIsLoading(true);
    try {
      await api.deleteArticles(selectedArticles);
      await mutateArticles();
      await mutateStats();
      setSelectedArticles([]);
      alert(`✅ ${selectedArticles.length} כתבות נמחקו`);
    } catch (error) {
      alert('❌ שגיאה במחיקת כתבות');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">מערכת ניתוח כתבות RSS</h1>
              <p className="text-sm text-gray-600 mt-1">ניהול ומעקב אחר כתבות מרובות מקורות</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleFetchArticles}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                שלוף כתבות
              </button>
              <button
                onClick={handleRunComparison}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                <Play className="w-4 h-4" />
                הרץ השוואה
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'סקירה כללית', icon: Activity },
            { id: 'articles', label: 'כתבות', icon: FileText },
            { id: 'matches', label: 'התאמות', icon: Link2 },
            { id: 'analytics', label: 'ניתוח נתונים', icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatsCard
                title="סה״כ כתבות"
                value={stats.totalArticles}
                icon={FileText}
                color="blue"
                subtitle={`${stats.newArticles} חדשות`}
              />
              <StatsCard
                title="כתבות נבדקו"
                value={stats.checkedArticles}
                icon={CheckCircle}
                color="green"
                subtitle={`${Math.round((stats.checkedArticles / stats.totalArticles) * 100)}% מהכולל`}
              />
              <StatsCard
                title="כתבות חדשות"
                value={stats.newArticles}
                icon={Sparkles}
                color="yellow"
                subtitle="ממתינות לבדיקה"
              />
              <StatsCard
                title="התאמות"
                value={stats.totalMatches}
                icon={Link2}
                color="purple"
              />
              <StatsCard
                title="ממתינות לבדיקה"
                value={stats.uncheckedArticles}
                icon={XCircle}
                color="orange"
              />
              <StatsCard
                title="כתבות עם התאמות"
                value={stats.matchedArticlesCount}
                icon={Database}
                color="blue"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">פעולות מהירות</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={handleMarkAllAsNew}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg transition-colors border border-yellow-200"
                >
                  <Sparkles className="w-5 h-5" />
                  סמן הכל כחדש
                </button>
                <button
                  onClick={() => mutateArticles()}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors border border-blue-200"
                >
                  <RefreshCw className="w-5 h-5" />
                  רענן נתונים
                </button>
                <button
                  onClick={handleDeleteArticles}
                  disabled={isLoading || selectedArticles.length === 0}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors border border-red-200 disabled:opacity-50"
                >
                  <XCircle className="w-5 h-5" />
                  מחק נבחרות ({selectedArticles.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Articles Tab */}
        {selectedTab === 'articles' && (
          <div className="space-y-6">
            <FilterPanel
              sources={sources || []}
              currentFilters={filters}
              onFilterChange={setFilters}
            />
            
            {selectedArticles.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                <p className="text-blue-700 font-medium">
                  נבחרו {selectedArticles.length} כתבות
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleMarkAsChecked}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                  >
                    סמן כנבדקו
                  </button>
                  <button
                    onClick={handleDeleteArticles}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                  >
                    מחק
                  </button>
                </div>
              </div>
            )}

            <ArticlesTable 
              articles={articles || []} 
              selectable
              onSelect={setSelectedArticles}
            />
          </div>
        )}

        {/* Matches Tab */}
        {selectedTab === 'matches' && (
          <div className="space-y-6">
            <MatchesTable matches={matches || []} />
          </div>
        )}

        {/* Analytics Tab */}
        {selectedTab === 'analytics' && (
          <div className="space-y-6">
            <Charts sourceData={sourceComparison} />
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-gray-900 font-medium">טוען...</span>
          </div>
        </div>
      )}
    </div>
  );
}
