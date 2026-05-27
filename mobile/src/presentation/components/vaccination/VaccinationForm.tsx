import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { Vaccine, CreateVaccinationInput } from '../../../domain/entities/Vaccination';
import { colors, spacing, radius, fontSize, shadow } from '../../../shared/theme';

interface VaccinationFormProps {
  petId: string;
  petName: string;
  vaccines: Vaccine[];
  onSubmit: (data: CreateVaccinationInput) => void;
  isLoading?: boolean;
}

export function VaccinationForm({
  petId,
  petName,
  vaccines,
  onSubmit,
  isLoading,
}: VaccinationFormProps) {
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);
  const [applicationDate, setApplicationDate] = useState('');
  const [veterinarian, setVeterinarian] = useState('');
  const [notes, setNotes] = useState('');
  const [vaccineModalVisible, setVaccineModalVisible] = useState(false);

  const handleDateChange = (text: string) => {
    const digits = text.replace(/\D/g, '');
    let formatted = '';
    if (digits.length > 0) formatted = digits.substring(0, 2);
    if (digits.length > 2) formatted += '/' + digits.substring(2, 4);
    if (digits.length > 4) formatted += '/' + digits.substring(4, 8);
    setApplicationDate(formatted);
  };

  const handleSubmit = () => {
    if (!selectedVaccine) {
      Alert.alert('Campo obrigatório', 'Selecione a vacina.');
      return;
    }
    if (!applicationDate.trim()) {
      Alert.alert('Campo obrigatório', 'Informe a data de aplicação.');
      return;
    }

    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(applicationDate)) {
      Alert.alert('Data inválida', 'Use o formato DD/MM/AAAA.');
      return;
    }

    const [day, month, year] = applicationDate.split('/').map(Number);
    const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    onSubmit({
      petId,
      vaccineId: selectedVaccine.id,
      applicationDate: isoDate,
      veterinarian: veterinarian.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={styles.petBanner}>
        <Text style={styles.petBannerEmoji}>💉</Text>
        <Text style={styles.petBannerText}>Registrar vacina de {petName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Vacina *</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setVaccineModalVisible(true)}
          activeOpacity={0.7}
        >
          {selectedVaccine ? (
            <View style={styles.selectedRow}>
              <Text style={styles.selectedEmoji}>💉</Text>
              <View>
                <Text style={styles.selectedText}>{selectedVaccine.name}</Text>
                <Text style={styles.selectedSub}>
                  A cada {selectedVaccine.periodicityMonths} meses
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.placeholderText}>Selecionar vacina...</Text>
          )}
          <Text style={styles.arrow}>▾</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Data de Aplicação *</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>📅</Text>
          <TextInput
            style={[styles.input, { paddingLeft: 40 }]}
            value={applicationDate}
            onChangeText={handleDateChange}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        <Text style={styles.label}>Veterinário</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>👨‍⚕️</Text>
          <TextInput
            style={[styles.input, { paddingLeft: 40 }]}
            value={veterinarian}
            onChangeText={setVeterinarian}
            placeholder="Nome do veterinário"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="words"
          />
        </View>

        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Anotações sobre a vacina..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
        activeOpacity={0.85}
      >
        <Text style={styles.submitIcon}>{isLoading ? '⏳' : '✓'}</Text>
        <Text style={styles.submitButtonText}>
          {isLoading ? 'Registrando...' : 'Registrar Vacina'}
        </Text>
      </TouchableOpacity>

      {/* Vaccine Selector Modal */}
      <Modal
        visible={vaccineModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setVaccineModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Vacina</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setVaccineModalVisible(false)}
              >
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={vaccines}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyModal}>
                  <Text style={styles.emptyModalText}>Nenhuma vacina disponível para esta espécie.</Text>
                </View>
              }
              renderItem={({ item }) => {
                const isSelected = selectedVaccine?.id === item.id;
                return (
                  <TouchableOpacity
                    style={[styles.vaccineItem, isSelected && styles.vaccineItemActive]}
                    onPress={() => {
                      setSelectedVaccine(item);
                      setVaccineModalVisible(false);
                    }}
                    activeOpacity={0.6}
                  >
                    <View style={styles.vaccineItemInfo}>
                      <Text style={[styles.vaccineItemName, isSelected && styles.vaccineItemNameActive]}>
                        {item.name}
                      </Text>
                      <Text style={styles.vaccineItemSub}>
                        Periodicidade: {item.periodicityMonths} meses
                      </Text>
                      {item.description && (
                        <Text style={styles.vaccineItemDesc}>{item.description}</Text>
                      )}
                    </View>
                    {isSelected && (
                      <View style={styles.checkCircle}>
                        <Text style={styles.checkMark}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  petBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primarySoft, padding: spacing.lg, marginBottom: spacing.lg,
  },
  petBannerEmoji: { fontSize: 24, marginRight: spacing.sm },
  petBannerText: { fontSize: fontSize.md, fontWeight: '700', color: colors.primary },

  section: {
    backgroundColor: colors.surface, borderRadius: radius.xl,
    marginHorizontal: spacing.lg, padding: spacing.xl, ...shadow.sm,
  },
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
  textArea: { minHeight: 80, paddingTop: spacing.md },
  selector: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1.5, borderColor: colors.borderLight, borderRadius: radius.md,
    padding: spacing.md, backgroundColor: colors.background,
  },
  selectedRow: { flexDirection: 'row', alignItems: 'center' },
  selectedEmoji: { fontSize: 20, marginRight: spacing.md },
  selectedText: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  selectedSub: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 1 },
  placeholderText: { fontSize: fontSize.md, color: colors.textMuted },
  arrow: { fontSize: 14, color: colors.textMuted },

  submitButton: {
    flexDirection: 'row', backgroundColor: colors.primary, borderRadius: radius.lg,
    padding: spacing.lg, alignItems: 'center', justifyContent: 'center',
    marginHorizontal: spacing.lg, marginTop: spacing.xxl, marginBottom: 50, ...shadow.md,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitIcon: { fontSize: 18, marginRight: spacing.sm },
  submitButtonText: { color: colors.textInverse, fontSize: fontSize.lg, fontWeight: '700' },

  modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: colors.surface, borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl, maxHeight: '75%', paddingBottom: spacing.xxl,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border,
    alignSelf: 'center', marginTop: spacing.md, marginBottom: spacing.sm,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.xl, paddingVertical: spacing.lg,
  },
  modalTitle: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text },
  modalCloseBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.background,
    justifyContent: 'center', alignItems: 'center',
  },
  modalClose: { fontSize: 14, color: colors.textSecondary, fontWeight: '700' },

  vaccineItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: spacing.lg, paddingHorizontal: spacing.xl,
    borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  vaccineItemActive: { backgroundColor: colors.primarySoft },
  vaccineItemInfo: { flex: 1 },
  vaccineItemName: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  vaccineItemNameActive: { color: colors.primary },
  vaccineItemSub: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 2 },
  vaccineItemDesc: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 4 },
  checkCircle: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center', marginLeft: spacing.md,
  },
  checkMark: { fontSize: 13, color: colors.textInverse, fontWeight: '700' },
  emptyModal: { padding: spacing.xxxl, alignItems: 'center' },
  emptyModalText: { color: colors.textMuted, fontSize: fontSize.md, textAlign: 'center' },
});
