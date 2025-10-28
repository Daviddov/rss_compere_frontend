// types/index.ts
export interface Article {
  id: number;
  source: string;
  title: string;
  link: string;
  summary: string;
  content?: string;
  published?: string;
  checked?: number;
  checked_at?: string;
  is_new?: number;
  created_at?: string;
  stats?: ArticleStats;
}

export interface ArticleStats {
  titleWords: number;
  titleChars: number;
  summaryWords: number;
  summaryChars: number;
  contentWords: number;
  contentChars: number;
}

export interface Match {
  matchId: number;
  article1Id: number;
  article2Id: number;
  article1Source: string;
  article1Title: string;
  article1Link: string;
  article2Source: string;
  article2Title: string;
  article2Link: string;
  betterArticleId: number;
  betterArticleLink: string;
  betterArticleSource: string;
  reason?: string;
  firstPublishedId: number;
  publishedDiffSeconds: number | null;
  createdAt: string;
}

export interface SystemStats {
  totalArticles: number;
  checkedArticles: number;
  uncheckedArticles: number;
  newArticles: number;
  totalMatches: number;
  matchedArticlesCount: number;
}

export interface ComparisonResult {
  totalComparisons: number;
  totalMatches: number;
}

export interface FilterOptions {
  source?: string;
  onlyNew?: boolean;
  onlyUnmatched?: boolean;
  onlyUnchecked?: boolean;
  publishedAfter?: string;
  publishedBefore?: string;
  limit?: number;
}

export interface Source {
  name: string;
  count: number;
  color: string;
}

export interface TimeSeriesData {
  date: string;
  articles: number;
  matches: number;
}

export interface SourceComparison {
  source: string;
  total: number;
  checked: number;
  matches: number;
  new: number;
}
