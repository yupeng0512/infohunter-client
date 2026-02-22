import type { Source, SubscriptionType, SubscriptionStatus } from './enums';

export interface SubscriptionCreate {
  name: string;
  source: Source;
  type: SubscriptionType;
  target: string;
  filters?: Record<string, unknown> | null;
  fetch_interval?: number;
  ai_analysis_enabled?: boolean;
  notification_enabled?: boolean;
}

export interface SubscriptionUpdate {
  name?: string;
  target?: string;
  filters?: Record<string, unknown> | null;
  fetch_interval?: number;
  ai_analysis_enabled?: boolean;
  notification_enabled?: boolean;
  status?: 'active' | 'paused';
}

export interface SubscriptionResponse {
  id: number;
  name: string;
  source: Source;
  type: SubscriptionType;
  target: string;
  filters: Record<string, unknown> | null;
  fetch_interval: number;
  ai_analysis_enabled: boolean;
  notification_enabled: boolean;
  status: SubscriptionStatus;
  last_fetched_at: string | null;
  created_at: string;
  updated_at: string;
}
