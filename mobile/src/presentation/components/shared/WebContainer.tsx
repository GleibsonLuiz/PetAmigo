import React from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { colors } from '../../../shared/theme';

interface WebContainerProps {
  children: React.ReactNode;
  maxWidth?: number;
  noPadding?: boolean;
}

export function WebContainer({ children, maxWidth = 480, noPadding }: WebContainerProps) {
  const { width } = useWindowDimensions();
  const isWide = Platform.OS === 'web' && width > 600;

  if (!isWide) return <>{children}</>;

  return (
    <View style={styles.outer}>
      <View style={[styles.inner, { maxWidth }, noPadding && { padding: 0 }]}>
        {children}
      </View>
    </View>
  );
}

export function WebPageLayout({ children, sidebar }: { children: React.ReactNode; sidebar?: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width > 900;

  if (!isDesktop || !sidebar) {
    return <WebContainer>{children}</WebContainer>;
  }

  return (
    <View style={styles.desktopLayout}>
      <View style={styles.sidebarContainer}>{sidebar}</View>
      <View style={styles.mainContainer}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  desktopLayout: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background,
  },
  sidebarContainer: {
    width: 320,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  mainContainer: {
    flex: 1,
    maxWidth: 640,
  },
});
