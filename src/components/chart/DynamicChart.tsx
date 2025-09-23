import { cn } from '@/lib/utils'
import { Button } from './../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './../ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from './../ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './../ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './../ui/table'
import { Download, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
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

// Type definitions for Recharts components
interface ChartClickData {
  activePayload?: Array<{
    payload: ChartDataPoint
    dataKey: string
    value: number | string
  }>
  activeLabel?: string
  activeCoordinate?: { x: number; y: number }
}

interface PieChartEntryData {
  [key: string]: string | number | undefined
}

interface RechartsActiveShapeProps {
  cx: number
  cy: number
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
  fill: string
  percent: number
  value: number
  name: string
  payload?: ChartDataPoint
  [key: string]: unknown
}

interface RechartsTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number | string
    name: string
    dataKey: string
    color?: string
    payload?: ChartDataPoint
  }>
  label?: string | number
}

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
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#00ff00',
  '#0088fe',
  '#ff0066',
  '#8dd1e1',
  '#d084d0',
  '#87d068',
]

// Default line colors for fallback
const DEFAULT_LINE_COLORS = [
  '#ffca9d',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#0088fe',
  '#ff0066',
  '#8dd1e1',
  '#d084d0',
  '#87d068',
  '#00ff00',
]

// Chart types
export type ChartType = 'area' | 'line' | 'bar' | 'pie' | 'table' | 'donut'

export interface ChartDataPoint {
  [key: string]: string | number
}

export interface DynamicChartProps {
  title?: React.ReactNode
  description?: React.ReactNode
  footer?: React.ReactNode
  chartType?: ChartType
  data: ChartDataPoint[]
  config?: ChartConfig
  xAxisKey?: string
  yAxisKeys?: string[]
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  tooltipFormatter?: (
    value: unknown,
    name: string | number,
    props: RechartsTooltipProps
  ) => React.ReactNode
  tooltipLabelFormatter?: (label: unknown, payload: unknown) => React.ReactNode
  legendPosition?: 'top' | 'bottom'
  className?: string
  height?: number | string
  chartProps?: Record<string, unknown>
  classNames?: {
    card?: string
    cardHeader?: string
    cardTitle?: string
    cardDescription?: string
    cardContent?: string
    cardFooter?: string
    chart?: string
  }
  xAxis?: {
    hide?: boolean
    label?: string
    tickCount?: number
    tickFormatter?: (value: unknown) => string
    angle?: number
    fontSize?: number
    padding?: { left?: number; right?: number }
  }
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
  zoom?: {
    enabled?: boolean
    factor?: number
    minZoom?: number
    maxZoom?: number
    initialZoom?: number
    showControls?: boolean
  }
  showTypeSelector?: boolean
  onChartTypeChange?: (type: ChartType) => void
  pieColors?: string[]
  onDataPointClick?: (data: ChartClickData) => void
  highlightActive?: boolean
  showDownload?: boolean
  downloadFilename?: string
  tableConfig?: {
    showRowNumbers?: boolean
    sortable?: boolean
    columnHeaders?: Record<string, string>
    hiddenColumns?: string[]
    cellRenderer?: (
      value: string | number,
      key: string,
      row: ChartDataPoint
    ) => React.ReactNode
  }
}

// Helper functions (getColorForKey, convertToCSV, downloadFile, prepareDownloadData) remain the same...
function getColorForKey(
  key: string,
  index: number,
  config: ChartConfig
): string {
  const cssVar = `var(--color-${key})`
  if (config[key]?.theme) return cssVar
  return DEFAULT_LINE_COLORS[index % DEFAULT_LINE_COLORS.length]
}

function convertToCSV(data: ChartDataPoint[]): string {
  if (!data.length) return ''
  const headers = Object.keys(data[0])
  const csvRows = [headers.join(',')]
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header]
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

