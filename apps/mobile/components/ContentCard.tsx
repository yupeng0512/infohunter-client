import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import type { ContentListItem } from '@infohunter/shared';
import { formatRelativeTime, truncateText, formatNumber } from '@infohunter/shared';
import { SourceBadge } from './SourceBadge';

interface ContentCardProps {
  item: ContentListItem;
}

export function ContentCard({ item }: ContentCardProps) {
  const router = useRouter();
  const hasAnalysis = !!item.ai_analysis;
  const importance = item.ai_analysis?.importance as number | undefined;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push(`/content/${item.id}`)}
    >
      <View style={styles.header}>
        <SourceBadge source={item.source} />
        <Text style={styles.time}>
          {item.posted_at ? formatRelativeTime(item.posted_at) : ''}
        </Text>
      </View>

      {item.title && (
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
      )}

      {item.content && (
        <Text style={styles.content} numberOfLines={3}>
          {truncateText(item.content, 200)}
        </Text>
      )}

      {item.author && (
        <Text style={styles.author}>@{item.author}</Text>
      )}

      <View style={styles.footer}>
        {item.metrics && (
          <View style={styles.metrics}>
            {item.metrics.likes != null && (
              <Text style={styles.metric}>
                ♥ {formatNumber(item.metrics.likes)}
              </Text>
            )}
            {item.metrics.views != null && (
              <Text style={styles.metric}>
                ▶ {formatNumber(item.metrics.views)}
              </Text>
            )}
          </View>
        )}
        {hasAnalysis && (
          <View
            style={[
              styles.analysisBadge,
              importance != null && importance >= 0.7 && styles.highImportance,
            ]}
          >
            <Text style={styles.analysisText}>
              {importance != null ? `AI ${Math.round(importance * 100)}` : 'AI ✓'}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  time: {
    fontSize: 12,
    color: '#94A3B8',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 6,
    lineHeight: 22,
  },
  content: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 8,
  },
  author: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metrics: {
    flexDirection: 'row',
    gap: 12,
  },
  metric: {
    fontSize: 12,
    color: '#94A3B8',
  },
  analysisBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  highImportance: {
    backgroundColor: '#FEF3C7',
  },
  analysisText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3B82F6',
  },
});
