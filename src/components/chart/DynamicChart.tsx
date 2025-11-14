import SheetDemo from '@/components/sheet/page'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Download, Edit, Expand, MoreVertical, Trash2 } from 'lucide-react'
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
import { TooltipWrapper } from '../ui/tooltip-wrapper'
import { Badge } from './../ui/badge'
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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from './../ui/chart'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './../ui/dropdown-menu'
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

// Default chart config - uses CSS variables that adapt to the current theme
const defaultConfig: ChartConfig = {
  chartData1: {
    label: 'Dataset 1',
    color: 'var(--chart-1)',
  },
  chartData2: {
    label: 'Dataset 2',
    color: 'var(--chart-2)',
  },
  chartData3: {
    label: 'Dataset 3',
    color: 'var(--chart-3)',
  },
  chartData4: {
    label: 'Dataset 4',
    color: 'var(--chart-4)',
  },
  chartData5: {
    label: 'Dataset 5',
    color: 'var(--chart-5)',
  },
}

// Theme-aware pie chart colors using CSS variables that work in both light and dark modes
const DEFAULT_PIE_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'hsl(217 91% 60%)', // blue
  'hsl(340 82% 52%)', // pink
  'hsl(188 80% 72%)', // cyan
  'hsl(300 50% 70%)', // purple
  'hsl(120 39% 55%)', // green
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
  data?: ChartDataPoint[]
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
  chartKey?: string
  showTypeSelector?: boolean
  onChartTypeChange?: (type: ChartType) => void
  pieColors?: string[]
  onDataPointClick?: (data: ChartClickData) => void
  highlightActive?: boolean
  showDownload?: boolean
  downloadFilename?: string
  loading?: boolean
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
  onAction?: (action: 'edit' | 'delete') => void
  sortable?: boolean
  onSortableChange?: (chartKey: string, position: number) => void
  chartIndex?: number
}

