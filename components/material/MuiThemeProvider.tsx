'use client';

/**
 * Material-UI Theme Provider
 *
 * 本组件提供 Material-UI 的主题上下文，确保应用中的所有 Material-UI 组件
 * 都能使用统一的主题配置。
 */

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

/**
 * Material-UI Theme Provider 组件
 */
export function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
