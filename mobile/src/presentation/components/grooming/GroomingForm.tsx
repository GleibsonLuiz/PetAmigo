import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { notify } from '../../../shared/utils/notify';
import {
  GroomingServiceType,
  CreateGroomingInput,
  SERVICE_TYPE_LABELS,
  SERVICE_TYPE_EMOJI,
} from '../../../domain/entities/Grooming';
import { colors, spacing, radius, fontSize, shadow } from '../../../shared/theme';

interface GroomingFormProps {
  petId: string;
  petName: string;
  onSubmit: (data: CreateGroomingInput) => void;
  isLoading?: boolean;
}

const SERVICE_OPTIONS: { type: GroomingServiceType; label: string; emoji: string }[] = [
  { type: 'bath', label: 'Banho', emoji: '🛁' },
  { type: 'bath_grooming', label: 'Banho + Tosa', emoji: '🛁✂️' },
  { type: 'hygienic_grooming', label: 'Tosa Higiênica', emoji: '✂️' },
  { type: 'full_grooming', label: 'Tosa Completa', emoji: '💇' },
];

export function GroomingForm({ petId, petName, onSubmit, isLoading }: GroomingFormProps) {
  const [serviceType, setServiceType] = useState<GroomingServiceType>('bath');
  const [location, setLocation] = useState('');
  const [groomingDate, setGroomingDate] = useState('');
  const [nextDate, setNextDate] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');

  const handleDateChange = (text: string, setter: (v: string) => void) => {
    const digits = text.replace(/\D/g, '');
    let formatted = '';
    if (digits.length > 0) formatted = digits.substring(0, 2);
    if (digits.length > 2) formatted += '/' + digits.substring(2, 4);
    if (digits.length > 4) formatted += '/' + digits.substring(4, 8);
    setter(formatted);
  };

  const handlePriceChange = (text: string) => {
    const cleaned = text.replace(/[^0-9,\.]/g, '').replace(',', '.');
    setPrice(cleaned);
  };

  const parseDate = (dateStr: string): string | null => {
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(dateStr)) return null;
    const [day, month, year] = dateStr.split('/').map(Number);
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (!location.trim()) {
      notify('Campo obrigatório', 'Informe o local do banho.');
      return;
    }
    if (!groomingDate.trim()) {
      notify('Campo obrigatório', 'Informe a data do banho.');
      return;
    }
    const isoDate = parseDate(groomingDate);
    if (!isoDate) {
      notify('Data inválida', 'Use o formato DD/MM/AAAA.');
      return;
    }
    const isoNextDate = nextDate.trim() ? parseDate(nextDate) : undefined;
    if (nextDate.trim() && !isoNextDate) {
      notify('Data inválida', 'Próximo banho: use DD/MM/AAAA.');
      return;
    }

    onSubmit({
      petId,
      serviceType,
      location: location.trim(),
      groomingDate: isoDate,
      nextDate: isoNextDate ?? undefined,
      price: price ? parseFloat(price) : undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={styles.banner}>
        <Text style={styles.bannerEmoji}>🛁</Text>
        <Text style={styles.bannerText}>Registrar banho de {petName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipo de Serviço</Text>
        <View style={styles.serviceGrid}>
          {SERVICE_OPTIONS.map((opt) => {
            const isActive = serviceType === opt.type;
            return (
              <TouchableOpacity
                key={opt.type}
                style={[styles.serviceCard, isActive && styles.serviceCardActive]}
                onPress={() => setServiceType(opt.type)}
                activeOpacity={0.7}
              >
                <Text style={styles.serviceEmoji}>{opt.emoji}</Text>
                <Text style={[styles.serviceLabel, isActive && styles.serviceLabelActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Local *</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>📍</Text>
          <TextInput
            style={[styles.input, { paddingLeft: 40 }]}
            value={location}
            onChangeText={setLocation}
            placeholder="Ex: PetShop Amigo, Em casa..."
            placeholderTextColor={colors.textMuted}
            autoCapitalize="words"
          />
        </View>

        <Text style={styles.label}>Data do Banho *</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>📅</Text>
          <TextInput
            style={[styles.input, { paddingLeft: 40 }]}
            value={groomingDate}
            onChangeText={(t) => handleDateChange(t, setGroomingDate)}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        <Text style={styles.label}>Próximo Banho</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>🔄</Text>
          <TextInput
            style={[styles.input, { paddingLeft: 40 }]}
            value={nextDate}
            onChangeText={(t) => handleDateChange(t, setNextDate)}
            placeholder="DD/MM/AAAA (opcional)"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        <Text style={styles.label}>Valor (R$)</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>💰</Text>
          <TextInput
            style={[styles.input, { paddingLeft: 40 }]}
            value={price}
            onChangeText={handlePriceChange}
            placeholder="0.00"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
          />
        </View>

        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Anotações..."
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
          {isLoading ? 'Registrando...' : 'Registrar Banho'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  banner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#E0F7FA', padding: spacing.lg, marginBottom: spacing.lg,
  },
  bannerEmoji: { fontSize: 24, marginRight: spacing.sm },
  bannerText: { fontSize: fontSize.md, fontWeight: '700', color: '#00838F' },
  section: {
    backgroundColor: colors.surface, borderRadius: radius.xl,
    marginHorizontal: spacing.lg, padding: spacing.xl, ...shadow.sm,
  },
  sectionTitle: {
    fontSize: fontSize.xs, fontWeight: '700', color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.md,
  },
  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  serviceCard: {
    flex: 1, minWidth: '45%', alignItems: 'center', paddingVertical: spacing.md,
    borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  serviceCardActive: { backgroundColor: '#E0F7FA', borderColor: '#00ACC1' },
  serviceEmoji: { fontSize: 24, marginBottom: spacing.xs },
  serviceLabel: { fontSize: fontSize.xs, fontWeight: '500', color: colors.textSecondary },
  serviceLabelActive: { color: '#00838F', fontWeight: '700' },
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
  submitButton: {
    flexDirection: 'row', backgroundColor: '#00ACC1', borderRadius: radius.lg,
    padding: spacing.lg, alignItems: 'center', justifyContent: 'center',
    marginHorizontal: spacing.lg, marginTop: spacing.xxl, marginBottom: 50, ...shadow.md,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitIcon: { fontSize: 18, marginRight: spacing.sm },
  submitButtonText: { color: colors.textInverse, fontSize: fontSize.lg, fontWeight: '700' },
});