function getColorForKey(
  key: string,
  index: number,
  config: ChartConfig
): string {
  const cssVar = `var(--color-${key})`
  // Check if the config has a themeable color defined
  if (config[key]?.theme) {
    return cssVar
  }
  // Fallback to the non-theme color in the config
  if (typeof config[key]?.color === 'string') {
    return config[key]!.color!
  }
  // Final fallback to theme-aware chart CSS variables (--chart-1, --chart-2, etc.)
  // The CSS variables are already in oklch format, so we use them directly
  const chartColors = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
  ]
  return chartColors[index % chartColors.length]
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
  if ((chartType === 'pie' || chartType === 'donut') && yAxisKeys.length > 1) {
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
  showTooltip = true,
  showLegend = true,
  chartKey,
  className,
  height = 400,
  chartProps = {},
  classNames,
  showTypeSelector = true,
  onChartTypeChange,
  pieColors = DEFAULT_PIE_COLORS,
  onDataPointClick,
  highlightActive = true,
  showDownload = true,
  downloadFilename = 'chart-data',
  loading = false,
  tableConfig = {},
  onAction,
  chartIndex,
}: DynamicChartProps) {
  if (!data) {
    return <div>No data available</div>
  }

  const containerRef = React.useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = React.useState(500)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [currentChartType, setCurrentChartType] = React.useState<ChartType>(
    () => {
      if (typeof window !== 'undefined') {
        const savedType = localStorage.getItem(`dynamic-chart-type-${chartKey}`)
        if (
          savedType &&
          ['area', 'line', 'bar', 'pie', 'donut', 'table'].includes(savedType)
        ) {
          return savedType as ChartType
        }
      }
      return chartType
    }
  )

  const [sortConfig, setSortConfig] = React.useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)

  React.useLayoutEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) setContainerWidth(entry.contentRect.width)
    })
    if (containerRef.current) observer.observe(containerRef.current)
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current)
    }
  }, [])

  const handleChartTypeChange = (newType: ChartType) => {
    setCurrentChartType(newType)
    onChartTypeChange?.(newType) // Call the optional callback

    // Save the new type to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(`dynamic-chart-type-${chartKey}`, newType)
    }
  }
  const handleDownload = () => {
    const downloadData = prepareDownloadData(
      data,
      currentChartType,
      validYAxisKeys,
      config
    )
    const csvContent = convertToCSV(downloadData)
    downloadFile(
      csvContent,
      `${downloadFilename}-${currentChartType}.csv`,
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

  const chartDimensions = React.useMemo(
    () => ({
      height: typeof height === 'number' ? height : 400,
      width: containerWidth > 0 ? containerWidth : 500,
    }),
    [containerWidth, height]
  )

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

  const handleClick = (clickData: ChartClickData | PieChartEntryData) =>
    onDataPointClick?.(clickData as ChartClickData)

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
          className="fill-foreground">
          {value}
        </text>
        <text
          x={cx}
          y={cy}
          dy={20}
          textAnchor="middle"
          className="fill-muted-foreground">{`(${(percent * 100).toFixed(
          2
        )}%)`}</text>
      </g>
    )
  }

  const renderTable = () => {
    const {
      showRowNumbers = false,
      columnHeaders = {},
      hiddenColumns = [],
      cellRenderer,
    } = tableConfig
    if (!data.length)
      return <div className="py-8 text-center">No data available</div>
    const columns = Object.keys(data[0]).filter(
      (key) => !hiddenColumns.includes(key)
    )
    return (
      <div
        className="w-full overflow-auto border rounded-none"
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
      width: chartDimensions.width,
      height: chartDimensions.height,
      ...chartProps,
    }

    switch (currentChartType) {
      case 'area':
        return (
          <AreaChart
            data={data}
            onClick={handleClick}
            {...commonProps}>
            <CartesianGrid />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend />
            {validYAxisKeys.map((key, i) => (
              <Area
                key={key}
                dataKey={key}
                fill={getColorForKey(key, i, config)}
                stroke={getColorForKey(key, i, config)}
              />
            ))}
          </AreaChart>
        )
      case 'line':
        return (
          <LineChart
            data={data}
            onClick={handleClick}
            {...commonProps}>
            <CartesianGrid />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend />
            {validYAxisKeys.map((key, i) => (
              <Line
                key={key}
                dataKey={key}
                stroke={getColorForKey(key, i, config)}
              />
            ))}
          </LineChart>
        )
      case 'bar':
        return (
          <BarChart
            data={data}
            onClick={handleClick}
            {...commonProps}>
            <CartesianGrid />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend />
            {validYAxisKeys.map((key, i) => (
              <Bar
                key={key}
                dataKey={key}
                fill={getColorForKey(key, i, config)}
              />
            ))}
          </BarChart>
        )
      case 'pie':
      case 'donut':
        const isMultiSeries = validYAxisKeys.length > 1
        const dataKey = isMultiSeries ? 'value' : validYAxisKeys[0]

        if (!dataKey) {
          return (
            <div className="flex items-center justify-center h-full">
              Error: Invalid or missing yAxisKey for Pie Chart.
            </div>
          )
        }

        const pieData = isMultiSeries
          ? validYAxisKeys.map((key) => ({
              dataKey: key, // Keep track of the original key
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
              nameKey={isMultiSeries ? 'name' : xAxisKey}
              dataKey={dataKey}
              cx="50%"
              cy="50%"
              outerRadius="80%"
              innerRadius={currentChartType === 'donut' ? '60%' : '0%'}
              activeShape={highlightActive ? renderActiveShape : undefined}
              onClick={handleClick}>
              {pieData.map((entry, index) => {
                let fillColor = ''
                if (isMultiSeries) {
                  // Use the config color for multi-series pie charts
                  const key = (entry as any).dataKey
                  fillColor = getColorForKey(key, index, config)
                } else {
                  // For single-series, prioritize 'fill' in data, then fallback to pieColors
                  fillColor =
                    (entry as any).fill || pieColors[index % pieColors.length]
                }
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={fillColor}
                  />
                )
              })}
            </Pie>
            {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
            {showLegend && <ChartLegend />}
          </PieChart>
        )
      default:
        return (
          <div className="flex items-center justify-center h-full">
            No chart available for selected type.
          </div>
        )
    }
  }

  return (
    <Card
      className={cn(
        'gap-0 py-3 rounded-none bg-secondary',
        className,
        classNames?.card
      )}>
      {loading ? (
        <>
          <CardHeader
            className={cn('relative pb-4 z-10', classNames?.cardHeader)}>
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-48 rounded-md" />
                <Skeleton className="h-4 w-64 rounded-md" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-[120px] rounded-md" />
              </div>
            </div>
          </CardHeader>
          <CardContent
            ref={containerRef}
            className={cn(
              'flex-1 p-3 w-full relative z-10',
              classNames?.cardContent
            )}>
            <div className="flex items-center justify-center h-full rounded-lg bg-muted/20">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
          </CardContent>
        </>
      ) : (
        <>
          <CardHeader className={cn(classNames?.cardHeader)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <div>
                  {title && (
                    <CardTitle
                      className={cn(
                        'text-lg font-semibold',
                        classNames?.cardTitle
                      )}>
                      {title}
                    </CardTitle>
                  )}
                  {description && (
                    <CardDescription
                      className={cn(
                        'text-sm mt-1',
                        classNames?.cardDescription
                      )}>
                      {description}
                    </CardDescription>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {chartIndex !== undefined && (
                    <Badge
                      variant="outline"
                      className="text-xs">
                      #{chartIndex + 1}
                    </Badge>
                  )}
                  <Badge
                    variant="secondary"
                    className="text-xs capitalize">
                    {currentChartType}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {showTypeSelector && (
                  <Select
                    value={currentChartType}
                    onValueChange={handleChartTypeChange}>
                    <TooltipWrapper
                      content="Select Chart Type"
                      side="top">
                      <SelectTrigger className="border-none">
                        <SelectValue />
                      </SelectTrigger>
                    </TooltipWrapper>
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
                  <TooltipWrapper
                    content="Download Excel"
                    side="top">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleDownload}
                      title="Download CSV">
                      <Download className="w-4 h-4" />
                    </Button>
                  </TooltipWrapper>
                )}
                <TooltipWrapper
                  content="Expand Chart"
                  side="top">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsExpanded(true)}
                    title="Expand">
                    <Expand className="w-4 h-4" />
                  </Button>
                </TooltipWrapper>
                <DropdownMenu>
                  <TooltipWrapper
                    content="More actions"
                    side="top">
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Actions">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipWrapper>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onAction?.('edit')}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAction?.('delete')}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          <CardContent
            ref={containerRef}
            className={cn(
              'flex-1 p-1 w-full bg-gradient-to-b from-transparent to-muted/5',
              classNames?.cardContent
            )}>
            {currentChartType === 'table' ? (
              renderTable()
            ) : (
              <div
                style={{
                  height: height ?? '100%',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ChartContainer
                  config={config}
                  className={cn('w-full', classNames?.chart)}
                  style={{
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
        </>
      )}

      {/* Expanded View Sheet */}
      <SheetDemo
        open={isExpanded}
        onOpenChange={setIsExpanded}
        size="2xl">
        <div className="space-y-6">
          <ChartContainer
            config={config}
            className="w-full"
            style={{
              height: 420,
            }}>
            {renderChart()}
          </ChartContainer>

          {/* Table Section */}
          <div>{renderTable()}</div>
        </div>
      </SheetDemo>
    </Card>
  )
}
