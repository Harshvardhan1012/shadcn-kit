'use client'

import type { Column, Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
import { useQueryState } from 'nuqs'
import * as React from 'react'

import { DataTableDateFilter } from '@/components/data-table/data-table-date-filter'
import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter'
import { DataTableSliderFilter } from '@/components/data-table/data-table-slider-filter'
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'
import { getDefaultFilterOperator } from '@/lib/data-table'
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
}

export function DataTableToolbarFilter<TData>({
  column,
  table,
}: DataTableToolbarFilterProps<TData>) {
  const columnMeta = column.columnDef.meta
  const [value, setValue] = React.useState<string>('')

  // Get all columns for the filter parser
  const columns = React.useMemo(() => {
    return table
      .getAllColumns()
      .filter((col) => col.columnDef.enableColumnFilter)
  }, [table])

  // Use URL-based filter state
  const [filters, setFilters] = useQueryState(
    FILTERS_KEY,
    getFiltersStateParser<TData>(columns.map((field) => field.id))
      .withDefault([])
      .withOptions({
        clearOnDefault: true,
        shallow: true,
        throttleMs: THROTTLE_MS,
      })
  )
  const debouncedSetFilters = useDebouncedCallback(setFilters, DEBOUNCE_MS)

  // Find existing filter for this column
  const existingFilter = React.useMemo(() => {
    return filters.find((f) => f.id === column.id)
  }, [filters, column.id])

  // Sync local state with existing filter
  React.useEffect(() => {
    if (existingFilter && typeof existingFilter.value === 'string') {
      setValue(existingFilter.value)
    } else if (!existingFilter) {
      setValue('')
    }
  }, [existingFilter])

  const handleValueChange = React.useCallback(
    (newValue: string) => {
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
    },
    [column.id, columnMeta, filters, debouncedSetFilters]
  )

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
      return (
        <DataTableDateFilter
          column={column}
          title={columnMeta.label ?? column.id}
          multiple={columnMeta.variant === 'dateRange'}
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
        />
      )

    default:
      return null
  }
}
