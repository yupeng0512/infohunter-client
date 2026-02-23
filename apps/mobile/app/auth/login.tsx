import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLogin, useRegister } from '@infohunter/shared';
import * as SecureStore from 'expo-secure-store';

export default function AuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const login = useLogin();
  const register = useRegister();

  const isLoading = login.isPending || register.isPending;

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('提示', '请填写用户名和密码');
      return;
    }
    if (!isLogin && password.length < 6) {
      Alert.alert('提示', '密码至少 6 位');
      return;
    }

    try {
      const mutation = isLogin ? login : register;
      const result = await mutation.mutateAsync({ username: username.trim(), password });

      await SecureStore.setItemAsync('access_token', result.access_token);
      await SecureStore.setItemAsync('refresh_token', result.refresh_token);

      router.replace('/(tabs)');
    } catch (err: any) {
      const msg = err?.response?.data?.detail ?? (isLogin ? '登录失败' : '注册失败');
      Alert.alert('错误', msg);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <View style={styles.logoSection}>
          <View style={styles.logoIcon}>
            <Ionicons name="telescope-outline" size={40} color="#3B82F6" />
          </View>
          <Text style={styles.logoTitle}>InfoHunter</Text>
          <Text style={styles.logoSubtitle}>智能信息猎手</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="用户名"
              placeholderTextColor="#94A3B8"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="密码"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#94A3B8"
              />
            </Pressable>
          </View>

          <Pressable
            style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.submitText}>
              {isLoading ? '处理中...' : isLogin ? '登录' : '注册'}
            </Text>
          </Pressable>

          <Pressable onPress={() => setIsLogin(!isLogin)} style={styles.switchBtn}>
            <Text style={styles.switchText}>
              {isLogin ? '没有账号？点击注册' : '已有账号？点击登录'}
            </Text>
          </Pressable>
        </View>

        <Pressable onPress={() => router.replace('/(tabs)')} style={styles.skipBtn}>
          <Text style={styles.skipText}>暂不登录，浏览全局内容</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  logoSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  form: {
    gap: 14,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
  },
  eyeBtn: {
    padding: 4,
  },
  submitBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  switchBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchText: {
    fontSize: 14,
    color: '#3B82F6',
  },
  skipBtn: {
    alignItems: 'center',
    marginTop: 32,
  },
  skipText: {
    fontSize: 13,
    color: '#94A3B8',
  },
});
