import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import {
  fetchHealth,
  fetchStats,
  fetchCreditSummary,
  fetchCreditRecords,
  fetchLogs,
} from '../api/endpoints';
import type {
  HealthResponse,
  StatsResponse,
  CreditSummary,
  CreditRecord,
  FetchLogRecord,
} from '../types';

export const statsKeys = {
  health: ['health'] as const,
  stats: ['stats'] as const,
  credits: ['credits'] as const,
  creditSummary: (days: number) => [...statsKeys.credits, 'summary', days] as const,
  creditRecords: (params: Record<string, unknown>) =>
    [...statsKeys.credits, 'records', params] as const,
  logs: ['logs'] as const,
  logList: (params: Record<string, unknown>) =>
    [...statsKeys.logs, 'list', params] as const,
};

export function useHealth(
  options?: Omit<UseQueryOptions<HealthResponse>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: statsKeys.health,
    queryFn: fetchHealth,
    refetchInterval: 60_000,
    ...options,
  });
}

export function useStats(
  options?: Omit<UseQueryOptions<StatsResponse>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: statsKeys.stats,
    queryFn: fetchStats,
    ...options,
  });
}

export function useCreditSummary(
  days = 30,
  options?: Omit<UseQueryOptions<CreditSummary>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: statsKeys.creditSummary(days),
    queryFn: () => fetchCreditSummary(days),
    ...options,
  });
}

export function useCreditRecords(
  params?: { limit?: number; source?: string },
  options?: Omit<UseQueryOptions<CreditRecord[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: statsKeys.creditRecords(params ?? {}),
    queryFn: () => fetchCreditRecords(params),
    ...options,
  });
}

export function useFetchLogs(
  params?: { limit?: number; subscription_id?: number },
  options?: Omit<UseQueryOptions<FetchLogRecord[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: statsKeys.logList(params ?? {}),
    queryFn: () => fetchLogs(params),
    ...options,
  });
}
