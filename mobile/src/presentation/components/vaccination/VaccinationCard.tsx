import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useVaccinationScheduler } from '../../hooks/useVaccinationScheduler';
import { colors, spacing, radius, fontSize, shadow } from '../../../shared/theme';

interface VaccinationCardProps {
  vaccineName: string;
  lastApplicationDate: string;
  intervalMonths: number;
  veterinarian?: string;
}

const STATUS_CONFIG = {
  overdue: {
    color: colors.danger,
    bg: colors.dangerSoft,
    label: 'Atrasada',
    emoji: '⚠️',
  },
  upcoming: {
    color: colors.warning,
    bg: colors.warningSoft,
    label: 'Próxima',
    emoji: '⏰',
  },
  ok: {
    color: colors.success,
    bg: colors.successSoft,
    label: 'Em dia',
    emoji: '✅',
  },
} as const;

export function VaccinationCard({
  vaccineName,
  lastApplicationDate,
  intervalMonths,
  veterinarian,
}: VaccinationCardProps) {
  const { formattedNextDose, daysUntilNextDose, status } = useVaccinationScheduler({
    lastApplicationDate,
    intervalMonths,
  });

  const config = STATUS_CONFIG[status];

  return (
    <View style={styles.card}>
      <View style={[styles.statusStripe, { backgroundColor: config.color }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.emoji}>💉</Text>
            <Text style={styles.vaccineName}>{vaccineName}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: config.bg }]}>
            <Text style={styles.badgeEmoji}>{config.emoji}</Text>
            <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Próxima dose</Text>
            <Text style={styles.detailValue}>{formattedNextDose}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {status === 'overdue' ? 'Atraso' : 'Faltam'}
            </Text>
            <Text style={[styles.detailValue, status === 'overdue' && { color: config.color }]}>
              {status === 'overdue'
                ? `${Math.abs(daysUntilNextDose)} dia(s)`
                : `${daysUntilNextDose} dia(s)`}
            </Text>
          </View>
        </View>

        {veterinarian && (
          <View style={styles.vetRow}>
            <Text style={styles.vetEmoji}>👨‍⚕️</Text>
            <Text style={styles.vetText}>{veterinarian}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadow.md,
  },
  statusStripe: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  vaccineName: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginLeft: spacing.sm,
  },
  badgeEmoji: {
    fontSize: 10,
    marginRight: 4,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  details: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    padding: spacing.md,
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  detailValue: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  vetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  vetEmoji: {
    fontSize: 12,
    marginRight: spacing.xs,
  },
  vetText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: '500',
  },
});
