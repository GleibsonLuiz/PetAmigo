import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { usePets } from '../hooks/usePets';
import { useTutors } from '../hooks/useTutors';
import { useTutorStore } from '../stores/tutorStore';
import { useAllVaccinations } from '../hooks/useVaccinations';
import { TutorSelector } from '../components/tutor/TutorSelector';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { Tutor } from '../../domain/entities/Tutor';
import {
  colors,
  spacing,
  radius,
  fontSize,
  shadow,
  SPECIES_EMOJI,
  SPECIES_COLORS,
  SPECIES_LABELS,
} from '../../shared/theme';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function daysUntil(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDateBR(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export function DashboardScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: pets, isLoading: loadingPets } = usePets();
  const { data: tutors, isLoading: loadingTutors } = useTutors();
  const { activeTutor, activeTutorId, setActiveTutor } = useTutorStore();
  const { data: allVaccinations, isLoading: loadingVacc } = useAllVaccinations(
    pets?.map((p) => p.id) ?? [],
  );

  useEffect(() => {
    if (!activeTutorId && tutors?.length) {
      setActiveTutor(tutors[0]);
    }
  }, [tutors, activeTutorId]);

  const handleSelectTutor = (tutor: Tutor) => {
    setActiveTutor(tutor);
    queryClient.invalidateQueries({ queryKey: ['pets'] });
  };

  if (loadingPets || loadingTutors) return <LoadingSpinner />;

  if (!tutors?.length) {
    return (
      <View style={styles.onboarding}>
        <Text style={styles.onboardingEmoji}>🐾</Text>
        <Text style={styles.onboardingTitle}>Bem-vindo ao PetAmigo!</Text>
        <Text style={styles.onboardingSub}>
          Cadastre-se como tutor para começar{'\n'}a cuidar dos seus pets.
        </Text>
        <TouchableOpacity
          style={styles.onboardingButton}
          onPress={() => router.push('/tutor/new')}
          activeOpacity={0.85}
        >
          <Text style={styles.onboardingButtonText}>Começar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const now = new Date();
  const overdueVaccines = allVaccinations?.filter(
    (v) => new Date(v.nextDoseDate) < now,
  ) ?? [];
  const upcomingVaccines = allVaccinations
    ?.filter((v) => {
      const days = daysUntil(v.nextDoseDate);
      return days >= 0 && days <= 30;
    })
    .sort((a, b) => new Date(a.nextDoseDate).getTime() - new Date(b.nextDoseDate).getTime())
    ?? [];

  const petBirthdays = pets
    ?.map((p) => {
      const birth = new Date(p.birthDate);
      const nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
      if (nextBday < now) nextBday.setFullYear(nextBday.getFullYear() + 1);
      const days = daysUntil(nextBday);
      const age = now.getFullYear() - birth.getFullYear();
      return { ...p, nextBday, daysUntilBday: days, age };
    })
    .filter((p) => p.daysUntilBday <= 30)
    .sort((a, b) => a.daysUntilBday - b.daysUntilBday) ?? [];

  const tutorName = activeTutor?.name.split(' ')[0] ?? 'Tutor';
  const totalPets = pets?.length ?? 0;
  const totalVaccines = allVaccinations?.length ?? 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {tutors && tutors.length > 1 && (
        <View style={styles.tutorRow}>
          <TutorSelector
            tutors={tutors}
            activeTutorId={activeTutorId}
            onSelect={handleSelectTutor}
            onAddNew={() => router.push('/tutor/new')}
          />
        </View>
      )}

      <View style={styles.greeting}>
        <Text style={styles.greetingText}>{getGreeting()},</Text>
        <Text style={styles.greetingName}>{tutorName}! 👋</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        <TouchableOpacity
          style={[styles.statCard, { backgroundColor: colors.primarySoft }]}
          onPress={() => router.push('/(tabs)/index' as any)}
          activeOpacity={0.7}
        >
          <Text style={styles.statEmoji}>🐾</Text>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{totalPets}</Text>
          <Text style={styles.statLabel}>Pets</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statCard, { backgroundColor: colors.successSoft }]}
          activeOpacity={0.7}
        >
          <Text style={styles.statEmoji}>✅</Text>
          <Text style={[styles.statNumber, { color: colors.success }]}>
            {totalVaccines - overdueVaccines.length}
          </Text>
          <Text style={styles.statLabel}>Em dia</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statCard, { backgroundColor: overdueVaccines.length > 0 ? colors.dangerSoft : colors.successSoft }]}
          activeOpacity={0.7}
        >
          <Text style={styles.statEmoji}>{overdueVaccines.length > 0 ? '⚠️' : '🎉'}</Text>
          <Text style={[styles.statNumber, { color: overdueVaccines.length > 0 ? colors.danger : colors.success }]}>
            {overdueVaccines.length}
          </Text>
          <Text style={styles.statLabel}>Atrasadas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statCard, { backgroundColor: colors.warningSoft }]}
          activeOpacity={0.7}
        >
          <Text style={styles.statEmoji}>📅</Text>
          <Text style={[styles.statNumber, { color: colors.warning }]}>
            {upcomingVaccines.length}
          </Text>
          <Text style={styles.statLabel}>Próximas</Text>
        </TouchableOpacity>
      </View>

      {/* Overdue Alert */}
      {overdueVaccines.length > 0 && (
        <View style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <Text style={styles.alertEmoji}>🚨</Text>
            <Text style={styles.alertTitle}>Vacinas atrasadas</Text>
          </View>
          {overdueVaccines.slice(0, 3).map((v) => {
            const pet = pets?.find((p) => p.id === v.petId);
            const days = Math.abs(daysUntil(v.nextDoseDate));
            return (
              <TouchableOpacity
                key={v.id}
                style={styles.alertItem}
                onPress={() => router.push(`/pet/${v.petId}`)}
                activeOpacity={0.7}
              >
                <Text style={styles.alertPetEmoji}>
                  {SPECIES_EMOJI[pet?.species ?? 'other']}
                </Text>
                <View style={styles.alertInfo}>
                  <Text style={styles.alertPetName}>{pet?.name}</Text>
                  <Text style={styles.alertVaccine}>
                    {v.vaccine?.name} · {days} dia{days > 1 ? 's' : ''} de atraso
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Upcoming Vaccines */}
      {upcomingVaccines.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Próximas vacinas</Text>
          {upcomingVaccines.slice(0, 5).map((v) => {
            const pet = pets?.find((p) => p.id === v.petId);
            const days = daysUntil(v.nextDoseDate);
            return (
              <TouchableOpacity
                key={v.id}
                style={styles.vaccineRow}
                onPress={() => router.push(`/pet/${v.petId}`)}
                activeOpacity={0.7}
              >
                <View style={[styles.vaccineDate, days <= 3 && styles.vaccineDateUrgent]}>
                  <Text style={[styles.vaccineDateText, days <= 3 && styles.vaccineDateTextUrgent]}>
                    {formatDateBR(v.nextDoseDate)}
                  </Text>
                </View>
                <View style={styles.vaccineInfo}>
                  <Text style={styles.vaccinePet}>
                    {SPECIES_EMOJI[pet?.species ?? 'other']} {pet?.name}
                  </Text>
                  <Text style={styles.vaccineLabel}>{v.vaccine?.name}</Text>
                </View>
                <Text style={styles.vaccineDays}>
                  {days === 0 ? 'Hoje!' : `${days}d`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Birthdays */}
      {petBirthdays.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎂 Aniversários próximos</Text>
          {petBirthdays.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.birthdayRow}
              onPress={() => router.push(`/pet/${p.id}`)}
              activeOpacity={0.7}
            >
              <Text style={styles.birthdayEmoji}>
                {SPECIES_EMOJI[p.species]}
              </Text>
              <View style={styles.birthdayInfo}>
                <Text style={styles.birthdayName}>{p.name}</Text>
                <Text style={styles.birthdayAge}>
                  Faz {p.age + 1} ano{p.age + 1 > 1 ? 's' : ''}
                </Text>
              </View>
              <View style={styles.birthdayBadge}>
                <Text style={styles.birthdayDays}>
                  {p.daysUntilBday === 0 ? 'Hoje! 🎉' : `em ${p.daysUntilBday}d`}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Ações rápidas</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/pet/new')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionEmoji}>🐾</Text>
            <Text style={styles.actionLabel}>Novo Pet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/tutor/new')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionEmoji}>👤</Text>
            <Text style={styles.actionLabel}>Novo Tutor</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/vaccines' as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionEmoji}>💉</Text>
            <Text style={styles.actionLabel}>Vacinas</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  tutorRow: { marginBottom: spacing.sm },
  greeting: { marginBottom: spacing.xl },
  greetingText: { fontSize: fontSize.lg, color: colors.textSecondary, fontWeight: '500' },
  greetingName: { fontSize: fontSize.hero, fontWeight: '800', color: colors.text, marginTop: 2 },

  onboarding: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, padding: spacing.xxxl },
  onboardingEmoji: { fontSize: 80, marginBottom: spacing.xxl },
  onboardingTitle: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text, textAlign: 'center' },
  onboardingSub: { fontSize: fontSize.md, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.md, lineHeight: 22 },
  onboardingButton: {
    backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.lg,
    paddingHorizontal: 48, marginTop: spacing.xxxl, ...shadow.md,
  },
  onboardingButtonText: { color: colors.textInverse, fontSize: fontSize.lg, fontWeight: '700' },

  statsGrid: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  statCard: {
    flex: 1, borderRadius: radius.lg, padding: spacing.md,
    alignItems: 'center', ...shadow.sm,
  },
  statEmoji: { fontSize: 20, marginBottom: spacing.xs },
  statNumber: { fontSize: fontSize.xxl, fontWeight: '800' },
  statLabel: { fontSize: fontSize.xs, color: colors.textMuted, fontWeight: '600', marginTop: 2 },

  alertCard: {
    backgroundColor: colors.dangerSoft, borderRadius: radius.lg, padding: spacing.lg,
    marginBottom: spacing.xl, borderLeftWidth: 4, borderLeftColor: colors.danger,
  },
  alertHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  alertEmoji: { fontSize: 18, marginRight: spacing.sm },
  alertTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.danger },
  alertItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  alertPetEmoji: { fontSize: 20, marginRight: spacing.md },
  alertInfo: { flex: 1 },
  alertPetName: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  alertVaccine: { fontSize: fontSize.sm, color: colors.danger, marginTop: 1 },

  section: { marginBottom: spacing.xl },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginBottom: spacing.md },

  vaccineRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, ...shadow.sm,
  },
  vaccineDate: {
    backgroundColor: colors.primarySoft, borderRadius: radius.sm,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs, marginRight: spacing.md,
  },
  vaccineDateUrgent: { backgroundColor: colors.warningSoft },
  vaccineDateText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.primary },
  vaccineDateTextUrgent: { color: colors.warning },
  vaccineInfo: { flex: 1 },
  vaccinePet: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  vaccineLabel: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 1 },
  vaccineDays: { fontSize: fontSize.sm, fontWeight: '700', color: colors.textSecondary },

  birthdayRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, ...shadow.sm,
  },
  birthdayEmoji: { fontSize: 24, marginRight: spacing.md },
  birthdayInfo: { flex: 1 },
  birthdayName: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  birthdayAge: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 1 },
  birthdayBadge: {
    backgroundColor: '#FFF3E0', borderRadius: radius.full,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
  },
  birthdayDays: { fontSize: fontSize.xs, fontWeight: '700', color: colors.warning },

  actionsGrid: { flexDirection: 'row', gap: spacing.md },
  actionCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.lg, alignItems: 'center', ...shadow.sm,
  },
  actionEmoji: { fontSize: 28, marginBottom: spacing.sm },
  actionLabel: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text },
});
