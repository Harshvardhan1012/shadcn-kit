'use client'

import { Label } from '@/components/ui/label'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export interface SearchResult {
  id: string | number
  title: string
  groupLabel?: string
  path: string[]
  isSubItem?: boolean
  url?: string
}

export interface SearchFormProps {
  onSearchAction: (query: string) => void
  results: SearchResult[]
  className?: string
}

export function SearchForm({
  onSearchAction,
  results,
  className,
  ...props
}: SearchFormProps) {
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()

  console.log(results)

  // Function to highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text

    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span
              key={i}
              className="bg-[#d0ebff]">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    )
  }

  return (
    <div className={cn('relative', className)}>
      <form
        {...props}
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          const query = formData.get('search') as string
          onSearchAction?.(query)
        }}>
        <SidebarGroup className="py-0 group-data-[collapsible=icon]:hidden">
          <SidebarGroupContent className="relative">
            <Label
              htmlFor="search"
              className="sr-only">
              Search
            </Label>
            <SidebarInput
              id="search"
              name="search"
              placeholder="Search..."
              className="pl-8 group-data-[collapsible=icon]:pl-2"
              onFocus={() => setShowResults(true)}
              onChange={(e) => onSearchAction?.(e.target.value)}
            />
            <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50 group-data-[collapsible=icon]:hidden" />
          </SidebarGroupContent>
        </SidebarGroup>
      </form>
      {/* Search Results Dropdown */}
      {showResults && results && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-2 shadow-md">
          <div className="max-h-60 overflow-auto">
            {results.map((result) => (
              <button
                key={`${result.id}-${result.isSubItem}`}
                className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent flex flex-col"
                onClick={() => {
                  setShowResults(false)
                  const input =
                    document.querySelector<HTMLInputElement>('#search')
                  if (input) input.value = ''
                  if (result.url) {
                    router.push(result.url)
                  }
                }}>
                <span className="font-medium">
                  {highlightMatch(
                    result.title,
                    document.querySelector<HTMLInputElement>('#search')
                      ?.value || ''
                  )}
                </span>
                {result.path.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {result.path.join(' → ')}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
