'use client'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/components/lib/utils'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'

export interface SearchResult {
  id: string | number
  title: string
  groupLabel?: string
  path: string[]
  isSubItem?: boolean
  url?: string
  icon?: React.ElementType | React.ReactNode
}

export interface SearchWrapperProps {
  onSearch?: (query: string) => void
  searchResults?: SearchResult[]
  className?: string
}

export function SearchWrapper({
  onSearch,
  searchResults = [],
  className,
}: SearchWrapperProps) {
  const [isCentered, setIsCentered] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [localResults, setLocalResults] =
    useState<SearchResult[]>(searchResults)
  const router = useRouter()

  // Update local results when search results prop changes
  useEffect(() => {
    setLocalResults(searchResults)
  }, [searchResults])
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        openCenteredSearch()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const openCenteredSearch = () => {
    setSearchValue('') // Clear search input
    setLocalResults([]) // Clear results when opening modal
    setIsCentered(true)
  }

  const handleSearch = (query: string) => {
    setSearchValue(query)
    onSearch?.(query)
  }

  const handleSelect = (result: SearchResult) => {
    if (result.url) {
      router.push(result.url)
    }
    setIsCentered(false)
  }

  // Group results by section (only if there are results)
  const groupedResults =
    localResults.length > 0
      ? Object.entries(
          localResults.reduce((groups, result) => {
            const groupKey = result.groupLabel || 'General'
            return {
              ...groups,
              [groupKey]: [...(groups[groupKey] || []), result],
            }
          }, {} as Record<string, SearchResult[]>)
        )
      : []

  return (
    <>
      <div className={cn('w-full px-4 py-2', className)}>
        <Button
          variant="outline"
          className="w-full flex items-center justify-between text-muted-foreground"
          onClick={openCenteredSearch}>
          <div className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            <span>Search...</span>
          </div>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>
      <CommandDialog
        open={isCentered}
        onOpenChange={setIsCentered}>
        <CommandInput
          placeholder="Search for menu items, pages, or features..."
          value={searchValue}
          onValueChange={handleSearch}
          autoFocus
        />
        <CommandList>
          {groupedResults.length > 0 ? (
            groupedResults.map(([groupName, groupResults]) => (
              <CommandGroup
                key={groupName}
                heading={groupName}>
                {groupResults.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelect(result)}
                    className={result.isSubItem ? 'pl-6' : ''}>
                    {result.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))
          ) : searchValue ? (
            <CommandEmpty>No results found</CommandEmpty>
          ) : (
            <CommandEmpty>Type to search...</CommandEmpty>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}