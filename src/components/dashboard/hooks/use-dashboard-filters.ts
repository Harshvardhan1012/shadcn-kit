import { getDefaultFilterOperator } from '@/lib/data-table'
import { generateId } from '@/lib/id'
import { getFiltersStateParser } from '@/lib/parsers'
import type { ExtendedColumnFilter, FilterVariant } from '@/types/data-table'
import { useQueryState } from 'nuqs'
import * as React from 'react'
import type { DashboardParams } from '../types'

const THROTTLE_MS = 50

/**
 * Owns the dashboard's global filter state. Mirrors the URL `filters` key used
 * by `DataTableToolbarFilter`, derives the `params` object sent to the backend,
 * and exposes `setFilterValue` for cross-filtering (clicking a chart point).
 *
 * `columnKeys` are the allowed filter ids (config filters ∪ chart cross-filter
 * fields); the parser drops any URL filter whose id isn't listed.
 */
export function useDashboardFilters(columnKeys: string[]) {
  const keysSignature = columnKeys.join('|')
  const stableKeys = React.useMemo(() => columnKeys, [keysSignature]) // eslint-disable-line react-hooks/exhaustive-deps

  const [filters, setFilters] = useQueryState(
    'filters',
    getFiltersStateParser<any>(stableKeys)
      .withDefault([])
      .withOptions({ clearOnDefault: true, shallow: false, throttleMs: THROTTLE_MS }),
  )

  // URL filters → flat params object ({ columnKey: value }) for the API.
  const params = React.useMemo<DashboardParams>(() => {
    const out: DashboardParams = {}
    for (const f of filters) out[f.id] = f.value
    return out
  }, [filters])

  /** Set (or clear, when value is empty) a single filter by column key. */
  const setFilterValue = React.useCallback(
    (columnKey: string, value: unknown, variant: FilterVariant = 'text') => {
      const isEmpty =
        value == null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)

      setFilters((current) => {
        const rest = current.filter((f) => f.id !== columnKey)
        if (isEmpty) return rest
        const next: ExtendedColumnFilter<any> = {
          id: columnKey,
          value: value as any,
          variant,
          operator: getDefaultFilterOperator(variant),
          filterId: generateId({ length: 8 }),
        }
        return [...rest, next]
      })
    },
    [setFilters],
  )

  const reset = React.useCallback(() => setFilters([]), [setFilters])

  return { filters, params, setFilterValue, reset, activeCount: filters.length }
}
