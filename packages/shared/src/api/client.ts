import axios, { type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';

let _client: AxiosInstance | null = null;
let _refreshPromise: Promise<string> | null = null;
let _getRefreshToken: (() => string | null) | null = null;
let _onTokenRefreshed: ((access: string) => void) | null = null;
let _onRefreshFailed: (() => void) | null = null;

export interface ClientConfig {
  baseURL: string;
  apiKey?: string;
  timeout?: number;
}

export interface AuthInterceptorConfig {
  getRefreshToken: () => string | null;
  onTokenRefreshed: (accessToken: string) => void;
  onRefreshFailed: () => void;
}

export function setupAuthInterceptor(config: AuthInterceptorConfig) {
  _getRefreshToken = config.getRefreshToken;
  _onTokenRefreshed = config.onTokenRefreshed;
  _onRefreshFailed = config.onRefreshFailed;
}

export function configureClient(config: ClientConfig): AxiosInstance {
  _client = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout ?? 30000,
    headers: {
      'Content-Type': 'application/json',
      ...(config.apiKey ? { 'X-API-Key': config.apiKey } : {}),
    },
  });

  _client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      if (
        error.response?.status === 401 &&
        !original._retry &&
        _getRefreshToken?.() &&
        !original.url?.includes('/api/auth/')
      ) {
        original._retry = true;

        if (!_refreshPromise) {
          _refreshPromise = (async () => {
            try {
              const res = await _client!.post('/api/auth/refresh', {
                refresh_token: _getRefreshToken!(),
              });
              const newToken: string = res.data.access_token;
              _onTokenRefreshed?.(newToken);
              return newToken;
            } catch {
              _onRefreshFailed?.();
              throw error;
            } finally {
              _refreshPromise = null;
            }
          })();
        }

        const newToken = await _refreshPromise;
        original.headers['Authorization'] = `Bearer ${newToken}`;
        return _client!(original);
      }

      return Promise.reject(error);
    },
  );

  return _client;
}

export function getClient(): AxiosInstance {
  if (!_client) {
    throw new Error(
      'API client not configured. Call configureClient() first.',
    );
  }
  return _client;
}

export async function apiGet<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await getClient().get<T>(url, config);
  return res.data;
}

export async function apiPost<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await getClient().post<T>(url, data, config);
  return res.data;
}

export async function apiPut<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await getClient().put<T>(url, data, config);
  return res.data;
}

export async function apiDelete<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await getClient().delete<T>(url, config);
  return res.data;
}
