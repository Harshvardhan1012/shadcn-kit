import type * as React from 'react'
import type { ChartConfig } from '../ui/chart'
import type { ColumnConfig, TableConfig } from '../master-table/get-columns'

// ---------------------------------------------------------------------------
// Core chart types
// ---------------------------------------------------------------------------

export type ChartType = 'area' | 'line' | 'bar' | 'pie' | 'table' | 'donut'

export interface ChartDataPoint {
  /**
   * Optional per-point drill-down endpoint. When present, clicking this point
   * opens the drill-down sheet and calls this path. Overrides the chart-level
   * `drillDown.apiPath`.
   */
  apiPath?: string
  [key: string]: string | number | undefined
}

// ---------------------------------------------------------------------------
// Recharts interop types
// ---------------------------------------------------------------------------

export interface ChartClickData {
  activePayload?: Array<{
    payload: ChartDataPoint
    dataKey: string
    value: number | string
  }>
  activeLabel?: string
  activeCoordinate?: { x: number; y: number }
}

export interface PieChartEntryData {
  [key: string]: string | number | undefined
}

export interface RechartsActiveShapeProps {
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

export interface RechartsTooltipProps {
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

// ---------------------------------------------------------------------------
// Drill-down types
// ---------------------------------------------------------------------------

/**
 * Everything we know about the point the user clicked. Passed to the params
 * builder and fetcher so a backend can return the right slice of data.
 */
export interface DrillDownContext {
  /** The x-axis field name (e.g. "formattedDate"). */
  xAxisKey: string
  /** The x-axis value of the clicked point (e.g. "Jan"). */
  xValue: string | number
  /** The series key that was clicked (e.g. "value1"). */
  yKey: string
  /** Human label for the clicked series, from chart config. */
  yLabel: string
  /** The numeric/string value of the clicked series at this point. */
  yValue: string | number
  /** All configured series keys. */
  yAxisKeys: string[]
  /** Count of series (yAxis count). */
  yAxisCount: number
  /** The full underlying data row. */
  row: ChartDataPoint
}

/**
 * Shape of the response the drill-down endpoint (or static fetcher) returns.
 * Field/header/table config all come from the backend; only `data` is required.
 */
export interface DrillDownResponse {
  data: Record<string, unknown>[]
  columnsConfig: ColumnConfig[]
  tableConfig?: TableConfig
  actionConfig?: unknown[]
  columnActions?: unknown[]
  title?: string
  description?: string
}

export type DrillDownParams = Record<string, unknown>

export interface DrillDownConfig {
  /** Master switch for the feature. */
  enabled?: boolean
  /** Chart-level endpoint, used when a point has no `apiPath` of its own. */
  apiPath?: string
  /** Build the query params sent to the endpoint from the click context. */
  paramsBuilder?: (ctx: DrillDownContext) => DrillDownParams
  /** Constant params merged on top of the built params (e.g. fixed filters). */
  extraParams?: DrillDownParams
  /**
   * Resolves the table response. Injected so the data source is swappable
   * (real API vs. static mock). Defaults to the static fetcher.
   */
  fetcher?: (
    apiPath: string,
    params: DrillDownParams,
    ctx: DrillDownContext,
  ) => Promise<DrillDownResponse>
  /** Width of the drill-down sheet. */
  sheetSize?: 'sm' | 'md' | 'xl' | '2xl' | '3xl'
}

/** Internal: the resolved click target the sheet renders from. */
export interface DrillDownTarget {
  apiPath: string
  params: DrillDownParams
  context: DrillDownContext
}

// ---------------------------------------------------------------------------
// Table view (in-chart "table" type) config
// ---------------------------------------------------------------------------

export interface ChartTableViewConfig {
  showRowNumbers?: boolean
  sortable?: boolean
  columnHeaders?: Record<string, string>
  hiddenColumns?: string[]
  cellRenderer?: (
    value: string | number,
    key: string,
    row: ChartDataPoint,
  ) => React.ReactNode
}

// ---------------------------------------------------------------------------
// Public component props
// ---------------------------------------------------------------------------

export interface DynamicChartClassNames {
  card?: string
  cardHeader?: string
  cardTitle?: string
  cardDescription?: string
  cardContent?: string
  cardFooter?: string
  chart?: string
}

/** A horizontal/vertical marker line drawn over a cartesian chart. */
export interface ReferenceLineConfig {
  /** Draw a horizontal line at this y value. */
  y?: number
  /** Draw a vertical line at this x value. */
  x?: string | number
  label?: string
  color?: string
  strokeDasharray?: string
}

/** Range-slider config; `true` enables it with defaults. */
export type BrushConfig = boolean | { height?: number; startIndex?: number; endIndex?: number }

export interface DynamicChartProps {
  title?: React.ReactNode
  description?: React.ReactNode
  footer?: React.ReactNode
  chartType?: ChartType
  data?: ChartDataPoint[]
  config?: ChartConfig | null
  xAxisKey?: string
  yAxisKeys?: string[]
  showTooltip?: boolean
  showLegend?: boolean
  className?: string
  height?: number | string
  chartProps?: Record<string, unknown>
  classNames?: DynamicChartClassNames
  chartKey?: string
  showTypeSelector?: boolean
  onChartTypeChange?: (type: ChartType) => void
  pieColors?: string[]
  onDataPointClick?: (data: ChartClickData) => void
  highlightActive?: boolean
  showDownload?: boolean
  downloadFilename?: string
  loading?: boolean
  tableConfig?: ChartTableViewConfig
  showActions?: boolean
  onAction?: (action: 'edit' | 'delete') => void
  sortable?: boolean
  onSortableChange?: (chartKey: string, position: number) => void
  chartIndex?: number

  // --- Card-level options ---
  /** Hide the expand-to-sheet button. */
  showFullscreen?: boolean
  /** Optional refresh handler; shows a refresh button when provided. */
  onRefresh?: () => void
  /** Message shown when `data` is empty. */
  emptyMessage?: React.ReactNode
  /** Error state. Truthy renders an error message instead of the chart. */
  error?: React.ReactNode | boolean
  /** Drill-down behaviour. See {@link DrillDownConfig}. */
  drillDown?: DrillDownConfig

  // --- Visualization features ---
  /** Custom color palette for series (cartesian + pie). Overrides defaults. */
  colors?: string[]
  /** Render bar/area series stacked rather than grouped. */
  stacked?: boolean
  /** Show a header toggle to switch grouped/stacked (bar & area). */
  showStackToggle?: boolean
  /** Range slider under cartesian charts for scrubbing long datasets. */
  brush?: BrushConfig
  /** Threshold/target marker lines drawn over cartesian charts. */
  referenceLines?: ReferenceLineConfig[]
  /** Show numeric data labels on points/bars. */
  showDataLabels?: boolean
  /** Clicking a legend entry hides/shows that series. */
  enableLegendToggle?: boolean
  /** Shared id to sync tooltip/crosshair across charts on a dashboard. */
  syncId?: string
  /** Downsample to at most this many points before rendering (perf). */
  maxDataPoints?: number
}
