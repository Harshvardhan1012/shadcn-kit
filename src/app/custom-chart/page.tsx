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
  bulkUpdateFilters,
  deleteCard,
  deleteChartConfig,
  editCard,
  getAllCards,
  getAllCharts,
  getAllFilters,
  postCard,
} from './api'
import type { ChartConfiguration } from './ChartBuilder'
import { ChartBuilderSheet } from './ChartBuilderSheet'
import { ChartItem } from './ChartItem'
import { FilterConfigSheet, type FilterConfig } from './FilterConfigSheet'
const THROTTLE_MS = 50

const width ={
  full: {
    name: 'Full Width',
    className: 'lg:col-span-6',
  },
  half: {
    name: 'Half Width',
    className: 'lg:col-span-3',
  },
  third: {
    name: 'Third Width',
    className: 'lg:col-span-2',
  }
}

export default function ChartPage() {
  const [editingChart, setEditingChart] = useState<ChartConfiguration | null>(
    null
  )
  const [params, setParams] = useState<Object>({})
  const [open, setOpen] = useState(false)
  const { data: charts } = getAllCharts(params)
  const { data: cards } = getAllCards()
  const { data: filtersData } = getAllFilters()
  const { mutate: bulkUpdateFiltersMutation } = bulkUpdateFilters()
  const { mutate: bulkUpdateCardsMutation } = bulkUpdateCards()
  const { mutate: createCardMutation } = postCard()
  const { mutate: editCardMutation } = editCard()
  const { mutate: deleteCardMutation } = deleteCard()

  // Use filterConfigs from API data
  const filterConfigs = filtersData?.data || []
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

  // Save filter configs using API
  const handleSaveFilterConfigs = (configs: FilterConfig[]) => {
    bulkUpdateFiltersMutation({ data: configs })
  }

  // Create column definitions for filtering based on enabled configs
  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (filterConfigs.length === 0) return []

    return filterConfigs.map((config) => {
      return {
        accessorKey: config.columnKey,
        header: config.columnKey,
        enableColumnFilter: true,
        meta: {
          variant: config.variant,
          options: config.options ?? [],
          placeholder: config.placeholder,
          spName: config.spName,
        },
      }
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
        id: f.filterId,
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
      {
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
      }

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
            <SortableContent className="grid grid-cols-1 lg:grid-cols-6 gap-6">
              {charts?.data?.map((chart, index) => (
                <SortableItem
                  key={chart.chartKey}
                  value={chart.chartKey}
                  className={`group relative ${width[chart.width].className}`}>
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
