import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureClient } from '@infohunter/shared';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 2, retry: 2 },
  },
});

export default function RootLayout() {
  useEffect(() => {
    configureClient({
      baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000',
    });
  }, []);

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
          name="content/[id]"
          options={{ title: '内容详情', presentation: 'card' }}
        />
        <Stack.Screen
          name="subscription/create"
          options={{ title: '创建订阅', presentation: 'modal' }}
        />
        <Stack.Screen
          name="analyze/index"
          options={{ title: 'AI 分析', presentation: 'modal' }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
