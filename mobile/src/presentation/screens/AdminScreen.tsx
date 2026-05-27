import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../infrastructure/api/client';
import { useAuthStore } from '../stores/authStore';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { colors, spacing, radius, fontSize, shadow } from '../../shared/theme';

interface AdminStats {
  total_tutors: string;
  total_admins: string;
  total_pets: string;
  total_vaccinations: string;
  total_groomings: string;
  new_users_30d: string;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  tutor_id: string | null;
  tutor_phone: string | null;
  pet_count: string;
  created_at: string;
}

function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ['admin', 'stats'],
    queryFn: () => api.get('/admin/stats'),
  });
}

function useAdminUsers() {
  return useQuery<AdminUser[]>({
    queryKey: ['admin', 'users'],
    queryFn: () => api.get('/admin/users'),
  });
}

export function AdminScreen() {
  const user = useAuthStore((s) => s.user);
  const { data: stats, isLoading: loadingStats, refetch: refetchStats } = useAdminStats();
  const { data: users, isLoading: loadingUsers, refetch: refetchUsers } = useAdminUsers();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchStats(), refetchUsers()]);
    setRefreshing(false);
  };

  if (loadingStats || loadingUsers) return <LoadingSpinner />;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🛡️</Text>
        <Text style={styles.headerTitle}>Painel Admin</Text>
        <Text style={styles.headerSub}>Logado como {user?.name}</Text>
      </View>

      {/* Stats Grid */}
      {stats && (
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>📊 Visão Geral</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.primarySoft }]}>
              <Text style={styles.statEmoji}>👥</Text>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.total_tutors}</Text>
              <Text style={styles.statLabel}>Tutores</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
              <Text style={styles.statEmoji}>🐾</Text>
              <Text style={[styles.statNumber, { color: colors.success }]}>{stats.total_pets}</Text>
              <Text style={styles.statLabel}>Pets</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
              <Text style={styles.statEmoji}>💉</Text>
              <Text style={[styles.statNumber, { color: colors.warning }]}>{stats.total_vaccinations}</Text>
              <Text style={styles.statLabel}>Vacinas</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#E0F7FA' }]}>
              <Text style={styles.statEmoji}>🛁</Text>
              <Text style={[styles.statNumber, { color: '#00838F' }]}>{stats.total_groomings}</Text>
              <Text style={styles.statLabel}>Banhos</Text>
            </View>
          </View>
          <View style={styles.highlightCard}>
            <Text style={styles.highlightEmoji}>📈</Text>
            <View>
              <Text style={styles.highlightNumber}>{stats.new_users_30d}</Text>
              <Text style={styles.highlightLabel}>novos usuários nos últimos 30 dias</Text>
            </View>
          </View>
        </View>
      )}

      {/* Users List */}
      <View style={styles.usersSection}>
        <Text style={styles.sectionTitle}>👥 Usuários Cadastrados ({users?.length ?? 0})</Text>
        {users?.map((u) => (
          <View key={u.id} style={styles.userCard}>
            <View style={[styles.userAvatar, u.role === 'admin' && styles.userAvatarAdmin]}>
              <Text style={styles.userAvatarText}>
                {u.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <View style={styles.userNameRow}>
                <Text style={styles.userName}>{u.name}</Text>
                {u.role === 'admin' && (
                  <View style={styles.adminBadge}>
                    <Text style={styles.adminBadgeText}>Admin</Text>
                  </View>
                )}
              </View>
              <Text style={styles.userEmail}>{u.email}</Text>
              <View style={styles.userMeta}>
                {u.tutor_phone && (
                  <Text style={styles.userMetaItem}>📱 {u.tutor_phone}</Text>
                )}
                <Text style={styles.userMetaItem}>🐾 {u.pet_count} pets</Text>
                <Text style={styles.userMetaItem}>
                  📅 {new Date(u.created_at).toLocaleDateString('pt-BR')}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  header: { marginBottom: spacing.xl },
  headerEmoji: { fontSize: 32, marginBottom: spacing.sm },
  headerTitle: { fontSize: fontSize.hero, fontWeight: '800', color: colors.text },
  headerSub: { fontSize: fontSize.md, color: colors.textSecondary, marginTop: spacing.xs },

  sectionTitle: {
    fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginBottom: spacing.md,
  },

  statsContainer: { marginBottom: spacing.xl },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  statCard: {
    width: '48%', flex: 1, minWidth: 140, borderRadius: radius.lg,
    padding: spacing.lg, alignItems: 'center', ...shadow.sm,
  },
  statEmoji: { fontSize: 24, marginBottom: spacing.sm },
  statNumber: { fontSize: fontSize.hero, fontWeight: '800' },
  statLabel: { fontSize: fontSize.xs, color: colors.textMuted, fontWeight: '600', marginTop: 2 },

  highlightCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: radius.lg, padding: spacing.lg, ...shadow.md,
  },
  highlightEmoji: { fontSize: 32, marginRight: spacing.lg },
  highlightNumber: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.primary },
  highlightLabel: { fontSize: fontSize.sm, color: colors.textSecondary },

  usersSection: { marginBottom: spacing.xl },
  userCard: {
    flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.lg, marginBottom: spacing.md, ...shadow.sm,
  },
  userAvatar: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primarySoft,
    justifyContent: 'center', alignItems: 'center',
  },
  userAvatarAdmin: { backgroundColor: '#FFF3E0' },
  userAvatarText: { fontSize: fontSize.lg, fontWeight: '700', color: colors.primary },
  userInfo: { flex: 1, marginLeft: spacing.lg },
  userNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  userName: { fontSize: fontSize.md, fontWeight: '700', color: colors.text },
  adminBadge: {
    backgroundColor: colors.warning, borderRadius: radius.full,
    paddingHorizontal: spacing.sm, paddingVertical: 2,
  },
  adminBadgeText: { fontSize: fontSize.xs, fontWeight: '700', color: '#FFF' },
  userEmail: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  userMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.sm },
  userMetaItem: { fontSize: fontSize.xs, color: colors.textMuted },
});
