'use client'

import { DynamicChart } from '@/components/chart/DynamicChart'
import { Button } from '@/components/ui/button'
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from '@/components/ui/sortable'
import { TitleDescription } from '@/components/ui/title-description'
import { DataTableToolbarFilter } from '@/components/data-table/data-table-toolbar'
import { GripVertical, Plus, X } from 'lucide-react'
import { useState, useMemo } from 'react'
import type { ChartConfiguration } from './ChartBuilder'
import { ChartBuilderSheet } from './ChartBuilderSheet'
import { bulkUpdateCharts, deleteChartConfig, getAllCharts } from './api'
import type { ExtendedColumnFilter, FilterVariant } from '@/types/data-table'
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { getVariantFromValue } from '../custom-table/generateColumnConfig'

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
function ChartItem({
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

export default function ChartPage() {
  const [editingChart, setEditingChart] = useState<ChartConfiguration | null>(
    null
  )
  const [open, setOpen] = useState(false)
  const { data: charts } = getAllCharts()
  const bulkUpdateMutation = bulkUpdateCharts()
  const deleteChartMutation = deleteChartConfig()

  const handleDeleteChart = (chartKey: string) => {
    if (!chartKey) return
    const confirmed = confirm('Are you sure you want to delete this chart?')
    if (!confirmed) return

    deleteChartMutation.mutate(
      { chartKey },
      {
        onSuccess: () => {
          console.log('Chart deleted:', chartKey)
        },
        onError: (err) => {
          console.error('Failed to delete chart', err)
        },
      }
    )
  }

  const handleEditChart = (chart: ChartConfiguration) => {
    setOpen(true)
    setEditingChart(chart)
  }

  const handleChartsReorder = (newCharts: ChartConfiguration[]) => {
    const reindexed = newCharts.map((chart, idx) => ({
      ...chart,
      index: idx,
    }))
    bulkUpdateMutation.mutate({ data: reindexed })
  }

  return (
    <>
      <div className="flex items-center p-2 justify-between">
        <TitleDescription
          title="Custom Charts"
          description="Create and manage custom charts based on your data."
          size="lg"
        />
        <div className="flex items-center gap-2">
          <ChartBuilderSheet
            data={[]}
            columns={[]}
            onSave={() => {
              console.log('Chart created')
              setEditingChart(null)
            }}
            triggerButton={
              <Button variant="default">
                <Plus className="w-4 h-4 mr-2" />
                Create Chart
              </Button>
            }
          />
        </div>
      </div>

      {charts?.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 space-y-4 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold text-muted-foreground">
            No Charts Available
          </h2>
          <p className="text-muted-foreground">
            Create your first chart to get started
          </p>
          <ChartBuilderSheet
            data={[]}
            columns={[]}
            onSave={() => {
              console.log('Chart created')
              setEditingChart(null)
            }}
            triggerButton={
              <Button
                variant="default"
                size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Chart
              </Button>
            }
          />
        </div>
      ) : (
        <div className="p-6">
          <Sortable
            value={charts?.data || []}
            onValueChange={handleChartsReorder}
            getItemValue={(chart) => chart.chartKey}
            orientation="mixed">
            <SortableContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {charts?.data?.map((chart, index) => (
                <SortableItem
                  key={chart.chartKey}
                  value={chart.chartKey}
                  className={`group relative ${
                    index === 0 ? 'lg:col-span-2' : ''
                  }`}>
                  <ChartItem
                    chart={chart}
                    onDelete={handleDeleteChart}
                    onEdit={handleEditChart}
                    index={index}
                  />
                  <div className="absolute top-14 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <SortableItemHandle
                      asChild
                      className="cursor-grab active:cursor-grabbing">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-muted/80">
                        <GripVertical className="h-4 w-4" />
                        <span className="sr-only">Drag to reorder</span>
                      </Button>
                    </SortableItemHandle>
                  </div>
                </SortableItem>
              ))}
            </SortableContent>

            <SortableOverlay>
              {({ value }) => {
                const chart = charts?.data?.find((c) => c.chartKey === value)
                const chartIndex = charts?.data?.findIndex(
                  (c) => c.chartKey === value
                )
                return chart ? (
                  <div className="opacity-50">
                    <ChartItem
                      chart={chart}
                      onDelete={() => {}}
                      onEdit={() => {}}
                      index={chartIndex}
                    />
                  </div>
                ) : null
              }}
            </SortableOverlay>
          </Sortable>
        </div>
      )}

      {editingChart && (
        <ChartBuilderSheet
          data={editingChart.data || []}
          columns={Object.keys(
            (editingChart.data && editingChart.data[0]) || {}
          )}
          initialConfig={editingChart}
          onSave={() => {
            setEditingChart(null)
            setOpen(false)
          }}
          onCancel={() => {
            setEditingChart(null)
            setOpen(false)
          }}
          triggerButton={null}
          autoOpen={open}
        />
      )}
    </>
  )
}
