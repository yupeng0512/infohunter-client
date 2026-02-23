import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCreateUserSubscription } from '@infohunter/shared';

type SourceOption = { id: string; label: string; icon: string; types: TypeOption[] };
type TypeOption = { id: string; label: string; placeholder: string };

const SOURCES: SourceOption[] = [
  {
    id: 'blog',
    label: 'RSS / Blog',
    icon: 'newspaper-outline',
    types: [
      { id: 'feed', label: 'RSS Feed', placeholder: 'https://example.com/rss.xml' },
    ],
  },
  {
    id: 'twitter',
    label: 'Twitter',
    icon: 'logo-twitter',
    types: [
      { id: 'author', label: '博主', placeholder: '@username（不含 @）' },
      { id: 'keyword', label: '关键词', placeholder: '搜索关键词' },
    ],
  },
  {
    id: 'youtube',
    label: 'YouTube',
    icon: 'logo-youtube',
    types: [
      { id: 'author', label: '频道', placeholder: 'Channel ID 或 @handle' },
      { id: 'keyword', label: '关键词', placeholder: '搜索关键词' },
    ],
  },
];

export default function AddSubscriptionScreen() {
  const router = useRouter();
  const createSub = useCreateUserSubscription();

  const [selectedSource, setSelectedSource] = useState<SourceOption | null>(null);
  const [selectedType, setSelectedType] = useState<TypeOption | null>(null);
  const [target, setTarget] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (!selectedSource || !selectedType) return;
    const trimmedTarget = target.trim();
    if (!trimmedTarget) {
      Alert.alert('请输入订阅目标');
      return;
    }

    const subName = name.trim() || `${selectedSource.label} - ${trimmedTarget}`;

    createSub.mutate(
      {
        name: subName,
        source: selectedSource.id,
        type: selectedType.id,
        target: trimmedTarget,
      },
      {
        onSuccess: (res) => {
          if (res.status === 'reused') {
            Alert.alert('已包含', res.message || '该目标已在全局订阅中');
          } else if (res.status === 'exists') {
            Alert.alert('已存在', res.message || '你已订阅该目标');
          } else {
            Alert.alert('订阅成功', `已添加「${subName}」`);
          }
          router.back();
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : '创建失败';
          Alert.alert('创建失败', message);
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text style={styles.stepLabel}>1. 选择平台</Text>
        <View style={styles.sourceRow}>
          {SOURCES.map((s) => (
            <Pressable
              key={s.id}
              style={[
                styles.sourceCard,
                selectedSource?.id === s.id && styles.sourceCardActive,
              ]}
              onPress={() => {
                setSelectedSource(s);
                setSelectedType(s.types[0]);
                setTarget('');
              }}
            >
              <Ionicons
                name={s.icon as any}
                size={24}
                color={selectedSource?.id === s.id ? '#8B5CF6' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.sourceLabel,
                  selectedSource?.id === s.id && styles.sourceLabelActive,
                ]}
              >
                {s.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {selectedSource && selectedSource.types.length > 1 && (
          <>
            <Text style={styles.stepLabel}>2. 订阅类型</Text>
            <View style={styles.typeRow}>
              {selectedSource.types.map((t) => (
                <Pressable
                  key={t.id}
                  style={[
                    styles.typeChip,
                    selectedType?.id === t.id && styles.typeChipActive,
                  ]}
                  onPress={() => {
                    setSelectedType(t);
                    setTarget('');
                  }}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      selectedType?.id === t.id && styles.typeChipTextActive,
                    ]}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {selectedType && (
          <>
            <Text style={styles.stepLabel}>
              {selectedSource!.types.length > 1 ? '3' : '2'}. 输入目标
            </Text>
            <TextInput
              style={styles.input}
              placeholder={selectedType.placeholder}
              placeholderTextColor="#CBD5E1"
              value={target}
              onChangeText={setTarget}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.stepLabel}>
              {selectedSource!.types.length > 1 ? '4' : '3'}. 订阅名称（可选）
            </Text>
            <TextInput
              style={styles.input}
              placeholder="自动生成"
              placeholderTextColor="#CBD5E1"
              value={name}
              onChangeText={setName}
            />

            <Pressable
              style={[
                styles.submitBtn,
                (!target.trim() || createSub.isPending) && styles.submitBtnDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!target.trim() || createSub.isPending}
            >
              <Ionicons name="add-circle" size={20} color="#FFFFFF" />
              <Text style={styles.submitText}>
                {createSub.isPending ? '创建中...' : '添加订阅'}
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
    marginTop: 16,
  },
  sourceRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sourceCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  sourceCardActive: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F5F3FF',
  },
  sourceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 6,
  },
  sourceLabelActive: {
    color: '#8B5CF6',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typeChipActive: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F5F3FF',
  },
  typeChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  typeChipTextActive: {
    color: '#8B5CF6',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
