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
  scope?: 'global' | 'user';
  owner_id?: number | null;
  last_fetched_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserSubscriptionItem {
  id: number;
  name: string;
  source: Source;
  type: SubscriptionType;
  target: string;
  status: SubscriptionStatus;
  scope: 'global' | 'user';
  owner_id?: number | null;
  is_mine: boolean;
  last_fetched_at: string | null;
}

export interface UserSubscriptionCreate {
  name: string;
  source: string;
  type: string;
  target: string;
}

export interface UserSubscriptionCreateResponse {
  status: 'ok' | 'reused' | 'exists';
  message?: string;
  subscription: {
    id: number;
    name: string;
    source: string;
    type: string;
    target: string;
    scope: string;
  };
}
