// lib/api.ts
import axios from 'axios';
import type { Article, Match, SystemStats, ComparisonResult, FilterOptions } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Stats
export const getStats = async (): Promise<SystemStats> => {
  const { data } = await api.get('/stats');
  return data.stats;
};

// Articles
export const getArticles = async (filters?: FilterOptions): Promise<Article[]> => {
  const params = new URLSearchParams();
  if (filters?.source) params.append('source', filters.source);
  if (filters?.onlyNew !== undefined) params.append('onlyNew', String(filters.onlyNew));
  if (filters?.onlyUnmatched !== undefined) params.append('onlyUnmatched', String(filters.onlyUnmatched));
  if (filters?.onlyUnchecked !== undefined) params.append('onlyUnchecked', String(filters.onlyUnchecked));
  if (filters?.publishedAfter) params.append('publishedAfter', filters.publishedAfter);
  if (filters?.publishedBefore) params.append('publishedBefore', filters.publishedBefore);
  if (filters?.limit) params.append('limit', String(filters.limit));
  
  const { data } = await api.get(`/articles?${params.toString()}`);
  
  // Add stats calculation on client side if not provided by backend
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

// Operations
export const fetchArticles = async (): Promise<void> => {
  await api.post('/fetch');
};

export const runComparison = async (): Promise<ComparisonResult> => {
  const { data } = await api.post('/compare');
  return data.result;
};

export const runNewComparison = async (): Promise<ComparisonResult> => {
  const { data } = await api.post('/compare-new');
  return data.result;
};

export const runAdvancedComparison = async (options: any): Promise<ComparisonResult> => {
  const { data } = await api.post('/compare-advanced', options);
  return data.result;
};

// Sources
export const getSources = async (): Promise<string[]> => {
  const { data } = await api.get('/sources');
  return data.sources;
};

export default api;
