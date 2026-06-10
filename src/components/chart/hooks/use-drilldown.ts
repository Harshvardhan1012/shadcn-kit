import * as React from 'react'
import type { ChartConfig } from '../../ui/chart'
import { resolveDrillDownTarget } from '../lib/drilldown'
import type {
  ChartClickData,
  DrillDownConfig,
  DrillDownTarget,
  PieChartEntryData,
} from '../types'

interface UseDrillDownArgs {
  drillDown?: DrillDownConfig
  xAxisKey: string
  yAxisKeys: string[]
  config: ChartConfig
  /** Legacy passthrough click handler, always invoked. */
  onDataPointClick?: (data: ChartClickData) => void
}

/**
 * Owns drill-down sheet state. `handleClick` resolves a chart click into a
 * target (respecting per-point `apiPath`); when one exists the sheet opens.
 * The original `onDataPointClick` is always forwarded for backward compat.
 */
export function useDrillDown({
  drillDown,
  xAxisKey,
  yAxisKeys,
  config,
  onDataPointClick,
}: UseDrillDownArgs) {
  const [target, setTarget] = React.useState<DrillDownTarget | null>(null)
  const [open, setOpen] = React.useState(false)

  const handleClick = React.useCallback(
    (clickData: ChartClickData | PieChartEntryData) => {
      onDataPointClick?.(clickData as ChartClickData)

      const resolved = resolveDrillDownTarget({
        clickData,
        xAxisKey,
        yAxisKeys,
        config,
        drillDown,
      })
      if (resolved) {
        setTarget(resolved)
        setOpen(true)
      }
    },
    [onDataPointClick, xAxisKey, yAxisKeys, config, drillDown],
  )

  return {
    target,
    open,
    setOpen,
    handleClick,
    enabled: !!drillDown?.enabled,
  }
}
