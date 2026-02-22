import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHealth } from '@infohunter/shared';

export default function SettingsScreen() {
  const { data: health } = useHealth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>系统状态</Text>
        <SettingRow
          icon="pulse-outline"
          label="后端状态"
          value={health?.status === 'ok' ? '正常运行' : '未连接'}
          valueColor={health?.status === 'ok' ? '#10B981' : '#EF4444'}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>连接配置</Text>
        <SettingRow
          icon="server-outline"
          label="API 地址"
          value={process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000'}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>通知</Text>
        <SettingRow
          icon="notifications-outline"
          label="推送通知"
          value="待配置"
          valueColor="#F59E0B"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>关于</Text>
        <SettingRow icon="information-circle-outline" label="版本" value="0.1.0" />
        <SettingRow icon="logo-github" label="项目" value="InfoHunter" />
      </View>
    </ScrollView>
  );
}

function SettingRow({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={20} color="#64748B" />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Text style={[styles.rowValue, valueColor ? { color: valueColor } : null]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 2,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: {
    fontSize: 15,
    color: '#0F172A',
  },
  rowValue: {
    fontSize: 14,
    color: '#64748B',
  },
});