function prepareDownloadData(
  data: ChartDataPoint[],
  chartType: ChartType,
  yAxisKeys: string[],
  config: ChartConfig
): ChartDataPoint[] {
  if (chartType === 'pie' && yAxisKeys.length > 1) {
    return yAxisKeys.map((key) => {
      const total = data.reduce(
        (sum, item) =>
          sum + (typeof item[key] === 'number' ? (item[key] as number) : 0),
        0
      )
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
  height = 400, // Default height for the container
  chartProps = {},
  classNames,
  zoom = {
    enabled: true,
    factor: 0.2,
    minZoom: 0.5,
    maxZoom: 3,
    initialZoom: 1,
    showControls: true,
  },
  showTypeSelector = true,
  onChartTypeChange,
  pieColors = DEFAULT_PIE_COLORS,
  onDataPointClick,
  highlightActive = true,
  showDownload = true,
  downloadFilename = 'chart-data',
  tableConfig = {},
}: DynamicChartProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = React.useState(500) // Default width
  const [currentChartType, setCurrentChartType] =
    React.useState<ChartType>(chartType)
  const [zoomLevel, setZoomLevel] = React.useState(zoom.initialZoom || 1)
  const [sortConfig, setSortConfig] = React.useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)

  // Measure the container width to make the chart responsive
  React.useLayoutEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        setContainerWidth(entry.contentRect.width)
      }
    })
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current)
    }
  }, [])

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

  const handleChartTypeChange = (newType: ChartType) => {
    setCurrentChartType(newType)
    onChartTypeChange?.(newType)
  }

  const handleDownload = () => {
    const downloadData = prepareDownloadData(
      data,
      currentChartType,
      yAxisKeys,
      config
    )
    const csvContent = convertToCSV(downloadData)
    downloadFile(
      `${downloadFilename}-${currentChartType}.csv`,
      csvContent,
      'text/csv'
    )
  }

  const handleSort = (key: string) => {
    if (!tableConfig.sortable) return
    setSortConfig((current) =>
      current && current.key === key && current.direction === 'asc'
        ? { key, direction: 'desc' }
        : { key, direction: 'asc' }
    )
  }

  const validYAxisKeys = React.useMemo(() => {
    if (!data.length) return yAxisKeys
    return yAxisKeys.filter((key) => Object.keys(data[0]).includes(key))
  }, [data, yAxisKeys])

  const chartDimensions = React.useMemo(() => {
    const baseHeight = typeof height === 'number' ? height : 400
    return {
      height: baseHeight * zoomLevel,
      width: containerWidth * zoomLevel,
    }
  }, [containerWidth, height, zoomLevel])

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key],
        bValue = b[sortConfig.key]
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue
      }
      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue))
    })
  }, [data, sortConfig])

  const handleClick = (clickData: ChartClickData | PieChartEntryData) => {
    if (clickData) onDataPointClick?.(clickData as ChartClickData)
  }

  const renderActiveShape = (props: unknown) => {
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
    } = props as RechartsActiveShapeProps
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
          fill="#999">{`(${(percent * 100).toFixed(2)}%)`}</text>
      </g>
    )
  }

  const renderTable = () => {
    // ... Table rendering logic remains the same
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
        className="border rounded-md overflow-auto w-full"
        style={{ height: typeof height === 'number' ? height : '100%' }}>
        <Table>
          <TableHeader>
            <TableRow>
              {showRowNumbers && (
                <TableHead className="text-center">#</TableHead>
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

  const renderChart = () => {
    const commonProps = {
      data,
      width: chartDimensions.width,
      height: chartDimensions.height,
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
                content={<ChartLegendContent />}
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
                content={<ChartLegendContent />}
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
                content={<ChartLegendContent />}
                verticalAlign={legendPosition}
              />
            )}
            {validYAxisKeys.map((key, index) => (
              <Bar
                key={index}
                dataKey={key}
                fill={getColorForKey(key, index, config)}
                onClick={(e: ChartClickData) => {
                  handleClick(e)
                }}
                {...(chartProps[key] || {})}
              />
            ))}
          </BarChart>
        )
      case 'pie':
      case 'donut':
        const pieData =
          validYAxisKeys.length > 1
            ? validYAxisKeys.map((key) => ({
                name: config[key]?.label || key,
                value: data.reduce(
                  (sum, item) => sum + (Number(item[key]) || 0),
                  0
                ),
              }))
            : data
        return (
          <PieChart {...commonProps}>
            <Pie
              data={pieData}
              nameKey={xAxisKey}
              dataKey={validYAxisKeys[0]}
              cx="50%"
              cy="50%"
              outerRadius="80%"
              innerRadius={currentChartType === 'donut' ? '60%' : '0%'}
              activeShape={highlightActive ? renderActiveShape : undefined}
              onClick={handleClick}>
              {pieData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={pieColors[index % pieColors.length]}
                />
              ))}
            </Pie>
            {showTooltip && (
              <ChartTooltip
                content={<ChartTooltipContent formatter={tooltipFormatter} />}
              />
            )}
            {showLegend && (
              <ChartLegend
                content={<ChartLegendContent />}
                verticalAlign={legendPosition}
              />
            )}
          </PieChart>
        )
      default:
        return null
    }
  }

  return (
    <Card
      className={cn(
        'flex flex-col w-full h-full',
        className,
        classNames?.card
      )}>
      {(title ||
        description ||
        showTypeSelector ||
        showDownload ||
        (zoom.enabled && zoom.showControls)) && (
        <CardHeader className={cn('relative', classNames?.cardHeader)}>
          <div className="flex items-center justify-between">
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
              {zoom.enabled &&
                zoom.showControls &&
                currentChartType !== 'table' && (
                  <div className="flex items-center border rounded-md p-1">
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
              {showTypeSelector && (
                <Select
                  value={currentChartType}
                  onValueChange={handleChartTypeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="area">Area</SelectItem>
                    <SelectItem value="line">Line</SelectItem>
                    <SelectItem value="bar">Bar</SelectItem>
                    <SelectItem value="pie">Pie</SelectItem>
                    <SelectItem value="donut">Donut</SelectItem>
                    <SelectItem value="table">Table</SelectItem>
                  </SelectContent>
                </Select>
              )}
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

      <CardContent
        ref={containerRef}
        className={cn('flex-1 p-1 w-full', classNames?.cardContent)}>
        {currentChartType === 'table' ? (
          renderTable()
        ) : (
          <div
            style={{
              height: typeof height === 'number' ? height : '100%',
              width: '100%',
              overflow: 'auto',
            }}>
            <ChartContainer
              config={config}
              className={cn('w-full h-full', classNames?.chart)}
              style={{
                width: chartDimensions.width,
                height: chartDimensions.height,
              }}>
              {renderChart()}
            </ChartContainer>
          </div>
        )}
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
