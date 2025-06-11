'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeDemo() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only show theme information after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">Loading theme information...</p>
      </div>
    )
  }

  // Extract base theme and color theme
  const isSystemTheme = theme === 'system'
  const baseTheme = isSystemTheme
    ? resolvedTheme
    : theme?.includes('-')
    ? theme?.split('-')[0]
    : theme
  const colorTheme = theme?.includes('-') ? theme?.split('-')[1] : 'default'
  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Current Theme</CardTitle>
          <CardDescription>
            This component demonstrates the theme colors in action
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">
                Theme
              </span>
              <span className="font-medium">
                {isSystemTheme ? `System (${resolvedTheme})` : theme}
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">
                Mode
              </span>
              <span className="font-medium capitalize">{baseTheme}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">
                Color Palette
              </span>
              <span className="font-medium capitalize">{colorTheme}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium">Primary Button</span>
              <Button>Primary Button</Button>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium">Secondary Button</span>
              <Button variant="secondary">Secondary Button</Button>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium">Outline Button</span>
              <Button variant="outline">Outline Button</Button>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium">Destructive Button</span>
              <Button variant="destructive">Destructive Button</Button>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <h3 className="text-lg font-medium">Color Theme Samples</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div className="h-12 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                Primary
              </div>
              <div className="h-12 rounded-md bg-secondary flex items-center justify-center text-secondary-foreground text-sm font-medium">
                Secondary
              </div>
              <div className="h-12 rounded-md bg-accent flex items-center justify-center text-accent-foreground text-sm font-medium">
                Accent
              </div>
              <div className="h-12 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-sm font-medium">
                Muted
              </div>
              <div className="h-12 rounded-md bg-destructive flex items-center justify-center text-destructive-foreground text-sm font-medium">
                Destructive
              </div>
              <div className="h-12 rounded-md border border-border flex items-center justify-center text-foreground text-sm font-medium">
                Border
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
