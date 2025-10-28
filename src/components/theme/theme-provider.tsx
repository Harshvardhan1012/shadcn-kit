'use client'

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

// Define the available color themes
export const colorThemes = ['default', 'boldtech', 'amber', 'custom']

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      forcedTheme={props.forcedTheme}
      enableSystem={props.enableSystem}
      enableColorScheme={true}
      attribute={props.attribute || 'data-theme'}
      defaultTheme={props.defaultTheme || 'system'}
      themes={[
        'light',
        'dark',
        // Include combination themes (light/dark + color)
        ...colorThemes.map((color) => `light-${color}`),
        ...colorThemes.map((color) => `dark-${color}`),
      ]}>
      {children}
    </NextThemesProvider>
  )
}
