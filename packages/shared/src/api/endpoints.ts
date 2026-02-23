import { apiGet, apiPost, apiPut, apiDelete } from './client';
import type {
  SubscriptionCreate,
  SubscriptionUpdate,
  SubscriptionResponse,
  PaginatedContents,
  ContentResponse,
  HealthResponse,
  StatsResponse,
  CreditSummary,
  CreditRecord,
  FetchLogRecord,
  SystemConfig,
  OPMLImportResponse,
  AnalyzeUrlRequest,
  AnalyzeUrlResponse,
  AnalyzeAuthorRequest,
  AnalyzeAuthorResponse,
  Source,
} from '../types';

// --- Health ---

export const fetchHealth = () => apiGet<HealthResponse>('/api/health');

// --- Subscriptions ---

export const fetchSubscriptions = (params?: {
  source?: Source;
  type?: string;
  status?: string;
}) => apiGet<SubscriptionResponse[]>('/api/subscriptions', { params });

export const fetchSubscription = (id: number) =>
  apiGet<SubscriptionResponse>(`/api/subscriptions/${id}`);

export const createSubscription = (data: SubscriptionCreate) =>
  apiPost<SubscriptionResponse>('/api/subscriptions', data);

export const updateSubscription = (id: number, data: SubscriptionUpdate) =>
  apiPut<SubscriptionResponse>(`/api/subscriptions/${id}`, data);

export const deleteSubscription = (id: number) =>
  apiDelete<{ status: string }>(`/api/subscriptions/${id}`);

// --- Contents ---

export const fetchContents = (params?: {
  subscription_id?: number;
  source?: Source;
  page?: number;
  page_size?: number;
}) => apiGet<PaginatedContents>('/api/contents', { params });

export const fetchUnanalyzedContents = (limit?: number) =>
  apiGet<ContentResponse[]>('/api/contents/unanalyzed', {
    params: { limit },
  });

// --- Triggers ---

export const triggerSmartCollect = () =>
  apiPost<{ status: string; message: string; results: unknown }>(
    '/api/trigger/smart-collect',
  );

export const triggerDailyReport = () =>
  apiPost<{ status: string; message: string }>('/api/trigger/daily-report');

// --- Stats ---

export const fetchStats = () => apiGet<StatsResponse>('/api/stats');

// --- Credits ---

export const fetchCreditSummary = (days?: number) =>
  apiGet<CreditSummary>('/api/credits/summary', { params: { days } });

export const fetchCreditRecords = (params?: {
  limit?: number;
  source?: string;
}) => apiGet<CreditRecord[]>('/api/credits/records', { params });

export const fetchCreditDaily = (params?: {
  days?: number;
  source?: string;
}) => apiGet<unknown[]>('/api/credits/daily', { params });

export const fetchCreditBreakdown = (params?: {
  days?: number;
  source?: string;
}) => apiGet<unknown[]>('/api/credits/breakdown', { params });

// --- Fetch Logs ---

export const fetchLogs = (params?: {
  limit?: number;
  subscription_id?: number;
}) => apiGet<FetchLogRecord[]>('/api/logs/fetch', { params });

// --- System Config ---

export const fetchConfigs = () => apiGet<SystemConfig[]>('/api/config');

export const fetchConfig = (key: string) =>
  apiGet<SystemConfig>(`/api/config/${key}`);

export const updateConfig = (
  key: string,
  data: { value: Record<string, unknown>; description?: string },
) => apiPut<SystemConfig & { status: string }>(`/api/config/${key}`, data);

export const deleteConfig = (key: string) =>
  apiDelete<{ status: string }>(`/api/config/${key}`);

// --- Analyze ---

export const analyzeUrl = (data: AnalyzeUrlRequest) =>
  apiPost<AnalyzeUrlResponse>('/api/analyze/url', data);

export const analyzeAuthor = (data: AnalyzeAuthorRequest) =>
  apiPost<AnalyzeAuthorResponse>('/api/analyze/author', data);

// --- Auth ---

import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  RefreshResponse,
  AuthUser,
  UserFeedResponse,
  DeviceRegistration,
  DeviceListResponse,
} from '../types';

export const authRegister = (data: RegisterRequest) =>
  apiPost<TokenResponse>('/api/auth/register', data);

export const authLogin = (data: LoginRequest) => {
  const formData = new URLSearchParams();
  formData.append('username', data.username);
  formData.append('password', data.password);
  return apiPost<TokenResponse>('/api/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

export const authRefresh = (refreshToken: string) =>
  apiPost<RefreshResponse>('/api/auth/refresh', { refresh_token: refreshToken });

export const authMe = () => apiGet<AuthUser>('/api/auth/me');

// --- User Feed ---

export const fetchUserFeed = (params?: {
  page?: number;
  page_size?: number;
  unread_only?: boolean;
}) => apiGet<UserFeedResponse>('/api/user/feed', { params });

export const markFeedRead = (contentId: number) =>
  apiPost<{ status: string }>(`/api/user/feed/${contentId}/read`);

export const updateUserMode = (mode: 'global' | 'custom') =>
  apiPut<{ status: string; mode: string }>('/api/user/mode', { mode });

// --- Devices ---

export const registerDevice = (data: DeviceRegistration) =>
  apiPost<{ status: string; device_id: string }>('/api/devices/register', data);

export const unregisterDevice = (deviceId: string) =>
  apiDelete<{ status: string }>(`/api/devices/${deviceId}`);

export const listDevices = () =>
  apiGet<DeviceListResponse>('/api/devices');

// --- User Subscriptions ---

import type { UserSubscriptionItem, UserSubscriptionCreate, UserSubscriptionCreateResponse } from '../types';

export const fetchUserSubscriptions = () =>
  apiGet<UserSubscriptionItem[]>('/api/user/subscriptions');

export const createUserSubscription = (data: UserSubscriptionCreate) =>
  apiPost<UserSubscriptionCreateResponse>('/api/user/subscriptions', data);

export const deleteUserSubscription = (subId: number) =>
  apiDelete<{ status: string }>(`/api/user/subscriptions/${subId}`);

// --- Push Test ---

export const testPush = (data?: { title?: string; body?: string }) =>
  apiPost<{ status: string; sent: number }>('/api/push/test', data || {});
