// lib/api.ts
import axios from 'axios';
import type { Article, Match, SystemStats, FilterOptions } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Job {
  id: string;
  type: 'find-matches' | 'compare-quality' | 'fetch-articles';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startedAt?: string;
  completedAt?: string;
  result?: any;
  error?: string;
}

// Stats
export const getStats = async (): Promise<SystemStats> => {
  const { data } = await api.get('/stats');
  return data.stats;
};

// Articles
export const getArticles = async (filters?: FilterOptions): Promise<Article[]> => {
  const params = new URLSearchParams();
  if (filters?.source) params.append('source', filters.source);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.onlyNew !== undefined) params.append('onlyNew', String(filters.onlyNew));
  if (filters?.onlyUnmatched !== undefined) params.append('onlyUnmatched', String(filters.onlyUnmatched));
  if (filters?.onlyUnchecked !== undefined) params.append('onlyUnchecked', String(filters.onlyUnchecked));
  if (filters?.publishedAfter) params.append('publishedAfter', filters.publishedAfter);
  if (filters?.publishedBefore) params.append('publishedBefore', filters.publishedBefore);
  if (filters?.limit) params.append('limit', String(filters.limit));
  
  const { data } = await api.get(`/articles?${params.toString()}`);
  
  return data.articles.map((article: Article) => {
    if (!article.stats) {
      article.stats = {
        titleWords: article.title.split(/\s+/).length,
        titleChars: article.title.length,
        summaryWords: article.summary?.split(/\s+/).length || 0,
        summaryChars: article.summary?.length || 0,
        contentWords: article.content?.split(/\s+/).length || 0,
        contentChars: article.content?.length || 0,
      };
    }
    return article;
  });
};

export const getNewArticles = async (source?: string): Promise<Article[]> => {
  const url = source ? `/articles/new?source=${source}` : '/articles/new';
  const { data } = await api.get(url);
  return data.articles;
};

export const getCategories = async (): Promise<string[]> => {
  const { data } = await api.get('/articles/categories');
  return data.categories;
};

export const deleteArticles = async (articleIds: number[]): Promise<void> => {
  await api.delete('/articles', { data: { articleIds } });
};

export const markArticlesAsChecked = async (articleIds: number[]): Promise<void> => {
  await api.post('/articles/mark-checked', { articleIds });
};

export const markArticlesAsOld = async (articleIds: number[]): Promise<void> => {
  await api.post('/articles/mark-old', { articleIds });
};

export const markAllAsNew = async (): Promise<void> => {
  await api.post('/articles/mark-all-new');
};

export const resetCheckedStatus = async (articleIds?: number[]): Promise<void> => {
  await api.post('/articles/reset-checked', { articleIds });
};

// Matches
export const getMatches = async (): Promise<Match[]> => {
  const { data } = await api.get('/matches');
  return data.matches;
};

export const deleteMatches = async (matchIds: number[]): Promise<void> => {
  await api.delete('/matches', { data: { matchIds } });
};

// Operations - עם Jobs
export const fetchArticles = async (sources?: string[]): Promise<void> => {
  await api.post('/fetch', { sources });
};

export const findMatches = async (options: {
  source?: string;
  fromDate?: string;
  toDate?: string;
  onlyNew?: boolean;
}): Promise<{ jobId: string }> => {
  const { data } = await api.post('/compare/find-matches', options);
  return data;
};

export const compareQuality = async (options: {
  source?: string;
  fromDate?: string;
  toDate?: string;
  onlyUnchecked?: boolean;
}): Promise<{ jobId: string }> => {
  const { data } = await api.post('/compare/compare-quality', options);
  return data;
};

// Job Status
export const getJob = async (jobId: string): Promise<Job> => {
  const { data } = await api.get(`/compare/jobs/${jobId}`);
  return data.job;
};

export const getAllJobs = async (): Promise<Job[]> => {
  const { data } = await api.get('/compare/jobs');
  return data.jobs;
};

// Polling helper
export const pollJob = async (
  jobId: string,
  onProgress?: (job: Job) => void,
  intervalMs: number = 2000
): Promise<Job> => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const job = await getJob(jobId);
        
        if (onProgress) {
          onProgress(job);
        }
        
        if (job.status === 'completed') {
          clearInterval(interval);
          resolve(job);
        } else if (job.status === 'failed') {
          clearInterval(interval);
          reject(new Error(job.error || 'Job failed'));
        }
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, intervalMs);
  });
};

// Sources
export const getSources = async (): Promise<string[]> => {
  const { data } = await api.get('/sources');
  return data.sources;
};

// Reports
export const sendReport = async (email: string, html: string, reportType: string): Promise<void> => {
  await api.post('/report/send', { email, html, reportType });
};

export default api;