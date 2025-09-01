'use client'

import { DynamicChart } from '@/components/chart/DynamicChart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DownloadIcon,
  InfoIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from 'lucide-react'

// Advanced usage example with more customization options
export default function AdvancedChartExamples() {
  // Sample data for time series
  const timeSeriesData = [
    {
      date: '2025-01',
      value1: 400,
      value2: 240,
      value3: 320,
      formattedDate: 'Jan',
    },
    {
      date: '2025-02',
      value1: 300,
      value2: 198,
      value3: 280,
      formattedDate: 'Feb',
    },
    {
      date: '2025-03',
      value1: 450,
      value2: 260,
      value3: 340,
      formattedDate: 'Mar',
    },
    {
      date: '2025-04',
      value1: 470,
      value2: 280,
      value3: 380,
      formattedDate: 'Apr',
    },
    {
      date: '2025-05',
      value1: 540,
      value2: 305,
      value3: 430,
      formattedDate: 'May',
    },
    {
      date: '2025-06',
      value1: 580,
      value2: 350,
      value3: 450,
      formattedDate: 'Jun',
    },
  ]

  // State for controlling advanced options
  // Format dates based on selection

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

  return (
    <div className="container mx-auto p-10 space-y-8">
      {/* Main advanced chart */}
      <DynamicChart
        title="Financial Performance 2025"
        data={timeSeriesData}
        config={advancedConfig}
        xAxisKey="formattedDate"
        yAxisKeys={['value1', 'value2', 'value3']}
        footer={<DynamicFooter />}
        xAxis={{
          label: 'Time Period',
          fontSize: 12,
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
    </div>
  )
}
