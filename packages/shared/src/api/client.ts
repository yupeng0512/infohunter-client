import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

let _client: AxiosInstance | null = null;

export interface ClientConfig {
  baseURL: string;
  apiKey?: string;
  timeout?: number;
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
