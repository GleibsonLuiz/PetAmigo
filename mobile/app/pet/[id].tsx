import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePet } from '../../src/presentation/hooks/usePets';
import { useVaccinations } from '../../src/presentation/hooks/useVaccinations';
import { VaccinationCard } from '../../src/presentation/components/vaccination/VaccinationCard';
import { LoadingSpinner } from '../../src/presentation/components/shared/LoadingSpinner';
import {
  colors,
  spacing,
  radius,
  fontSize,
  shadow,
  SPECIES_EMOJI,
  SPECIES_COLORS,
  SPECIES_LABELS,
} from '../../src/shared/theme';

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: pet, isLoading: loadingPet } = usePet(id);
  const { data: vaccinations, isLoading: loadingVacc } = useVaccinations(id);

  if (loadingPet || loadingVacc) return <LoadingSpinner />;
  if (!pet) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFoundEmoji}>🔍</Text>
        <Text style={styles.notFoundText}>Pet não encontrado.</Text>
      </View>
    );
  }

  const speciesColor = SPECIES_COLORS[pet.species] ?? colors.speciesOther;
  const emoji = SPECIES_EMOJI[pet.species] ?? '🐾';
  const birthFormatted = new Date(pet.birthDate).toLocaleDateString('pt-BR');

  const overdueCount = vaccinations?.filter((v) => {
    const next = new Date(v.nextDoseDate);
    return next < new Date();
  }).length ?? 0;

  const upToDateCount = (vaccinations?.length ?? 0) - overdueCount;

  return (
    <View style={styles.container}>
      <View style={[styles.heroSection, { backgroundColor: speciesColor }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.heroContent}>
          <View style={styles.heroAvatarContainer}>
            <Text style={styles.heroEmoji}>{emoji}</Text>
          </View>
          <Text style={styles.heroName}>{pet.name}</Text>
          <Text style={styles.heroBreed}>
            {SPECIES_LABELS[pet.species]}
            {pet.breed ? ` · ${pet.breed}` : ''}
          </Text>
          <Text style={styles.heroBirth}>Nascimento: {birthFormatted}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{vaccinations?.length ?? 0}</Text>
            <Text style={styles.statLabel}>Vacinas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.success }]}>{upToDateCount}</Text>
            <Text style={styles.statLabel}>Em dia</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, overdueCount > 0 && { color: colors.danger }]}>
              {overdueCount}
            </Text>
            <Text style={styles.statLabel}>Atrasadas</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={vaccinations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>💉</Text>
            <Text style={styles.sectionTitle}>Histórico de Vacinação</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>💉</Text>
            <Text style={styles.emptyTitle}>Sem vacinas registradas</Text>
            <Text style={styles.emptySub}>
              Toque no botão + para registrar{'\n'}a primeira vacina de {pet.name}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <VaccinationCard
            vaccineName={item.vaccine?.name ?? 'Vacina'}
            lastApplicationDate={String(item.applicationDate)}
            intervalMonths={item.vaccine?.periodicityMonths ?? 12}
            veterinarian={item.veterinarian}
          />
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push(`/pet/${id}/vaccination`)}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>💉</Text>
        <Text style={styles.fabLabel}>Vacinar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  notFoundEmoji: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  notFoundText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
  },
  heroSection: {
    paddingTop: 50,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.xxl,
    borderBottomRightRadius: radius.xxl,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: spacing.lg,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backText: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: '300',
    marginTop: -2,
  },
  heroContent: {
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  heroAvatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  heroEmoji: {
    fontSize: 40,
  },
  heroName: {
    fontSize: fontSize.hero,
    fontWeight: '800',
    color: '#FFF',
  },
  heroBreed: {
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    marginTop: 2,
  },
  heroBirth: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.65)',
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: '#FFF',
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
    marginTop: 2,
  },
  list: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  sectionEmoji: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  emptySub: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    ...shadow.lg,
  },
  fabIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  fabLabel: {
    color: colors.textInverse,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
