export interface AnalyzeUrlRequest {
  url: string;
}

export interface AnalyzeUrlResponse {
  url: string;
  source: string;
  content: Record<string, unknown> | null;
  analysis: Record<string, unknown> | null;
  error: string | null;
}

export interface AnalyzeAuthorRequest {
  author_id: string;
  source?: 'twitter' | 'youtube';
}

export interface AnalyzeAuthorResponse {
  author_id: string;
  source: string;
  profile: Record<string, unknown> | null;
  recent_contents: Record<string, unknown>[] | null;
  analysis: Record<string, unknown> | null;
  error: string | null;
}
