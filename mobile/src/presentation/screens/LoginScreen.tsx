import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../stores/authStore';
import { useTutorStore } from '../stores/tutorStore';
import { api } from '../../infrastructure/api/client';
import { colors, spacing, radius, fontSize, shadow } from '../../shared/theme';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'tutor' | 'admin';
    tutorId: string | null;
  };
}

export function LoginScreen() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (isRegister && !name.trim()) {
      Alert.alert('Campo obrigatório', 'Informe seu nome.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Campo obrigatório', 'Informe seu e-mail.');
      return;
    }
    if (!password || password.length < 6) {
      Alert.alert('Senha fraca', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const body = isRegister
        ? { name: name.trim(), email: email.trim().toLowerCase(), password }
        : { email: email.trim().toLowerCase(), password };

      const res = await api.post<AuthResponse>(endpoint, body);

      useAuthStore.getState().setAuth(res.token, res.user);

      if (res.user.tutorId) {
        const tutorRepo = await api.get<any>(`/tutors/${res.user.tutorId}`);
        useTutorStore.getState().setActiveTutor(tutorRepo);
      }

      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Erro', err.message ?? 'Falha na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoSection}>
          <Text style={styles.logoEmoji}>🐾</Text>
          <Text style={styles.logoTitle}>PetAmigo</Text>
          <Text style={styles.logoSub}>Cuide de quem te ama incondicionalmente</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, !isRegister && styles.tabActive]}
              onPress={() => setIsRegister(false)}
            >
              <Text style={[styles.tabText, !isRegister && styles.tabTextActive]}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, isRegister && styles.tabActive]}
              onPress={() => setIsRegister(true)}
            >
              <Text style={[styles.tabText, isRegister && styles.tabTextActive]}>Criar Conta</Text>
            </TouchableOpacity>
          </View>

          {isRegister && (
            <>
              <Text style={styles.label}>Nome</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>👤</Text>
                <TextInput
                  style={[styles.input, { paddingLeft: 40 }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Seu nome completo"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="words"
                />
              </View>
            </>
          )}

          <Text style={styles.label}>E-mail</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>✉️</Text>
            <TextInput
              style={[styles.input, { paddingLeft: 40 }]}
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={[styles.input, { paddingLeft: 40 }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Aguarde...' : isRegister ? 'Criar Conta' : 'Entrar'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          {isRegister ? 'Já tem conta? ' : 'Não tem conta? '}
          <Text style={styles.footerLink} onPress={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Faça login' : 'Cadastre-se'}
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },

  logoSection: { alignItems: 'center', marginBottom: spacing.xxxl },
  logoEmoji: { fontSize: 64, marginBottom: spacing.md },
  logoTitle: { fontSize: 36, fontWeight: '800', color: '#FFF' },
  logoSub: { fontSize: fontSize.md, color: 'rgba(255,255,255,0.75)', marginTop: spacing.sm, textAlign: 'center' },

  card: {
    backgroundColor: colors.surface, borderRadius: radius.xxl,
    padding: spacing.xxl, ...shadow.lg, maxWidth: 420, width: '100%', alignSelf: 'center',
  },
  tabRow: { flexDirection: 'row', marginBottom: spacing.xl, gap: spacing.sm },
  tab: {
    flex: 1, paddingVertical: spacing.md, borderRadius: radius.md,
    alignItems: 'center', backgroundColor: colors.background,
  },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: fontSize.md, fontWeight: '600', color: colors.textMuted },
  tabTextActive: { color: '#FFF' },

  label: {
    fontSize: fontSize.sm, fontWeight: '600', color: colors.text,
    marginBottom: spacing.sm, marginTop: spacing.lg,
  },
  inputContainer: { position: 'relative' },
  inputIcon: { position: 'absolute', left: 12, top: 12, fontSize: 16, zIndex: 1 },
  input: {
    borderWidth: 1.5, borderColor: colors.borderLight, borderRadius: radius.md,
    padding: spacing.md, fontSize: fontSize.md, backgroundColor: colors.background, color: colors.text,
  },

  submitButton: {
    backgroundColor: colors.primary, borderRadius: radius.lg,
    padding: spacing.lg, alignItems: 'center', marginTop: spacing.xxl, ...shadow.md,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { color: '#FFF', fontSize: fontSize.lg, fontWeight: '700' },

  footer: {
    textAlign: 'center', color: 'rgba(255,255,255,0.75)',
    fontSize: fontSize.md, marginTop: spacing.xxl,
  },
  footerLink: { color: '#FFF', fontWeight: '700' },
});
