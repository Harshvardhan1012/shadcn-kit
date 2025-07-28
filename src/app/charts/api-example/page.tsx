'use client'

import { DynamicChart } from '@/components/chart/DynamicChart'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircleIcon, RefreshCwIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

// Types for the API response
interface ChartDataPoint {
  name: string
  data1: number
  data2: number
  data3: number
  [key: string]: string | number
}

interface ChartApiResponse {
  data: ChartDataPoint[]
  config: any
}

export default function ChartApiDemo() {
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area')
  const [dataPoints, setDataPoints] = useState(12)

  // Function to fetch data from the API
  const fetchChartData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/chart-data?points=${dataPoints}`)

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const result: ChartApiResponse = await response.json()
      setData(result.data)
      setConfig(result.config)
    } catch (err) {
      console.error('Error fetching chart data:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to fetch chart data'
      )
    } finally {
      setLoading(false)
    }
  }

  // Fetch data on initial load and when parameters change
  useEffect(() => {
    fetchChartData()
  }, [dataPoints])

  // Calculate some metrics for the chart summary
  const calculateMetrics = () => {
    if (!data.length) return { total: 0, average: 0, trend: 0 }

    const total = data.reduce((sum, point) => sum + point.data1, 0)
    const average = total / data.length

    // Calculate trend (comparing last value to first)
    const firstValue = data[0].data1
    const lastValue = data[data.length - 1].data1
    const trend = ((lastValue - firstValue) / firstValue) * 100

    return { total, average, trend }
  }

  const { total, average, trend } = calculateMetrics()

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Chart with API Data</h1>
        <p className="text-muted-foreground">
          Dynamic chart component loading data from an API endpoint
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Chart Controls</CardTitle>
          <CardDescription>
            Customize the chart display and data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Chart Type</h3>
              <div className="flex gap-2">
                <Button
                  variant={chartType === 'area' ? 'default' : 'outline'}
                  onClick={() => setChartType('area')}
                  size="sm">
                  Area
                </Button>
                <Button
                  variant={chartType === 'line' ? 'default' : 'outline'}
                  onClick={() => setChartType('line')}
                  size="sm">
                  Line
                </Button>
                <Button
                  variant={chartType === 'bar' ? 'default' : 'outline'}
                  onClick={() => setChartType('bar')}
                  size="sm">
                  Bar
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Data Points</h3>
              <div className="flex gap-2">
                <Button
                  variant={dataPoints === 6 ? 'default' : 'outline'}
                  onClick={() => setDataPoints(6)}
                  size="sm">
                  6 Months
                </Button>
                <Button
                  variant={dataPoints === 12 ? 'default' : 'outline'}
                  onClick={() => setDataPoints(12)}
                  size="sm">
                  12 Months
                </Button>
                <Button
                  variant={dataPoints === 24 ? 'default' : 'outline'}
                  onClick={() => setDataPoints(24)}
                  size="sm">
                  24 Months
                </Button>
              </div>
            </div>

            <div className="ml-auto">
              <Button
                onClick={fetchChartData}
                disabled={loading}
                size="sm"
                className="flex items-center gap-1">
                <RefreshCwIcon
                  className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                />
                Refresh Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl">
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                `$${total.toLocaleString()}`
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Monthly</CardDescription>
            <CardTitle className="text-2xl">
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                `$${Math.round(average).toLocaleString()}`
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overall Trend</CardDescription>
            <CardTitle
              className={`text-2xl ${
                trend >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                `${trend >= 0 ? '+' : ''}${trend.toFixed(1)}%`
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main chart */}
      {error ? (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <AlertCircleIcon className="h-5 w-5" />
              Error Loading Chart Data
            </CardTitle>
            <CardDescription className="text-red-400">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchChartData}>Try Again</Button>
          </CardContent>
        </Card>
      ) : loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-full max-w-md" />
          </CardHeader>
          <CardContent className="p-6">
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </CardContent>
        </Card>
      ) : (
        <DynamicChart
          title="Financial Performance"
          description={`Showing data for the last ${dataPoints} months`}
          chartType={chartType}
          data={data}
          config={config}
          xAxisKey="name"
          yAxisKeys={['data1', 'data2', 'data3']}
          height={400}
          showGrid={true}
          footer={
            <div className="flex justify-between w-full">
              <span>Last updated: {new Date().toLocaleString()}</span>
              <span>Source: Financial API</span>
            </div>
          }
          chartProps={{
            // Example of custom chart props
            data1: { strokeWidth: 2 },
            data2: { strokeWidth: 2 },
            data3: { strokeWidth: 2 },
          }}
        />
      )}

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>About This Chart</CardTitle>
          <CardDescription>
            How the dynamic chart component works
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This example demonstrates how to use the <code>DynamicChart</code>{' '}
            component with data loaded from an API endpoint. The chart offers
            the following features:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Dynamic data loading with loading states and error handling</li>
            <li>Support for multiple chart types (area, line, bar, pie)</li>
            <li>Customizable configuration for colors and labels</li>
            <li>Responsive design that adapts to different screen sizes</li>
            <li>Interactive tooltips and legends</li>
            <li>Dynamic footer with additional information</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
