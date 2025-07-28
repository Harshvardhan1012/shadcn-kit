'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import * as React from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts'

// Default chart config
const defaultConfig: ChartConfig = {
  chartData1: {
    label: 'Dataset 1',
    theme: {
      light: 'oklch(0.6 0.22 41.116)',
      dark: 'oklch(0.488 0.243 264.376)',
    },
  },
  chartData2: {
    label: 'Dataset 2',
    theme: {
      light: 'oklch(0.6 0.118 184.704)',
      dark: 'oklch(0.696 0.17 162.48)',
    },
  },
  chartData3: {
    label: 'Dataset 3',
    theme: {
      light: 'oklch(0.398 0.07 227.392)',
      dark: 'oklch(0.769 0.188 70.08)',
    },
  },
}

// Default pie chart colors
const DEFAULT_PIE_COLORS = [
  '#8884d8', // Purple
  '#82ca9d', // Green
  '#ffc658', // Yellow
  '#ff7300', // Orange
  '#00ff00', // Lime
  '#0088fe', // Blue
  '#ff0066', // Pink
  '#8dd1e1', // Light Blue
  '#d084d0', // Light Purple
  '#87d068', // Light Green
]

// Chart types
export type ChartType = 'area' | 'line' | 'bar' | 'pie'

export interface ChartDataPoint {
  [key: string]: string | number
}

export interface DynamicChartProps {
  /**
   * Title of the chart
   */
  title?: React.ReactNode
  /**
   * Description of the chart
   */
  description?: React.ReactNode
  /**
   * Footer content for the chart
   */
  footer?: React.ReactNode
  /**
   * Type of chart to render
   */
  chartType?: ChartType
  /**
   * Data to be displayed in the chart
   */
  data: ChartDataPoint[]
  /**
   * Chart configuration for styling and labels
   */
  config?: ChartConfig
  /**
   * X-axis dataKey
   */
  xAxisKey?: string
  /**
   * Y-axis dataKeys
   */
  yAxisKeys?: string[]
  /**
   * Whether to show the grid
   */
  showGrid?: boolean
  /**
   * Whether to show tooltips
   */
  showTooltip?: boolean
  /**
   * Whether to show the legend
   */
  showLegend?: boolean
  /**
   * Custom tooltip formatter
   * See recharts Formatter type: (value: ValueType, name: NameType, ...rest) => ReactNode
   */
  tooltipFormatter?: (
    value: unknown,
    name: string | number,
    ...rest: any[]
  ) => React.ReactNode
  /**
   * Tooltip label formatter
   */
  tooltipLabelFormatter?: (label: unknown, payload: unknown) => React.ReactNode
  /**
   * Legend position
   */
  legendPosition?: 'top' | 'bottom'
  /**
   * Additional class name for the card
   */
  className?: string
  /**
   * Height of the chart container
   */
  height?: number | string
  /**
   * Custom width for the chart container (defaults to responsive)
   */
  width?: number | string
  /**
   * Additional props for the specific chart type
   */
  chartProps?: Record<string, unknown>
  /**
   * Custom classnames for different chart elements
   */
  classNames?: {
    card?: string
    cardHeader?: string
    cardTitle?: string
    cardDescription?: string
    cardContent?: string
    cardFooter?: string
    chart?: string
  }
  /**
   * X-axis configuration
   */
  xAxis?: {
    hide?: boolean
    label?: string
    tickCount?: number
    tickFormatter?: (value: unknown) => string
    angle?: number
    fontSize?: number
    padding?: { left?: number; right?: number }
  }
  /**
   * Y-axis configuration
   */
  yAxis?: {
    hide?: boolean
    label?: string
    tickCount?: number
    tickFormatter?: (value: unknown) => string
    domain?: [number | string, number | string]
    fontSize?: number
    width?: number
    padding?: { top?: number; bottom?: number }
  }
  /**
   * Grid configuration
   */
  grid?: {
    horizontal?: boolean
    vertical?: boolean
    horizontalPoints?: number[]
    verticalPoints?: number[]
    strokeDasharray?: string
  }
  /**
   * Background color for the chart area (supports CSS variables)
   */
  backgroundColor?: string
  /**
   * Stacked chart (for area and bar charts)
   */
  stacked?: boolean
  /**
   * Reference lines to add to the chart
   */
  referenceLines?: Array<{
    y?: number
    x?: number | string
    label?: string
    stroke?: string
    strokeDasharray?: string
    strokeWidth?: number
  }>
  /**
   * Fallback component to display when data is empty
   */
  fallback?: React.ReactNode
  /**
   * Whether to show the chart type selector dropdown
   */
  showTypeSelector?: boolean
  /**
   * Callback when chart type changes
   */
  onChartTypeChange?: (type: ChartType) => void
  /**
   * Custom colors for pie chart segments
   */
  pieColors?: string[]
}

