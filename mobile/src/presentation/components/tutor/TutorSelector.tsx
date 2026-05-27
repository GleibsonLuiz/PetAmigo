import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Tutor } from '../../../domain/entities/Tutor';
import { colors, spacing, radius, fontSize, shadow } from '../../../shared/theme';

interface TutorSelectorProps {
  tutors: Tutor[];
  activeTutorId: string | null;
  onSelect: (tutor: Tutor) => void;
  onAddNew: () => void;
}

export function TutorSelector({ tutors, activeTutorId, onSelect, onAddNew }: TutorSelectorProps) {
  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={tutors}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          <TouchableOpacity style={styles.addButton} onPress={onAddNew} activeOpacity={0.7}>
            <Text style={styles.addIcon}>+</Text>
            <Text style={styles.addLabel}>Novo</Text>
          </TouchableOpacity>
        }
        renderItem={({ item }) => {
          const isActive = item.id === activeTutorId;
          return (
            <TouchableOpacity
              style={[styles.tutorItem, isActive && styles.tutorItemActive]}
              onPress={() => onSelect(item)}
              activeOpacity={0.7}
            >
              <View style={[styles.avatar, isActive && styles.avatarActive]}>
                <Text style={styles.avatarText}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={[styles.name, isActive && styles.nameActive]} numberOfLines={1}>
                {item.name.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  list: {
    paddingRight: spacing.lg,
  },
  tutorItem: {
    alignItems: 'center',
    marginRight: spacing.md,
    width: 68,
  },
  tutorItemActive: {},
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  avatarText: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  name: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
    fontWeight: '500',
    textAlign: 'center',
  },
  nameActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  addButton: {
    alignItems: 'center',
    width: 68,
  },
  addIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    textAlign: 'center',
    lineHeight: 44,
    fontSize: 22,
    color: colors.textMuted,
  },
  addLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
});
