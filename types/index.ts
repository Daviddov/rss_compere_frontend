// types/index.ts
export interface Article {
  id?: number;
  source: string;
  category?: string;
  title: string;
  link: string;
  published?: Date | string;
  summary?: string;
  content?: string;
  author?: string;
  isNew: number;
  checked: number;
  createdAt?: Date | string;
  stats?: {
    titleWords: number;
    titleChars: number;
    summaryWords: number;
    summaryChars: number;
    contentWords: number;
    contentChars: number;
  };
}

export interface Match {
  id?: number;
  article1Id: number;
  article2Id: number;
  similarityScore: number;
  title1?: string;
  title2?: string;
  source1?: string;
  source2?: string;
  link1?: string;
  link2?: string;
  published1?: Date | string;
  published2?: Date | string;
  publishedDiffSeconds?: number;
  betterArticle?: number;
  qualityChecked: number;
  createdAt?: Date | string;
}

export interface SystemStats {
  totalArticles: number;
  checkedArticles: number;
  newArticles: number;
  totalMatches: number;
  qualityCheckedMatches: number;
  uncheckedMatches: number;
}

export interface FilterOptions {
  source?: string;
  category?: string;
  onlyNew?: boolean;
  onlyUnmatched?: boolean;
  onlyUnchecked?: boolean;
  publishedAfter?: string;
  publishedBefore?: string;
  limit?: number;
}

export interface MatchFilterOptions {
  source?: string;
  onlyUnchecked?: boolean;
  publishedAfter?: string;
  publishedBefore?: string;
}

export interface SourceComparison {
  source: string;
  total: number;
  checked: number;
  matches: number;
  firstPublishedCount: number;
  betterArticleCount: number;
  medianDelayMinutes: number;
  averageContentWords: number;
}

export interface ComparisonOptions {
  source?: string;
  fromDate?: string;
  toDate?: string;
  onlyNew?: boolean;
  onlyUnchecked?: boolean;
}