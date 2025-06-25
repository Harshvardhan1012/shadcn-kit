'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LaptopIcon, MoonIcon, SunIcon } from '@/components/ui/icons'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ModeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Helper function to preserve color theme when changing mode
  const setMode = (mode: string) => {
    // Extract color theme if it exists
    let colorPart = ''
    if (theme && theme.includes('-')) {
      colorPart = '-' + theme.split('-')[1]
    }

    if (mode === 'system') {
      setTheme(mode)
    } else {
      setTheme(`${mode}${colorPart}`)
    }
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon">
        <SunIcon className="h-5 w-5" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  // Determine if we're in dark mode for styling icons
  const isDarkMode =
    resolvedTheme === 'dark' || (theme && theme.startsWith('dark'))

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon">
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
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setMode('light')}>
          <SunIcon className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setMode('dark')}>
          <MoonIcon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setMode('system')}>
          <LaptopIcon className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
