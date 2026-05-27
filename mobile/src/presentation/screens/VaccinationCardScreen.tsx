import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePet } from '../hooks/usePets';
import { useVaccinations } from '../hooks/useVaccinations';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { WebContainer } from '../components/shared/WebContainer';
import {
  colors,
  spacing,
  radius,
  fontSize,
  shadow,
  SPECIES_EMOJI,
  SPECIES_LABELS,
} from '../../shared/theme';

function formatDateBR(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR');
}

function calculateAge(birthDate: Date | string): string {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();
  const totalMonths = years * 12 + months;

  if (totalMonths < 12) return `${totalMonths} mes${totalMonths !== 1 ? 'es' : ''}`;
  const y = Math.floor(totalMonths / 12);
  const m = totalMonths % 12;
  if (m === 0) return `${y} ano${y > 1 ? 's' : ''}`;
  return `${y} ano${y > 1 ? 's' : ''} e ${m} mes${m > 1 ? 'es' : ''}`;
}

export function VaccinationCardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: pet, isLoading: loadingPet } = usePet(id);
  const { data: vaccinations, isLoading: loadingVacc } = useVaccinations(id);

  if (loadingPet || loadingVacc) return <LoadingSpinner />;
  if (!pet) return null;

  const emoji = SPECIES_EMOJI[pet.species] ?? '🐾';
  const speciesLabel = SPECIES_LABELS[pet.species] ?? pet.species;
  const sorted = [...(vaccinations ?? [])].sort(
    (a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime(),
  );

  const allUpToDate = sorted.every((v) => new Date(v.nextDoseDate) >= new Date());

  return (
    <WebContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Card Header */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardLogoRow}>
              <Text style={styles.cardLogo}>🐾</Text>
              <View>
                <Text style={styles.cardTitle}>PetAmigo</Text>
                <Text style={styles.cardSubtitle}>Carteira de Vacinação</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, allUpToDate ? styles.statusOk : styles.statusAlert]}>
              <Text style={styles.statusText}>
                {allUpToDate ? '✅ Em dia' : '⚠️ Pendente'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Pet Info */}
          <View style={styles.petSection}>
            <View style={styles.petAvatar}>
              <Text style={styles.petEmoji}>{emoji}</Text>
            </View>
            <View style={styles.petDetails}>
              <Text style={styles.petName}>{pet.name}</Text>
              <View style={styles.petInfoGrid}>
                <View style={styles.petInfoItem}>
                  <Text style={styles.petInfoLabel}>Espécie</Text>
                  <Text style={styles.petInfoValue}>{speciesLabel}</Text>
                </View>
                {pet.breed && (
                  <View style={styles.petInfoItem}>
                    <Text style={styles.petInfoLabel}>Raça</Text>
                    <Text style={styles.petInfoValue}>{pet.breed}</Text>
                  </View>
                )}
                <View style={styles.petInfoItem}>
                  <Text style={styles.petInfoLabel}>Nascimento</Text>
                  <Text style={styles.petInfoValue}>{formatDateBR(pet.birthDate)}</Text>
                </View>
                <View style={styles.petInfoItem}>
                  <Text style={styles.petInfoLabel}>Idade</Text>
                  <Text style={styles.petInfoValue}>{calculateAge(pet.birthDate)}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* QR Code placeholder */}
          <View style={styles.qrSection}>
            <View style={styles.qrBox}>
              <Text style={styles.qrEmoji}>📱</Text>
              <Text style={styles.qrText}>ID: {pet.id.substring(0, 8).toUpperCase()}</Text>
            </View>
            <Text style={styles.qrHint}>
              Apresente esta carteira no veterinário ou petshop
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Vaccination Records */}
          <Text style={styles.recordsTitle}>Registro de Vacinas</Text>

          {sorted.length === 0 ? (
            <View style={styles.emptyRecords}>
              <Text style={styles.emptyText}>Nenhuma vacina registrada</Text>
            </View>
          ) : (
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { flex: 2 }]}>Vacina</Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>Data</Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>Próxima</Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>Status</Text>
              </View>
              {sorted.map((v, i) => {
                const isOverdue = new Date(v.nextDoseDate) < new Date();
                return (
                  <View
                    key={v.id}
                    style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}
                  >
                    <View style={{ flex: 2 }}>
                      <Text style={styles.cellName}>{v.vaccine?.name ?? 'Vacina'}</Text>
                      {v.veterinarian && (
                        <Text style={styles.cellVet}>Dr(a). {v.veterinarian}</Text>
                      )}
                    </View>
                    <Text style={[styles.cellText, { flex: 1 }]}>
                      {formatDateBR(v.applicationDate)}
                    </Text>
                    <Text style={[styles.cellText, { flex: 1 }]}>
                      {formatDateBR(v.nextDoseDate)}
                    </Text>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <View style={[styles.statusPill, isOverdue ? styles.pillOverdue : styles.pillOk]}>
                        <Text style={[styles.pillText, isOverdue ? styles.pillTextOverdue : styles.pillTextOk]}>
                          {isOverdue ? 'Atrasada' : 'Em dia'}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Documento gerado em {formatDateBR(new Date())}
            </Text>
            <Text style={styles.footerText}>
              PetAmigo — Cuidado e amor pelos seus pets
            </Text>
          </View>
        </View>

        {/* Print Button (web only) */}
        {Platform.OS === 'web' && (
          <TouchableOpacity
            style={styles.printButton}
            onPress={() => window.print()}
            activeOpacity={0.85}
          >
            <Text style={styles.printIcon}>🖨️</Text>
            <Text style={styles.printText}>Imprimir Carteira</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </WebContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },

  card: {
    backgroundColor: '#FFF', borderRadius: radius.xl, padding: spacing.xxl,
    ...shadow.lg, borderWidth: 1, borderColor: colors.borderLight,
  },

  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  cardLogoRow: { flexDirection: 'row', alignItems: 'center' },
  cardLogo: { fontSize: 28, marginRight: spacing.md },
  cardTitle: { fontSize: fontSize.xl, fontWeight: '800', color: colors.primary },
  cardSubtitle: { fontSize: fontSize.xs, color: colors.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  statusBadge: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full,
  },
  statusOk: { backgroundColor: colors.successSoft },
  statusAlert: { backgroundColor: colors.warningSoft },
  statusText: { fontSize: fontSize.xs, fontWeight: '700' },

  divider: {
    height: 1, backgroundColor: colors.divider, marginVertical: spacing.lg,
  },

  petSection: { flexDirection: 'row', alignItems: 'flex-start' },
  petAvatar: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primarySoft,
    justifyContent: 'center', alignItems: 'center', marginRight: spacing.lg,
  },
  petEmoji: { fontSize: 32 },
  petDetails: { flex: 1 },
  petName: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  petInfoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  petInfoItem: { minWidth: 100 },
  petInfoLabel: { fontSize: fontSize.xs, color: colors.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  petInfoValue: { fontSize: fontSize.md, fontWeight: '600', color: colors.text, marginTop: 2 },

  qrSection: { alignItems: 'center' },
  qrBox: {
    width: 100, height: 100, borderRadius: radius.lg,
    backgroundColor: colors.background, borderWidth: 2, borderColor: colors.border,
    justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md,
  },
  qrEmoji: { fontSize: 32, marginBottom: spacing.xs },
  qrText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.textSecondary, fontFamily: Platform.OS === 'web' ? 'monospace' : undefined },
  qrHint: { fontSize: fontSize.xs, color: colors.textMuted, textAlign: 'center' },

  recordsTitle: {
    fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginBottom: spacing.md,
  },

  emptyRecords: { padding: spacing.xxl, alignItems: 'center' },
  emptyText: { color: colors.textMuted, fontSize: fontSize.md },

  table: { borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.borderLight },
  tableHeader: {
    flexDirection: 'row', backgroundColor: colors.primary, padding: spacing.md,
  },
  tableHeaderText: {
    fontSize: fontSize.xs, fontWeight: '700', color: '#FFF', textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row', padding: spacing.md, alignItems: 'center',
  },
  tableRowAlt: { backgroundColor: colors.background },
  cellName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text },
  cellVet: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 1 },
  cellText: { fontSize: fontSize.sm, color: colors.textSecondary },
  statusPill: {
    paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.full,
  },
  pillOk: { backgroundColor: colors.successSoft },
  pillOverdue: { backgroundColor: colors.dangerSoft },
  pillText: { fontSize: fontSize.xs, fontWeight: '700' },
  pillTextOk: { color: colors.success },
  pillTextOverdue: { color: colors.danger },

  footer: {
    marginTop: spacing.xl, paddingTop: spacing.lg, borderTopWidth: 1,
    borderTopColor: colors.divider, alignItems: 'center',
  },
  footerText: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },

  printButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg,
    marginTop: spacing.xl, ...shadow.md,
  },
  printIcon: { fontSize: 18, marginRight: spacing.sm },
  printText: { color: '#FFF', fontSize: fontSize.md, fontWeight: '700' },
});
