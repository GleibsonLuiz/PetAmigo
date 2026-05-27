import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTutorStore } from '../stores/tutorStore';
import { useAuthStore } from '../stores/authStore';
import { useTutors } from '../hooks/useTutors';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { WebContainer } from '../components/shared/WebContainer';
import { api } from '../../infrastructure/api/client';
import { notify, confirm } from '../../shared/utils/notify';
import { colors, spacing, radius, fontSize, shadow } from '../../shared/theme';

function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!expanded) {
    return (
      <TouchableOpacity
        style={styles.changePassButton}
        onPress={() => setExpanded(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.changePassIcon}>🔒</Text>
        <Text style={styles.changePassText}>Alterar Senha</Text>
      </TouchableOpacity>
    );
  }

  const handleSubmit = async () => {
    if (!currentPassword) {
      notify('Campo obrigatório', 'Informe a senha atual.');
      return;
    }
    if (newPassword.length < 6) {
      notify('Senha fraca', 'A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      notify('Senhas diferentes', 'A confirmação não confere com a nova senha.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      notify('Sucesso! 🔐', 'Sua senha foi alterada.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setExpanded(false);
    } catch (err: any) {
      notify('Erro', err.message ?? 'Não foi possível alterar a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.passwordCard}>
      <View style={styles.passwordHeader}>
        <Text style={styles.passwordTitle}>🔐 Alterar Senha</Text>
        <TouchableOpacity onPress={() => setExpanded(false)}>
          <Text style={styles.passwordClose}>✕</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.fieldLabel}>Senha atual</Text>
      <TextInput
        style={styles.fieldInput}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Digite a senha atual"
        placeholderTextColor={colors.textMuted}
        secureTextEntry
      />

      <Text style={styles.fieldLabel}>Nova senha</Text>
      <TextInput
        style={styles.fieldInput}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Mínimo 6 caracteres"
        placeholderTextColor={colors.textMuted}
        secureTextEntry
      />

      <Text style={styles.fieldLabel}>Confirmar nova senha</Text>
      <TextInput
        style={styles.fieldInput}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Repita a nova senha"
        placeholderTextColor={colors.textMuted}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.savePassButton, loading && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={loading}
        activeOpacity={0.85}
      >
        <Text style={styles.savePassText}>
          {loading ? 'Salvando...' : 'Salvar Nova Senha'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function TutorProfileScreen() {
  const router = useRouter();
  const { data: tutors, isLoading } = useTutors();
  const { activeTutor, setActiveTutor } = useTutorStore();
  const authUser = useAuthStore((s) => s.user);

  if (isLoading) return <LoadingSpinner />;

  const tutor = activeTutor ?? tutors?.[0] ?? null;

  if (tutor && !activeTutor) {
    setActiveTutor(tutor);
  }

  return (
    <WebContainer>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>👤</Text>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
      </View>

      {tutor ? (
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {tutor.name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.profileName}>{tutor.name}</Text>

          {authUser && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>✉️</Text>
              <Text style={styles.infoText}>{authUser.email}</Text>
            </View>
          )}

          {tutor.phone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📱</Text>
              <Text style={styles.infoText}>{tutor.phone}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📅</Text>
            <Text style={styles.infoText}>
              Membro desde {new Date(tutor.createdAt).toLocaleDateString('pt-BR')}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push(`/tutor/${tutor.id}`)}
            activeOpacity={0.7}
          >
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Perfil não encontrado.</Text>
        </View>
      )}

      <ChangePasswordSection />

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          confirm('Sair', 'Deseja realmente sair?', () => {
            useAuthStore.getState().logout();
            useTutorStore.getState().clearActiveTutor();
            router.replace('/login');
          });
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.logoutIcon}>🚪</Text>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
    </WebContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  header: { marginBottom: spacing.xl },
  headerEmoji: { fontSize: 32, marginBottom: spacing.sm },
  headerTitle: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text },
  profileCard: {
    backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.xxl,
    alignItems: 'center', ...shadow.md,
  },
  profileAvatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primarySoft,
    justifyContent: 'center', alignItems: 'center', marginBottom: spacing.lg,
    borderWidth: 3, borderColor: colors.primary,
  },
  profileAvatarText: { fontSize: 32, fontWeight: '700', color: colors.primary },
  profileName: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text, marginBottom: spacing.lg },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, alignSelf: 'flex-start' },
  infoIcon: { fontSize: 16, marginRight: spacing.md, width: 24 },
  infoText: { fontSize: fontSize.md, color: colors.textSecondary },
  editButton: {
    borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.lg,
    paddingVertical: spacing.md, paddingHorizontal: spacing.xxxl, marginTop: spacing.lg,
  },
  editButtonText: { color: colors.primary, fontSize: fontSize.md, fontWeight: '700' },
  emptyCard: {
    backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.xxl,
    alignItems: 'center', ...shadow.sm,
  },
  emptyText: { color: colors.textMuted, fontSize: fontSize.md },

  changePassButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.lg, marginTop: spacing.xl, ...shadow.sm,
  },
  changePassIcon: { fontSize: 18, marginRight: spacing.sm },
  changePassText: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  passwordCard: {
    backgroundColor: colors.surface, borderRadius: radius.xl,
    padding: spacing.xxl, marginTop: spacing.xl, ...shadow.md,
  },
  passwordHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: spacing.lg,
  },
  passwordTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text },
  passwordClose: { fontSize: 18, color: colors.textMuted, padding: spacing.sm },
  fieldLabel: {
    fontSize: fontSize.sm, fontWeight: '600', color: colors.text,
    marginBottom: spacing.sm, marginTop: spacing.md,
  },
  fieldInput: {
    borderWidth: 1.5, borderColor: colors.borderLight, borderRadius: radius.md,
    padding: spacing.md, fontSize: fontSize.md, backgroundColor: colors.background, color: colors.text,
  },
  savePassButton: {
    backgroundColor: colors.primary, borderRadius: radius.lg,
    padding: spacing.lg, alignItems: 'center', marginTop: spacing.xl, ...shadow.md,
  },
  savePassText: { color: '#FFF', fontSize: fontSize.md, fontWeight: '700' },

  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.dangerSoft, borderRadius: radius.lg,
    padding: spacing.lg, marginTop: spacing.xl, marginBottom: 40,
  },
  logoutIcon: { fontSize: 18, marginRight: spacing.sm },
  logoutText: { fontSize: fontSize.md, fontWeight: '600', color: colors.danger },
});
