'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PaletteIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

// Color theme options
const colorThemes = [
  { name: 'Default', value: 'default' },
  { name: 'Red', value: 'red' },
  { name: 'Rose', value: 'rose' },
  { name: 'Orange', value: 'orange' },
  { name: 'Green', value: 'green' },
  { name: 'Blue', value: 'blue' },
]

export function ThemeSelector() {
  const { setTheme, theme, resolvedTheme } = useTheme()

  // Extract the color theme part from the theme string
  const currentColorTheme = theme?.includes('-')
    ? theme.split('-')[1]
    : 'default'

  // Function to set theme that preserves light/dark preference
  const setColorTheme = (colorTheme: string) => {
    // Get the current mode (dark or light) from various possible sources
    let baseTheme: string

    // First priority: If theme is explicitly dark or light
    if (theme === 'dark' || theme === 'light') {
      baseTheme = theme
    }
    // Second priority: If theme is a compound theme (like 'dark-blue')
    else if (theme && theme.includes('-')) {
      baseTheme = theme.startsWith('dark') ? 'dark' : 'light'
    }
    // Third priority: Use resolvedTheme (this accounts for 'system' preference)
    else if (resolvedTheme === 'dark' || resolvedTheme === 'light') {
      baseTheme = resolvedTheme
    }
    // Fallback if nothing else works
    else {
      baseTheme = 'light' // Safe default
    }

    // Set the theme - either plain (dark/light) or with color theme
    if (colorTheme === 'default') {
      setTheme(baseTheme)
    } else {
      setTheme(`${baseTheme}-${colorTheme}`)
    }
  }

  // Generate color indicator class based on theme
  const getColorClass = (themeValue: string) => {
    const colorMap: Record<string, string> = {
      default: 'bg-black',
      red: 'bg-red-500',
      rose: 'bg-rose-500',
      orange: 'bg-orange-500',
      green: 'bg-green-500',
      blue: 'bg-blue-500',
    }
    return colorMap[themeValue] || colorMap.default
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon">
          <PaletteIcon className="h-5 w-5" />
          <span className="sr-only">Select color theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {colorThemes.map((colorTheme) => (
          <DropdownMenuItem
            key={colorTheme.value}
            onClick={() => setColorTheme(colorTheme.value)}
            className="flex items-center justify-between">
            <span>{colorTheme.name}</span>
            <span
              className={`ml-2 h-4 w-4 rounded-full ${getColorClass(
                colorTheme.value
              )}`}
              aria-hidden="true"
            />
            {(currentColorTheme === colorTheme.value ||
              (currentColorTheme === 'default' &&
                colorTheme.value === 'default')) && (
              <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                <span className="sr-only">Active</span>•
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
