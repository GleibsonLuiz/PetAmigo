import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  GroomingRecord,
  SERVICE_TYPE_LABELS,
  SERVICE_TYPE_EMOJI,
  GroomingServiceType,
} from '../../../domain/entities/Grooming';
import { colors, spacing, radius, fontSize, shadow } from '../../../shared/theme';

interface GroomingCardProps {
  record: GroomingRecord;
}

function daysUntil(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  return Math.ceil((d.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
}

export function GroomingCard({ record }: GroomingCardProps) {
  const type = record.serviceType as GroomingServiceType;
  const label = SERVICE_TYPE_LABELS[type] ?? record.serviceType;
  const emoji = SERVICE_TYPE_EMOJI[type] ?? '🛁';
  const dateFormatted = new Date(record.groomingDate).toLocaleDateString('pt-BR');
  const hasNext = !!record.nextDate;
  const nextFormatted = hasNext ? new Date(record.nextDate!).toLocaleDateString('pt-BR') : null;
  const daysToNext = hasNext ? daysUntil(record.nextDate!) : null;
  const isOverdue = daysToNext !== null && daysToNext < 0;
  const isUpcoming = daysToNext !== null && daysToNext >= 0 && daysToNext <= 3;

  const stripeColor = isOverdue ? colors.danger : isUpcoming ? colors.warning : '#00ACC1';

  return (
    <View style={styles.card}>
      <View style={[styles.stripe, { backgroundColor: stripeColor }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={styles.title}>{label}</Text>
          </View>
          {record.price != null && (
            <Text style={styles.price}>R$ {record.price.toFixed(2)}</Text>
          )}
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📍 Local</Text>
            <Text style={styles.detailValue}>{record.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📅 Data</Text>
            <Text style={styles.detailValue}>{dateFormatted}</Text>
          </View>
          {hasNext && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>🔄 Próximo</Text>
              <Text style={[
                styles.detailValue,
                isOverdue && { color: colors.danger, fontWeight: '700' },
                isUpcoming && { color: colors.warning, fontWeight: '700' },
              ]}>
                {nextFormatted}
                {daysToNext !== null && (
                  isOverdue
                    ? ` (${Math.abs(daysToNext)}d atraso)`
                    : daysToNext === 0
                      ? ' (Hoje!)'
                      : ` (${daysToNext}d)`
                )}
              </Text>
            </View>
          )}
        </View>

        {record.notes && (
          <Text style={styles.notes}>{record.notes}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', backgroundColor: colors.surface,
    borderRadius: radius.lg, marginBottom: spacing.md, overflow: 'hidden', ...shadow.md,
  },
  stripe: { width: 4 },
  content: { flex: 1, padding: spacing.lg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: spacing.md,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  emoji: { fontSize: 16, marginRight: spacing.sm },
  title: { fontSize: fontSize.md, fontWeight: '700', color: colors.text },
  price: {
    fontSize: fontSize.md, fontWeight: '800', color: '#00838F',
    backgroundColor: '#E0F7FA', paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs, borderRadius: radius.full,
  },
  details: {
    backgroundColor: colors.background, borderRadius: radius.sm,
    padding: spacing.md, gap: spacing.sm,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: fontSize.sm, color: colors.textMuted },
  detailValue: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text },
  notes: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: spacing.md, fontStyle: 'italic' },
});
