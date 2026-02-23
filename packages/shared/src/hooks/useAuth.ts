import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authLogin, authRegister, authMe } from '../api/endpoints';
import { getClient, setupAuthInterceptor } from '../api/client';
import type { LoginRequest, RegisterRequest, TokenResponse } from '../types';

export const authKeys = {
  me: ['auth', 'me'] as const,
};

let _accessToken: string | null = null;
let _refreshToken: string | null = null;
let _onTokenChange: ((access: string | null, refresh: string | null) => void) | null = null;
let _interceptorInitialized = false;

export function setTokenChangeHandler(
  handler: ((access: string | null, refresh: string | null) => void) | null,
) {
  _onTokenChange = handler;
}

function ensureInterceptor() {
  if (_interceptorInitialized) return;
  _interceptorInitialized = true;
  setupAuthInterceptor({
    getRefreshToken: () => _refreshToken,
    onTokenRefreshed: (newAccess) => {
      _accessToken = newAccess;
      const client = getClient();
      client.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
      _onTokenChange?.(newAccess, _refreshToken);
    },
    onRefreshFailed: () => {
      clearTokens();
    },
  });
}

export function setTokens(access: string | null, refresh: string | null) {
  _accessToken = access;
  _refreshToken = refresh;
  const client = getClient();
  if (access) {
    client.defaults.headers.common['Authorization'] = `Bearer ${access}`;
  } else {
    delete client.defaults.headers.common['Authorization'];
  }
  ensureInterceptor();
  _onTokenChange?.(access, refresh);
}

export function getAccessToken(): string | null {
  return _accessToken;
}

export function clearTokens() {
  _accessToken = null;
  _refreshToken = null;
  const client = getClient();
  delete client.defaults.headers.common['Authorization'];
  _onTokenChange?.(null, null);
}

function handleAuthResponse(data: TokenResponse) {
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginRequest) => authLogin(data),
    onSuccess: (data) => {
      handleAuthResponse(data);
      queryClient.setQueryData(authKeys.me, data.user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegisterRequest) => authRegister(data),
    onSuccess: (data) => {
      handleAuthResponse(data);
      queryClient.setQueryData(authKeys.me, data.user);
    },
  });
}

export function useCurrentUser(enabled = true) {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: authMe,
    enabled: enabled && _accessToken != null,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return () => {
    clearTokens();
    queryClient.setQueryData(authKeys.me, null);
    queryClient.clear();
  };
}
