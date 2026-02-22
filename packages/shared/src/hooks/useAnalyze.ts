import { useMutation } from '@tanstack/react-query';
import { analyzeUrl, analyzeAuthor } from '../api/endpoints';
import type {
  AnalyzeUrlRequest,
  AnalyzeAuthorRequest,
} from '../types';

export function useAnalyzeUrl() {
  return useMutation({
    mutationFn: (data: AnalyzeUrlRequest) => analyzeUrl(data),
  });
}

export function useAnalyzeAuthor() {
  return useMutation({
    mutationFn: (data: AnalyzeAuthorRequest) => analyzeAuthor(data),
  });
}
