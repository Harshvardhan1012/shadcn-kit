import type * as React from 'react'
import type { ChartConfig } from '../../ui/chart'
import type {
  BrushConfig,
  ChartClickData,
  ChartDataPoint,
  PieChartEntryData,
  ReferenceLineConfig,
} from '../types'

/** Everything a renderer needs, assembled once by DynamicChart. */
export interface ChartRenderContext {
  data: ChartDataPoint[]
  config: ChartConfig
  xAxisKey: string
  /** All plottable keys (incl. hidden, to keep color slots stable). */
  allChartKeys: string[]
  /** Keys that should actually be drawn (config-visible). */
  validYAxisKeys: string[]
  dimensions: { width: number; height: number }
  chartProps: Record<string, unknown>
  pieColors: string[]
  highlightActive: boolean
  showTooltip: boolean
  showLegend: boolean
  onPointClick: (data: ChartClickData | PieChartEntryData) => void

  // --- Feature flags / config ---
  /** Custom series palette (cartesian + pie). */
  palette?: string[]
  /** Render bar/area stacked. */
  stacked: boolean
  /** Marker lines over cartesian charts. */
  referenceLines?: ReferenceLineConfig[]
  /** Range slider under cartesian charts. */
  brush?: BrushConfig
  /** Show numeric labels on points/bars. */
  showDataLabels: boolean
  /** Series the user toggled off via the legend. */
  hiddenSeries: Set<string>
  /** Toggle a series on/off (wired only when legend toggle is enabled). */
  onToggleSeries?: (key: string) => void
  /** Whether legend clicks toggle series. */
  enableLegendToggle: boolean
  /** Sync id to link tooltip/crosshair across charts. */
  syncId?: string
  /** Message rendered when there is no data. */
  emptyMessage?: React.ReactNode
}
