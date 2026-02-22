import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Linking,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  useContents,
  formatRelativeTime,
  formatNumber,
  getSourceLabel,
  getSourceColor,
  getImportanceLabel,
  type ContentListItem,
} from '@infohunter/shared';
import { SourceBadge, LoadingScreen } from '../../components';
import { useState, useCallback } from 'react';

export default function ContentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const contentId = Number(id);

  const { data, isLoading, refetch, isRefetching } = useContents(
    { page: 1, page_size: 1 },
    { enabled: false },
  );

  // We fetch all contents and find the one matching the ID.
  // In production, add a dedicated GET /api/contents/:id endpoint.
  const {
    data: contentsData,
    isLoading: contentsLoading,
    refetch: refetchContents,
  } = useContents({ page_size: 100 });

  const item = contentsData?.items.find((c) => c.id === contentId);

  const onRefresh = useCallback(async () => {
    await refetchContents();
  }, [refetchContents]);

  if (contentsLoading) return <LoadingScreen />;

  if (!item) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>内容未找到</Text>
      </View>
    );
  }

  const analysis = item.ai_analysis;
  const importance = analysis?.importance as number | undefined;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor="#3B82F6" />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerMeta}>
          <SourceBadge source={item.source} />
          <Text style={styles.time}>
            {item.posted_at ? formatRelativeTime(item.posted_at) : ''}
          </Text>
        </View>

        {item.title && <Text style={styles.title}>{item.title}</Text>}
        {item.author && (
          <Text style={styles.author}>@{item.author}</Text>
        )}
      </View>

      {item.metrics && <MetricsBar metrics={item.metrics} />}

      {item.content && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>原文内容</Text>
          <Text style={styles.body}>{item.content}</Text>
        </View>
      )}

      {analysis && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI 分析</Text>

          {importance != null && (
            <View style={styles.importanceRow}>
              <Text style={styles.importanceLabel}>重要度</Text>
              <View style={styles.importanceBar}>
                <View
                  style={[
                    styles.importanceFill,
                    {
                      width: `${Math.round(importance * 100)}%`,
                      backgroundColor:
                        importance >= 0.7 ? '#F59E0B' : importance >= 0.4 ? '#3B82F6' : '#94A3B8',
                    },
                  ]}
                />
              </View>
              <Text style={styles.importanceValue}>
                {Math.round(importance * 100)}
              </Text>
            </View>
          )}

          {analysis.summary && (
            <View style={styles.analysisBlock}>
              <Text style={styles.analysisLabel}>摘要</Text>
              <Text style={styles.analysisText}>{String(analysis.summary)}</Text>
            </View>
          )}

          {analysis.key_points && Array.isArray(analysis.key_points) && (
            <View style={styles.analysisBlock}>
              <Text style={styles.analysisLabel}>关键观点</Text>
              {(analysis.key_points as string[]).map((point, i) => (
                <View key={i} style={styles.bulletRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{point}</Text>
                </View>
              ))}
            </View>
          )}

          {analysis.insights && (
            <View style={styles.analysisBlock}>
              <Text style={styles.analysisLabel}>洞察</Text>
              <Text style={styles.analysisText}>{String(analysis.insights)}</Text>
            </View>
          )}
        </View>
      )}

      {item.url && (
        <Pressable
          style={styles.linkBtn}
          onPress={() => Linking.openURL(item.url!)}
        >
          <Ionicons name="open-outline" size={18} color="#3B82F6" />
          <Text style={styles.linkText}>查看原文</Text>
        </Pressable>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function MetricsBar({ metrics }: { metrics: Record<string, unknown> }) {
  const items: { icon: string; value: number }[] = [];
  if (metrics.likes != null) items.push({ icon: '♥', value: metrics.likes as number });
  if (metrics.views != null) items.push({ icon: '▶', value: metrics.views as number });
  if (metrics.retweets != null) items.push({ icon: '🔁', value: metrics.retweets as number });
  if (metrics.replies != null) items.push({ icon: '💬', value: metrics.replies as number });
  if (metrics.comments != null) items.push({ icon: '💬', value: metrics.comments as number });

  if (items.length === 0) return null;

  return (
    <View style={styles.metricsBar}>
      {items.map((m, i) => (
        <View key={i} style={styles.metricItem}>
          <Text style={styles.metricIcon}>{m.icon}</Text>
          <Text style={styles.metricValue}>{formatNumber(m.value)}</Text>
        </View>
      ))}
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
  errorText: {
    fontSize: 16,
    color: '#94A3B8',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  time: {
    fontSize: 13,
    color: '#94A3B8',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 28,
    marginBottom: 6,
  },
  author: {
    fontSize: 14,
    color: '#64748B',
  },
  metricsBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricIcon: {
    fontSize: 14,
  },
  metricValue: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  body: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 24,
  },
  importanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  importanceLabel: {
    fontSize: 13,
    color: '#64748B',
    width: 50,
  },
  importanceBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  importanceFill: {
    height: '100%',
    borderRadius: 3,
  },
  importanceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    width: 30,
    textAlign: 'right',
  },
  analysisBlock: {
    marginBottom: 16,
  },
  analysisLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  analysisText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
  },
  bulletRow: {
    flexDirection: 'row',
    paddingLeft: 4,
    marginBottom: 4,
  },
  bullet: {
    fontSize: 14,
    color: '#3B82F6',
    marginRight: 8,
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3B82F6',
  },
});
