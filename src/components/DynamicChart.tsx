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
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react'
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
  Sector,
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

// Default line colors for fallback
const DEFAULT_LINE_COLORS = [
  '#000000', // Purple
  '#82ca9d', // Green
  '#ffc658', // Yellow
  '#ff7300', // Orange
  '#0088fe', // Blue
  '#ff0066', // Pink
  '#8dd1e1', // Light Blue
  '#d084d0', // Light Purple
  '#87d068', // Light Green
  '#00ff00', // Lime
]

// Chart types
export type ChartType = 'area' | 'line' | 'bar' | 'pie' | 'table'

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
  tooltipFormatter?: (value: unknown, name: string | number, props: any) => React.ReactNode
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
   * Height of the chart container - if not provided, will auto-calculate based on data
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
  /**
   * Auto-sizing configuration
   */
  autoSize?: {
    /**
     * Minimum height for the chart
     */
    minHeight?: number
    /**
     * Maximum height for the chart
     */
    maxHeight?: number
    /**
     * Height per data point for bar charts
     */
    heightPerDataPoint?: number
    /**
     * Base height for charts
     */
    baseHeight?: number
    /**
     * Enable responsive width (defaults to true)
     */
    responsiveWidth?: boolean
    /**
     * Minimum width for the chart
     */
    minWidth?: number
    /**
     * Maximum width for the chart
     */
    maxWidth?: number
    /**
     * Width per data point for charts
     */
    widthPerDataPoint?: number
    /**
     * Base width for charts
     */
    baseWidth?: number
  }
  /**
   * Zoom configuration
   */
  zoom?: {
    /**
     * Enable zoom functionality
     */
    enabled?: boolean
    /**
     * Zoom increment/decrement factor
     */
    factor?: number
    /**
     * Minimum zoom level
     */
    minZoom?: number
    /**
     * Maximum zoom level
     */
    maxZoom?: number
    /**
     * Initial zoom level
     */
    initialZoom?: number
    /**
     * Show zoom controls
     */
    showControls?: boolean
    /**
     * Whether to highlight the active (clicked) data point
     */
    highlightActive?: boolean
  }
  /**
   * Callback when a data point is clicked in the chart
   */
  onDataPointClick?: (data: {
    activePayload: any
    activeLabel: string
    activeCoordinate: { x: number; y: number }
  }) => void

  /**
   * Whether to highlight the active (clicked) data point (for pie chart)
   */
  highlightActive?: boolean

  /**
   * Whether to show the download button
   */
  showDownload?: boolean

  /**
   * Custom filename for downloads (without extension)
   */
  downloadFilename?: string

  /**
   * Table configuration
   */
  tableConfig?: {
    /**
     * Whether to show row numbers
     */
    showRowNumbers?: boolean
    /**
     * Maximum height for the table container
     */
    maxHeight?: number
    /**
     * Whether to make the table sortable
     */
    sortable?: boolean
    /**
     * Custom column headers
     */
    columnHeaders?: Record<string, string>
    /**
     * Columns to hide in table view
     */
    hiddenColumns?: string[]
    /**
     * Custom cell renderer
     */
    cellRenderer?: (
      value: any,
      key: string,
      row: ChartDataPoint
    ) => React.ReactNode
  }
}

