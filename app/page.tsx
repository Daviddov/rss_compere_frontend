'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { FileText, Link2, RefreshCw, Sparkles, CheckCircle, XCircle, TrendingUp, Database, Activity } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import ArticlesTable from '@/components/ArticlesTable';
import MatchesTable from '@/components/MatchesTable';
import Charts from '@/components/Charts';
import FilterPanel from '@/components/FilterPanel';
import FetchControl from '@/components/FetchControl';
import ComparisonControl from '@/components/ComparisonControl';
import ReportGenerator from '@/components/ReportGenerator';
import * as api from '@/lib/api';
import type { FilterOptions, SourceComparison } from '@/types';

const calculateMedianDelayMinutes = (delays: number[]): number => {
  if (delays.length === 0) return 0;
  delays.sort((a, b) => a - b);
  const mid = Math.floor(delays.length / 2);
  const medianSeconds = delays.length % 2 !== 0 ? delays[mid] : (delays[mid - 1] + delays[mid]) / 2;
  return Math.round(medianSeconds / 60);
};

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'articles' | 'matches' | 'analytics' | 'tools'>('overview');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data: stats, mutate: mutateStats } = useSWR('stats', api.getStats, { refreshInterval: 10000 });
  const { data: articles, mutate: mutateArticles } = useSWR(['articles', filters], () => api.getArticles(filters), { refreshInterval: 10000 });
  const { data: matches, mutate: mutateMatches } = useSWR('matches', api.getMatches, { refreshInterval: 10000 });
  const { data: sources } = useSWR('sources', api.getSources);

  const sourceComparison: SourceComparison[] = React.useMemo(() => {
    if (!articles || !sources || !matches) return [];
    
    return sources.map(source => {
      const sourceArticles = articles.filter(a => a.source === source);
      const checked = sourceArticles.filter(a => a.checked === 1).length;
      const newCount = sourceArticles.filter(a => a.is_new === 1).length;
      
      const sourceMatches = matches.filter(m => 
        (sourceArticles.find(a => a.id === m.article1Id) && m.article1Source === source) ||
        (sourceArticles.find(a => a.id === m.article2Id) && m.article2Source === source)
      ).length;

      const betterArticleCount = matches.filter(m => m.betterArticleSource === source).length;
      const firstPublishedCount = matches.filter(m => 
        (m.firstPublishedId === m.article1Id && m.article1Source === source) ||
        (m.firstPublishedId === m.article2Id && m.article2Source === source)
      ).length;
      
      const delays: number[] = [];
      matches.forEach(m => {
        const isCurrentSourceInvolved = m.article1Source === source || m.article2Source === source;
        const isCurrentSourceFirst = (m.firstPublishedId === m.article1Id && m.article1Source === source) || 
                                     (m.firstPublishedId === m.article2Id && m.article2Source === source);
        if (isCurrentSourceInvolved && !isCurrentSourceFirst && m.publishedDiffSeconds !== null) {
          delays.push(m.publishedDiffSeconds);
        }
      });
      
      const medianDelayMinutes = calculateMedianDelayMinutes(delays);
      
      const articlesWithContent = sourceArticles.filter(a => a.stats?.contentWords);
      const totalContentWords = articlesWithContent.reduce((sum, a) => sum + (a.stats?.contentWords || 0), 0);
      const averageContentWords = articlesWithContent.length > 0 ? Math.round(totalContentWords / articlesWithContent.length) : 0;
      
      return {
        source,
        total: sourceArticles.length,
        checked,
        matches: sourceMatches,
        new: newCount,
        betterArticleCount,
        firstPublishedCount,
        totalPublishedDelaySeconds: delays.reduce((a, b) => a + b, 0),
        medianDelayMinutes,
        averageContentWords,
      };
    });
  }, [articles, sources, matches]);

  const handleFetchArticles = async (selectedSources: string[]) => {
    setIsLoading(true);
    try {
      await api.fetchArticles(selectedSources);
      alert('✅ שליפה התחילה ברקע');
      setTimeout(() => { mutateArticles(); mutateStats(); }, 3000);
    } catch { alert('❌ שגיאה'); }
    finally { setIsLoading(false); }
  };

  const handleRunComparison = async (options: any) => {
    setIsLoading(true);
    try {
      await api.runAdvancedComparison(options);
      alert('✅ השוואה התחילה ברקע');
      setTimeout(() => { mutateArticles(); mutateMatches(); mutateStats(); }, 5000);
    } catch { alert('❌ שגיאה'); }
    finally { setIsLoading(false); }
  };

  const handleMarkAsChecked = async () => {
    if (!selectedArticles.length) return;
    setIsLoading(true);
    try {
      await api.markArticlesAsChecked(selectedArticles);
      await mutateArticles();
      await mutateStats();
      setSelectedArticles([]);
      alert(`✅ סומנו ${selectedArticles.length} כתבות`);
    } catch { alert('❌ שגיאה'); }
    finally { setIsLoading(false); }
  };

  const handleMarkAllAsNew = async () => {
    if (!confirm('לסמן הכל כחדש?')) return;
    setIsLoading(true);
    try {
      await api.markAllAsNew();
      await mutateArticles();
      await mutateStats();
      alert('✅ הכל סומן כחדש');
    } catch { alert('❌ שגיאה'); }
    finally { setIsLoading(false); }
  };

  const handleDeleteArticles = async () => {
    if (!selectedArticles.length || !confirm(`למחוק ${selectedArticles.length} כתבות?`)) return;
    setIsLoading(true);
    try {
      await api.deleteArticles(selectedArticles);
      await mutateArticles();
      await mutateStats();
      setSelectedArticles([]);
      alert(`✅ נמחקו ${selectedArticles.length}`);
    } catch { alert('❌ שגיאה'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">מערכת ניתוח כתבות RSS</h1>
              <p className="text-sm text-gray-600 mt-1">ניהול ומעקב אחר כתבות מרובות מקורות</p>
            </div>
            <button onClick={() => mutateArticles()} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg">
              <RefreshCw className="w-4 h-4" />
              רענן
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'סקירה', icon: Activity },
            { id: 'articles', label: 'כתבות', icon: FileText },
            { id: 'matches', label: 'התאמות', icon: Link2 },
            { id: 'analytics', label: 'ניתוח', icon: TrendingUp },
            { id: 'tools', label: 'כלים', icon: Database },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setSelectedTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap ${selectedTab === tab.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {selectedTab === 'overview' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatsCard title="סה״כ כתבות" value={stats.totalArticles} icon={FileText} color="blue" subtitle={`${stats.newArticles} חדשות`} />
              <StatsCard title="נבדקו" value={stats.checkedArticles} icon={CheckCircle} color="green" />
              <StatsCard title="חדשות" value={stats.newArticles} icon={Sparkles} color="yellow" />
              <StatsCard title="התאמות" value={stats.totalMatches} icon={Link2} color="purple" />
              <StatsCard title="לא נבדקו" value={stats.uncheckedArticles} icon={XCircle} color="orange" />
              <StatsCard title="עם התאמות" value={stats.matchedArticlesCount} icon={Database} color="blue" />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">פעולות מהירות</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button onClick={handleMarkAllAsNew} disabled={isLoading} className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg border border-yellow-200">
                  <Sparkles className="w-5 h-5" />
                  סמן הכל כחדש
                </button>
                <button onClick={() => mutateArticles()} disabled={isLoading} className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200">
                  <RefreshCw className="w-5 h-5" />
                  רענן נתונים
                </button>
                <button onClick={handleDeleteArticles} disabled={isLoading || !selectedArticles.length} className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-200 disabled:opacity-50">
                  <XCircle className="w-5 h-5" />
                  מחק ({selectedArticles.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'articles' && (
          <div className="space-y-6">
            <FilterPanel sources={sources || []} currentFilters={filters} onFilterChange={setFilters} />
            {selectedArticles.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between">
                <p className="text-blue-700 font-medium">נבחרו {selectedArticles.length}</p>
                <div className="flex gap-2">
                  <button onClick={handleMarkAsChecked} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded">סמן</button>
                  <button onClick={handleDeleteArticles} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded">מחק</button>
                </div>
              </div>
            )}
            <ArticlesTable articles={articles || []} selectable onSelect={setSelectedArticles} />
          </div>
        )}

        {selectedTab === 'matches' && (
          <div className="space-y-6">
            <FilterPanel sources={sources || []} currentFilters={filters} onFilterChange={setFilters} />
            <MatchesTable matches={matches || []} />
          </div>
        )}

        {selectedTab === 'analytics' && (
          <div className="space-y-6">
            <FilterPanel sources={sources || []} currentFilters={filters} onFilterChange={setFilters} />
            <Charts sourceData={sourceComparison} />
          </div>
        )}

        {selectedTab === 'tools' && (
          <div className="space-y-6">
            <FetchControl sources={sources || []} onFetch={handleFetchArticles} isLoading={isLoading} />
            <ComparisonControl sources={sources || []} onRunComparison={handleRunComparison} isLoading={isLoading} />
            {stats && <ReportGenerator stats={stats} sourceData={sourceComparison} matches={matches || []} articles={articles || []} />}
          </div>
        )}
      </div>

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