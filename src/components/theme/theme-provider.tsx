'use client'

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

// Define the available color themes
export const colorThemes = ['default', 'red', 'rose', 'orange', 'green', 'blue']

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      forcedTheme={props.forcedTheme}
      enableSystem={props.enableSystem}
      enableColorScheme={true}
      attribute={props.attribute || 'class'}
      defaultTheme={props.defaultTheme || 'system'}
      themes={[
        'light',
        'dark',
        'system',
        // Include combination themes (light/dark + color)
        ...colorThemes.map((color) => `light-${color}`),
        ...colorThemes.map((color) => `dark-${color}`),
      ]}>
      {children}
    </NextThemesProvider>
  )
}
