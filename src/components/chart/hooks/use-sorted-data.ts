import * as React from 'react'
import type { ChartDataPoint } from '../types'

export interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

/**
 * Client-side sort state for the in-chart table view. Toggling the same column
 * flips direction; a new column starts ascending.
 */
export function useSortedData(data: ChartDataPoint[], enabled = false) {
  const [sortConfig, setSortConfig] = React.useState<SortConfig | null>(null)

  const handleSort = React.useCallback(
    (key: string) => {
      if (!enabled) return
      setSortConfig((current) =>
        current && current.key === key && current.direction === 'asc'
          ? { key, direction: 'desc' }
          : { key, direction: 'asc' },
      )
    },
    [enabled],
  )

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
      }
      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue))
    })
  }, [data, sortConfig])

  return { sortedData, sortConfig, handleSort }
}
