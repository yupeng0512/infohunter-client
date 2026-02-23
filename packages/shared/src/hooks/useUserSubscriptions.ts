import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchUserSubscriptions,
  createUserSubscription,
  deleteUserSubscription,
  updateUserMode,
  fetchUserFeed,
  testPush,
} from '../api/endpoints';
import type { UserSubscriptionCreate } from '../types';

export const userSubKeys = {
  list: ['user', 'subscriptions'] as const,
  feed: (params?: Record<string, unknown>) => ['user', 'feed', params] as const,
};

export function useUserSubscriptions() {
  return useQuery({
    queryKey: userSubKeys.list,
    queryFn: fetchUserSubscriptions,
    staleTime: 1000 * 30,
  });
}

export function useCreateUserSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserSubscriptionCreate) => createUserSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userSubKeys.list });
      queryClient.invalidateQueries({ queryKey: ['user', 'feed'] });
    },
  });
}

export function useDeleteUserSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (subId: number) => deleteUserSubscription(subId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userSubKeys.list });
    },
  });
}

export function useUpdateUserMode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mode: 'global' | 'custom') => updateUserMode(mode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      queryClient.invalidateQueries({ queryKey: userSubKeys.list });
      queryClient.invalidateQueries({ queryKey: ['user', 'feed'] });
    },
  });
}

export function useUserFeed(params?: {
  page?: number;
  page_size?: number;
  unread_only?: boolean;
}) {
  return useQuery({
    queryKey: userSubKeys.feed(params as Record<string, unknown>),
    queryFn: () => fetchUserFeed(params),
    staleTime: 1000 * 60,
  });
}

export function useTestPush() {
  return useMutation({
    mutationFn: (data?: { title?: string; body?: string }) => testPush(data),
  });
}
