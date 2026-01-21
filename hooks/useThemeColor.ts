'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getThemeColors, 
  type ThemeColors, 
  type AIRole 
} from '@/lib/theme-colors';

export function useThemeColor(role: AIRole) {
  const [themeColors, setThemeColors] = useState<ThemeColors>(() => getThemeColors(role));

  const updateThemeColors = useCallback((newRole: AIRole) => {
    const colors = getThemeColors(newRole);
    setThemeColors(colors);
    
    applyThemeColors(colors);
  }, []);

  const applyThemeColors = useCallback((colors: ThemeColors) => {
    const root = document.documentElement;
    
    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-gradient', colors.gradient);
    root.style.setProperty('--theme-secondary', colors.secondary);
    root.style.setProperty('--theme-bg', colors.bg);
    root.style.setProperty('--theme-text', colors.text);
    root.style.setProperty('--theme-border', colors.border);
    root.style.setProperty('--theme-shadow', colors.shadow);
  }, []);

  useEffect(() => {
    updateThemeColors(role);
  }, [role, updateThemeColors]);

  return {
    themeColors,
    updateThemeColors,
    applyThemeColors,
  };
}

export default useThemeColor;
