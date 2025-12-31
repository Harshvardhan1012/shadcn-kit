'use client'

import type { Column, Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
import { useQueryState } from 'nuqs'
import * as React from 'react'
import type { DateRange } from 'react-day-picker'

import { DataTableDateFilter } from '@/components/data-table/data-table-date-filter'
import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter'
import { DataTableSliderFilter } from '@/components/data-table/data-table-slider-filter'
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'
import { getDefaultFilterOperator } from '@/lib/data-table'
import { applyFilter } from '@/lib/filter'
import { generateId } from '@/lib/id'
import { getFiltersStateParser } from '@/lib/parsers'
import { cn } from '@/lib/utils'
import type { ExtendedColumnFilter } from '@/types/data-table'

const FILTERS_KEY = 'filters'
const DEBOUNCE_MS = 300
const THROTTLE_MS = 50

interface DataTableToolbarProps<TData> extends React.ComponentProps<'div'> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const columns = React.useMemo(
    () => table.getAllColumns().filter((column) => column.getCanFilter()),
    [table]
  )

  const onReset = React.useCallback(() => {
    table.resetColumnFilters()
  }, [table])

  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn(
        'flex w-full items-start justify-between gap-2 p-1',
        className
      )}
      {...props}>
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {columns.map((column) => (
          <DataTableToolbarFilter
            key={column.id}
            column={column}
            table={table}
          />
        ))}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="outline"
            size="sm"
            className="border-dashed"
            onClick={onReset}>
            <X />
            Reset
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}

interface DataTableToolbarFilterProps<TData> {
  column: Column<TData>
  table: Table<TData>
  // Optional: for sharing filter state with DataTableFilterList
  externalFilters?: ExtendedColumnFilter<TData>[]
  onExternalFiltersChange?: (filters: ExtendedColumnFilter<TData>[]) => void
}

