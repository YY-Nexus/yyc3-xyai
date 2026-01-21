'use client';

export interface ThemeColors {
  primary: string;
  gradient: string;
  secondary: string;
  bg: string;
  text: string;
  border: string;
  shadow: string;
}

export type AIRole = 'companion' | 'recorder' | 'guardian' | 'listener' | 'advisor' | 'cultural';

export const ROLE_THEME_COLORS: Record<AIRole, ThemeColors> = {
  companion: {
    primary: '#667EEA',
    gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    secondary: '#764BA2',
    bg: 'rgba(102, 126, 234, 0.1)',
    text: '#667EEA',
    border: 'rgba(102, 126, 234, 0.3)',
    shadow: 'rgba(102, 126, 234, 0.2)',
  },
  recorder: {
    primary: '#38B2AC',
    gradient: 'linear-gradient(135deg, #38B2AC 0%, #319795 100%)',
    secondary: '#319795',
    bg: 'rgba(56, 178, 172, 0.1)',
    text: '#38B2AC',
    border: 'rgba(56, 178, 172, 0.3)',
    shadow: 'rgba(56, 178, 172, 0.2)',
  },
  guardian: {
    primary: '#E53E3E',
    gradient: 'linear-gradient(135deg, #E53E3E 0%, #C53030 100%)',
    secondary: '#C53030',
    bg: 'rgba(229, 62, 62, 0.1)',
    text: '#E53E3E',
    border: 'rgba(229, 62, 62, 0.3)',
    shadow: 'rgba(229, 62, 62, 0.2)',
  },
  listener: {
    primary: '#ED8936',
    gradient: 'linear-gradient(135deg, #ED8936 0%, #DD6B20 100%)',
    secondary: '#DD6B20',
    bg: 'rgba(237, 137, 54, 0.1)',
    text: '#ED8936',
    border: 'rgba(237, 137, 54, 0.3)',
    shadow: 'rgba(237, 137, 54, 0.2)',
  },
  advisor: {
    primary: '#805AD5',
    gradient: 'linear-gradient(135deg, #805AD5 0%, #6B46C1 100%)',
    secondary: '#6B46C1',
    bg: 'rgba(128, 90, 213, 0.1)',
    text: '#805AD5',
    border: 'rgba(128, 90, 213, 0.3)',
    shadow: 'rgba(128, 90, 213, 0.2)',
  },
  cultural: {
    primary: '#D69E2E',
    gradient: 'linear-gradient(135deg, #D69E2E 0%, #B7791F 100%)',
    secondary: '#B7791F',
    bg: 'rgba(214, 158, 46, 0.1)',
    text: '#D69E2E',
    border: 'rgba(214, 158, 46, 0.3)',
    shadow: 'rgba(214, 158, 46, 0.2)',
  },
};

export function getThemeColors(role: AIRole): ThemeColors {
  return ROLE_THEME_COLORS[role] || ROLE_THEME_COLORS.companion;
}

export function getThemeColor(role: AIRole, colorKey: keyof ThemeColors): string {
  const colors = getThemeColors(role);
  return colors[colorKey];
}

export function getThemeGradient(role: AIRole): string {
  return getThemeColor(role, 'gradient');
}

export function getThemePrimary(role: AIRole): string {
  return getThemeColor(role, 'primary');
}

export function getThemeSecondary(role: AIRole): string {
  return getThemeColor(role, 'secondary');
}

export function getThemeBg(role: AIRole): string {
  return getThemeColor(role, 'bg');
}

export function getThemeText(role: AIRole): string {
  return getThemeColor(role, 'text');
}

export function getThemeBorder(role: AIRole): string {
  return getThemeColor(role, 'border');
}

export function getThemeShadow(role: AIRole): string {
  return getThemeColor(role, 'shadow');
}
