import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureClient, setTokens } from '@infohunter/shared';
import * as SecureStore from 'expo-secure-store';
import { usePushNotifications } from '../hooks/usePushNotifications';

configureClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000',
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 2, retry: 2 },
  },
});

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  usePushNotifications();

  useEffect(() => {
    (async () => {
      try {
        const access = await SecureStore.getItemAsync('access_token');
        const refresh = await SecureStore.getItemAsync('refresh_token');
        if (access) {
          setTokens(access, refresh);
        }
      } catch {
        // SecureStore 不可用时静默降级
      }
      setReady(true);
    })();
  }, []);

  if (!ready) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0F172A' },
          headerTintColor: '#F8FAFC',
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: '#F8FAFC' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth/login"
          options={{ title: '登录', headerShown: false, presentation: 'modal' }}
        />
        <Stack.Screen
          name="subscription/manage"
          options={{ title: '我的订阅', presentation: 'card' }}
        />
        <Stack.Screen
          name="subscription/add"
          options={{ title: '添加订阅', presentation: 'modal' }}
        />
        <Stack.Screen
          name="content/[id]"
          options={{ title: '内容详情', presentation: 'card' }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
