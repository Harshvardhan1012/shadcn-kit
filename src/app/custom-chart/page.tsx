'use client'

import { DynamicChart } from '@/components/chart/DynamicChart'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ChartConfiguration } from './chart-builder/ChartBuilder'
import { ChartBuilderSheet } from './chart-builder/ChartBuilderSheet'

interface StoredChart extends ChartConfiguration {
  id: string
}

// Component for each chart that uses TanStack Query
function ChartItem({
  chart,
  onDelete,
}: {
  chart: StoredChart
  onDelete: (key: string) => void
}) {
  return (
    <div className="relative">
      <DynamicChart
        title={
          <div className="flex items-center justify-between w-full">
            <span>{chart.title}</span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(chart.chartKey)}>
                Delete
              </Button>
            </div>
          </div>
        }
        description={
          <span className="text-xs text-muted-foreground">Chart Data</span>
        }
        chartType="bar"
        data={chart.data || []}
        config={chart.config}
        xAxisKey={chart.xAxisKey}
        yAxisKeys={chart.yAxisKeys}
        height={400}
        showTypeSelector={true}
        showDownload={true}
        downloadFilename={`${chart.title}-data`}
        chartKey={chart.chartKey}
      />
    </div>
  )
}

export default function ChartPage() {
  const [charts, setCharts] = useState<StoredChart[]>([])

  // Load charts from localStorage
  useEffect(() => {
    const loadCharts = () => {
      try {
        const storedCharts = localStorage.getItem('saved-charts')
        if (storedCharts) {
          const parsed = JSON.parse(storedCharts) as StoredChart[]
          setCharts(parsed)
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
    setCharts(updatedCharts)
    localStorage.setItem('saved-charts', JSON.stringify(updatedCharts))
  }


  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Charts Dashboard</h1>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {charts.map((chart) => (
            <ChartItem
              key={chart.chartKey}
              chart={chart}
              onDelete={handleDeleteChart}
            />
          ))}
        </div>
      )}
    </div>
  )
}
