import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { usePets } from '../../src/presentation/hooks/usePets';
import { useVaccinations } from '../../src/presentation/hooks/useVaccinations';
import { LoadingSpinner } from '../../src/presentation/components/shared/LoadingSpinner';
import { WebContainer } from '../../src/presentation/components/shared/WebContainer';
import {
  colors,
  spacing,
  radius,
  fontSize,
  shadow,
  SPECIES_EMOJI,
  SPECIES_COLORS,
} from '../../src/shared/theme';

function PetVaccineStatus({ petId, petName, species }: { petId: string; petName: string; species: string }) {
  const { data: vaccinations } = useVaccinations(petId);
  const router = useRouter();

  const overdueCount = vaccinations?.filter((v) => new Date(v.nextDoseDate) < new Date()).length ?? 0;
  const nextVaccine = vaccinations
    ?.filter((v) => new Date(v.nextDoseDate) >= new Date())
    .sort((a, b) => new Date(a.nextDoseDate).getTime() - new Date(b.nextDoseDate).getTime())[0];

  const speciesColor = SPECIES_COLORS[species] ?? colors.speciesOther;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/pet/${petId}`)}
      activeOpacity={0.7}
    >
      <View style={[styles.cardAvatar, { backgroundColor: speciesColor + '20' }]}>
        <Text style={styles.cardEmoji}>{SPECIES_EMOJI[species] ?? '🐾'}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{petName}</Text>
        {overdueCount > 0 ? (
          <View style={styles.alertRow}>
            <View style={[styles.alertDot, { backgroundColor: colors.danger }]} />
            <Text style={styles.alertText}>
              {overdueCount} vacina{overdueCount > 1 ? 's' : ''} atrasada{overdueCount > 1 ? 's' : ''}
            </Text>
          </View>
        ) : nextVaccine ? (
          <View style={styles.alertRow}>
            <View style={[styles.alertDot, { backgroundColor: colors.success }]} />
            <Text style={styles.okText}>
              Próxima: {new Date(nextVaccine.nextDoseDate).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        ) : (
          <Text style={styles.noVaccText}>Sem vacinas registradas</Text>
        )}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

export default function VaccinesTab() {
  const { data: pets, isLoading } = usePets();

  if (isLoading) return <LoadingSpinner />;

  return (
    <WebContainer>
    <View style={styles.container}>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>💉</Text>
            <Text style={styles.headerTitle}>Controle de Vacinação</Text>
            <Text style={styles.headerSub}>
              Acompanhe as vacinas de todos os seus pets
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🐾</Text>
            <Text style={styles.emptyTitle}>Nenhum pet cadastrado</Text>
            <Text style={styles.emptySub}>Cadastre um pet para controlar suas vacinas.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <PetVaccineStatus petId={item.id} petName={item.name} species={item.species} />
        )}
      />
    </View>
    </WebContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  header: {
    marginBottom: spacing.xl,
  },
  headerEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.text,
  },
  headerSub: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.md,
  },
  cardAvatar: {
    width: 48,
    height: 48,
    borderRadius: radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  cardName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  alertText: {
    fontSize: fontSize.sm,
    color: colors.danger,
    fontWeight: '600',
  },
  okText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  noVaccText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  chevron: {
    fontSize: 24,
    color: colors.textMuted,
    fontWeight: '300',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  emptySub: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
