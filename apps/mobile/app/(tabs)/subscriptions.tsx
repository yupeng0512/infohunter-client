import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  useSubscriptions,
  useUpdateSubscription,
  useDeleteSubscription,
  type SubscriptionResponse,
  type Source,
  getSourceLabel,
  getSourceColor,
  formatRelativeTime,
} from '@infohunter/shared';
import { SourceBadge, EmptyState, LoadingScreen } from '../../components';

export default function SubscriptionsScreen() {
  const router = useRouter();
  const [sourceFilter, setSourceFilter] = useState<Source | undefined>(undefined);
  const { data, isLoading, refetch, isRefetching } = useSubscriptions(
    sourceFilter ? { source: sourceFilter } : undefined,
  );
  const updateSub = useUpdateSubscription();
  const deleteSub = useDeleteSubscription();

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleToggle = (sub: SubscriptionResponse) => {
    updateSub.mutate({
      id: sub.id,
      data: { status: sub.status === 'active' ? 'paused' : 'active' },
    });
  };

  const handleDelete = (sub: SubscriptionResponse) => {
    Alert.alert('确认删除', `确定删除订阅「${sub.name}」？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => deleteSub.mutate(sub.id),
      },
    ]);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.addBtn}
        onPress={() => router.push('/subscription/create')}
      >
        <Ionicons name="add-circle-outline" size={20} color="#3B82F6" />
        <Text style={styles.addBtnText}>添加订阅</Text>
      </Pressable>

      <FlashList
        data={data ?? []}
        renderItem={({ item }) => (
          <SubscriptionItem
            item={item}
            onToggle={() => handleToggle(item)}
            onDelete={() => handleDelete(item)}
          />
        )}
        keyExtractor={(item) => String(item.id)}
        estimatedItemSize={90}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
        refreshing={isRefetching}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <EmptyState
            icon="layers-outline"
            title="暂无订阅"
            message="点击上方按钮添加订阅"
          />
        }
      />
    </View>
  );
}

function SubscriptionItem({
  item,
  onToggle,
  onDelete,
}: {
  item: SubscriptionResponse;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const typeIcons: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
    keyword: 'search-outline',
    author: 'person-outline',
    topic: 'pricetag-outline',
    feed: 'rss-outline',
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitle}>
          <Ionicons
            name={typeIcons[item.type] ?? 'ellipse-outline'}
            size={18}
            color="#64748B"
          />
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        <SourceBadge source={item.source} />
      </View>

      <Text style={styles.target} numberOfLines={1}>
        {item.target}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.statusRow}>
          <Pressable onPress={onToggle} style={styles.toggleBtn}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: item.status === 'active' ? '#10B981' : '#94A3B8' },
              ]}
            />
            <Text style={styles.statusText}>
              {item.status === 'active' ? '活跃' : '已暂停'}
            </Text>
          </Pressable>
          <Pressable onPress={onDelete} hitSlop={8}>
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
          </Pressable>
        </View>
        {item.last_fetched_at && (
          <Text style={styles.fetchTime}>
            上次采集 {formatRelativeTime(item.last_fetched_at)}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderStyle: 'dashed',
  },
  addBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
  },
  target: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#64748B',
  },
  fetchTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