export function DataTableToolbarFilter<TData>({
  column,
  table,
  externalFilters,
  onExternalFiltersChange,
}: DataTableToolbarFilterProps<TData>) {
  const columnMeta = column.columnDef.meta
  const [value, setValue] = React.useState<string>('')

  // Get all columns for the filter parser
  const columns = React.useMemo(() => {
    return table
      .getAllColumns()
      .filter((col) => col.columnDef.enableColumnFilter)
  }, [table])

  // Determine if using external state or own URL state
  const useExternalState =
    externalFilters !== undefined && onExternalFiltersChange !== undefined

  // Use URL-based filter state (only if not using external state)
  const [urlFilters, setUrlFilters] = useQueryState(
    FILTERS_KEY,
    getFiltersStateParser<TData>(columns.map((field) => field.id))
      .withDefault([])
      .withOptions({
        clearOnDefault: true,
        shallow: true,
        throttleMs: THROTTLE_MS,
      })
  )
  const debouncedSetUrlFilters = useDebouncedCallback(
    setUrlFilters,
    DEBOUNCE_MS
  )

  // Use external or URL filters
  const filters = useExternalState ? externalFilters : urlFilters
  const setFilters = useExternalState ? onExternalFiltersChange : setUrlFilters
  const debouncedSetFilters = useExternalState
    ? onExternalFiltersChange
    : debouncedSetUrlFilters

  // Find existing filter for this column
  const existingFilter = React.useMemo(() => {
    return filters.find((f) => f.id === column.id)
  }, [filters, column.id])

  // Sync local state with existing filter for text/number inputs
  React.useEffect(() => {
    if (existingFilter && typeof existingFilter.value === 'string') {
      setValue(existingFilter.value)
    } else if (!existingFilter) {
      setValue('')
    }
  }, [existingFilter])

  const handleValueChange = React.useCallback(
    (newValue: any) => {
      // Handle text/number filters (string values)
      if (typeof newValue === 'string') {
        setValue(newValue)

        if (!newValue.trim()) {
          // Remove filter if value is empty
          const updatedFilters = filters.filter((f) => f.id !== column.id)
          debouncedSetFilters(updatedFilters)
        } else {
          // Update or add filter
          const filterExists = filters.some((f) => f.id === column.id)

          if (filterExists) {
            // Update existing filter
            const updatedFilters = filters.map((f) =>
              f.id === column.id ? { ...f, value: newValue } : f
            )
            debouncedSetFilters(updatedFilters)
          } else {
            // Add new filter
            const newFilter: ExtendedColumnFilter<TData> = {
              id: column.id as Extract<keyof TData, string>,
              value: newValue,
              variant: columnMeta?.variant ?? 'text',
              operator: getDefaultFilterOperator(columnMeta?.variant ?? 'text'),
              filterId: generateId({ length: 8 }),
            }
            debouncedSetFilters([...filters, newFilter])
          }
        }
      }
      // Handle select/multiSelect filters (array values)
      else if (Array.isArray(newValue) || newValue === undefined) {
        if (!newValue || newValue.length === 0) {
          // Remove filter if no values selected
          const updatedFilters = filters.filter((f) => f.id !== column.id)
          setFilters(updatedFilters)
        } else {
          // Update or add filter
          const filterExists = filters.some((f) => f.id === column.id)

          if (filterExists) {
            // Update existing filter
            const updatedFilters = filters.map((f) =>
              f.id === column.id ? { ...f, value: newValue } : f
            )
            setFilters(updatedFilters as ExtendedColumnFilter<TData>[])
          } else {
            // Add new filter
            const newFilter: ExtendedColumnFilter<TData> = {
              id: column.id as Extract<keyof TData, string>,
              value: newValue as Array<string | number>,
              variant: columnMeta?.variant ?? 'select',
              operator: getDefaultFilterOperator(
                columnMeta?.variant ?? 'select'
              ),
              filterId: generateId({ length: 8 }),
            }
            setFilters([...filters, newFilter])
          }
        }
      }
    },
    [column.id, columnMeta, filters, debouncedSetFilters, setFilters]
  )

  // Handle date filter changes
  const handleDateChange = React.useCallback(
    (date: Date | DateRange | undefined) => {
      console.log('Date selected:', date)
      if (!date) {
        // Remove filter
        const updatedFilters = filters.filter((f) => f.id !== column.id)
        setFilters(updatedFilters)
        return
      }

      // Convert date to filter object
      let filterValue: any
      let operator: string
      if (date && typeof date === 'object' && 'from' in date) {
        // DateRange
        const from = date.from?.getTime()
        const to = date.to?.getTime()
        filterValue = [from, to]
        operator = 'isBetween'
      } else if (date instanceof Date) {
        // Single date
        filterValue = date.getTime()
        operator = 'eq'
      } else {
        return
      }

      // Update or add filter
      const filterExists = filters.some((f) => f.id === column.id)

      if (filterExists) {
        // Update existing filter
        const updatedFilters = filters.map((f) =>
          f.id === column.id
            ? { ...f, value: { value: filterValue, operator } as any }
            : f
        )
        console.log('Updated Filters:', updatedFilters)
        setFilters(updatedFilters as ExtendedColumnFilter<TData>[])
      } else {
        // Add new filter
        const newFilter: ExtendedColumnFilter<TData> = {
          id: column.id as Extract<keyof TData, string>,
          value: { value: filterValue, operator } as any,
          variant: columnMeta?.variant ?? 'dateRange',
          operator: getDefaultFilterOperator(
            columnMeta?.variant ?? 'dateRange'
          ),
          filterId: generateId({ length: 8 }),
        }
        setFilters([...filters, newFilter])
        console.log(newFilter)
      }
    },
    [column.id, columnMeta, filters, setFilters]
  )

  // Get current filter value for select/multiSelect
  const selectValue = React.useMemo(() => {
    if (existingFilter && Array.isArray(existingFilter.value)) {
      return existingFilter.value as Array<string | number | boolean>
    }
    return undefined
  }, [existingFilter])

  if (!columnMeta?.variant) return null

  switch (columnMeta.variant) {
    case 'text':
      return (
        <Input
          placeholder={columnMeta.placeholder ?? columnMeta.label}
          value={value}
          onChange={(event) => handleValueChange(event.target.value)}
          className="h-8 w-40 lg:w-56"
        />
      )

    case 'number':
      return (
        <div className="relative">
          <Input
            type="number"
            inputMode="numeric"
            placeholder={columnMeta.placeholder ?? columnMeta.label}
            value={value}
            onChange={(event) => handleValueChange(event.target.value)}
            className={cn('h-8 w-[120px]', columnMeta.unit && 'pr-8')}
          />
          {columnMeta.unit && (
            <span className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-muted-foreground text-sm">
              {columnMeta.unit}
            </span>
          )}
        </div>
      )

    case 'range':
      return (
        <DataTableSliderFilter
          column={column}
          title={columnMeta.label ?? column.id}
        />
      )

    case 'date':
    case 'dateRange':
      // Set custom filter function using applyFilter
      ;(column as any).columnDef.filterFn = (
        row: any,
        columnId: any,
        filterValue: any
      ) => {
        if (
          !filterValue ||
          typeof filterValue !== 'object' ||
          !('value' in filterValue)
        )
          return true
        const { value, operator } = filterValue
        const filter = { id: columnId, value, operator, variant: 'dateRange' }
        return applyFilter(row.original, filter)
      }
      console.log(columnMeta)
      return (
        <DataTableDateFilter
          column={column}
          title={columnMeta.label ?? column.id}
          multiple={columnMeta.variant === 'dateRange'}
          onValueChange={handleDateChange}
          value={existingFilter?.value as any}
        />
      )

    case 'select':
    case 'multiSelect':
      return (
        <DataTableFacetedFilter
          column={column}
          title={columnMeta.label ?? column.id}
          options={columnMeta.options ?? []}
          multiple={columnMeta.variant === 'multiSelect'}
          value={selectValue}
          onValueChange={handleValueChange}
        />
      )

    default:
      return null
  }
}
