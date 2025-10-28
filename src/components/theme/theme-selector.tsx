'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Textarea } from '@/components/ui/textarea'
import { CheckIcon, ExternalLinkIcon, PaletteIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

// Color theme options
const colorThemes = [
  { name: 'Default', value: 'default', color: 'bg-black' },
  { name: 'Bold Tech', value: 'boldtech', color: 'bg-purple-600' },
  { name: 'Amber Minimal', value: 'amber', color: 'bg-violet-600' },
  {
    name: 'Custom',
    value: 'custom',
    color: 'bg-gradient-to-r from-pink-500 to-yellow-500',
  },
]

export function ThemeSelector() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [customThemeDialogOpen, setCustomThemeDialogOpen] = useState(false)
  const [customThemeCSS, setCustomThemeCSS] = useState('')

  // Load custom theme from localStorage on mount
  useEffect(() => {
    const savedCustomTheme = localStorage.getItem('customThemeCSS')
    if (savedCustomTheme) {
      setCustomThemeCSS(savedCustomTheme)

      // Apply the saved theme if user was using custom theme
      if (theme?.includes('custom')) {
        applyCustomThemeToDOM(savedCustomTheme)
      }
    }
  }, [])

  // Reapply custom theme when switching between light/dark modes
  useEffect(() => {
    if (theme?.includes('custom')) {
      const savedCustomTheme = localStorage.getItem('customThemeCSS')
      if (savedCustomTheme) {
        applyCustomThemeToDOM(savedCustomTheme)
      }
    }
  }, [theme, resolvedTheme])

  // Extract the color theme part from the theme string
  const currentColorTheme = theme?.includes('-')
    ? theme.split('-')[1]
    : 'default'

  // Function to set theme that preserves light/dark preference
  const setColorTheme = (colorTheme: string) => {
    // If custom theme is selected, open the dialog
    if (colorTheme === 'custom') {
      setCustomThemeDialogOpen(true)
      return
    }

    // Remove custom theme CSS when switching to built-in themes
    const existingStyle = document.getElementById('custom-theme-style')
    if (existingStyle) {
      existingStyle.remove()
    }

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

  // Helper function to apply custom theme to DOM
  const applyCustomThemeToDOM = (css: string) => {
    // Remove existing custom theme style if present
    const existingStyle = document.getElementById('custom-theme-style')
    if (existingStyle) {
      existingStyle.remove()
    }

    // Create new style element
    const styleElement = document.createElement('style')
    styleElement.id = 'custom-theme-style'

    // Parse and inject the CSS
    let processedCSS = css.trim()

    // Check if CSS contains :root or .dark/.light selectors
    if (
      !processedCSS.includes(':root') &&
      !processedCSS.includes('.dark') &&
      !processedCSS.includes('.light')
    ) {
      // If it's just CSS variables, wrap them
      processedCSS = `:root {\n${processedCSS}\n}`
    }

    styleElement.textContent = processedCSS
    document.head.appendChild(styleElement)
  }

  // Apply custom theme CSS
  const applyCustomTheme = () => {
    if (!customThemeCSS.trim()) return

    try {
      applyCustomThemeToDOM(customThemeCSS)

      // Save to localStorage
      localStorage.setItem('customThemeCSS', customThemeCSS)

      // Set theme to custom
      const baseTheme =
        resolvedTheme === 'dark' || (theme && theme.startsWith('dark'))
          ? 'dark'
          : 'light'
      setTheme(`${baseTheme}-custom`)

      setCustomThemeDialogOpen(false)
    } catch (error) {
      console.error('Error applying custom theme:', error)
      alert(
        'There was an error applying the custom theme. Please check the CSS syntax.'
      )
    }
  }

  const openThemeEditor = () => {
    window.open('https://tweakcn.com/editor/theme', '_blank')
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="top-0">
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
              className="flex items-center justify-between gap-2">
              <span>{colorTheme.name}</span>
              <div className="flex items-center gap-2">
                <span
                  className={`h-4 w-4 rounded-full ${colorTheme.color}`}
                  aria-hidden="true"
                />
                {currentColorTheme === colorTheme.value && (
                  <CheckIcon className="h-4 w-4" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={customThemeDialogOpen}
        onOpenChange={setCustomThemeDialogOpen}>
        <DialogContent className="max-w-2xl max-h-screen">
          <DialogHeader>
            <DialogTitle>Custom Theme</DialogTitle>
            <DialogDescription>
              Create your custom theme at
              <Button
                variant="link"
                className="h-auto p-0 text-primary"
                onClick={openThemeEditor}>
                tweakcn.com/editor/theme
                <ExternalLinkIcon className="ml-1 h-3 w-3" />
              </Button>
              choose the code option after selecting the theme and paste the code here.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            placeholder="Paste your custom theme CSS here...&#10;&#10;Example:&#10;:root {&#10;  --background: oklch(1 0 0);&#10;  --foreground: oklch(0.145 0 0);&#10;  ...&#10;}"
            value={customThemeCSS}
            onChange={(e) => setCustomThemeCSS(e.target.value)}
            className="font-mono text-sm overflow-y-scroll max-h-100"
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCustomThemeDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={applyCustomTheme}
              disabled={!customThemeCSS.trim()}>
              Apply Theme
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}