// Function to calculate chart dimensions based on data
function calculateChartDimensions(
  data: ChartDataPoint[],
  chartType: ChartType,
  autoSize?: DynamicChartProps['autoSize'],
  providedHeight?: number | string,
  providedWidth?: number | string
): {
  height: number | string
  width: number | string
  cardClassName: string
  chartWidth: number
} {
  const {
    minHeight = 200,
    maxHeight = 800,
    heightPerDataPoint = 40,
    baseHeight = 300,
    responsiveWidth = true,
    minWidth = 400,
    maxWidth = 2000,
    widthPerDataPoint = 50,
    baseWidth = 600,
  } = autoSize || {}

  let calculatedHeight: number | string = baseHeight
  let calculatedWidth: number | string = '100%'
  let cardClassName = 'w-full'
  let chartWidth = baseWidth

  // For table view, use different dimensions
  // if (chartType === 'table') {
  //   calculatedHeight = Math.min(
  //     maxHeight,
  //     Math.max(minHeight, data.length * 50)
  //   )
  //   chartWidth = baseWidth
  //   cardClassName = 'w-full'
  //   return {
  //     height: calculatedHeight,
  //     width: calculatedWidth,
  //     cardClassName,
  //     chartWidth,
  //   }
  // }

  // Calculate width based on data points
  if (providedWidth !== undefined) {
    calculatedWidth = providedWidth
    chartWidth = typeof providedWidth === 'number' ? providedWidth : baseWidth
  } else {
    // Calculate width based on chart type and data
    switch (chartType) {
      case 'bar':
      case 'line':
      case 'area':
        // For these chart types, width should scale with number of data points
        chartWidth = Math.max(
          minWidth,
          Math.min(maxWidth, data.length * widthPerDataPoint + 100)
        )
        break
      case 'pie':
        // Pie charts don't need as much width scaling
        chartWidth = Math.min(500, Math.max(300, baseWidth))
        break
      default:
        chartWidth = baseWidth
    }
  }

  // If explicit height is provided, use it
  if (providedHeight !== undefined) {
    calculatedHeight = providedHeight
  } else {
    // Calculate height based on chart type and data
    switch (chartType) {
      case 'bar': {
        // For bar charts, height should accommodate all bars
        const barHeight = Math.max(
          minHeight,
          Math.min(maxHeight, data.length * heightPerDataPoint + 100)
        )
        calculatedHeight = barHeight
        break
      }

      case 'pie':
        // Pie charts can be more compact
        calculatedHeight = Math.min(400, Math.max(300, data.length * 20 + 200))
        break

      case 'line':
      case 'area':
        // Line and area charts scale with data density
        if (data.length > 20) {
          calculatedHeight = Math.min(
            maxHeight,
            baseHeight + (data.length - 20) * 5
          )
        } else if (data.length < 5) {
          calculatedHeight = Math.max(minHeight, baseHeight - 50)
        } else {
          calculatedHeight = baseHeight
        }
        break

      default:
        calculatedHeight = baseHeight
    }
  }

  // Set card className based on chart width
  if (responsiveWidth) {
    if (chartWidth > 1200) {
      cardClassName = 'w-full overflow-x-auto'
    } else if (chartWidth > 800) {
      cardClassName = 'w-full min-w-[800px]'
    } else if (chartWidth > 600) {
      cardClassName = 'w-full min-w-[600px]'
    } else {
      cardClassName = 'w-full'
    }
  }

  return {
    height: calculatedHeight,
    width: calculatedWidth,
    cardClassName,
    chartWidth,
  }
}

// Helper function to get color for a data key
function getColorForKey(
  key: string,
  index: number,
  config: ChartConfig
): string {
  // First try to get color from CSS variable
  const cssVar = `var(--color-${key})`

  // Check if the config has a color defined
  if (config[key]?.theme) {
    return cssVar
  }

  // Fallback to default colors
  return DEFAULT_LINE_COLORS[index % DEFAULT_LINE_COLORS.length]
}

// Helper function to convert data to CSV format
function convertToCSV(data: ChartDataPoint[]): string {
  if (!data.length) return ''

  const headers = Object.keys(data[0])
  const csvRows = []

  // Add headers
  csvRows.push(headers.join(','))

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header]
      // Escape commas and quotes in values
      if (
        typeof value === 'string' &&
        (value.includes(',') || value.includes('"'))
      ) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    })
    csvRows.push(values.join(','))
  }

  return csvRows.join('\n')
}

