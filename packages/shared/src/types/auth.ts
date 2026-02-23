export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  role: 'admin' | 'user';
  mode: 'global' | 'custom';
  created_at?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: AuthUser;
}

export interface RefreshResponse {
  access_token: string;
  token_type: string;
}

export interface UserFeedResponse {
  items: import('./content').ContentListItem[];
  total: number;
  page: number;
  page_size: number;
  mode: 'global' | 'custom';
}
