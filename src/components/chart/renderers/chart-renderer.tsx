import type { ReactElement } from 'react'
import type { ChartType } from '../types'
import {
  renderAreaChart,
  renderBarChart,
  renderLineChart,
} from './cartesian-charts'
import { renderPieChart } from './pie-chart'
import type { ChartRenderContext } from './types'

/**
 * Returns the raw Recharts element for a chart type so it can be passed directly
 * to `ResponsiveContainer`. `table` is handled separately by the host (it isn't
 * a Recharts chart).
 */
export function renderChart(
  chartType: ChartType,
  ctx: ChartRenderContext,
): ReactElement {
  switch (chartType) {
    case 'area':
      return renderAreaChart(ctx)
    case 'line':
      return renderLineChart(ctx)
    case 'bar':
      return renderBarChart(ctx)
    case 'pie':
      return renderPieChart(ctx, false)
    case 'donut':
      return renderPieChart(ctx, true)
    default:
      return (
        <div className="flex items-center justify-center h-full">
          No chart available for selected type.
        </div>
      )
  }
}
