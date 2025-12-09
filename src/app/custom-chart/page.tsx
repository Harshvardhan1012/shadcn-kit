'use client'

import { DataTableToolbarFilter } from '@/components/data-table/data-table-toolbar'
import { Button } from '@/components/ui/button'
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from '@/components/ui/sortable'
import { TitleDescription } from '@/components/ui/title-description'
import { getFiltersStateParser } from '@/lib/parsers'
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { GripVertical, Plus, X } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useEffect, useMemo, useState } from 'react'
import { CardBuilder } from '../custom-table/card-builder'
import {
  bulkUpdateCards,
  bulkUpdateCharts,
  deleteCard,
  deleteChartConfig,
  editCard,
  getAllCards,
  getAllCharts,
  postCard,
} from './api'
import type { ChartConfiguration } from './ChartBuilder'
import { ChartBuilderSheet } from './ChartBuilderSheet'
import { ChartItem } from './ChartItem'
import { FilterConfigSheet, type FilterConfig } from './FilterConfigSheet'
const THROTTLE_MS = 50

export default function ChartPage() {
  const [editingChart, setEditingChart] = useState<ChartConfiguration | null>(
    null
  )
  const [params, setParams] = useState<Object>({})
  const [open, setOpen] = useState(false)
  const [filterConfigs, setFilterConfigs] = useState<FilterConfig[]>([])
  const { data: charts } = getAllCharts(params)
  const { data: cards } = getAllCards()
  const { mutate: bulkUpdateCardsMutation } = bulkUpdateCards()
  const { mutate: createCardMutation } = postCard()
  const { mutate: editCardMutation } = editCard()
  const { mutate: deleteCardMutation } = deleteCard()
  const handleDeleteCard = (id: number) => {
    if (!id) return
    const confirmed = confirm('Are you sure you want to delete this card?')
    if (!confirmed) return
    deleteCardMutation({ cardId: id })
  }

  const editCardHandler = (id: number, cardData: any) => {
    editCardMutation({ id, ...cardData })
  }

  const createCardHandler = (cardData: any) => {
    createCardMutation(cardData)
  }

  const handleCardsReorder = (newCards: any[]) => {
    const reindexed = newCards.map((card, idx) => ({
      ...card,
      order: idx,
    }))
    bulkUpdateCardsMutation({ data: reindexed })
  }

  const { mutate: bulkUpdateMutation } = bulkUpdateCharts()
  const { mutate: deleteChartMutation } = deleteChartConfig()
  const handleDeleteChart = (chartKey: string) => {
    if (!chartKey) return
    const confirmed = confirm('Are you sure you want to delete this chart?')
    if (!confirmed) return
    deleteChartMutation({ chartKey })
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
    bulkUpdateMutation({ data: reindexed })
  }

  // Load filter configs from localStorage or initialize
  useEffect(() => {
    const savedConfigs = localStorage.getItem('chartFilterConfigs')
    if (savedConfigs) {
      try {
        const parsed = JSON.parse(savedConfigs) as FilterConfig[]
        setFilterConfigs(parsed)
      } catch (e) {
        // Initialize with empty if parse fails
        setFilterConfigs([])
      }
    }
  }, [])

  // Save filter configs to localStorage whenever they change
  const handleSaveFilterConfigs = (configs: FilterConfig[]) => {
    setFilterConfigs(configs)
    localStorage.setItem('chartFilterConfigs', JSON.stringify(configs))
  }

  // Create column definitions for filtering based on enabled configs
  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (filterConfigs.length === 0) return []

    // Only create columns for enabled filter configs
    const enabledConfigs = filterConfigs.filter((c) => c.enabled)

    return enabledConfigs.map((config) => {
      return {
        accessorKey: config.columnKey,
        header: config.columnKey,
        enableColumnFilter: true,
        meta: {
          label: config.label,
          variant: config.variant,
          options: [], // Options will be fetched from SP or provided by server
          placeholder: config.placeholder,
          spName: config.spName,
        },
      } as any
    })
  }, [filterConfigs])

  // Use URL query params for filters
  const enabledFilterKeys = useMemo(
    () => filterConfigs.filter((c) => c.enabled).map((c) => c.columnKey),
    [filterConfigs]
  )

  const [urlFilters, setUrlFilters] = useQueryState(
    'filters',
    getFiltersStateParser<any>(enabledFilterKeys).withDefault([]).withOptions({
      clearOnDefault: true,
      shallow: false,
      throttleMs: THROTTLE_MS,
    })
  )

  // Convert URL filters to object format for API params
  useEffect(() => {
    const filterParams: Record<string, any> = {}
    urlFilters.forEach((filter) => {
      filterParams[filter.id] = filter.value
    })
    setParams(filterParams)
  }, [urlFilters])

  // Create a table instance for filtering UI only (no actual data filtering)
  const table = useReactTable({
    data: [], // Empty data - filters are for server-side only
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters: urlFilters.map((f) => ({
        id: f.id,
        value: f.value,
      })),
    },
  })

  const handleClearFilters = () => {
    setUrlFilters([])
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
      <CardBuilder
        cards={cards?.data || []}
        onAddCard={createCardHandler}
        onUpdateCard={editCardHandler}
        onReorderCards={handleCardsReorder}
        onDeleteCard={handleDeleteCard}
        data={[]}
        showActions
        sp
      />

      {/* Global Filter Toolbar */}
      {charts?.data && charts.data.length > 0 && (
        <div className="mx-2 mb-4 p-4 border rounded-lg bg-card shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">Filters</h3>
              {urlFilters.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({urlFilters.length} active)
                </span>
              )}
            </div>
            <FilterConfigSheet
              filterConfigs={filterConfigs}
              onSave={handleSaveFilterConfigs}
            />
          </div>
          {columns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                No filters configured
              </p>
              <p className="text-xs text-muted-foreground">
                Click "Configure Filters" above to add filters
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              {columns.map((col) => {
                const columnDef = col as any
                const column = table.getColumn(columnDef.accessorKey)
                return column ? (
                  <DataTableToolbarFilter
                    key={columnDef.accessorKey}
                    column={column}
                    table={table}
                  />
                ) : null
              })}
              {urlFilters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-8 px-2 border-dashed border">
                  <X className="h-4 w-4 mr-1" />
                  Reset All
                </Button>
              )}
            </div>
          )}
        </div>
      )}

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
