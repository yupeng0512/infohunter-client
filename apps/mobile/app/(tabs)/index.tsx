import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  useInfiniteContents,
  useHealth,
  type Source,
} from '@infohunter/shared';
import { ContentCard, EmptyState, LoadingScreen, DailyDigestCard } from '../../components';

const SOURCES: { label: string; value: Source | undefined }[] = [
  { label: '全部', value: undefined },
  { label: 'Twitter', value: 'twitter' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'Blog', value: 'blog' },
];

export default function TodayScreen() {
  const [selectedSource, setSelectedSource] = useState<Source | undefined>(undefined);
  const { data: health, isLoading: isHealthLoading } = useHealth();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteContents({ source: selectedSource, page_size: 20 });

  const items = data?.pages.flatMap((p) => p.items) ?? [];

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  if (isLoading) return <LoadingScreen />;

  const isConnected = isHealthLoading || health?.status === 'ok';

  return (
    <View style={styles.container}>
      <FlashList
        data={items}
        renderItem={({ item }) => <ContentCard item={item} />}
        keyExtractor={(item) => String(item.id)}
        estimatedItemSize={180}
        contentContainerStyle={{ paddingBottom: 24 }}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        refreshing={isRefetching}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <View>
            {!isConnected && (
              <View style={styles.offlineBanner}>
                <Ionicons name="cloud-offline-outline" size={14} color="#F59E0B" />
                <Text style={styles.offlineText}>后端未连接</Text>
              </View>
            )}
            <DailyDigestCard />
            <View style={styles.filterBar}>
              {SOURCES.map((s) => (
                <Pressable
                  key={s.label}
                  style={[
                    styles.filterChip,
                    selectedSource === s.value && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedSource(s.value)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedSource === s.value && styles.filterTextActive,
                    ]}
                  >
                    {s.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="today-outline"
            title="暂无内容"
            message="下拉刷新获取最新内容"
          />
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color="#3B82F6" />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFBEB',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  offlineText: {
    fontSize: 13,
    color: '#B45309',
    fontWeight: '500',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
