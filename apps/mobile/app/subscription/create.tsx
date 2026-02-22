import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCreateSubscription, type Source } from '@infohunter/shared';

const SOURCES: { label: string; value: Source }[] = [
  { label: 'Twitter', value: 'twitter' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'Blog/RSS', value: 'blog' },
];

const TYPES = [
  { label: '关键词', value: 'keyword' },
  { label: '作者', value: 'author' },
  { label: '话题', value: 'topic' },
  { label: 'RSS Feed', value: 'feed' },
];

export default function CreateSubscriptionScreen() {
  const router = useRouter();
  const createSub = useCreateSubscription();
  const [name, setName] = useState('');
  const [source, setSource] = useState<Source>('twitter');
  const [type, setType] = useState('keyword');
  const [target, setTarget] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !target.trim()) {
      Alert.alert('提示', '请填写名称和目标');
      return;
    }
    createSub.mutate(
      { name: name.trim(), source, type, target: target.trim() },
      {
        onSuccess: () => {
          Alert.alert('成功', '订阅已创建', [
            { text: '确定', onPress: () => router.back() },
          ]);
        },
        onError: (err) => {
          Alert.alert('失败', String(err));
        },
      },
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>名称</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="如：AI 技术动态"
          placeholderTextColor="#94A3B8"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>来源</Text>
        <View style={styles.chips}>
          {SOURCES.map((s) => (
            <Pressable
              key={s.value}
              style={[styles.chip, source === s.value && styles.chipActive]}
              onPress={() => setSource(s.value)}
            >
              <Text style={[styles.chipText, source === s.value && styles.chipTextActive]}>
                {s.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>类型</Text>
        <View style={styles.chips}>
          {TYPES.map((t) => (
            <Pressable
              key={t.value}
              style={[styles.chip, type === t.value && styles.chipActive]}
              onPress={() => setType(t.value)}
            >
              <Text style={[styles.chipText, type === t.value && styles.chipTextActive]}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>目标</Text>
        <TextInput
          style={styles.input}
          value={target}
          onChangeText={setTarget}
          placeholder="关键词、用户名或 Feed URL"
          placeholderTextColor="#94A3B8"
        />
      </View>

      <Pressable
        style={[styles.submitBtn, createSub.isPending && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={createSub.isPending}
      >
        <Text style={styles.submitText}>
          {createSub.isPending ? '创建中...' : '创建订阅'}
        </Text>
      </Pressable>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  section: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 8 },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: '#0F172A',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  chipActive: { backgroundColor: '#3B82F6' },
  chipText: { fontSize: 13, fontWeight: '500', color: '#64748B' },
  chipTextActive: { color: '#FFFFFF' },
  submitBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});
