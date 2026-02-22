export const Colors = {
  // Primary brand colors
  primary: '#93C2C3',
  primaryLight: '#A8CFD0',
  primaryDark: '#7FB0B1',

  // Secondary colors
  secondary: '#F4EEDC',
  secondaryLight: '#F7F1E5',
  secondaryDark: '#F0E7D1',

  // Accent colors
  accent: '#1D2B28',
  accentLight: '#2A3F3A',
  accentDark: '#151F1C',

  // UI colors
  background: '#93C2C3',
  surface: '#F4EEDC',
  surfaceDark: '#1D2B28',

  // Text colors
  text: '#1D2B28',
  textDark: '#000000',
  textLight: '#2A3F3A',
  textSecondary: '#5A6B68',

  // Status colors
  success: '#2dd36f',
  warning: '#ffc409',
  danger: '#eb445a',
  error: '#eb445a',
  info: '#3880ff',

  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  gray: '#808080',
  lightGray: '#f5f5f5',
  darkGray: '#333333',

  // Transparent
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 15,
  xl: 20,
  round: 999,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  title: 40,
  hero: 48,
};

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.18)',
  md: '0 2px 4px rgba(0,0,0,0.25)',
  lg: '0 4px 8px rgba(0,0,0,0.30)',
};

export const Layout = {
  maxWidth: 600,
  headerHeight: 60,
  tabBarHeight: 60,
};
