'use client'

import { Input } from '@/components/ui/input'
import { useSidebar } from '@/components/ui/sidebar'
import { Search } from 'lucide-react'
import { ModeToggle } from './mode-toggle'
import { ThemeSelector } from './theme-selector'

interface UniversalHeaderProps {
  showSearch?: boolean
  showBreadcrumb?: boolean
  breadcrumbContent?: React.ReactNode
}

export function UniversalHeader({ 
  showSearch = true, 
  showBreadcrumb = false,
  breadcrumbContent 
}: UniversalHeaderProps) {
  const { state } = useSidebar()
  // isCollapsed could be used for future responsive features if needed
  // const isCollapsed = state === 'collapsed'

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between p-4 gap-2 sm:gap-4">
        {/* Left side - Breadcrumb if provided */}
        {showBreadcrumb && breadcrumbContent && (
          <div className="flex items-center min-w-0 flex-1">
            {breadcrumbContent}
          </div>
        )}
        
        {/* Center/Right - Search and Theme Controls */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {showSearch && (
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 w-64 h-9 bg-background/50"
              />
            </div>
          )}
          
          {/* Theme Controls Container */}
          <div className="flex items-center gap-1 sm:gap-2 bg-background/50 backdrop-blur-sm border rounded-lg p-1">
            <ThemeSelector />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
