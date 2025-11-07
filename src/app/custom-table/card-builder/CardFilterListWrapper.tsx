'use client'

import { DataTableFilterList } from '@/components/data-table/data-table-filter-list'
import { useMemo } from 'react'
import type { Table } from '@tanstack/react-table'

interface CardFilterListWrapperProps<TData> {
  /**
   * The TanStack table instance with the card data
   * This gives direct access to all table features and columns
   */
  table: Table<TData>

  /**
   * Optional styling for the filter list container
   */
  className?: string
}

/**
 * CardFilterListWrapper
 *
 * Wraps DataTableFilterList to provide complete TanStack table filter system
 * This component gives you the entire professional filter UI from data-table:
 * 
 * Features:
 * - Advanced filter UI with field, operator, and value selection
 * - Support for all filter variants (text, number, date, multiSelect, etc)
 * - Drag-and-drop sorting of filters
 * - AND/OR join operators between filters
 * - Keyboard shortcuts for quick filter management
 * - Query parameter persistence (via nuqs)
 * - Full accessibility support
 * 
 * The filter dialog includes:
 * - [Filter] button showing active filter count
 * - Popover with add/remove/reset options
 * - Sortable list of active filters
 * - Field selector with search
 * - Operator selector (changes based on field type)
 * - Value input (text, slider, calendar, checkboxes depending on type)
 * 
 * Usage:
 * ```tsx
 * import { CardFilterListWrapper } from '@/app/custom-table/card-builder'
 * 
 * export function MyComponent() {
 *   const table = useReactTable({
 *     data: myData,
 *     columns: myColumns,
 *     getCoreRowModel: getCoreRowModel(),
 *   })
 * 
 *   return (
 *     <CardFilterListWrapper 
 *       table={table}
 *       className="mb-4"
 *     />
 *   )
 * }
 * ```
 */
export function CardFilterListWrapper<TData>({
  table,
  className,
}: CardFilterListWrapperProps<TData>) {
  // Ensure we always have a valid table instance
  const validTable = useMemo(() => {
    if (!table) {
      throw new Error('CardFilterListWrapper: table instance is required')
    }
    return table
  }, [table])

  return (
    <div className={className}>
      <DataTableFilterList
        table={validTable}
        debounceMs={300}
        throttleMs={50}
        shallow={true}
      />
    </div>
  )
}

export default CardFilterListWrapper
