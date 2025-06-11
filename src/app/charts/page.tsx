'use client'
import { DynamicChart } from '@/components/DynamicChart'
import { Button } from '@/components/ui/button'
import {
  DownloadIcon,
  InfoIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from 'lucide-react'
import { useState } from 'react'

// Sample data for the charts
const areaChartData = [
  { name: 'Jan', chartData1: 140, chartData2: 100, chartData3: 80 },
  { name: 'Feb', chartData1: 180, chartData2: 120, chartData3: 90 },
  { name: 'Mar', chartData1: 160, chartData2: 140, chartData3: 110 },
  { name: 'Apr', chartData1: 210, chartData2: 160, chartData3: 130 },
  { name: 'May', chartData1: 290, chartData2: 180, chartData3: 140 },
  { name: 'Jun', chartData1: 330, chartData2: 210, chartData3: 150 },
  { name: 'Jul', chartData1: 310, chartData2: 190, chartData3: 170 },
  { name: 'Aug', chartData1: 350, chartData2: 230, chartData3: 180 },
]

const barChartData = [
  { name: 'Q1', revenue: 4000, profit: 2400, expenses: 1800 },
  { name: 'Q2', revenue: 5000, profit: 3100, expenses: 2200 },
  { name: 'Q3', revenue: 6000, profit: 3600, expenses: 2400 },
  { name: 'Q4', revenue: 7000, profit: 4200, expenses: 2800 },
]

const pieChartData = [
  { name: 'Product A', value: 400 },
  { name: 'Product B', value: 300 },
  { name: 'Product C', value: 300 },
  { name: 'Product D', value: 200 },
]

// Custom chart configuration
const customConfig = {
  chartData1: {
    label: 'Current Year',
    theme: {
      light: 'oklch(0.6 0.22 200)',
      dark: 'oklch(0.5 0.25 210)',
    },
  },
  chartData2: {
    label: 'Previous Year',
    theme: {
      light: 'oklch(0.7 0.15 160)',
      dark: 'oklch(0.6 0.18 170)',
    },
  },
  chartData3: {
    label: 'Target',
    theme: {
      light: 'oklch(0.5 0.12 100)',
      dark: 'oklch(0.4 0.15 110)',
    },
  },
  revenue: {
    label: 'Revenue',
    theme: {
      light: 'oklch(0.65 0.2 140)',
      dark: 'oklch(0.55 0.25 150)',
    },
  },
  profit: {
    label: 'Profit',
    theme: {
      light: 'oklch(0.65 0.25 25)',
      dark: 'oklch(0.6 0.28 30)',
    },
  },
  expenses: {
    label: 'Expenses',
    theme: {
      light: 'oklch(0.65 0.22 240)',
      dark: 'oklch(0.55 0.25 245)',
    },
  },
  value: {
    label: 'Sales',
    theme: {
      light: 'oklch(0.5 0.15 180)',
      dark: 'oklch(0.4 0.18 190)',
    },
  },
}

export default function ChartDemo() {
  // State for controlling chart options
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar' | 'pie'>(
    'area'
  )
  const [showGrid, setShowGrid] = useState(true)
  const [showTooltip, setShowTooltip] = useState(true)
  const [showLegend, setShowLegend] = useState(true)
  const [legendPosition, setLegendPosition] = useState<'top' | 'bottom'>(
    'bottom'
  )

  // Sample custom footer component
  const CustomFooter = () => {
    const currentDate = new Date().toLocaleDateString()

    return (
      <>
        <div className="flex items-center gap-1">
          <InfoIcon className="h-3 w-3" />
          <span>Last updated: {currentDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6">
            <DownloadIcon className="h-3 w-3" />
          </Button>
        </div>
      </>
    )
  }

  // Sample dynamic footer based on data trends
  const DynamicFooter = () => {
    const lastDataPoint = areaChartData[areaChartData.length - 1]
    const previousDataPoint = areaChartData[areaChartData.length - 2]
    const trend = lastDataPoint.chartData1 > previousDataPoint.chartData1

    return (
      <>
        <div className="flex items-center gap-1">
          {trend ? (
            <>
              <TrendingUpIcon className="h-3 w-3 text-green-500" />
              <span className="text-green-500">
                +
                {(
                  ((lastDataPoint.chartData1 - previousDataPoint.chartData1) /
                    previousDataPoint.chartData1) *
                  100
                ).toFixed(1)}
                % from previous month
              </span>
            </>
          ) : (
            <>
              <TrendingDownIcon className="h-3 w-3 text-red-500" />
              <span className="text-red-500">
                {(
                  ((lastDataPoint.chartData1 - previousDataPoint.chartData1) /
                    previousDataPoint.chartData1) *
                  100
                ).toFixed(1)}
                % from previous month
              </span>
            </>
          )}
        </div>
        <span>Monthly data</span>
      </>
    )
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      {' '}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dynamic Chart Examples</h1>
        <p className="text-muted-foreground">
          Showcasing the flexibility of the DynamicChart component with various
          configurations
        </p>
        <div className="mt-4">
          <Button
            variant="outline"
            asChild>
            <a href="/charts/advanced">View Advanced Examples</a>
          </Button>
          <Button
            variant="outline"
            className="ml-2"
            asChild>
            <a href="/charts/api-example">View API Example</a>
          </Button>
        </div>
      </div>
      {/* Controls for the main chart */}
      <div className="grid gap-4 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold">Chart Controls</h2>
        <div className="flex flex-wrap gap-2">
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
          <Button
            variant={chartType === 'pie' ? 'default' : 'outline'}
            onClick={() => setChartType('pie')}
            size="sm">
            Pie
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={showGrid ? 'default' : 'outline'}
            onClick={() => setShowGrid(!showGrid)}
            size="sm">
            {showGrid ? 'Hide Grid' : 'Show Grid'}
          </Button>
          <Button
            variant={showTooltip ? 'default' : 'outline'}
            onClick={() => setShowTooltip(!showTooltip)}
            size="sm">
            {showTooltip ? 'Hide Tooltip' : 'Show Tooltip'}
          </Button>
          <Button
            variant={showLegend ? 'default' : 'outline'}
            onClick={() => setShowLegend(!showLegend)}
            size="sm">
            {showLegend ? 'Hide Legend' : 'Show Legend'}
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setLegendPosition(legendPosition === 'top' ? 'bottom' : 'top')
            }
            size="sm">
            Legend: {legendPosition}
          </Button>
        </div>
      </div>
      {/* Main dynamic chart */}
      <DynamicChart
        title="Monthly Performance Metrics"
        description="Comparing key performance indicators over the past 8 months"
        chartType={chartType}
        data={
          chartType === 'pie'
            ? pieChartData
            : chartType === 'bar'
            ? barChartData
            : areaChartData
        }
        config={customConfig}
        xAxisKey="name"
        yAxisKeys={
          chartType === 'pie'
            ? ['value']
            : chartType === 'bar'
            ? ['revenue', 'profit', 'expenses']
            : ['chartData1', 'chartData2', 'chartData3']
        }
        showGrid={showGrid}
        showTooltip={showTooltip}
        showLegend={showLegend}
        legendPosition={legendPosition}
        height={400}
        footer={<DynamicFooter />}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Example: Area chart with custom footer */}
        <DynamicChart
          title="Sales Performance"
          description="Monthly sales figures for the current year"
          chartType="area"
          data={areaChartData}
          config={customConfig}
          xAxisKey="name"
          yAxisKeys={['chartData1']}
          showGrid={true}
          footer={<CustomFooter />}
        />

        {/* Example: Bar chart with reduced height */}
        <DynamicChart
          title="Quarterly Financial Summary"
          description="Revenue, profit, and expenses by quarter"
          chartType="bar"
          data={barChartData}
          config={customConfig}
          xAxisKey="name"
          yAxisKeys={['revenue', 'profit', 'expenses']}
          height={300}
        />

        {/* Example: Line chart with limited data series */}
        <DynamicChart
          title="Target vs Actual"
          description="Comparing performance against targets"
          chartType="line"
          data={areaChartData}
          config={customConfig}
          xAxisKey="name"
          yAxisKeys={['chartData1', 'chartData3']}
          legendPosition="top"
          footer={<span>Showing only current performance vs target</span>}
        />

        {/* Example: Pie chart */}
        <DynamicChart
          title="Product Sales Distribution"
          description="Breakdown of sales by product category"
          chartType="pie"
          data={pieChartData}
          config={customConfig}
          xAxisKey="name"
          yAxisKeys={['value']}
          height={300}
          footer={<span>Based on Q2 2025 sales data</span>}
        />
      </div>
    </div>
  )
}
