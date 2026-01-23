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
  getAppConfig,
  postCard,
} from './api'
import type { ChartConfiguration } from './ChartBuilder'
import { ChartBuilderSheet } from './ChartBuilderSheet'
import { ChartItem } from './ChartItem'
import { FilterConfigSheet, type FilterConfig } from './FilterConfigSheet'
import { width } from './utils'
const THROTTLE_MS = 50

import { useParams } from 'react-router-dom'

export default function ChartPage() {
  const { appKey } = useParams()
  const [params, setParams] = useState<Object>({})
  const { data: getApplication } = getAppConfig(appKey || '', params)
  const applicationId = getApplication?.data?.id

  const [editingChart, setEditingChart] = useState<ChartConfiguration | null>(
    null,
  )
  const [open, setOpen] = useState(false)
  // const { data: charts } = getAllCharts(params)
  // const { data: cards } = getAllCards()
  // const { data: filtersData } = getAllFilters()
  const { mutate: bulkUpdateFiltersMutation } = bulkUpdateFilters()
  const { mutate: bulkUpdateCardsMutation } = bulkUpdateCards()
  const { mutate: createCardMutation } = postCard()
  const { mutate: editCardMutation } = editCard()
  const { mutate: deleteCardMutation } = deleteCard()

  // Helper to add applicationId to all mutation payloads
  function withAppId(payload: any) {
    return { ...payload, applicationId }
  }

  // Use filterConfigs from API data
  const filterConfigs = getApplication?.data.filters || []

  const handleDeleteCard = (id: number) => {
    if (!id) return
    const confirmed = confirm('Are you sure you want to delete this card?')
    if (!confirmed) return
    deleteCardMutation(withAppId({ cardId: id }))
  }

  const editCardHandler = (id: number, cardData: any) => {
    editCardMutation(withAppId({ id, ...cardData }))
  }

  const createCardHandler = (cardData: any) => {
    createCardMutation(withAppId(cardData))
  }

  const handleCardsReorder = (newCards: any[]) => {
    const reindexed = newCards.map((card, idx) => ({
      ...card,
      order: idx,
    }))
    bulkUpdateCardsMutation(withAppId({ data: reindexed }))
  }

  const { mutate: bulkUpdateMutation } = bulkUpdateCharts()
  const { mutate: deleteChartMutation } = deleteChartConfig()
  const handleDeleteChart = (chartKey: string) => {
    if (!chartKey) return
    const confirmed = confirm('Are you sure you want to delete this chart?')
    if (!confirmed) return
    deleteChartMutation(withAppId({ chartKey }))
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
    bulkUpdateMutation(withAppId({ data: reindexed }))
  }

  // Save filter configs using API
  const handleSaveFilterConfigs = (configs: FilterConfig[]) => {
    bulkUpdateFiltersMutation(withAppId({ data: configs }))
  }

  // Create column definitions for filtering based on enabled configs
  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (filterConfigs.length === 0) return []

    return filterConfigs.map(
      (config: {
        columnKey: any
        variant: any
        options: any
        placeholder: any
        spName: any
      }) => {
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
      },
    )
  }, [filterConfigs])

  // Use URL query params for filters
  const enabledFilterKeys = useMemo(
    () =>
      filterConfigs
        .filter((c: { enabled: any }) => c.enabled)
        .map((c: { columnKey: any }) => c.columnKey),
    [filterConfigs],
  )

  const [urlFilters, setUrlFilters] = useQueryState(
    'filters',
    getFiltersStateParser<any>(enabledFilterKeys).withDefault([]).withOptions({
      clearOnDefault: true,
      shallow: false,
      throttleMs: THROTTLE_MS,
    }),
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
    <div className="p-3">
      <div className="flex items-center justify-between">
        <TitleDescription
          title="Custom Charts"
          description="Create and manage custom charts based on your data."
          size="lg"
        />

        <div className="flex items-center gap-2">
          <ChartBuilderSheet
            data={[]}
            columns={[]}
            applicationId={applicationId}
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
        cards={getApplication?.data.cards || []}
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
        <div className="mx-2 mb-4 ">
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

      {getApplication?.data?.charts?.length === 0 ? (
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
            applicationId={applicationId}
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
        <div>
          <Sortable
            value={getApplication?.data?.charts || []}
            onValueChange={handleChartsReorder}
            getItemValue={(chart) => chart.chartKey}
            orientation="mixed">
            <SortableContent className="grid grid-cols-1 lg:grid-cols-6 gap-6">
              {getApplication?.data?.charts?.map(
                (chart: any, index: number) => (
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
                ),
              )}
            </SortableContent>

            <SortableOverlay>
              {({ value }) => {
                const chart = getApplication?.data?.charts?.find(
                  (c: any) => c.chartKey === value,
                )
                const chartIndex = getApplication?.data?.charts?.findIndex(
                  (c: any) => c.chartKey === value,
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
            (editingChart.data && editingChart.data[0]) || {},
          )}
          initialConfig={editingChart}
          applicationId={applicationId}
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
    </div>
  )
}
