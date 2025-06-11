'use client'

import { ChartType, DynamicChart } from '@/components/DynamicChart'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  DownloadIcon,
  InfoIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'

// Advanced usage example with more customization options
export default function AdvancedChartExamples() {
  // Sample data for time series
  const [timeSeriesData, setTimeSeriesData] = useState([
    { date: '2025-01', value1: 400, value2: 240, value3: 320 },
    { date: '2025-02', value1: 300, value2: 198, value3: 280 },
    { date: '2025-03', value1: 450, value2: 260, value3: 340 },
    { date: '2025-04', value1: 470, value2: 280, value3: 380 },
    { date: '2025-05', value1: 540, value2: 305, value3: 430 },
    { date: '2025-06', value1: 580, value2: 350, value3: 450 },
  ])

  // State for controlling advanced options
  const [chartType, setChartType] = useState<ChartType>('area')
  const [stacked, setStacked] = useState(false)
  const [showGrid, setShowGrid] = useState(true)
  const [showReferenceLines, setShowReferenceLines] = useState(false)
  const [dateFormat, setDateFormat] = useState('month')
  const [chartHeight, setChartHeight] = useState(400)

  // Format dates based on selection
  useEffect(() => {
    const formatData = () => {
      return timeSeriesData.map((item) => {
        const date = new Date(item.date)
        let formattedDate

        switch (dateFormat) {
          case 'month':
            formattedDate = date.toLocaleString('default', { month: 'short' })
            break
          case 'quarter':
            const quarter = Math.floor(date.getMonth() / 3) + 1
            formattedDate = `Q${quarter}`
            break
          case 'full':
            formattedDate = date.toLocaleString('default', {
              month: 'short',
              year: '2-digit',
            })
            break
          default:
            formattedDate = item.date
        }

        return { ...item, formattedDate }
      })
    }

    setTimeSeriesData((prevData) => {
      const baseData = prevData.map((item) => ({
        date: item.date,
        value1: item.value1,
        value2: item.value2,
        value3: item.value3,
      }))

      return formatData(baseData)
    })
  }, [dateFormat])

  // Calculate the threshold for reference line
  const averageValue =
    timeSeriesData.reduce((sum, item) => sum + item.value1, 0) /
    timeSeriesData.length

  // Advanced chart configuration
  const advancedConfig = {
    value1: {
      label: 'Revenue',
      theme: {
        light: 'oklch(0.65 0.2 140)',
        dark: 'oklch(0.55 0.25 150)',
      },
    },
    value2: {
      label: 'Expenses',
      theme: {
        light: 'oklch(0.65 0.22 240)',
        dark: 'oklch(0.55 0.25 245)',
      },
    },
    value3: {
      label: 'Profit',
      theme: {
        light: 'oklch(0.65 0.25 25)',
        dark: 'oklch(0.6 0.28 30)',
      },
    },
  }

  // Custom tooltip formatter
  const customTooltipFormatter = (value, name, entry) => {
    const formattedValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)

    // Find the label from config
    const label =
      Object.entries(advancedConfig).find(([key]) => key === entry.dataKey)?.[1]
        ?.label || name

    return (
      <span>
        <strong>{label}</strong>: {formattedValue}
      </span>
    )
  }

  // Dynamic footer that changes based on trends
  const DynamicFooter = () => {
    const firstValue = timeSeriesData[0].value1
    const lastValue = timeSeriesData[timeSeriesData.length - 1].value1
    const percentChange = ((lastValue - firstValue) / firstValue) * 100
    const isPositive = percentChange > 0

    return (
      <>
        <div className="flex items-center gap-1">
          {isPositive ? (
            <>
              <TrendingUpIcon className="h-3 w-3 text-green-500" />
              <span className="text-green-500">
                +{percentChange.toFixed(1)}% from{' '}
                {timeSeriesData[0].formattedDate}
              </span>
            </>
          ) : (
            <>
              <TrendingDownIcon className="h-3 w-3 text-red-500" />
              <span className="text-red-500">
                {percentChange.toFixed(1)}% from{' '}
                {timeSeriesData[0].formattedDate}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <InfoIcon className="h-3 w-3" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </>
    )
  }

  // Reference lines configuration
  const referenceLines = showReferenceLines
    ? [
        {
          y: averageValue,
          label: 'Average',
          stroke: 'var(--color-value1)',
          strokeDasharray: '3 3',
          strokeWidth: 2,
        },
        {
          y: averageValue * 1.2,
          label: 'Target',
          stroke: 'var(--color-value3)',
          strokeDasharray: '5 5',
          strokeWidth: 1,
        },
      ]
    : []

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Advanced Chart Examples</h1>
        <p className="text-muted-foreground">
          Showcasing advanced features and customization options of the
          DynamicChart component
        </p>
      </div>

      {/* Controls panel */}
      <Card>
        <CardHeader>
          <CardTitle>Chart Controls</CardTitle>
          <CardDescription>
            Customize the appearance and behavior of the chart
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label>Chart Type</Label>
              <Select
                defaultValue={chartType}
                onValueChange={setChartType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select
                defaultValue={dateFormat}
                onValueChange={setDateFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month Only</SelectItem>
                  <SelectItem value="quarter">Quarters</SelectItem>
                  <SelectItem value="full">Month and Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Chart Height</Label>
              <Select
                defaultValue={String(chartHeight)}
                onValueChange={(val) => setChartHeight(Number(val))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select height" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="300">Small (300px)</SelectItem>
                  <SelectItem value="400">Medium (400px)</SelectItem>
                  <SelectItem value="500">Large (500px)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="stacked"
                  checked={stacked}
                  onCheckedChange={setStacked}
                />
                <Label htmlFor="stacked">Stacked Chart</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="grid"
                  checked={showGrid}
                  onCheckedChange={setShowGrid}
                />
                <Label htmlFor="grid">Show Grid</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="refLines"
                  checked={showReferenceLines}
                  onCheckedChange={setShowReferenceLines}
                />
                <Label htmlFor="refLines">Reference Lines</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main advanced chart */}
      <DynamicChart
        title="Financial Performance 2025"
        description={`Monthly financial metrics with ${
          stacked ? 'stacked' : 'individual'
        } visualization`}
        chartType={chartType}
        data={timeSeriesData}
        config={advancedConfig}
        xAxisKey="formattedDate"
        yAxisKeys={['value1', 'value2', 'value3']}
        height={chartHeight}
        showGrid={showGrid}
        stacked={stacked}
        tooltipFormatter={customTooltipFormatter}
        referenceLines={referenceLines}
        footer={<DynamicFooter />}
        xAxis={{
          label: 'Time Period',
          fontSize: 12,
        }}
        yAxis={{
          label: 'Amount (USD)',
          tickFormatter: (value) => `$${value}`,
        }}
        grid={{
          horizontal: true,
          vertical: true,
          strokeDasharray: '3 3',
        }}
      />

      {/* Chart type showcase examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Example: Line chart with custom styling */}
        <DynamicChart
          title="Trend Analysis with Reference Line"
          description="Visualizing key metrics with target thresholds"
          chartType="line"
          data={timeSeriesData}
          config={advancedConfig}
          xAxisKey="formattedDate"
          yAxisKeys={['value1', 'value3']}
          height={300}
          referenceLines={[
            { y: averageValue * 1.1, label: 'Target', stroke: '#f43f5e' },
          ]}
          chartProps={{
            value1: {
              strokeWidth: 2,
              dot: { strokeWidth: 2, r: 4, fill: 'black' },
              activeDot: { r: 8, strokeWidth: 0 },
            },
            value3: {
              strokeWidth: 3,
              strokeDasharray: '10 5',
              dot: { strokeWidth: 2, r: 4, fill: 'black' },
              activeDot: { r: 8, strokeWidth: 0 },
            },
          }}
        />

        {/* Example: Bar chart with custom axis configuration */}
        <DynamicChart
          title="Revenue vs Profit Comparison"
          description="Monthly breakdown with custom formatting"
          chartType="bar"
          data={timeSeriesData}
          config={advancedConfig}
          xAxisKey="formattedDate"
          yAxisKeys={['value1', 'value3']}
          height={300}
          xAxis={{
            angle: -45,
            fontSize: 10,
          }}
          yAxis={{
            tickFormatter: (value) => `$${value / 1000}k`,
            tickCount: 5,
          }}
          chartProps={{
            value1: { radius: [8, 8, 0, 0] },
            value3: { radius: [8, 8, 0, 0] },
          }}
        />

        {/* Example: Area chart with gradient */}
        <DynamicChart
          title="Revenue Over Time"
          description="Smooth gradient visualization"
          chartType="area"
          data={timeSeriesData}
          config={{
            value1: {
              label: 'Revenue',
              theme: {
                light: 'oklch(0.6 0.22 200)',
                dark: 'oklch(0.5 0.25 210)',
              },
            },
          }}
          xAxisKey="formattedDate"
          yAxisKeys={['value1']}
          height={300}
          showLegend={false}
          chartProps={{
            value1: {
              strokeWidth: 2,
              fillOpacity: 0.8,
              activeDot: { r: 8, strokeWidth: 0 },
            },
          }}
          footer={
            <div className="flex justify-between w-full">
              <span>First 6 months of 2025</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6">
                <DownloadIcon className="h-3 w-3" />
              </Button>
            </div>
          }
        />

        {/* Example: Comparative bar chart */}
        <DynamicChart
          title="Revenue vs Expenses"
          description="Side-by-side comparison by month"
          chartType="bar"
          data={timeSeriesData}
          config={{
            value1: {
              label: 'Revenue',
              theme: {
                light: 'oklch(0.65 0.2 140)',
                dark: 'oklch(0.55 0.25 150)',
              },
            },
            value2: {
              label: 'Expenses',
              theme: {
                light: 'oklch(0.65 0.22 240)',
                dark: 'oklch(0.55 0.25 245)',
              },
            },
          }}
          xAxisKey="formattedDate"
          yAxisKeys={['value1', 'value2']}
          height={300}
          legendPosition="top"
          chartProps={{
            barGap: 4,
            value1: { radius: [4, 4, 0, 0] },
            value2: { radius: [4, 4, 0, 0] },
          }}
        />
      </div>

      {/* Additional resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <InfoIcon className="h-5 w-5" />
            About Advanced Chart Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The examples on this page demonstrate advanced features of the
            DynamicChart component:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Custom tooltips with formatting and styling</li>
            <li>Reference lines for thresholds and targets</li>
            <li>Stacked vs non-stacked visualization</li>
            <li>Custom axes configuration with labels and formatters</li>
            <li>Advanced styling per data series</li>
            <li>Dynamic footers that reflect data insights</li>
            <li>Responsive layout and customizable dimensions</li>
          </ul>
          <p className="pt-2">
            Check out the{' '}
            <code className="px-1.5 py-0.5 rounded bg-muted">
              DOCUMENTATION.md
            </code>{' '}
            file for a complete reference of all available options.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