// Helper function to download file
function downloadFile(content: string, filename: string, contentType: string) {
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Helper function to prepare data for different chart types
function prepareDownloadData(
  data: ChartDataPoint[],
  chartType: ChartType,
  yAxisKeys: string[],
  config: ChartConfig
): ChartDataPoint[] {
  switch (chartType) {
    case 'pie':
      if (yAxisKeys.length > 1) {
        // Multi-series pie chart - aggregate data
        return yAxisKeys.map((key) => {
          const total = data.reduce((sum, item) => {
            return (
              sum + (typeof item[key] === 'number' ? (item[key] as number) : 0)
            )
          }, 0)
          return {
            name:
              typeof config[key]?.label === 'string'
                ? config[key]?.label
                : String(key),
            value: total,
            dataKey: key,
          }
        })
      }
      return data
    case 'table':
    case 'area':
    case 'line':
    case 'bar':
    default:
      return data
  }
}

export function DynamicChart({
  title,
  description,
  footer,
  chartType = 'line',
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
  height,
  width,
  chartProps = {},
  classNames,
  showTypeSelector = true,
  onChartTypeChange,
  pieColors = DEFAULT_PIE_COLORS,
  autoSize,
  zoom = {
    enabled: true,
    factor: 0.2,
    minZoom: 0.5,
    maxZoom: 3,
    initialZoom: 1,
    showControls: true,
  },
  onDataPointClick,
  highlightActive = true,
  showDownload = true,
  downloadFilename = 'chart-data',
  tableConfig = {},
}: DynamicChartProps) {
  // Generate a unique ID for the chart
  const chartId = React.useId()

  // State for chart type
  const [currentChartType, setCurrentChartType] =
    React.useState<ChartType>(chartType)

  // State for zoom level
  const [zoomLevel, setZoomLevel] = React.useState(zoom.initialZoom || 1)

  // State for table sorting
  const [sortConfig, setSortConfig] = React.useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)

  // Handle chart type change
  const handleChartTypeChange = (newType: ChartType) => {
    setCurrentChartType(newType)
    onChartTypeChange?.(newType)
  }

  // Handle zoom functions
  const handleZoomIn = () => {
    if (!zoom.enabled) return
    setZoomLevel((prev) =>
      Math.min(zoom.maxZoom || 3, prev + (zoom.factor || 0.2))
    )
  }

  const handleZoomOut = () => {
    if (!zoom.enabled) return
    setZoomLevel((prev) =>
      Math.max(zoom.minZoom || 0.5, prev - (zoom.factor || 0.2))
    )
  }

  const handleZoomReset = () => {
    if (!zoom.enabled) return
    setZoomLevel(zoom.initialZoom || 1)
  }

  // Handle download
  const handleDownload = () => {
    const downloadData = prepareDownloadData(
      data,
      currentChartType,
      yAxisKeys,
      config
    )
    const csvContent = convertToCSV(downloadData)
    const filename = `${downloadFilename}-${currentChartType}.csv`
    downloadFile(csvContent, filename, 'text/csv')
  }

  // Handle table sorting
  const handleSort = (key: string) => {
    if (!tableConfig.sortable) return

    setSortConfig((current) => {
      if (current && current.key === key) {
        return current.direction === 'asc' ? { key, direction: 'desc' } : null
      }
      return { key, direction: 'asc' }
    })
  }

  // Filter out any yAxisKeys that don't exist in the data
  const validYAxisKeys = React.useMemo(() => {
    if (!data.length) return yAxisKeys

    return yAxisKeys.filter((key) => Object.keys(data[0]).includes(key))
  }, [data, yAxisKeys])

  // Calculate chart dimensions with zoom
  const chartDimensions = React.useMemo(() => {
    const baseDimensions = calculateChartDimensions(
      data,
      currentChartType,
      autoSize,
      height,
      width
    )

    // Apply zoom to dimensions if zoom is enabled and not table view
    if (zoom.enabled && currentChartType !== 'table') {
      const zoomedHeight =
        typeof baseDimensions.height === 'number'
          ? baseDimensions.height * zoomLevel
          : baseDimensions.height

      const zoomedWidth = baseDimensions.chartWidth * zoomLevel

      return {
        ...baseDimensions,
        height: zoomedHeight,
        chartWidth: zoomedWidth,
      }
    }

    return baseDimensions
  }, [data, currentChartType, autoSize, height, width, zoom.enabled, zoomLevel])

  // Prepare sorted data for table
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue
      }

      const aString = String(aValue)
      const bString = String(bValue)

      if (sortConfig.direction === 'asc') {
        return aString.localeCompare(bString)
      } else {
        return bString.localeCompare(aString)
      }
    })
  }, [data, sortConfig])

  const handleClick = (data: any) => {
    if (data) {
      onDataPointClick?.(data)
    }
  }

  const renderActiveShape = (props: any) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      percent,
      value,
      name,
    } = props

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <text
          x={cx}
          y={cy}
          dy={-20}
          textAnchor="middle"
          fill={fill}>
          {name}
        </text>
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          fill="#333">
          {value}
        </text>
        <text
          x={cx}
          y={cy}
          dy={20}
          textAnchor="middle"
          fill="#999">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    )
  }

  // Render table view
  const renderTable = () => {
    const {
      showRowNumbers = false,
      columnHeaders = {},
      hiddenColumns = [],
      cellRenderer,
    } = tableConfig

    if (!data.length)
      return <div className="text-center py-8">No data available</div>

    const columns = Object.keys(data[0]).filter(
      (key) => !hiddenColumns.includes(key)
    )

    return (
      <div
        className="border rounded-md overflow-auto w-full h-full">
        <Table>
          <TableHeader>
            <TableRow>
              {showRowNumbers && (
                <TableHead className="w-full text-center">#</TableHead>
              )}
              {columns.map((key) => (
                <TableHead
                  key={key}
                  className={
                    tableConfig.sortable ? 'cursor-pointer hover:bg-muted' : ''
                  }
                  onClick={() => handleSort(key)}>
                  <div>
                    {columnHeaders[key] || key}
                    {tableConfig.sortable && sortConfig?.key === key && (
                      <span className="ml-2">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row, index) => (
              <TableRow key={index}>
                {showRowNumbers && (
                  <TableCell className="text-center text-muted-foreground">
                    {index + 1}
                  </TableCell>
                )}
                {columns.map((key) => (
                  <TableCell key={key}>
                    {cellRenderer ? cellRenderer(row[key], key, row) : row[key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  // Render the appropriate chart based on chartType
  const renderChart = () => {
    if (currentChartType === 'table') {
      return renderTable()
    }

    const commonProps = {
      data,
      width: chartDimensions.chartWidth,
      height:
        typeof chartDimensions.height === 'number'
          ? chartDimensions.height
          : 300,
      ...chartProps,
    }

    switch (currentChartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
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
            {validYAxisKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={getColorForKey(key, index, config)}
                fill={getColorForKey(key, index, config)}
                fillOpacity={0.5}
                {...(chartProps[key] || {})}
              />
            ))}
          </AreaChart>
        )

      case 'line':
        return (
          <LineChart {...commonProps}>
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
            {validYAxisKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={getColorForKey(key, index, config)}
                strokeWidth={2}
                dot={{
                  fill: getColorForKey(key, index, config),
                  strokeWidth: 1,
                  r: 2,
                }}
                activeDot={{ r: 4, strokeWidth: 1 }}
                {...(chartProps[key] || {})}
              />
            ))}
          </LineChart>
        )

      case 'bar':
        return (
          <BarChart {...commonProps}>
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
            {validYAxisKeys.map((key, index) => (
              <Bar
                key={index}
                dataKey={key}
                fill={getColorForKey(key, index, config)}
                onClick={(e: any) => {
                  handleClick(e)
                }}
                {...(chartProps[key] || {})}
              />
            ))}
          </BarChart>
        )

      case 'pie': {
        // For pie charts, we need to transform multi-series data
        const pieData =
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
          <PieChart {...commonProps}>
            <Pie
              data={pieData}
              nameKey={validYAxisKeys.length > 1 ? 'name' : xAxisKey}
              dataKey={validYAxisKeys.length > 1 ? 'value' : validYAxisKeys[0]}
              cx="50%"
              cy="50%"
              outerRadius={
                typeof chartProps.outerRadius === 'number'
                  ? chartProps.outerRadius
                  : Math.min(
                      120,
                      (typeof chartDimensions.height === 'number'
                        ? chartDimensions.height
                        : 300) * 0.35
                    )
              }
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
                chartProps
                  ? chartProps.label ?? ((entry: any) => entry.name)
                  : false
              }
              activeShape={highlightActive ? renderActiveShape : undefined}
              onClick={(data: any) => {
                handleClick(data)
              }}>
              {validYAxisKeys.length > 1
                ? pieData.map((_, index) => (
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
        )
      }

      default:
        return <div>Unsupported chart type</div>
    }
  }

  return (
    <Card
      className={cn(
        'gap-4',
        chartDimensions.cardClassName,
        className,
        classNames?.card
      )}>
      {(title ||
        description ||
        showTypeSelector ||
        (zoom.enabled && zoom.showControls)) && (
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
            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              {zoom.enabled && zoom.showControls && (
                <div className="flex items-center gap-1 border rounded-md p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= (zoom.minZoom || 0.5)}
                    className="h-8 w-8 p-0"
                    title="Zoom Out">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground px-2 min-w-[3rem] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= (zoom.maxZoom || 3)}
                    className="h-8 w-8 p-0"
                    title="Zoom In">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomReset}
                    className="h-8 w-8 p-0"
                    title="Reset Zoom">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Chart Type Selector */}
              {showTypeSelector && (
                <div>
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
                      <SelectItem value="table">Table</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Download Button */}
              {showDownload && (
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleDownload}
                  className="ml-1"
                  title="Download CSV">
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className={cn('p-1', classNames?.cardContent)}>
        <div
          style={{
            height: chartDimensions.height,
            width: '100%',
            overflow: 'auto',
          }}>
          <ChartContainer
            id={`dynamic-chart-${chartId}`}
            config={config}
            className={cn('h-full', classNames?.chart)}
            style={{
              minWidth: chartDimensions.chartWidth,
              width: chartDimensions.chartWidth,
            }}>
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
