import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  useHealth,
  useStats,
  useCurrentUser,
  useLogout,
  getAccessToken,
  useUpdateUserMode,
  useTestPush,
} from '@infohunter/shared';
import * as SecureStore from 'expo-secure-store';

export default function ProfileScreen() {
  const router = useRouter();
  const { data: health, isLoading: isHealthLoading } = useHealth();
  const { data: stats } = useStats();
  const { data: currentUser } = useCurrentUser(getAccessToken() != null);
  const logout = useLogout();
  const updateMode = useUpdateUserMode();
  const pushTest = useTestPush();

  const isConnected = isHealthLoading || health?.status === 'ok';
  const isLoggedIn = currentUser != null;
  const isCustomMode = currentUser?.mode === 'custom';

  const handleLogout = () => {
    Alert.alert('确认退出', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '退出',
        style: 'destructive',
        onPress: async () => {
          await SecureStore.deleteItemAsync('access_token');
          await SecureStore.deleteItemAsync('refresh_token');
          logout();
        },
      },
    ]);
  };

  const handleModeToggle = () => {
    const newMode = isCustomMode ? 'global' : 'custom';
    const modeLabel = newMode === 'custom' ? '自定义模式' : '全局模式';
    const desc = newMode === 'custom'
      ? '你可以添加个人订阅，同时保留全局推送内容'
      : '所有内容来自管理员配置的全局订阅';

    Alert.alert(
      `切换到${modeLabel}`,
      desc,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认切换',
          onPress: () => updateMode.mutate(newMode),
        },
      ],
    );
  };

  const handleTestPush = () => {
    pushTest.mutate(undefined, {
      onSuccess: (res) => {
        Alert.alert('推送测试', `发送结果: ${res.status}, 设备: ${res.sent ?? 0}`);
      },
      onError: () => {
        Alert.alert('推送测试失败', '请确保已注册推送 Token');
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Ionicons
            name={isLoggedIn ? 'person' : 'person-outline'}
            size={32}
            color={isLoggedIn ? '#3B82F6' : '#94A3B8'}
          />
        </View>
        <Text style={styles.userName}>
          {isLoggedIn ? currentUser.username : 'InfoHunter 用户'}
        </Text>
        <Text style={styles.userMode}>
          {isLoggedIn
            ? isCustomMode ? '🎯 自定义模式' : '🌐 全局模式'
            : '未登录'}
        </Text>
      </View>

      {!isLoggedIn && (
        <Pressable
          style={styles.loginBtn}
          onPress={() => router.push('/auth/login')}
        >
          <Ionicons name="log-in-outline" size={18} color="#FFFFFF" />
          <Text style={styles.loginBtnText}>登录 / 注册</Text>
        </Pressable>
      )}

      <View style={styles.statsRow}>
        <ProfileStat label="订阅" value={stats?.subscriptions.active ?? 0} />
        <ProfileStat label="内容" value={stats?.contents.total ?? 0} />
        <ProfileStat label="已分析" value={stats?.contents.analyzed ?? 0} />
      </View>

      {isLoggedIn && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>订阅模式</Text>
          <View style={styles.modeCard}>
            <View style={styles.modeCardLeft}>
              <Ionicons
                name={isCustomMode ? 'options-outline' : 'globe-outline'}
                size={22}
                color={isCustomMode ? '#8B5CF6' : '#3B82F6'}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.modeLabel}>
                  {isCustomMode ? '自定义模式' : '全局模式'}
                </Text>
                <Text style={styles.modeDesc}>
                  {isCustomMode
                    ? '个人订阅 + 全局内容'
                    : '统一使用管理员配置'}
                </Text>
              </View>
            </View>
            <Switch
              value={isCustomMode}
              onValueChange={handleModeToggle}
              trackColor={{ false: '#E2E8F0', true: '#C4B5FD' }}
              thumbColor={isCustomMode ? '#8B5CF6' : '#94A3B8'}
            />
          </View>
          {isCustomMode && (
            <Pressable
              style={styles.manageSubBtn}
              onPress={() => router.push('/subscription/manage')}
            >
              <Ionicons name="add-circle-outline" size={18} color="#8B5CF6" />
              <Text style={styles.manageSubText}>管理我的订阅</Text>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </Pressable>
          )}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>系统状态</Text>
        <SettingRow
          icon="cloud-outline"
          label="后端连接"
          value={isConnected ? '已连接' : '未连接'}
          valueColor={isConnected ? '#10B981' : '#EF4444'}
        />
        <SettingRow
          icon="server-outline"
          label="API 地址"
          value={process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000'}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>通知</Text>
        <Pressable onPress={handleTestPush}>
          <SettingRow
            icon="notifications-outline"
            label="推送通知"
            value={pushTest.isPending ? '发送中...' : '点击测试'}
            valueColor="#3B82F6"
          />
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>关于</Text>
        <SettingRow icon="information-circle-outline" label="版本" value="0.3.0" />
        <SettingRow icon="logo-github" label="项目" value="InfoHunter" />
      </View>

      {isLoggedIn && (
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#EF4444" />
          <Text style={styles.logoutText}>退出登录</Text>
        </Pressable>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function ProfileStat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.profileStat}>
      <Text style={styles.profileStatValue}>{value}</Text>
      <Text style={styles.profileStatLabel}>{label}</Text>
    </View>
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
  profileHeader: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  userMode: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#3B82F6',
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  loginBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginHorizontal: 16,
  },
  profileStat: {
    alignItems: 'center',
  },
  profileStatValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  profileStatLabel: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
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
  modeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 2,
  },
  modeCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  modeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  modeDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  manageSubBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 6,
  },
  manageSubText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
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
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
});
