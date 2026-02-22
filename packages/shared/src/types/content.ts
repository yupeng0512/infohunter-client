import type { Source } from './enums';

export interface ContentMetrics {
  views?: number;
  likes?: number;
  retweets?: number;
  replies?: number;
  comments?: number;
  bookmarks?: number;
}

export interface AIAnalysis {
  summary?: string;
  key_points?: string[];
  sentiment?: string;
  importance?: number;
  topics?: string[];
  insights?: string;
  [key: string]: unknown;
}

export interface ContentListItem {
  id: number;
  content_id: string;
  source: Source;
  author: string | null;
  author_id: string | null;
  title: string | null;
  content: string | null;
  url: string | null;
  metrics: ContentMetrics | null;
  ai_analysis: AIAnalysis | null;
  quality_score: number | null;
  posted_at: string | null;
  created_at: string;
}

export interface ContentResponse extends ContentListItem {
  subscription_id: number | null;
  transcript: string | null;
  ai_analyzed_at: string | null;
  relevance_score: number | null;
  notified: boolean;
}

export interface PaginatedContents {
  items: ContentListItem[];
  total: number;
  page: number;
  page_size: number;
}
