import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type TabIcon = React.ComponentProps<typeof Ionicons>['name'];

function tabIcon(name: TabIcon) {
  return ({ color, size }: { color: string; size: number }) => (
    <Ionicons name={name} size={size} color={color} />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          paddingBottom: 4,
        },
        headerStyle: { backgroundColor: '#0F172A' },
        headerTintColor: '#F8FAFC',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: tabIcon('home-outline'),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: '内容',
          tabBarIcon: tabIcon('newspaper-outline'),
        }}
      />
      <Tabs.Screen
        name="subscriptions"
        options={{
          title: '订阅',
          tabBarIcon: tabIcon('layers-outline'),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '设置',
          tabBarIcon: tabIcon('settings-outline'),
        }}
      />
    </Tabs>
  );
}
