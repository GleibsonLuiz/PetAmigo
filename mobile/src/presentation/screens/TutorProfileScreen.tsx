import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTutorStore } from '../stores/tutorStore';
import { useAuthStore } from '../stores/authStore';
import { useTutors } from '../hooks/useTutors';
import { TutorSelector } from '../components/tutor/TutorSelector';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { WebContainer } from '../components/shared/WebContainer';
import { Tutor } from '../../domain/entities/Tutor';
import { colors, spacing, radius, fontSize, shadow } from '../../shared/theme';

export function TutorProfileScreen() {
  const router = useRouter();
  const { data: tutors, isLoading } = useTutors();
  const { activeTutor, activeTutorId, setActiveTutor } = useTutorStore();

  if (isLoading) return <LoadingSpinner />;

  if (!tutors?.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>👤</Text>
        <Text style={styles.emptyTitle}>Nenhum tutor cadastrado</Text>
        <Text style={styles.emptySub}>Cadastre o primeiro tutor para começar.</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/tutor/new')}
          activeOpacity={0.85}
        >
          <Text style={styles.createButtonText}>Cadastrar Tutor</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSelect = (tutor: Tutor) => {
    setActiveTutor(tutor);
  };

  const currentTutor = activeTutor ?? tutors[0];

  return (
    <WebContainer>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>👥</Text>
        <Text style={styles.headerTitle}>Tutores</Text>
        <Text style={styles.headerSub}>Alterne entre os tutores do app</Text>
      </View>

      <TutorSelector
        tutors={tutors}
        activeTutorId={activeTutorId}
        onSelect={handleSelect}
        onAddNew={() => router.push('/tutor/new')}
      />

      {currentTutor && (
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {currentTutor.name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.profileName}>{currentTutor.name}</Text>

          {currentTutor.email && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>✉️</Text>
              <Text style={styles.infoText}>{currentTutor.email}</Text>
            </View>
          )}

          {currentTutor.phone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📱</Text>
              <Text style={styles.infoText}>{currentTutor.phone}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📅</Text>
            <Text style={styles.infoText}>
              Desde {new Date(currentTutor.createdAt).toLocaleDateString('pt-BR')}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push(`/tutor/${currentTutor.id}`)}
            activeOpacity={0.7}
          >
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          Alert.alert('Sair', 'Deseja realmente sair?', [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Sair',
              style: 'destructive',
              onPress: () => {
                useAuthStore.getState().logout();
                useTutorStore.getState().clearActiveTutor();
                router.replace('/login');
              },
            },
          ]);
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
  headerSub: { fontSize: fontSize.md, color: colors.textSecondary, marginTop: spacing.xs },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, padding: spacing.xxxl },
  emptyEmoji: { fontSize: 64, marginBottom: spacing.xl },
  emptyTitle: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text },
  emptySub: { fontSize: fontSize.md, color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center' },
  createButton: {
    backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxxl, marginTop: spacing.xxl, ...shadow.md,
  },
  createButtonText: { color: colors.textInverse, fontSize: fontSize.lg, fontWeight: '700' },
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
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.dangerSoft, borderRadius: radius.lg,
    padding: spacing.lg, marginTop: spacing.xxl, marginBottom: 40,
  },
  logoutIcon: { fontSize: 18, marginRight: spacing.sm },
  logoutText: { fontSize: fontSize.md, fontWeight: '600', color: colors.danger },
});