export function DynamicChart({
  title,
  description,
  footer,
  chartType = 'area',
  data = [],
  config = defaultConfig,
  xAxisKey = 'name',
  yAxisKeys = ['value'],
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  tooltipFormatter,
  tooltipLabelFormatter,
  legendPosition = 'bottom',
  className,
  height = 300,
  width = '100%',
  chartProps = {},
  classNames,
  showTypeSelector = true,
  onChartTypeChange,
  pieColors = DEFAULT_PIE_COLORS,
}: DynamicChartProps) {
  // Generate a unique ID for the chart
  const chartId = React.useId()

  // State for chart type
  const [currentChartType, setCurrentChartType] =
    React.useState<ChartType>(chartType)

  // Handle chart type change
  const handleChartTypeChange = (newType: ChartType) => {
    setCurrentChartType(newType)
    onChartTypeChange?.(newType)
  }

  // Filter out any yAxisKeys that don't exist in the data
  const validYAxisKeys = React.useMemo(() => {
    if (!data.length) return yAxisKeys

    return yAxisKeys.filter((key) => Object.keys(data[0]).includes(key))
  }, [data, yAxisKeys])

  // Render the appropriate chart based on chartType
  const renderChart = () => {
    switch (currentChartType) {
      case 'area':
        return (
          <AreaChart
            data={data}
            {...chartProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            {showTooltip && (
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={tooltipFormatter}
                    labelFormatter={tooltipLabelFormatter}
                  />
                }
              />
            )}
            {showLegend && (
              <ChartLegend
                content={<ChartLegendContent payload={undefined} />}
                verticalAlign={legendPosition}
              />
            )}
            {validYAxisKeys.map((key) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={`var(--color-${key})`}
                fill={`var(--color-${key})`}
                fillOpacity={0.5}
                {...(chartProps[key] || {})}
              />
            ))}
          </AreaChart>
        )

      case 'line':
        return (
          <LineChart
            data={data}
            {...chartProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            {showTooltip && (
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={tooltipFormatter}
                    labelFormatter={tooltipLabelFormatter}
                  />
                }
              />
            )}
            {showLegend && (
              <ChartLegend
                content={<ChartLegendContent payload={undefined} />}
                verticalAlign={legendPosition}
              />
            )}
            {validYAxisKeys.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={`var(--color-${key})`}
                {...(chartProps[key] || {})}
              />
            ))}
          </LineChart>
        )

      case 'bar':
        return (
          <BarChart
            data={data}
            {...chartProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            {showTooltip && (
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={tooltipFormatter}
                    labelFormatter={tooltipLabelFormatter}
                  />
                }
              />
            )}
            {showLegend && (
              <ChartLegend
                content={<ChartLegendContent payload={undefined} />}
                verticalAlign={legendPosition}
              />
            )}
            {validYAxisKeys.map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={`var(--color-${key})`}
                {...(chartProps[key] || {})}
              />
            ))}
          </BarChart>
        )

      case 'pie':
        // For pie charts, we need to transform multi-series data
        // If we have multiple yAxisKeys, create a pie slice for each key
        // Otherwise, use the data directly with the specified dataKey
        { const pieData =
          validYAxisKeys.length > 1
            ? validYAxisKeys.map((key) => {
                // Calculate the sum of values for this key
                const total = data.reduce((sum, item) => {
                  return (
                    sum +
                    (typeof item[key] === 'number' ? (item[key] as number) : 0)
                  )
                }, 0)

                return {
                  name: config[key]?.label || key,
                  value: total,
                  dataKey: key,
                }
              })
            : data.map((item, index) => ({
                ...item,
                fill: pieColors[index % pieColors.length],
              }))

        return (
          <PieChart {...chartProps}>
            <Pie
              data={pieData}
              nameKey={validYAxisKeys.length > 1 ? 'name' : xAxisKey}
              dataKey={validYAxisKeys.length > 1 ? 'value' : validYAxisKeys[0]}
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={
                typeof chartProps.innerRadius === 'string' ||
                typeof chartProps.innerRadius === 'number'
                  ? chartProps.innerRadius
                  : 0
              }
              paddingAngle={
                typeof chartProps.paddingAngle === 'number'
                  ? chartProps.paddingAngle
                  : 0
              }
              labelLine={chartProps.labelLine !== false}
              label={
                chartProps.label !== false &&
                (chartProps.label ||
                  ((entry) =>
                    `${entry.name}: ${
                      typeof entry.value === 'number'
                        ? Math.round(entry.value)
                        : entry.value
                    }`))
              }>
              {validYAxisKeys.length > 1
                ? pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))
                : data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        typeof entry.fill === 'number'
                          ? String(entry.fill)
                          : entry.fill || pieColors[index % pieColors.length]
                      }
                    />
                  ))}
            </Pie>
            {showTooltip && (
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={tooltipFormatter}
                    labelFormatter={tooltipLabelFormatter}
                  />
                }
              />
            )}
            {showLegend && (
              <ChartLegend
                content={<ChartLegendContent payload={undefined} />}
                verticalAlign={legendPosition}
              />
            )}
          </PieChart>
        ) }

      default:
        return <div>Unsupported chart type</div>
    }
  }

  return (
    <Card className={cn('w-full', className, classNames?.card)}>
      {(title || description || showTypeSelector) && (
        <CardHeader className={cn('relative', classNames?.cardHeader)}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {title && (
                <CardTitle className={classNames?.cardTitle}>{title}</CardTitle>
              )}
              {description && (
                <CardDescription className={classNames?.cardDescription}>
                  {description}
                </CardDescription>
              )}
            </div>
            {showTypeSelector && (
              <div className="ml-4">
                <Select
                  value={currentChartType}
                  onValueChange={handleChartTypeChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="area">Area</SelectItem>
                    <SelectItem value="line">Line</SelectItem>
                    <SelectItem value="bar">Bar</SelectItem>
                    <SelectItem value="pie">Pie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className={cn('p-6', classNames?.cardContent)}>
        <div style={{ height, width }}>
          <ChartContainer
            id={`dynamic-chart-${chartId}`}
            config={config}
            className={cn('h-full', classNames?.chart)}>
            {renderChart()}
          </ChartContainer>
        </div>
      </CardContent>
      {footer && (
        <CardFooter
          className={cn(
            'flex justify-between text-xs text-muted-foreground',
            classNames?.cardFooter
          )}>
          {footer}
        </CardFooter>
      )}
    </Card>
  )
}
