export default function ThemeDocsPage() {
  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Theme Documentation</h1>
          <p className="text-muted-foreground mt-2">
            Learn how to customize and extend the theme system.
          </p>
        </div>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>Color Themes</h2>
          <p>
            This project supports multiple color themes that can be used in both light and dark modes:
          </p>
          <ul>
            <li><strong>Default</strong> - Classic neutral theme</li>
            <li><strong>Red</strong> - Vibrant red accent</li>
            <li><strong>Rose</strong> - Soft rose accent</li>
            <li><strong>Orange</strong> - Warm orange accent</li>
            <li><strong>Green</strong> - Fresh green accent</li>
            <li><strong>Blue</strong> - Cool blue accent</li>
          </ul>
          
          <h2>Theme Variables</h2>
          <p>
            All themes use CSS custom properties that are automatically updated when switching themes.
            The theme system is built on top of Tailwind CSS and uses the following CSS variables:
          </p>
          <ul>
            <li><code>--primary</code> - Primary color</li>
            <li><code>--secondary</code> - Secondary color</li>
            <li><code>--accent</code> - Accent color</li>
            <li><code>--muted</code> - Muted color</li>
            <li><code>--destructive</code> - Destructive/error color</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
