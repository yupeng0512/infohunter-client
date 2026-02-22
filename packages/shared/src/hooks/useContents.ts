import {
  useQuery,
  useInfiniteQuery,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { fetchContents } from '../api/endpoints';
import type { PaginatedContents, Source } from '../types';

export const contentKeys = {
  all: ['contents'] as const,
  lists: () => [...contentKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...contentKeys.lists(), filters] as const,
  infinite: (filters: Record<string, unknown>) =>
    [...contentKeys.all, 'infinite', filters] as const,
};

export function useContents(
  filters?: { source?: Source; page?: number; page_size?: number },
  options?: Omit<UseQueryOptions<PaginatedContents>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: contentKeys.list(filters ?? {}),
    queryFn: () => fetchContents(filters),
    ...options,
  });
}

export function useInfiniteContents(filters?: {
  source?: Source;
  page_size?: number;
}) {
  const pageSize = filters?.page_size ?? 20;
  return useInfiniteQuery({
    queryKey: contentKeys.infinite(filters ?? {}),
    queryFn: ({ pageParam = 1 }) =>
      fetchContents({ ...filters, page: pageParam, page_size: pageSize }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / lastPage.page_size);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
  });
}
