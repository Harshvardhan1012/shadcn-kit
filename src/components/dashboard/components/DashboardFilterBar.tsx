import { DataTableToolbarFilter } from '@/components/data-table/data-table-toolbar'
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { X } from 'lucide-react'
import * as React from 'react'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import type { useDashboardFilters } from '../hooks/use-dashboard-filters'
import type { DashboardFilterConfig } from '../types'
import { DateRangePresets } from './DateRangePresets'

interface DashboardFilterBarProps {
  configs: DashboardFilterConfig[]
  filters: ReturnType<typeof useDashboardFilters>
}

/**
 * Global filter bar: date-range presets, the configured filter controls
 * (reusing DataTableToolbarFilter), active cross-filter chips, and Reset All.
 */
export function DashboardFilterBar({
  configs,
  filters,
}: DashboardFilterBarProps) {
  const standardConfigs = configs.filter((c) => !c.isDatePreset)
  const presetConfigs = configs.filter((c) => c.isDatePreset)

  // Headless table purely to drive DataTableToolbarFilter (no data of its own).
  const columns = React.useMemo<ColumnDef<any>[]>(
    () =>
      standardConfigs.map((config) => ({
        accessorKey: config.columnKey,
        header: config.label ?? config.columnKey,
        enableColumnFilter: true,
        meta: {
          label: config.label ?? config.columnKey,
          variant: config.variant,
          options: config.options ?? [],
          placeholder: config.placeholder,
        },
      })),
    [standardConfigs],
  )

  const table = useReactTable({
    data: [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  // Filters not backed by a configured control are cross-filters (chart clicks).
  const configuredKeys = new Set(configs.map((c) => c.columnKey))
  const crossFilters = filters.filters.filter((f) => !configuredKeys.has(f.id))

  const valueFor = (columnKey: string) =>
    filters.filters.find((f) => f.id === columnKey)?.value as
      | string
      | undefined

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {presetConfigs.map((config) => (
        <DateRangePresets
          key={config.filterId}
          value={valueFor(config.columnKey)}
          onChange={(preset) =>
            filters.setFilterValue(config.columnKey, preset, 'date')
          }
        />
      ))}

      {columns.map((col) => {
        const column = table.getColumn((col as any).accessorKey)
        return column ? (
          <DataTableToolbarFilter
            key={(col as any).accessorKey}
            column={column}
            table={table}
          />
        ) : null
      })}

      {crossFilters.map((f) => (
        <Badge
          key={f.id}
          variant="secondary"
          className="gap-1">
          {f.id}: {String(f.value)}
          <button
            aria-label={`Remove ${f.id} filter`}
            onClick={() => filters.setFilterValue(f.id, null)}
            className="ml-1 rounded-sm hover:bg-muted">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {filters.activeCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={filters.reset}
          className="h-8 border border-dashed px-2">
          <X className="mr-1 h-4 w-4" />
          Reset All
        </Button>
      )}
    </div>
  )
}
