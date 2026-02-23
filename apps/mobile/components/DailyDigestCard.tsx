import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStats } from '@infohunter/shared';

export function DailyDigestCard() {
  const { data: stats } = useStats();

  const newToday = stats?.contents.today ?? 0;
  const totalContents = stats?.contents.total ?? 0;
  const activeSubs = stats?.subscriptions.active ?? 0;

  const todayStr = new Date().toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={16} color="#3B82F6" />
          <Text style={styles.dateText}>{todayStr}</Text>
        </View>
        <Text style={styles.title}>今日速览</Text>
      </View>

      <View style={styles.statsRow}>
        <DigestStat label="今日新增" value={newToday} icon="add-circle-outline" color="#10B981" />
        <View style={styles.divider} />
        <DigestStat label="总内容" value={totalContents} icon="analytics-outline" color="#8B5CF6" />
        <View style={styles.divider} />
        <DigestStat label="订阅源" value={activeSubs} icon="layers-outline" color="#3B82F6" />
      </View>
    </View>
  );
}

function DigestStat({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return (
    <View style={styles.stat}>
      <View style={[styles.statIcon, { backgroundColor: color + '14' }]}>
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    color: '#64748B',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
});
