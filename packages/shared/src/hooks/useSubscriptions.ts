import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import {
  fetchSubscriptions,
  fetchSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from '../api/endpoints';
import type {
  SubscriptionResponse,
  SubscriptionCreate,
  SubscriptionUpdate,
  Source,
} from '../types';

export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  lists: () => [...subscriptionKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...subscriptionKeys.lists(), filters] as const,
  details: () => [...subscriptionKeys.all, 'detail'] as const,
  detail: (id: number) => [...subscriptionKeys.details(), id] as const,
};

export function useSubscriptions(
  filters?: { source?: Source; status?: string },
  options?: Omit<
    UseQueryOptions<SubscriptionResponse[]>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: subscriptionKeys.list(filters ?? {}),
    queryFn: () => fetchSubscriptions(filters),
    ...options,
  });
}

export function useSubscription(
  id: number,
  options?: Omit<
    UseQueryOptions<SubscriptionResponse>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: subscriptionKeys.detail(id),
    queryFn: () => fetchSubscription(id),
    enabled: id > 0,
    ...options,
  });
}

export function useCreateSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SubscriptionCreate) => createSubscription(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: subscriptionKeys.all }),
  });
}

export function useUpdateSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SubscriptionUpdate }) =>
      updateSubscription(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: subscriptionKeys.all }),
  });
}

export function useDeleteSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteSubscription(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: subscriptionKeys.all }),
  });
}
