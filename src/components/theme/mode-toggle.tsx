'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoonIcon, SunIcon } from '@/components/ui/icons'
import { useTheme } from 'next-themes'

export function ModeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()

  const isDarkMode =
    resolvedTheme === 'dark' || (theme && theme.startsWith('dark'))

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild></DropdownMenuTrigger>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}>
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
    </DropdownMenu>
  )
}
