// app/page.tsx
'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { 
  FileText, 
  Link2, 
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
import FetchControl from '@/components/FetchControl';
import ComparisonControl from '@/components/ComparisonControl';
import ReportGenerator from '@/components/ReportGenerator';
import JobProgress from '@/components/JobProgress';
import { useJobProgress } from '@/hooks/useJobProgress';
import * as api from '@/lib/api';
import type { FilterOptions, SourceComparison, MatchFilterOptions } from '@/types';

const calculateMedianDelayMinutes = (delays: number[]): number => {
  if (delays.length === 0) return 0;
  delays.sort((a, b) => a - b);
  const mid = Math.floor(delays.length / 2);
  const medianSeconds = delays.length % 2 !== 0 
    ? delays[mid]
    : (delays[mid - 1] + delays[mid]) / 2;
  return Math.round(medianSeconds / 60);
};

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'articles' | 'matches' | 'analytics' | 'tools'>('overview');
  const [filters, setFilters] = useState<FilterOptions | MatchFilterOptions>({}); 
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);

  // Job Progress Hook
  const { activeJobs, startJob } = useJobProgress((job) => {
    // Refresh data when job completes
    mutateArticles();
    mutateMatches();
    mutateStats();
  });

  const { data: stats, mutate: mutateStats } = useSWR('stats', api.getStats, { 
    refreshInterval: 10000 
  });
  
  const { data: articles, mutate: mutateArticles } = useSWR(
    ['articles', filters], 
    () => api.getArticles(filters as FilterOptions),
    { refreshInterval: 10000 }
  );
  
  const { data: matches, mutate: mutateMatches } = useSWR('matches', api.getMatches, {
    refreshInterval: 10000
  });
  
  const { data: sources } = useSWR('sources', api.getSources);

  const sourceComparison: SourceComparison[] = React.useMemo(() => {
    if (!articles || !sources || !matches) return [];
    
    return sources.map(source => {
      const sourceArticles = articles.filter(a => a.source === source);
      const sourceMatches = matches.filter(m => m.source1 === source || m.source2 === source);
      
      const delays = sourceMatches
        .filter(m => m.publishedDiffSeconds !== undefined)
        .map(m => m.publishedDiffSeconds!);
      
      const firstPublished = sourceMatches.filter(m => 
        (m.source1 === source && m.betterArticle === m.article1Id) ||
        (m.source2 === source && m.betterArticle === m.article2Id)
      ).length;
      
      const betterArticles = sourceMatches.filter(m => 
        (m.source1 === source && m.betterArticle === m.article1Id) ||
        (m.source2 === source && m.betterArticle === m.article2Id)
      ).length;
      
      const avgWords = sourceArticles.length > 0
        ? Math.round(sourceArticles.reduce((sum, a) => sum + (a.stats?.contentWords || 0), 0) / sourceArticles.length)
        : 0;
      
      return {
        source,
        total: sourceArticles.length,
        checked: sourceArticles.filter(a => a.checked === 1).length,
        matches: sourceMatches.length,
        firstPublishedCount: firstPublished,
        betterArticleCount: betterArticles,
        medianDelayMinutes: calculateMedianDelayMinutes(delays),
        averageContentWords: avgWords
      };
    });
  }, [articles, sources, matches]);

  const handleFetchArticles = async (selectedSources?: string[]) => {
    try {
      await api.fetchArticles(selectedSources);
      // Refresh after some delay
      setTimeout(() => {
        mutateArticles();
        mutateStats();
      }, 3000);
    } catch (err) {
      alert('❌ שגיאה בשליפת כתבות');
    }
  };

  const handleRunComparison = async (options: any) => {
    try {
      let jobId: string;
      
      if (options.mode === 'find-matches') {
        const result = await api.findMatches({
          source: options.source,
          fromDate: options.fromDate,
          toDate: options.toDate,
          onlyNew: options.onlyNew
        });
        jobId = result.jobId;
      } else {
        const result = await api.compareQuality({
          source: options.source,
          fromDate: options.fromDate,
          toDate: options.toDate,
          onlyUnchecked: options.onlyUnchecked
        });
        jobId = result.jobId;
      }
      
      // Start tracking job
      startJob(jobId);
      
    } catch (err) {
      alert('❌ שגיאה בהשוואה');
    }
  };

  const handleDeleteArticles = async () => {
    if (selectedArticles.length === 0 || !confirm(`למחוק ${selectedArticles.length} כתבות?`)) return;
    
    try {
      await api.deleteArticles(selectedArticles);
      await mutateArticles();
      await mutateStats();
      setSelectedArticles([]);
    } catch (err) {
      alert('❌ שגיאה במחיקת כתבות');
    }
  };

  const handleMarkAsChecked = async () => {
    if (selectedArticles.length === 0) return;
    
    try {
      await api.markArticlesAsChecked(selectedArticles);
      await mutateArticles();
      await mutateStats();
      setSelectedArticles([]);
    } catch (err) {
      alert('❌ שגיאה בסימון כתבות');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">מערכת ניתוח RSS</h1>
          
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'overview', label: 'סקירה', icon: Database },
              { id: 'articles', label: 'כתבות', icon: FileText },
              { id: 'matches', label: 'התאמות', icon: Link2 },
              { id: 'analytics', label: 'ניתוח', icon: TrendingUp },
              { id: 'tools', label: 'כלים', icon: Activity }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedTab(id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                  selectedTab === id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Overview Tab */}
        {selectedTab === 'overview' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatsCard
                title="סה״כ כתבות"
                value={stats.totalArticles}
                icon={FileText}
                color="blue"
              />
              <StatsCard
                title="נבדקו"
                value={stats.checkedArticles}
                icon={CheckCircle}
                color="green"
              />
              <StatsCard
                title="חדשות"
                value={stats.newArticles}
                icon={Activity}
                color="yellow"
              />
              <StatsCard
                title="התאמות"
                value={stats.totalMatches}
                icon={Link2}
                color="purple"
              />
              <StatsCard
                title="הושוו לאיכות"
                value={stats.qualityCheckedMatches}
                icon={CheckCircle}
                color="green"
              />
              <StatsCard
                title="לא הושוו"
                value={stats.uncheckedMatches}
                icon={XCircle}
                color="red"
              />
            </div>
            
            <Charts sourceData={sourceComparison} />
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
                <span className="text-blue-900 font-medium">
                  {selectedArticles.length} כתבות נבחרו
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleMarkAsChecked}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    סמן כנבדקו
                  </button>
                  <button
                    onClick={handleDeleteArticles}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
            <FilterPanel
              sources={sources || []}
              currentFilters={filters}
              onFilterChange={setFilters}
            />
            <MatchesTable matches={matches || []} />
          </div>
        )}

        {/* Analytics Tab */}
        {selectedTab === 'analytics' && (
          <div className="space-y-6">
            <FilterPanel
              sources={sources || []}
              currentFilters={filters}
              onFilterChange={setFilters}
            />
            <Charts sourceData={sourceComparison} />
          </div>
        )}

        {/* Tools Tab */}
        {selectedTab === 'tools' && (
          <div className="space-y-6">
            <FetchControl
              sources={sources || []}
              onFetch={handleFetchArticles}
              isLoading={false}
            />
            
            <ComparisonControl
              sources={sources || []}
              onRunComparison={handleRunComparison}
              isLoading={false}
            />

            {stats && (
              <ReportGenerator
                stats={stats}
                sourceData={sourceComparison}
                matches={matches || []}
                articles={articles || []}
              />
            )}
          </div>
        )}
      </div>

      {/* Job Progress Overlay */}
      <JobProgress jobs={activeJobs} />
    </div>
  );
}