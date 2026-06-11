import type { DynamicChartProps } from '../chart/types'

/** Layout width of a card/chart within the responsive grid. */
export type DashboardWidth = 'full' | 'half' | 'third' | 'quarter'

/** How a KPI value should be formatted for display. */
export type ValueFormat = 'number' | 'currency' | 'percent'

/**
 * Threshold-based conditional coloring for a KPI card.
 * `direction` says whether higher (`up`) or lower (`down`) is "good".
 */
export interface CardThreshold {
  direction: 'up' | 'down'
  /** At/above (or at/below for `down`) → good (green). */
  good?: number
  /** Between good and warn → warning (amber); beyond → bad (red). */
  warn?: number
}

/** A read-only "smart" KPI card, fully described by the backend. */
export interface DashboardCard {
  cardKey: string
  title: string
  description?: string
  /** Lucide icon name, resolved via `resolveLucideIcon`. */
  icon?: string
  value: string | number
  /** Previous-period value → delta % + up/down indicator. */
  previousValue?: number
  unit?: string
  format?: ValueFormat
  /** Mini trend series rendered as a sparkline. */
  sparkline?: number[]
  /** Conditional color rule applied to the delta. */
  threshold?: CardThreshold
  width?: DashboardWidth
  /** Optional drill: navigate to this route on click. */
  url?: string
}

/**
 * A chart on the dashboard. Passes through to {@link DynamicChart}; only adds
 * a key, layout width, and an optional cross-filter field.
 */
export type DashboardChart = Pick<
  DynamicChartProps,
  | 'title'
  | 'description'
  | 'chartType'
  | 'data'
  | 'config'
  | 'xAxisKey'
  | 'yAxisKeys'
  | 'drillDown'
  | 'referenceLines'
  | 'stacked'
  | 'showStackToggle'
  | 'brush'
  | 'showDataLabels'
  | 'enableLegendToggle'
  | 'colors'
  | 'height'
> & {
  chartKey: string
  width?: DashboardWidth
  /**
   * When set, clicking a point sets this global filter (by columnKey) to the
   * clicked x-axis value and re-queries the whole dashboard.
   */
  crossFilterField?: string
}

export type DashboardFilterVariant =
  | 'text'
  | 'number'
  | 'select'
  | 'multiSelect'
  | 'date'
  | 'dateRange'
  | 'range'

/** A single global filter rendered in the filter bar. */
export interface DashboardFilterConfig {
  filterId: string
  /** Data column this filter targets; also the params key sent to the API. */
  columnKey: string
  label?: string
  variant: DashboardFilterVariant
  options?: { label: string; value: string }[]
  placeholder?: string
  defaultValue?: unknown
  /** Render the date-range preset bar instead of a plain date filter. */
  isDatePreset?: boolean
}

/** A tab/section grouping cards and charts. */
export interface DashboardTab {
  key: string
  label: string
  cards: DashboardCard[]
  charts: DashboardChart[]
}

/** The full dashboard configuration returned by a single backend GET. */
export interface DashboardConfig {
  key: string
  title: string
  description?: string
  filters: DashboardFilterConfig[]
  tabs: DashboardTab[]
}

/** Params object sent to the backend (built from URL filter state). */
export type DashboardParams = Record<string, unknown>

/** Fetcher signature so the data source is swappable (real API vs. mock). */
export type DashboardFetcher = (
  key: string,
  params: DashboardParams,
) => Promise<DashboardConfig>
