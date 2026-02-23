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
  };
  contents: {
    total: number;
    twitter: number;
    youtube: number;
    blog: number;
    today: number;
    this_week: number;
  };
  notifications: {
    pending: number;
  };
  modules: Record<string, unknown>;
  explore: Record<string, unknown>;
  schedule: Record<string, unknown>;
  twitter_credits: Record<string, unknown>;
}

export interface CreditDailyTrend {
  date: string;
  total_credits: number;
  call_count: number;
}

export interface CreditOperationBreakdown {
  operation: string;
  context: string;
  total_credits: number;
  call_count: number;
}

export interface CreditSummary {
  today: {
    used: number;
    limit: number;
    remaining: number;
    percentage: number;
  };
  period: {
    week: number;
    month: number;
    avg_daily: number;
  };
  cost_estimate: {
    monthly_credits: number;
    monthly_usd: number;
    plan: string;
  };
  daily_trend: CreditDailyTrend[];
  by_operation: {
    today: CreditOperationBreakdown[];
    week: CreditOperationBreakdown[];
  };
  in_memory: Record<string, unknown>;
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
