import { useMemo, useState } from 'react'
import type { ChartConfiguration } from './ChartBuilder'
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { getVariantFromValue } from '../custom-table/generateColumnConfig'
import type { ExtendedColumnFilter } from '@/types/data-table'
import { DataTableToolbarFilter } from '@/components/data-table/data-table-toolbar'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { DynamicChart } from '@/components/chart/DynamicChart'

// Get unique options for select/multiSelect variants
function getUniqueOptions(data: any[], key: string) {
  const uniqueValues = new Set<string | number>()
  data.forEach((item) => {
    const value = item[key]
    if (value !== null && value !== undefined) {
      uniqueValues.add(value)
    }
  })
  return Array.from(uniqueValues).map((value) => ({
    label: String(value),
    value: value,
  }))
}
// Component for each chart with DataTable filtering
export function ChartItem({
  chart,
  onDelete,
  onEdit,
  index,
}: {
  chart: ChartConfiguration
  onDelete: (key: string) => void
  onEdit: (chart: ChartConfiguration) => void
  index?: number
}) {
  const [filters, setFilters] = useState<ExtendedColumnFilter<any>[]>([])

  // Determine the variant for the xAxisKey
  const xAxisVariant = useMemo(() => {
    if (!chart.data || chart.data.length === 0 || !chart.xAxisKey) {
      return 'text'
    }
    const sampleValue = chart.data[0][chart.xAxisKey]
    return getVariantFromValue(sampleValue)
  }, [chart.data, chart.xAxisKey])

  // Get unique options for select/multiSelect
  const xAxisOptions = useMemo(() => {
    if (!chart.data || !chart.xAxisKey) return []
    if (xAxisVariant === 'multiSelect') {
      return getUniqueOptions(chart.data, chart.xAxisKey)
    }
    return []
  }, [chart.data, chart.xAxisKey, xAxisVariant])

  // Create a column definition for the xAxisKey
  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (!chart.xAxisKey) return []

    return [
      {
        accessorKey: chart.xAxisKey,
        header: chart.xAxisKey,
        enableColumnFilter: true,
        meta: {
          label: chart.xAxisKey,
          variant: xAxisVariant,
          options: xAxisOptions.length > 0 ? xAxisOptions : undefined,
        },
      } as any,
    ]
  }, [chart.xAxisKey, xAxisVariant, xAxisOptions])

  // Create a table instance for filtering
  const table = useReactTable({
    data: chart.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters: filters.map((f) => ({
        id: f.id,
        value: f.value,
      })),
    },
  })

  // Get filtered data from the table
  const filteredData = useMemo(() => {
    if (filters.length === 0) {
      return chart.data || []
    }
    return table.getFilteredRowModel().rows.map((row) => row.original)
  }, [chart.data, table, filters])

  const handleClearFilters = () => {
    setFilters([])
  }

  const xAxisColumn = table.getColumn(chart.xAxisKey || '')

  return (
    <div className="relative space-y-2">
      {/* Filter toolbar using DataTableToolbarFilter */}
      {xAxisColumn && chart.data && chart.data.length > 0 && (
        <div className="flex items-center gap-2 px-2 py-1 ">
          <DataTableToolbarFilter
            column={xAxisColumn}
            table={table}
            externalFilters={filters}
            onExternalFiltersChange={setFilters}
          />
          {filters.length > 0 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-8 px-2">
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
              <span className="text-xs text-muted-foreground">
                Showing {filteredData.length} of {chart.data.length} items
              </span>
            </>
          )}
        </div>
      )}

      {/* Chart */}
      <DynamicChart
        title={chart.title}
        chartType="bar"
        data={filteredData}
        config={chart.config}
        xAxisKey={chart.xAxisKey}
        yAxisKeys={chart.yAxisKeys}
        downloadFilename={`${chart.title}-data`}
        chartKey={chart.chartKey}
        height={300}
        legendPosition="top"
        chartIndex={index}
        onAction={(action) => {
          if (action === 'edit') {
            onEdit(chart)
          } else if (action === 'delete') {
            onDelete(chart.chartKey)
          }
        }}
      />
    </div>
  )
}
