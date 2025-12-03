'use client'

import { Button } from '@/components/ui/button'
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from '@/components/ui/sortable'
import { TitleDescription } from '@/components/ui/title-description'
import { GripVertical, Plus } from 'lucide-react'
import { useState } from 'react'
import type { ChartConfiguration } from './ChartBuilder'
import { ChartBuilderSheet } from './ChartBuilderSheet'
import { bulkUpdateCharts, deleteChartConfig, getAllCharts } from './api'
import { ChartItem } from './ChartItem'

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
    deleteChartMutation.mutate(chartKey)
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
