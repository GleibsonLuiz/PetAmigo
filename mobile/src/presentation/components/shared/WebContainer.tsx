import React from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { colors, spacing } from '../../../shared/theme';

interface WebContainerProps {
  children: React.ReactNode;
  maxWidth?: number;
}

export function WebContainer({ children, maxWidth = 960 }: WebContainerProps) {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  if (!isWeb || width <= 700) return <>{children}</>;

  return (
    <View style={styles.outer}>
      <View style={[styles.inner, { maxWidth }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },
  inner: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.background,
  },
});
