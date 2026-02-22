export interface HealthResponse {
  status: string;
  subscriptions: number;
  contents: number;
  twitter_contents: number;
  youtube_contents: number;
  blog_contents: number;
}

export interface StatsResponse {
  subscriptions: {
    total: number;
    active: number;
    paused: number;
    by_source: Record<string, number>;
  };
  contents: {
    total: number;
    analyzed: number;
    unanalyzed: number;
    by_source: Record<string, number>;
    recent_24h: number;
  };
  notifications: {
    total_notified: number;
    pending: number;
  };
  modules: Record<string, unknown>;
  explore: Record<string, unknown>;
  schedule: Record<string, unknown>;
  twitter_credits: Record<string, unknown>;
}

export interface CreditSummary {
  period_days: number;
  total_credits: number;
  by_source: Record<string, number>;
  by_operation: Record<string, number>;
  by_context: Record<string, number>;
  daily_average: number;
}

export interface CreditRecord {
  id: number;
  source: string;
  operation: string;
  credits: number;
  detail: string | null;
  context: string;
  created_at: string;
}

export interface FetchLogRecord {
  id: number;
  subscription_id: number | null;
  source: string;
  status: string;
  total_fetched: number;
  new_items: number;
  filtered_items: number;
  error_message: string | null;
  started_at: string;
  duration_seconds: number | null;
}

export interface SystemConfig {
  key: string;
  value: Record<string, unknown>;
  description: string | null;
  updated_at?: string;
}

export interface OPMLImportResponse {
  total_feeds: number;
  created: number;
  skipped: number;
  errors: string[];
}
