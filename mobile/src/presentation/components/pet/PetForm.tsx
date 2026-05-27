import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Modal,
  FlatList,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CreatePetInput, PetSpecies } from '../../../domain/entities/Pet';
import { BREEDS_BY_SPECIES } from '../../../shared/data/breeds';
import {
  colors,
  spacing,
  radius,
  fontSize,
  shadow,
  SPECIES_EMOJI,
  SPECIES_COLORS,
} from '../../../shared/theme';

interface PetFormProps {
  onSubmit: (data: CreatePetInput) => void;
  isLoading?: boolean;
  initialData?: Partial<CreatePetInput>;
}

const SPECIES_OPTIONS: { label: string; value: PetSpecies; emoji: string }[] = [
  { label: 'Cachorro', value: 'dog', emoji: '🐕' },
  { label: 'Gato', value: 'cat', emoji: '🐱' },
  { label: 'Pássaro', value: 'bird', emoji: '🐦' },
  { label: 'Coelho', value: 'rabbit', emoji: '🐰' },
  { label: 'Outro', value: 'other', emoji: '🐾' },
];

export function PetForm({ onSubmit, isLoading, initialData }: PetFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [species, setSpecies] = useState<PetSpecies>(initialData?.species ?? 'dog');
  const [breed, setBreed] = useState(initialData?.breed ?? '');
  const [birthDate, setBirthDate] = useState(initialData?.birthDate ?? '');
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl ?? '');
  const [breedModalVisible, setBreedModalVisible] = useState(false);
  const [breedSearch, setBreedSearch] = useState('');

  const filteredBreeds = useMemo(() => {
    const allBreeds = BREEDS_BY_SPECIES[species] ?? [];
    if (!breedSearch.trim()) return allBreeds;
    const query = breedSearch.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    return allBreeds.filter((b) =>
      b.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(query),
    );
  }, [species, breedSearch]);

  const handleSpeciesChange = (newSpecies: PetSpecies) => {
    setSpecies(newSpecies);
    setBreed('');
    setBreedSearch('');
  };

  const handleSelectBreed = (selectedBreed: string) => {
    setBreed(selectedBreed);
    setBreedModalVisible(false);
    setBreedSearch('');
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUrl(result.assets[0].uri);
    }
  };

  const handleBirthDateChange = (text: string) => {
    const digits = text.replace(/\D/g, '');
    let formatted = '';
    if (digits.length > 0) formatted = digits.substring(0, 2);
    if (digits.length > 2) formatted += '/' + digits.substring(2, 4);
    if (digits.length > 4) formatted += '/' + digits.substring(4, 8);
    setBirthDate(formatted);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o nome do pet.');
      return;
    }
    if (!birthDate.trim()) {
      Alert.alert('Campo obrigatório', 'Informe a data de nascimento.');
      return;
    }

    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(birthDate)) {
      Alert.alert('Data inválida', 'Use o formato DD/MM/AAAA.');
      return;
    }

    const [day, month, year] = birthDate.split('/').map(Number);
    const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    onSubmit({
      name: name.trim(),
      species,
      breed: breed.trim() || undefined,
      birthDate: isoDate,
      photoUrl: photoUrl || undefined,
    });
  };

  const speciesColor = SPECIES_COLORS[species] ?? colors.speciesOther;

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.photoContainer} onPress={handlePickImage} activeOpacity={0.8}>
        {photoUrl ? (
          <Image source={{ uri: photoUrl }} style={styles.photo} />
        ) : (
          <View style={[styles.photoPlaceholder, { backgroundColor: speciesColor + '15' }]}>
            <Text style={styles.photoEmoji}>{SPECIES_EMOJI[species] ?? '🐾'}</Text>
            <Text style={styles.photoHint}>Adicionar foto</Text>
          </View>
        )}
        <View style={styles.photoBadge}>
          <Text style={styles.photoBadgeText}>📷</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações Básicas</Text>

        <Text style={styles.label}>Nome do Pet *</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ex: Rex, Luna, Thor..."
            placeholderTextColor={colors.textMuted}
            autoCapitalize="words"
          />
        </View>

        <Text style={styles.label}>Espécie *</Text>
        <View style={styles.speciesGrid}>
          {SPECIES_OPTIONS.map((option) => {
            const isActive = species === option.value;
            const optColor = SPECIES_COLORS[option.value] ?? colors.speciesOther;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.speciesCard,
                  isActive && { backgroundColor: optColor + '15', borderColor: optColor },
                ]}
                onPress={() => handleSpeciesChange(option.value)}
                activeOpacity={0.7}
              >
                <Text style={styles.speciesEmoji}>{option.emoji}</Text>
                <Text style={[styles.speciesLabel, isActive && { color: optColor, fontWeight: '700' }]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Raça</Text>
        <TouchableOpacity
          style={styles.breedSelector}
          onPress={() => setBreedModalVisible(true)}
          activeOpacity={0.7}
        >
          {breed ? (
            <View style={styles.breedSelected}>
              <View style={[styles.breedDot, { backgroundColor: speciesColor }]} />
              <Text style={styles.breedText}>{breed}</Text>
            </View>
          ) : (
            <Text style={styles.breedPlaceholder}>Selecionar raça...</Text>
          )}
          <Text style={styles.breedArrow}>▾</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Data de Nascimento *</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>📅</Text>
          <TextInput
            style={[styles.input, { paddingLeft: 40 }]}
            value={birthDate}
            onChangeText={handleBirthDateChange}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
        activeOpacity={0.85}
      >
        <Text style={styles.submitIcon}>{isLoading ? '⏳' : '✓'}</Text>
        <Text style={styles.submitButtonText}>
          {isLoading ? 'Salvando...' : 'Cadastrar Pet'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={breedModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setBreedModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Selecionar Raça</Text>
                <Text style={styles.modalSubtitle}>
                  {filteredBreeds.length} raça{filteredBreeds.length !== 1 ? 's' : ''} disponíve{filteredBreeds.length !== 1 ? 'is' : 'l'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => { setBreedModalVisible(false); setBreedSearch(''); }}
              >
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                value={breedSearch}
                onChangeText={setBreedSearch}
                placeholder="Buscar raça..."
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
              />
            </View>

            <FlatList
              data={filteredBreeds}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptySearchContainer}>
                  <Text style={styles.emptySearchEmoji}>🔍</Text>
                  <Text style={styles.emptySearch}>Nenhuma raça encontrada</Text>
                </View>
              }
              renderItem={({ item }) => {
                const isSelected = breed === item;
                return (
                  <TouchableOpacity
                    style={[styles.breedItem, isSelected && styles.breedItemActive]}
                    onPress={() => handleSelectBreed(item)}
                    activeOpacity={0.6}
                  >
                    <Text style={[styles.breedItemText, isSelected && styles.breedItemTextActive]}>
                      {item}
                    </Text>
                    {isSelected && (
                      <View style={styles.checkCircle}>
                        <Text style={styles.checkMark}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />

            {breed !== '' && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => { setBreed(''); setBreedModalVisible(false); setBreedSearch(''); }}
                activeOpacity={0.7}
              >
                <Text style={styles.clearButtonText}>Limpar seleção</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  photoContainer: {
    alignSelf: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
  photo: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: colors.primarySoft,
  },
  photoPlaceholder: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  photoEmoji: {
    fontSize: 42,
    marginBottom: spacing.xs,
  },
  photoHint: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  photoBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadow.md,
  },
  photoBadgeText: {
    fontSize: 16,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    marginHorizontal: spacing.lg,
    padding: spacing.xl,
    ...shadow.sm,
  },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  inputContainer: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
    fontSize: 16,
    zIndex: 1,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    backgroundColor: colors.background,
    color: colors.text,
  },
  speciesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  speciesCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    backgroundColor: colors.background,
    minWidth: 70,
    flex: 1,
  },
  speciesEmoji: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  speciesLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  breedSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  breedSelected: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  breedText: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '500',
  },
  breedPlaceholder: {
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
  breedArrow: {
    fontSize: 14,
    color: colors.textMuted,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.xxl,
    marginBottom: 50,
    ...shadow.md,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  submitButtonText: {
    color: colors.textInverse,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    maxHeight: '85%',
    paddingBottom: spacing.xxl,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  modalSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
  },
  breedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  breedItemActive: {
    backgroundColor: colors.primarySoft,
  },
  breedItemText: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  breedItemTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    fontSize: 13,
    color: colors.textInverse,
    fontWeight: '700',
  },
  emptySearchContainer: {
    alignItems: 'center',
    padding: spacing.xxxl,
  },
  emptySearchEmoji: {
    fontSize: 32,
    marginBottom: spacing.md,
  },
  emptySearch: {
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
  clearButton: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  clearButtonText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
});
