import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeightRecord } from '../../../domain/entities/Weight';
import { colors, spacing, radius, fontSize, shadow } from '../../../shared/theme';

interface WeightChartProps {
  records: WeightRecord[];
}

function formatMonth(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
}

export function WeightChart({ records }: WeightChartProps) {
  if (records.length === 0) return null;

  const sorted = [...records].sort(
    (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
  );

  const weights = sorted.map((r) => r.weightKg);
  const maxW = Math.max(...weights);
  const minW = Math.min(...weights);
  const range = maxW - minW || 1;

  const current = weights[weights.length - 1];
  const previous = weights.length > 1 ? weights[weights.length - 2] : null;
  const diff = previous !== null ? current - previous : null;

  const chartHeight = 140;
  const barWidth = Math.max(20, Math.min(40, 300 / sorted.length));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>⚖️ Peso</Text>
          <Text style={styles.currentWeight}>{current.toFixed(1)} kg</Text>
        </View>
        {diff !== null && (
          <View style={[styles.diffBadge, diff > 0 ? styles.diffUp : diff < 0 ? styles.diffDown : styles.diffSame]}>
            <Text style={styles.diffText}>
              {diff > 0 ? '▲' : diff < 0 ? '▼' : '—'} {Math.abs(diff).toFixed(1)} kg
            </Text>
          </View>
        )}
      </View>

      <View style={styles.chartArea}>
        <View style={[styles.chart, { height: chartHeight }]}>
          {sorted.map((r, i) => {
            const h = ((r.weightKg - minW) / range) * (chartHeight - 30) + 30;
            const isLast = i === sorted.length - 1;
            return (
              <View key={r.id} style={styles.barColumn}>
                <Text style={[styles.barValue, isLast && styles.barValueActive]}>
                  {r.weightKg.toFixed(1)}
                </Text>
                <View
                  style={[
                    styles.bar,
                    {
                      height: h,
                      width: barWidth,
                      backgroundColor: isLast ? colors.primary : colors.primaryLight + '60',
                    },
                  ]}
                />
                <Text style={styles.barLabel}>{formatMonth(r.recordedAt)}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {sorted.length >= 2 && (
        <View style={styles.rangeRow}>
          <Text style={styles.rangeText}>Min: {minW.toFixed(1)} kg</Text>
          <Text style={styles.rangeText}>Max: {maxW.toFixed(1)} kg</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.lg, ...shadow.md, marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  title: { fontSize: fontSize.md, fontWeight: '700', color: colors.text },
  currentWeight: { fontSize: fontSize.hero, fontWeight: '800', color: colors.primary, marginTop: 2 },
  diffBadge: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full,
  },
  diffUp: { backgroundColor: colors.warningSoft },
  diffDown: { backgroundColor: colors.successSoft },
  diffSame: { backgroundColor: colors.background },
  diffText: { fontSize: fontSize.sm, fontWeight: '700', color: colors.text },

  chartArea: { marginBottom: spacing.md },
  chart: {
    flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 4,
  },
  barColumn: { alignItems: 'center' },
  barValue: { fontSize: 9, color: colors.textMuted, fontWeight: '600', marginBottom: 4 },
  barValueActive: { color: colors.primary, fontWeight: '800' },
  bar: { borderRadius: 4 },
  barLabel: { fontSize: 9, color: colors.textMuted, marginTop: 4 },

  rangeRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.divider,
  },
  rangeText: { fontSize: fontSize.xs, color: colors.textMuted },
});
