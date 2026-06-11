import { DynamicChart } from '../../chart/DynamicChart'
import type { ChartClickData } from '../../chart/types'
import type { DashboardChart } from '../types'

/**
 * Renders a dashboard chart via {@link DynamicChart}. When `crossFilterField`
 * is set, clicking a point sets that global filter to the clicked x value,
 * re-querying the whole dashboard. `drillDown` passes straight through.
 */
export function DashboardChartItem({
  chart,
  loading,
  onCrossFilter,
}: {
  chart: DashboardChart
  loading?: boolean
  onCrossFilter: (columnKey: string, value: string | number) => void
}) {
  const { chartKey, width: _width, crossFilterField, ...chartProps } = chart

  const handleClick = crossFilterField
    ? (data: ChartClickData) => {
        const value =
          data.activeLabel ??
          (data.activePayload?.[0]?.payload?.[
            chart.xAxisKey ?? 'name'
          ] as string | number | undefined)
        if (value != null) onCrossFilter(crossFilterField, value)
      }
    : undefined

  return (
    <DynamicChart
      {...chartProps}
      chartKey={chartKey}
      height={chart.height ?? 300}
      loading={loading}
      onDataPointClick={handleClick}
    />
  )
}
