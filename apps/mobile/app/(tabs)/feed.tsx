import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useState, useCallback } from 'react';
import { useInfiniteContents, type Source } from '@infohunter/shared';
import { ContentCard, EmptyState, LoadingScreen } from '../../components';

const SOURCES: { label: string; value: Source | undefined }[] = [
  { label: '全部', value: undefined },
  { label: 'Twitter', value: 'twitter' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'Blog', value: 'blog' },
];

export default function FeedScreen() {
  const [selectedSource, setSelectedSource] = useState<Source | undefined>(undefined);

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

  return (
    <View style={styles.container}>
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

      <FlashList
        data={items}
        renderItem={({ item }) => <ContentCard item={item} />}
        keyExtractor={(item) => String(item.id)}
        estimatedItemSize={160}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        refreshing={isRefetching}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <EmptyState
            icon="newspaper-outline"
            title="暂无内容"
            message="下拉刷新或等待自动采集"
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
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
