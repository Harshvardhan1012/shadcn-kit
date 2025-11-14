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
import { GripVertical, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ChartConfiguration } from './ChartBuilder'
import { ChartBuilderSheet } from './ChartBuilderSheet'

interface StoredChart extends ChartConfiguration {
  id: string
}

// Component for each chart that uses TanStack Query
function ChartItem({
  chart,
  onDelete,
  onEdit,
  index,
}: {
  chart: StoredChart
  onDelete: (key: string) => void
  onEdit: (chart: StoredChart) => void
  index?: number
}) {
  return (
    <div className="relative">
      <DynamicChart
        title={chart.title}
        chartType="bar"
        data={chart.data || []}
        config={chart.config}
        xAxisKey={chart.xAxisKey}
        yAxisKeys={chart.yAxisKeys}
        downloadFilename={`${chart.title}-data`}
        chartKey={chart.chartKey}
        height={300}
        legendPosition='top'
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
  const [charts, setCharts] = useState<StoredChart[]>([])
  const [editingChart, setEditingChart] = useState<StoredChart | null>(null)

  // Load charts from localStorage
  useEffect(() => {
    const loadCharts = () => {
      try {
        const storedCharts = localStorage.getItem('saved-charts')
        if (storedCharts) {
          const parsed = JSON.parse(storedCharts) as StoredChart[]
          // Sort by index if available
          const sorted = parsed.sort((a, b) => (a.index || 0) - (b.index || 0))
          setCharts(sorted)
        }
      } catch (e) {
        console.error('Failed to load charts:', e)
      }
    }

    loadCharts()

    // Listen for storage changes
    const handleStorageChange = () => {
      loadCharts()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Delete a chart
  const handleDeleteChart = (chartKey: string) => {
    const updatedCharts = charts.filter((c) => c.chartKey !== chartKey)
    // Update indices after deletion
    const reindexed = updatedCharts.map((chart, idx) => ({
      ...chart,
      index: idx,
    }))
    setCharts(reindexed)
    localStorage.setItem('saved-charts', JSON.stringify(reindexed))
  }

  // Edit a chart
  const handleEditChart = (chart: StoredChart) => {
    setEditingChart(chart)
  }

  // Handle chart reordering
  const handleChartsReorder = (newCharts: StoredChart[]) => {
    // Update indices based on new order
    const reindexed = newCharts.map((chart, idx) => ({
      ...chart,
      index: idx,
    }))
    setCharts(reindexed)
    localStorage.setItem('saved-charts', JSON.stringify(reindexed))
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
            onSave={(config) => {
              console.log('Chart saved:', config)
              // Reload charts from localStorage
              const storedCharts = localStorage.getItem('saved-charts')
              if (storedCharts) {
                setCharts(JSON.parse(storedCharts))
              }
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

      {charts.length === 0 ? (
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
            onSave={(config) => {
              console.log('Chart saved:', config)
              // Reload charts from localStorage
              const storedCharts = localStorage.getItem('saved-charts')
              if (storedCharts) {
                setCharts(JSON.parse(storedCharts))
              }
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
        <div className="p-4">
          <Sortable
            value={charts}
            onValueChange={handleChartsReorder}
            getItemValue={(chart) => chart.chartKey}
            orientation="mixed">
            <SortableContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {charts.map((chart, index) => (
                <SortableItem
                  key={chart.chartKey}
                  value={chart.chartKey}
                  className={`group relative ${
                    index === 0 ? 'lg:col-span-2' : ''
                  }`}>
                  <div className="absolute top-8 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
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
                  <ChartItem
                    chart={chart}
                    onDelete={handleDeleteChart}
                    onEdit={handleEditChart}
                    index={index}
                  />
                </SortableItem>
              ))}
            </SortableContent>

            <SortableOverlay>
              {({ value }) => {
                const chart = charts.find((c) => c.chartKey === value)
                const chartIndex = charts.findIndex((c) => c.chartKey === value)
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

      {/* Chart Builder Sheet for Editing */}
      {editingChart && (
        <ChartBuilderSheet
          data={editingChart.data || []}
          columns={[]}
          initialConfig={editingChart}
          onSave={(config) => {
            // Update the edited chart in localStorage
            const updatedCharts = charts.map((c) =>
              c.chartKey === editingChart.chartKey ? { ...c, ...config } : c
            )
            setCharts(updatedCharts)
            localStorage.setItem('saved-charts', JSON.stringify(updatedCharts))
            setEditingChart(null)
          }}
          onCancel={() => setEditingChart(null)}
          triggerButton={null}
          autoOpen={true}
        />
      )}
    </>
  )
}
