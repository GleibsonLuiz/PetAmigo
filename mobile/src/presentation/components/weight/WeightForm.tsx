import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { CreateWeightInput } from '../../../domain/entities/Weight';
import { notify } from '../../../shared/utils/notify';
import { colors, spacing, radius, fontSize, shadow } from '../../../shared/theme';

interface WeightFormProps {
  petId: string;
  petName: string;
  lastWeight?: number;
  onSubmit: (data: CreateWeightInput) => void;
  isLoading?: boolean;
}

export function WeightForm({ petId, petName, lastWeight, onSubmit, isLoading }: WeightFormProps) {
  const [weight, setWeight] = useState(lastWeight?.toString() ?? '');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleDateChange = (text: string) => {
    const digits = text.replace(/\D/g, '');
    let formatted = '';
    if (digits.length > 0) formatted = digits.substring(0, 2);
    if (digits.length > 2) formatted += '/' + digits.substring(2, 4);
    if (digits.length > 4) formatted += '/' + digits.substring(4, 8);
    setDate(formatted);
  };

  const handleWeightChange = (text: string) => {
    setWeight(text.replace(/[^0-9,\.]/g, '').replace(',', '.'));
  };

  const handleSubmit = () => {
    const w = parseFloat(weight);
    if (!weight || isNaN(w) || w <= 0) {
      notify('Campo obrigatório', 'Informe o peso (em kg).');
      return;
    }
    if (!date.trim()) {
      notify('Campo obrigatório', 'Informe a data da pesagem.');
      return;
    }
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(date)) {
      notify('Data inválida', 'Use o formato DD/MM/AAAA.');
      return;
    }
    const [day, month, year] = date.split('/').map(Number);
    const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    onSubmit({
      petId,
      weightKg: w,
      recordedAt: isoDate,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={styles.banner}>
        <Text style={styles.bannerEmoji}>⚖️</Text>
        <Text style={styles.bannerText}>Registrar peso de {petName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Peso (kg) *</Text>
        <View style={styles.weightInputRow}>
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.inputIcon}>⚖️</Text>
            <TextInput
              style={[styles.input, styles.weightInput]}
              value={weight}
              onChangeText={handleWeightChange}
              placeholder="0.0"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              autoFocus
            />
          </View>
          <Text style={styles.kgLabel}>kg</Text>
        </View>

        <Text style={styles.label}>Data da pesagem *</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>📅</Text>
          <TextInput
            style={[styles.input, { paddingLeft: 40 }]}
            value={date}
            onChangeText={handleDateChange}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Ex: Pesado no veterinário, após consulta..."
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
          {isLoading ? 'Salvando...' : 'Registrar Peso'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  banner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primarySoft, padding: spacing.lg, marginBottom: spacing.lg,
  },
  bannerEmoji: { fontSize: 24, marginRight: spacing.sm },
  bannerText: { fontSize: fontSize.md, fontWeight: '700', color: colors.primary },
  section: {
    backgroundColor: colors.surface, borderRadius: radius.xl,
    marginHorizontal: spacing.lg, padding: spacing.xl, ...shadow.sm,
  },
  label: {
    fontSize: fontSize.sm, fontWeight: '600', color: colors.text,
    marginBottom: spacing.sm, marginTop: spacing.lg,
  },
  weightInputRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  inputContainer: { position: 'relative' },
  inputIcon: { position: 'absolute', left: 12, top: 12, fontSize: 16, zIndex: 1 },
  input: {
    borderWidth: 1.5, borderColor: colors.borderLight, borderRadius: radius.md,
    padding: spacing.md, fontSize: fontSize.md, backgroundColor: colors.background, color: colors.text,
  },
  weightInput: { paddingLeft: 40, fontSize: 28, fontWeight: '800', textAlign: 'center' },
  kgLabel: { fontSize: fontSize.xl, fontWeight: '700', color: colors.textSecondary },
  textArea: { minHeight: 80, paddingTop: spacing.md },
  submitButton: {
    flexDirection: 'row', backgroundColor: colors.primary, borderRadius: radius.lg,
    padding: spacing.lg, alignItems: 'center', justifyContent: 'center',
    marginHorizontal: spacing.lg, marginTop: spacing.xxl, marginBottom: 50, ...shadow.md,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitIcon: { fontSize: 18, marginRight: spacing.sm },
  submitButtonText: { color: colors.textInverse, fontSize: fontSize.lg, fontWeight: '700' },
});
