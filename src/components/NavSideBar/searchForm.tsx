'use client'

import { cn } from './../lib/utils'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Input } from '../ui/input'

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
  isCentered?: boolean
  onCloseModal?: () => void
}

export function SearchForm({
  onSearchAction,
  results,
  className,
  isCentered = false,
  onCloseModal,
  ...props
}: SearchFormProps) {
  const [showResults, setShowResults] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (isCentered) {
      const input = document.querySelector<HTMLInputElement>('#search')
      if (input) {
        input.focus()
      }
      setShowResults(true)
    }
  }, [isCentered])

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const searchContainer = document.querySelector('#search-container')
      if (searchContainer && !searchContainer.contains(e.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div
      id="search-container"
      className={cn('relative w-full', isCentered, className)}>
      <form
        {...props}
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          const query = formData.get('search') as string
          setSearchValue(query)
          onSearchAction?.(query)
        }}>
        <div className="relative">
          <Search
            className={cn(
              'absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground',
              isCentered && 'h-5 w-5'
            )}
          />
          <Input
            id="search"
            name="search"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value)
              onSearchAction?.(e.target.value)
            }}
            placeholder={isCentered ? 'Search anything...' : 'Search...'}
            className={cn(
              'flex h-10 w-full rounded-md border bg-background px-10 py-2',
              'text-sm placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-ring focus-visible:ring-offset-2',
              isCentered && 'h-12 text-lg'
            )}
            autoComplete="off"
            onFocus={() => setShowResults(true)}
          />
        </div>
      </form>

      {/* Search Results Dropdown */}
      {(showResults || isCentered) && (
        <div
          className={cn(
            'overflow-hidden transition-all duration-150',
            isCentered ? 'max-h-[60vh]' : 'max-h-[300px]'
          )}>
          {results.length > 0 ? (
            <div className="overflow-y-auto p-2 divide-y divide-border">
              {results.map((result) => (
                <button
                  key={result.id}
                  className={cn(
                    'flex flex-col w-full items-start gap-1 px-3 py-2 text-sm',
                    'hover:bg-accent hover:text-accent-foreground rounded-md transition-colors',
                    'focus:outline-none focus:bg-accent focus:text-accent-foreground'
                  )}
                  onClick={() => {
                    if (result.url) {
                      router.push(result.url)
                    }
                    setShowResults(false)
                    onCloseModal?.()
                  }}>
                  <div className="w-full space-y-1">
                    <div className="font-medium truncate">{result.title}</div>
                    {result.path.length > 0 && (
                      <div className="text-xs text-muted-foreground truncate">
                        {result.path.join(' > ')}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : searchValue ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No results found
            </div>
          ) : (
            <div className="p-4 text-sm text-muted-foreground text-center">
              Type to search...
            </div>
          )}
        </div>
      )}
    </div>
  )
}
