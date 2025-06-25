import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ThemeGuidePage() {
  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Theme Setup Guide</h1>
          <p className="text-muted-foreground mt-2">
            Step-by-step guide to implementing the theme system in your project.
          </p>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Install Dependencies</CardTitle>
              <CardDescription>
                Install the required packages for theme functionality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>npm install next-themes class-variance-authority clsx tailwind-merge</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 2: Configure Tailwind</CardTitle>
              <CardDescription>
                Update your tailwind.config.js to include theme variables
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                <code>{`// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        // ... other color variables
      }
    }
  }
}`}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 3: Add Theme Provider</CardTitle>
              <CardDescription>
                Wrap your app with the ThemeProvider component
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                <code>{`// app/layout.tsx
import { ThemeProvider } from '@/components/theme-provider'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}`}</code>
              </pre>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button asChild>
              <a href="/theme">View Theme Demo</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/theme/docs">Read Documentation</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
