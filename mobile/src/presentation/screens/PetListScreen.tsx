import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { usePets } from '../hooks/usePets';
import { useTutors } from '../hooks/useTutors';
import { usePetStore } from '../stores/petStore';
import { useTutorStore } from '../stores/tutorStore';
import { TutorSelector } from '../components/tutor/TutorSelector';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { Pet } from '../../domain/entities/Pet';
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

export function PetListScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: pets, isLoading, error } = usePets();
  const { data: tutors, isLoading: loadingTutors } = useTutors();
  const { selectPet } = usePetStore();
  const { activeTutorId, setActiveTutor } = useTutorStore();

  useEffect(() => {
    if (!activeTutorId && tutors?.length) {
      setActiveTutor(tutors[0]);
    }
  }, [tutors, activeTutorId]);

  const handleSelectTutor = (tutor: Tutor) => {
    setActiveTutor(tutor);
    queryClient.invalidateQueries({ queryKey: ['pets'] });
  };

  const handlePressPet = (pet: Pet) => {
    selectPet(pet);
    router.push(`/pet/${pet.id}`);
  };

  if (isLoading || loadingTutors) return <LoadingSpinner />;

  if (!tutors?.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyEmoji}>👤</Text>
        <Text style={styles.emptyTitle}>Cadastre um tutor</Text>
        <Text style={styles.emptySub}>Para começar, cadastre o tutor responsável.</Text>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/tutor/new')}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorEmoji}>😿</Text>
        <Text style={styles.errorText}>Ops! Algo deu errado.</Text>
        <Text style={styles.errorSub}>Não foi possível carregar seus pets.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {tutors && tutors.length > 1 && (
              <TutorSelector
                tutors={tutors}
                activeTutorId={activeTutorId}
                onSelect={handleSelectTutor}
                onAddNew={() => router.push('/tutor/new')}
              />
            )}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                {pets && pets.length > 0
                  ? `${pets.length} pet${pets.length > 1 ? 's' : ''} cadastrado${pets.length > 1 ? 's' : ''}`
                  : ''}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🐾</Text>
            <Text style={styles.emptyTitle}>Nenhum pet ainda</Text>
            <Text style={styles.emptySub}>
              Toque no botão + para cadastrar{'\n'}seu primeiro amiguinho!
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const speciesColor = SPECIES_COLORS[item.species] ?? colors.speciesOther;
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handlePressPet(item)}
              activeOpacity={0.7}
            >
              <View style={[styles.avatarContainer, { backgroundColor: speciesColor + '20' }]}>
                {item.photoUrl ? (
                  <Image source={{ uri: item.photoUrl }} style={styles.avatar} />
                ) : (
                  <Text style={styles.avatarEmoji}>
                    {SPECIES_EMOJI[item.species] ?? '🐾'}
                  </Text>
                )}
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.petName}>{item.name}</Text>
                <View style={styles.speciesBadge}>
                  <View style={[styles.speciesDot, { backgroundColor: speciesColor }]} />
                  <Text style={styles.speciesText}>
                    {SPECIES_LABELS[item.species] ?? item.species}
                  </Text>
                  {item.breed && (
                    <>
                      <Text style={styles.speciesDivider}>·</Text>
                      <Text style={styles.breedText}>{item.breed}</Text>
                    </>
                  )}
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/pet/new')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
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
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxxl,
    backgroundColor: colors.background,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  errorText: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  errorSub: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    marginTop: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySub: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
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
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.xl,
  },
  avatarEmoji: {
    fontSize: 26,
  },
  cardInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  petName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 3,
  },
  speciesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  speciesDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  speciesText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  speciesDivider: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginHorizontal: spacing.xs,
  },
  breedText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  chevron: {
    fontSize: 24,
    color: colors.textMuted,
    fontWeight: '300',
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadow.lg,
  },
  fabText: {
    color: colors.textInverse,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '300',
  },
});
