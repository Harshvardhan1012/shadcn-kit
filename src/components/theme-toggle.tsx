'use client'

import { MoonIcon, SunIcon } from '@/components/ui/icons'
import { useTheme } from 'next-themes'
import { Button } from './ui/button'

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()

  // Determine the current mode (light/dark) and preserve the color theme when toggling
  const toggleTheme = () => {
    const isCurrentlyDark =
      resolvedTheme === 'dark' || (theme && theme.startsWith('dark'))
    const isCurrentlyLight =
      resolvedTheme === 'light' || (theme && theme.startsWith('light'))

    // Extract color theme if it exists
    let colorPart = ''
    if (theme && theme.includes('-')) {
      colorPart = '-' + theme.split('-')[1]
    }

    if (isCurrentlyDark) {
      setTheme(`light${colorPart}`)
    } else if (isCurrentlyLight) {
      setTheme(`dark${colorPart}`)
    } else {
      // Fallback for 'system' theme
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }
  }

  // Determine if we're in dark mode for styling icons
  const isDarkMode =
    resolvedTheme === 'dark' || (theme && theme.startsWith('dark'))

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}>
      <SunIcon
        className={`h-5 w-5 transition-all ${
          isDarkMode ? '-rotate-90 scale-0' : 'rotate-0 scale-100'
        }`}
      />
      <MoonIcon
        className={`absolute h-5 w-5 transition-all ${
          isDarkMode ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
