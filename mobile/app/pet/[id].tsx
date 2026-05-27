import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SectionList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePet } from '../../src/presentation/hooks/usePets';
import { useVaccinations } from '../../src/presentation/hooks/useVaccinations';
import { useGrooming } from '../../src/presentation/hooks/useGrooming';
import { VaccinationCard } from '../../src/presentation/components/vaccination/VaccinationCard';
import { GroomingCard } from '../../src/presentation/components/grooming/GroomingCard';
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
  const { data: groomings, isLoading: loadingGroom } = useGrooming(id);

  if (loadingPet || loadingVacc || loadingGroom) return <LoadingSpinner />;
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

  const overdueCount = vaccinations?.filter((v) => new Date(v.nextDoseDate) < new Date()).length ?? 0;
  const upToDateCount = (vaccinations?.length ?? 0) - overdueCount;

  const totalSpent = groomings?.reduce((sum, g) => sum + (g.price ?? 0), 0) ?? 0;

  return (
    <View style={styles.container}>
      {/* Hero */}
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
            {SPECIES_LABELS[pet.species]}{pet.breed ? ` · ${pet.breed}` : ''}
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
            <Text style={styles.statNumber}>{groomings?.length ?? 0}</Text>
            <Text style={styles.statLabel}>Banhos</Text>
          </View>
          {totalSpent > 0 && (
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>R${totalSpent.toFixed(0)}</Text>
              <Text style={styles.statLabel}>Gastos</Text>
            </View>
          )}
        </View>
      </View>

      {/* Content */}
      <FlatList
        data={[]}
        renderItem={() => null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            {/* Vaccinations */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEmoji}>💉</Text>
              <Text style={styles.sectionTitle}>Vacinação</Text>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => router.push(`/pet/${id}/vaccination`)}
              >
                <Text style={styles.addBtnText}>+ Vacinar</Text>
              </TouchableOpacity>
            </View>

            {vaccinations && vaccinations.length > 0 ? (
              vaccinations.map((item) => (
                <VaccinationCard
                  key={item.id}
                  vaccineName={item.vaccine?.name ?? 'Vacina'}
                  lastApplicationDate={String(item.applicationDate)}
                  intervalMonths={item.vaccine?.periodicityMonths ?? 12}
                  veterinarian={item.veterinarian}
                />
              ))
            ) : (
              <View style={styles.emptySection}>
                <Text style={styles.emptySectionText}>
                  Nenhuma vacina registrada.{'\n'}Toque em "+ Vacinar" acima.
                </Text>
              </View>
            )}

            {/* Grooming */}
            <View style={[styles.sectionHeader, { marginTop: spacing.xxl }]}>
              <Text style={styles.sectionEmoji}>🛁</Text>
              <Text style={styles.sectionTitle}>Banho & Tosa</Text>
              <TouchableOpacity
                style={[styles.addBtn, { backgroundColor: '#E0F7FA' }]}
                onPress={() => router.push(`/pet/${id}/grooming`)}
              >
                <Text style={[styles.addBtnText, { color: '#00838F' }]}>+ Banho</Text>
              </TouchableOpacity>
            </View>

            {groomings && groomings.length > 0 ? (
              groomings.map((item) => (
                <GroomingCard key={item.id} record={item} />
              ))
            ) : (
              <View style={styles.emptySection}>
                <Text style={styles.emptySectionText}>
                  Nenhum banho registrado.{'\n'}Toque em "+ Banho" acima.
                </Text>
              </View>
            )}

            <View style={{ height: 80 }} />
          </View>
        }
      />

      {/* FABs */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: '#00ACC1' }]}
          onPress={() => router.push(`/pet/${id}/grooming`)}
          activeOpacity={0.85}
        >
          <Text style={styles.fabIcon}>🛁</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => router.push(`/pet/${id}/vaccination`)}
          activeOpacity={0.85}
        >
          <Text style={styles.fabIcon}>💉</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  notFoundEmoji: { fontSize: 48, marginBottom: spacing.lg },
  notFoundText: { fontSize: fontSize.lg, color: colors.textSecondary },

  heroSection: {
    paddingTop: 50, paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.xxl, borderBottomRightRadius: radius.xxl,
  },
  backButton: {
    position: 'absolute', top: 50, left: spacing.lg,
    width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center', zIndex: 10,
  },
  backText: { fontSize: 24, color: '#FFF', fontWeight: '300', marginTop: -2 },
  heroContent: { alignItems: 'center', paddingTop: spacing.xl },
  heroAvatarContainer: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md,
  },
  heroEmoji: { fontSize: 40 },
  heroName: { fontSize: fontSize.hero, fontWeight: '800', color: '#FFF' },
  heroBreed: { fontSize: fontSize.md, color: 'rgba(255,255,255,0.85)', fontWeight: '500', marginTop: 2 },
  heroBirth: { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.65)', marginTop: spacing.xs },

  statsRow: { flexDirection: 'row', marginHorizontal: spacing.xl, marginTop: spacing.xl, gap: spacing.sm },
  statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center' },
  statNumber: { fontSize: fontSize.lg, fontWeight: '800', color: '#FFF' },
  statLabel: { fontSize: fontSize.xs, color: 'rgba(255,255,255,0.75)', fontWeight: '500', marginTop: 2 },

  list: { padding: spacing.lg, paddingBottom: 40 },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg, marginTop: spacing.sm,
  },
  sectionEmoji: { fontSize: 18, marginRight: spacing.sm },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, flex: 1 },
  addBtn: {
    backgroundColor: colors.primarySoft, borderRadius: radius.full,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
  },
  addBtnText: { fontSize: fontSize.sm, fontWeight: '700', color: colors.primary },

  emptySection: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.xxl, alignItems: 'center', ...shadow.sm,
  },
  emptySectionText: {
    fontSize: fontSize.md, color: colors.textMuted, textAlign: 'center', lineHeight: 22,
  },

  fabContainer: {
    position: 'absolute', right: spacing.xl, bottom: spacing.xl,
    gap: spacing.md,
  },
  fab: {
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', ...shadow.lg,
  },
  fabIcon: { fontSize: 24 },
});
