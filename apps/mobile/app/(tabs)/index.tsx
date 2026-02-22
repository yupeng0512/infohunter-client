import { View, Text, ScrollView, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStats, useHealth, useTriggerSmartCollect, useTriggerDailyReport } from '@infohunter/shared';
import { StatCard, LoadingScreen } from '../../components';
import { useState, useCallback } from 'react';

export default function DashboardScreen() {
  const router = useRouter();
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useStats();
  const { data: health, refetch: refetchHealth } = useHealth();
  const smartCollect = useTriggerSmartCollect();
  const dailyReport = useTriggerDailyReport();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchStats(), refetchHealth()]);
    setRefreshing(false);
  }, [refetchStats, refetchHealth]);

  if (statsLoading) return <LoadingScreen />;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6" />
      }
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>概览</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="活跃订阅"
            value={stats?.subscriptions.active ?? 0}
            color="#3B82F6"
          />
          <StatCard
            title="总内容数"
            value={stats?.contents.total ?? 0}
            subtitle={`24h 新增 ${stats?.contents.recent_24h ?? 0}`}
            color="#10B981"
          />
        </View>
        <View style={styles.statsGrid}>
          <StatCard
            title="Twitter"
            value={health?.twitter_contents ?? 0}
            color="#1DA1F2"
          />
          <StatCard
            title="YouTube"
            value={health?.youtube_contents ?? 0}
            color="#FF0000"
          />
        </View>
        <View style={styles.statsGrid}>
          <StatCard
            title="Blog/RSS"
            value={health?.blog_contents ?? 0}
            color="#FF8C00"
          />
          <StatCard
            title="已分析"
            value={stats?.contents.analyzed ?? 0}
            subtitle={`待分析 ${stats?.contents.unanalyzed ?? 0}`}
            color="#8B5CF6"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>快捷操作</Text>
        <View style={styles.actions}>
          <ActionButton
            icon="flash-outline"
            label="智能采集"
            loading={smartCollect.isPending}
            onPress={() => smartCollect.mutate()}
            color="#3B82F6"
          />
          <ActionButton
            icon="document-text-outline"
            label="生成日报"
            loading={dailyReport.isPending}
            onPress={() => dailyReport.mutate()}
            color="#10B981"
          />
          <ActionButton
            icon="search-outline"
            label="AI 分析"
            onPress={() => router.push('/analyze')}
            color="#8B5CF6"
          />
        </View>
      </View>
    </ScrollView>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
  loading,
  color,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  loading?: boolean;
  color: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionBtn,
        pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
      ]}
      onPress={onPress}
      disabled={loading}
    >
      <View style={[styles.actionIcon, { backgroundColor: color + '14' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.actionLabel}>{loading ? '处理中...' : label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
});
