import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, spacing } from '../../../shared/theme';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Carregando...' }: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    marginTop: spacing.lg,
    fontSize: fontSize.md,
    color: colors.textMuted,
    fontWeight: '500',
  },
});
