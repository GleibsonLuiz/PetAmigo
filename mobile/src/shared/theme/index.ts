export const colors = {
  primary: '#6C63FF',
  primaryDark: '#5A52D5',
  primaryLight: '#8B85FF',
  primarySoft: '#EEF0FF',

  accent: '#FF6B6B',
  accentSoft: '#FFF0F0',

  success: '#4CAF50',
  successSoft: '#E8F5E9',
  warning: '#FFA726',
  warningSoft: '#FFF3E0',
  danger: '#EF5350',
  dangerSoft: '#FFEBEE',

  background: '#F5F6FA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  text: '#1A1D2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',

  border: '#E5E7EB',
  borderLight: '#F0F1F5',
  divider: '#F3F4F6',

  overlay: 'rgba(26, 29, 46, 0.5)',

  speciesDog: '#FF9F43',
  speciesCat: '#A29BFE',
  speciesBird: '#55E6C1',
  speciesRabbit: '#FF6B81',
  speciesOther: '#778CA3',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  hero: 32,
} as const;

export const shadow = {
  sm: {
    shadowColor: '#1A1D2E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#1A1D2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  lg: {
    shadowColor: '#1A1D2E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
} as const;

export const SPECIES_EMOJI: Record<string, string> = {
  dog: '🐕',
  cat: '🐱',
  bird: '🐦',
  rabbit: '🐰',
  other: '🐾',
};

export const SPECIES_COLORS: Record<string, string> = {
  dog: colors.speciesDog,
  cat: colors.speciesCat,
  bird: colors.speciesBird,
  rabbit: colors.speciesRabbit,
  other: colors.speciesOther,
};

export const SPECIES_LABELS: Record<string, string> = {
  dog: 'Cachorro',
  cat: 'Gato',
  bird: 'Pássaro',
  rabbit: 'Coelho',
  other: 'Outro',
};
