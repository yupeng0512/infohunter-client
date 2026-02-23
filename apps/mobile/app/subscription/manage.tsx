import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  useUserSubscriptions,
  useDeleteUserSubscription,
  getSourceLabel,
} from '@infohunter/shared';
import type { UserSubscriptionItem } from '@infohunter/shared';

export default function ManageSubscriptionsScreen() {
  const router = useRouter();
  const { data: subs, isLoading, refetch, isRefetching } = useUserSubscriptions();
  const deleteSub = useDeleteUserSubscription();

  const globalSubs = (subs ?? []).filter((s) => s.scope === 'global');
  const userSubs = (subs ?? []).filter((s) => s.is_mine);

  const handleDelete = (sub: UserSubscriptionItem) => {
    Alert.alert('删除订阅', `确定删除「${sub.name}」？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => deleteSub.mutate(sub.id),
      },
    ]);
  };

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor="#8B5CF6" />
      }
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          我的个人订阅 ({userSubs.length})
        </Text>
        <Pressable
          style={styles.addBtn}
          onPress={() => router.push('/subscription/add')}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addBtnText}>添加</Text>
        </Pressable>
      </View>

      {userSubs.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="bookmark-outline" size={32} color="#CBD5E1" />
          <Text style={styles.emptyText}>还没有个人订阅</Text>
          <Text style={styles.emptyHint}>
            添加你感兴趣的 RSS / Twitter / YouTube 订阅
          </Text>
        </View>
      ) : (
        userSubs.map((sub) => (
          <SubCard key={`user-${sub.id}`} item={sub} onDelete={handleDelete} />
        ))
      )}

      {globalSubs.length > 0 && (
        <>
          <View style={styles.globalHeaderRow}>
            <Text style={styles.globalHeaderText}>
              全局订阅 ({globalSubs.length})
            </Text>
            <Text style={styles.globalHeaderHint}>
              管理员配置，自动包含在你的 Feed 中
            </Text>
          </View>
          {globalSubs.map((sub) => (
            <SubCard key={`global-${sub.id}`} item={sub} />
          ))}
        </>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function SubCard({
  item,
  onDelete,
}: {
  item: UserSubscriptionItem;
  onDelete?: (item: UserSubscriptionItem) => void;
}) {
  return (
    <View style={styles.subCard}>
      <View style={styles.subInfo}>
        <View style={styles.subHeader}>
          <View
            style={[
              styles.scopeBadge,
              item.scope === 'global' ? styles.scopeGlobal : styles.scopeUser,
            ]}
          >
            <Text
              style={[
                styles.scopeText,
                item.scope === 'global'
                  ? styles.scopeGlobalText
                  : styles.scopeUserText,
              ]}
            >
              {item.scope === 'global' ? '全局' : '个人'}
            </Text>
          </View>
          <Text style={styles.subSource}>{getSourceLabel(item.source)}</Text>
        </View>
        <Text style={styles.subName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.subTarget} numberOfLines={1}>
          {item.target}
        </Text>
      </View>
      {item.is_mine && onDelete && (
        <Pressable style={styles.deleteBtn} onPress={() => onDelete(item)}>
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  subCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 10,
  },
  subInfo: {
    flex: 1,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  scopeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  scopeGlobal: {
    backgroundColor: '#DBEAFE',
  },
  scopeUser: {
    backgroundColor: '#EDE9FE',
  },
  scopeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  scopeGlobalText: {
    color: '#3B82F6',
  },
  scopeUserText: {
    color: '#8B5CF6',
  },
  subSource: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  subName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  subTarget: {
    fontSize: 12,
    color: '#94A3B8',
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 8,
  },
  emptyCard: {
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 8,
  },
  emptyHint: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 4,
  },
  globalHeaderRow: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  globalHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  globalHeaderHint: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
});
