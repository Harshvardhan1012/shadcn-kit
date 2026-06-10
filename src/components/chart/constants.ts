import type { ChartConfig } from '../ui/chart'
import type { ChartType } from './types'

/**
 * Default chart config - uses CSS variables that adapt to the current theme.
 */
export const DEFAULT_CONFIG: ChartConfig = {
  chartData1: { label: 'Dataset 1', color: 'var(--chart-1)' },
  chartData2: { label: 'Dataset 2', color: 'var(--chart-2)' },
  chartData3: { label: 'Dataset 3', color: 'var(--chart-3)' },
  chartData4: { label: 'Dataset 4', color: 'var(--chart-4)' },
  chartData5: { label: 'Dataset 5', color: 'var(--chart-5)' },
}

/**
 * Theme-aware pie chart colors that work in both light and dark modes.
 */
export const DEFAULT_PIE_COLORS = [
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

/** Theme-aware fallback series colors. */
export const CHART_COLOR_VARS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

/** Options rendered in the chart-type selector. */
export const CHART_TYPE_OPTIONS: { value: ChartType; label: string }[] = [
  { value: 'area', label: 'Area' },
  { value: 'line', label: 'Line' },
  { value: 'bar', label: 'Bar' },
  { value: 'pie', label: 'Pie' },
  { value: 'donut', label: 'Donut' },
  { value: 'table', label: 'Table' },
]

export const CHART_TYPE_VALUES: ChartType[] = CHART_TYPE_OPTIONS.map(
  (o) => o.value,
)

export const chartTypeStorageKey = (chartKey?: string) =>
  `dynamic-chart-type-${chartKey}`
