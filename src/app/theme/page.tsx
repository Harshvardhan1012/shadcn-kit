import { ThemeDemo } from '@/components/theme-demo'

export default function ThemePage() {
  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Theme Showcase</h1>
          <p className="text-muted-foreground mt-2">
            Explore the different color themes and their variations in light and dark modes.
          </p>
        </div>
        
        <ThemeDemo />
      </div>
    </div>
  )
}
