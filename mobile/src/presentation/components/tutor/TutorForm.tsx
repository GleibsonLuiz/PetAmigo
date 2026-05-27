import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CreateTutorInput } from '../../../domain/entities/Tutor';
import { notify } from '../../../shared/utils/notify';
import { colors, spacing, radius, fontSize, shadow } from '../../../shared/theme';

interface TutorFormProps {
  onSubmit: (data: CreateTutorInput) => void;
  isLoading?: boolean;
  initialData?: Partial<CreateTutorInput>;
  submitLabel?: string;
}

export function TutorForm({ onSubmit, isLoading, initialData, submitLabel }: TutorFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [email, setEmail] = useState(initialData?.email ?? '');
  const [phone, setPhone] = useState(initialData?.phone ?? '');
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatarUrl ?? '');

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatarUrl(result.assets[0].uri);
    }
  };

  const handlePhoneChange = (text: string) => {
    const digits = text.replace(/\D/g, '');
    let formatted = '';
    if (digits.length > 0) formatted = '(' + digits.substring(0, 2);
    if (digits.length > 2) formatted += ') ' + digits.substring(2, 7);
    if (digits.length > 7) formatted += '-' + digits.substring(7, 11);
    setPhone(formatted);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      notify('Campo obrigatório', 'Informe o nome do tutor.');
      return;
    }
    onSubmit({
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      avatarUrl: avatarUrl || undefined,
    });
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.photoContainer} onPress={handlePickImage} activeOpacity={0.8}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoEmoji}>👤</Text>
            <Text style={styles.photoHint}>Adicionar foto</Text>
          </View>
        )}
        <View style={styles.photoBadge}>
          <Text style={styles.photoBadgeText}>📷</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados do Tutor</Text>

        <Text style={styles.label}>Nome completo *</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>👤</Text>
          <TextInput
            style={[styles.input, { paddingLeft: 40 }]}
            value={name}
            onChangeText={setName}
            placeholder="Ex: João Silva"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="words"
          />
        </View>

        <Text style={styles.label}>E-mail</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>✉️</Text>
          <TextInput
            style={[styles.input, { paddingLeft: 40 }]}
            value={email}
            onChangeText={setEmail}
            placeholder="joao@email.com"
            placeholderTextColor={colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.label}>Telefone</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>📱</Text>
          <TextInput
            style={[styles.input, { paddingLeft: 40 }]}
            value={phone}
            onChangeText={handlePhoneChange}
            placeholder="(11) 99999-9999"
            placeholderTextColor={colors.textMuted}
            keyboardType="phone-pad"
            maxLength={15}
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
          {isLoading ? 'Salvando...' : submitLabel ?? 'Cadastrar Tutor'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  photoContainer: { alignSelf: 'center', marginTop: spacing.xxl, marginBottom: spacing.lg },
  photo: { width: 130, height: 130, borderRadius: 65, borderWidth: 4, borderColor: colors.primarySoft },
  photoPlaceholder: {
    width: 130, height: 130, borderRadius: 65,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed',
    backgroundColor: colors.primarySoft,
  },
  photoEmoji: { fontSize: 42, marginBottom: spacing.xs },
  photoHint: { color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '600' },
  photoBadge: {
    position: 'absolute', bottom: 2, right: 2,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center',
    ...shadow.md,
  },
  photoBadgeText: { fontSize: 16 },
  section: {
    backgroundColor: colors.surface, borderRadius: radius.xl,
    marginHorizontal: spacing.lg, padding: spacing.xl, ...shadow.sm,
  },
  sectionTitle: {
    fontSize: fontSize.xs, fontWeight: '700', color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.lg,
  },
  label: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text, marginBottom: spacing.sm, marginTop: spacing.lg },
  inputContainer: { position: 'relative' },
  inputIcon: { position: 'absolute', left: 12, top: 12, fontSize: 16, zIndex: 1 },
  input: {
    borderWidth: 1.5, borderColor: colors.borderLight, borderRadius: radius.md,
    padding: spacing.md, fontSize: fontSize.md, backgroundColor: colors.background, color: colors.text,
  },
  submitButton: {
    flexDirection: 'row', backgroundColor: colors.primary, borderRadius: radius.lg,
    padding: spacing.lg, alignItems: 'center', justifyContent: 'center',
    marginHorizontal: spacing.lg, marginTop: spacing.xxl, marginBottom: 50, ...shadow.md,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitIcon: { fontSize: 18, marginRight: spacing.sm },
  submitButtonText: { color: colors.textInverse, fontSize: fontSize.lg, fontWeight: '700' },
});
