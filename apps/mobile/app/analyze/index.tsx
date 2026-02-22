import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useAnalyzeUrl, useAnalyzeAuthor } from '@infohunter/shared';

export default function AnalyzeScreen() {
  const [mode, setMode] = useState<'url' | 'author'>('url');
  const [url, setUrl] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [authorSource, setAuthorSource] = useState<'twitter' | 'youtube'>('twitter');

  const urlAnalysis = useAnalyzeUrl();
  const authorAnalysis = useAnalyzeAuthor();

  const isPending = urlAnalysis.isPending || authorAnalysis.isPending;
  const result = mode === 'url' ? urlAnalysis.data : authorAnalysis.data;
  const error = mode === 'url' ? urlAnalysis.error : authorAnalysis.error;

  const handleAnalyze = () => {
    if (mode === 'url' && url.trim()) {
      urlAnalysis.mutate({ url: url.trim() });
    } else if (mode === 'author' && authorId.trim()) {
      authorAnalysis.mutate({ author_id: authorId.trim(), source: authorSource });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.modeToggle}>
        <Pressable
          style={[styles.modeBtn, mode === 'url' && styles.modeBtnActive]}
          onPress={() => setMode('url')}
        >
          <Text style={[styles.modeText, mode === 'url' && styles.modeTextActive]}>
            链接分析
          </Text>
        </Pressable>
        <Pressable
          style={[styles.modeBtn, mode === 'author' && styles.modeBtnActive]}
          onPress={() => setMode('author')}
        >
          <Text style={[styles.modeText, mode === 'author' && styles.modeTextActive]}>
            博主评估
          </Text>
        </Pressable>
      </View>

      {mode === 'url' ? (
        <View style={styles.section}>
          <Text style={styles.label}>URL 地址</Text>
          <TextInput
            style={styles.input}
            value={url}
            onChangeText={setUrl}
            placeholder="输入 Twitter / YouTube 链接"
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>
      ) : (
        <>
          <View style={styles.section}>
            <Text style={styles.label}>作者 ID</Text>
            <TextInput
              style={styles.input}
              value={authorId}
              onChangeText={setAuthorId}
              placeholder="Twitter 用户名或 YouTube 频道 ID"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>平台</Text>
            <View style={styles.chips}>
              {(['twitter', 'youtube'] as const).map((s) => (
                <Pressable
                  key={s}
                  style={[styles.chip, authorSource === s && styles.chipActive]}
                  onPress={() => setAuthorSource(s)}
                >
                  <Text style={[styles.chipText, authorSource === s && styles.chipTextActive]}>
                    {s === 'twitter' ? 'Twitter' : 'YouTube'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </>
      )}

      <Pressable
        style={[styles.analyzeBtn, isPending && { opacity: 0.6 }]}
        onPress={handleAnalyze}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.analyzeBtnText}>开始分析</Text>
        )}
      </Pressable>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>分析失败: {String(error)}</Text>
        </View>
      )}

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>分析结果</Text>
          {'analysis' in result && result.analysis && (
            <Text style={styles.resultContent}>
              {JSON.stringify(result.analysis, null, 2)}
            </Text>
          )}
          {result.error && (
            <Text style={styles.errorText}>{result.error}</Text>
          )}
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
    marginBottom: 20,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeBtnActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  modeText: { fontSize: 14, fontWeight: '500', color: '#64748B' },
  modeTextActive: { color: '#0F172A', fontWeight: '600' },
  section: { marginBottom: 16 },
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
  chips: { flexDirection: 'row', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9' },
  chipActive: { backgroundColor: '#3B82F6' },
  chipText: { fontSize: 13, fontWeight: '500', color: '#64748B' },
  chipTextActive: { color: '#FFFFFF' },
  analyzeBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  analyzeBtnText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  errorBox: {
    marginTop: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 14,
  },
  errorText: { fontSize: 14, color: '#DC2626' },
  resultBox: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resultTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 10 },
  resultContent: { fontSize: 13, color: '#334155', fontFamily: 'monospace', lineHeight: 20 },
});
