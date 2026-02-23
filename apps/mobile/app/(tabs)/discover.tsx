import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  useSubscriptions,
  type SubscriptionResponse,
  getSourceColor,
  getSourceLabel,
  formatRelativeTime,
} from '@infohunter/shared';
import { SourceBadge, EmptyState, LoadingScreen } from '../../components';

type ViewMode = 'subscriptions' | 'sources';

export default function DiscoverScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('subscriptions');
  const { data: subscriptions, isLoading, refetch, isRefetching } = useSubscriptions({
    status: 'active',
  });

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  if (isLoading) return <LoadingScreen />;

  const activeSubs = subscriptions ?? [];
  const grouped = groupBySource(activeSubs);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor="#3B82F6" />
      }
    >
      <View style={styles.toggleBar}>
        <Pressable
          style={[styles.toggleBtn, viewMode === 'subscriptions' && styles.toggleActive]}
          onPress={() => setViewMode('subscriptions')}
        >
          <Text style={[styles.toggleText, viewMode === 'subscriptions' && styles.toggleTextActive]}>
            订阅源
          </Text>
        </Pressable>
        <Pressable
          style={[styles.toggleBtn, viewMode === 'sources' && styles.toggleActive]}
          onPress={() => setViewMode('sources')}
        >
          <Text style={[styles.toggleText, viewMode === 'sources' && styles.toggleTextActive]}>
            按平台
          </Text>
        </Pressable>
      </View>

      {activeSubs.length === 0 ? (
        <EmptyState
          icon="compass-outline"
          title="暂无订阅"
          message="管理员尚未配置订阅源"
        />
      ) : viewMode === 'subscriptions' ? (
        <View style={styles.list}>
          {activeSubs.map((sub) => (
            <SubscriptionCard key={sub.id} item={sub} />
          ))}
        </View>
      ) : (
        <View style={styles.list}>
          {Object.entries(grouped).map(([source, subs]) => (
            <SourceGroup key={source} source={source} items={subs} />
          ))}
        </View>
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

function SubscriptionCard({ item }: { item: SubscriptionResponse }) {
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
      {item.last_fetched_at && (
        <Text style={styles.fetchTime}>
          最近更新 {formatRelativeTime(item.last_fetched_at)}
        </Text>
      )}
    </View>
  );
}

function SourceGroup({ source, items }: { source: string; items: SubscriptionResponse[] }) {
  const color = getSourceColor(source);

  return (
    <View style={styles.sourceGroup}>
      <View style={styles.sourceHeader}>
        <View style={[styles.sourceDot, { backgroundColor: color }]} />
        <Text style={styles.sourceTitle}>{getSourceLabel(source)}</Text>
        <Text style={styles.sourceCount}>{items.length} 个订阅</Text>
      </View>
      {items.map((sub) => (
        <View key={sub.id} style={styles.sourceItem}>
          <Text style={styles.sourceItemName} numberOfLines={1}>{sub.name}</Text>
          <Text style={styles.sourceItemTarget} numberOfLines={1}>{sub.target}</Text>
        </View>
      ))}
    </View>
  );
}

function groupBySource(subs: SubscriptionResponse[]): Record<string, SubscriptionResponse[]> {
  const map: Record<string, SubscriptionResponse[]> = {};
  for (const sub of subs) {
    if (!map[sub.source]) map[sub.source] = [];
    map[sub.source].push(sub);
  }
  return map;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  toggleBar: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  toggleTextActive: {
    color: '#0F172A',
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
    marginBottom: 6,
  },
  fetchTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  sourceGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sourceDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  sourceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  sourceCount: {
    fontSize: 13,
    color: '#94A3B8',
  },
  sourceItem: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  sourceItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  sourceItemTarget: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
});
