import { Platform } from 'react-native';

export const COLORS = {
  background: '#0F0F1A',
  card: '#1A1A2E',
  cardSecondary: '#16213E',
  accent: '#6C63FF',
  accentLight: '#8B85FF',
  accentDark: '#4A42DD',
  income: '#00D09C',
  incomeLight: '#00F0B5',
  incomeBg: 'rgba(0, 208, 156, 0.12)',
  expense: '#FF6B6B',
  expenseLight: '#FF8E8E',
  expenseBg: 'rgba(255, 107, 107, 0.12)',
  textPrimary: '#FFFFFF',
  textSecondary: '#8A8A9A',
  textMuted: '#555570',
  border: '#2A2A3E',
  borderLight: '#3A3A5E',
  overlay: 'rgba(0,0,0,0.6)',
  white: '#FFFFFF',
  black: '#000000',
  food: '#FF8C42',
  transport: '#4ECDC4',
  shopping: '#A78BFA',
  entertainment: '#F472B6',
  bills: '#FBBF24',
  health: '#F87171',
  education: '#34D399',
  travel: '#60A5FA',
  salary: '#00D09C',
  investment: '#10B981',
  other: '#9CA3AF',
};

export const FONTS = {
  sizes: { xs: 11, sm: 13, md: 15, lg: 17, xl: 20, xxl: 24, xxxl: 32, hero: 42 },
};

export const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 };

export const RADIUS = { sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, full: 999 };

export const SHADOWS = {
  sm: Platform.select({
    web: { boxShadow: '0px 2px 8px rgba(108, 99, 255, 0.2)' },
    default: { shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
  }),
  md: Platform.select({
    web: { boxShadow: '0px 4px 16px rgba(108, 99, 255, 0.25)' },
    default: { shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 },
  }),
  lg: Platform.select({
    web: { boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.35)' },
    default: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 10 },
  }),
};
