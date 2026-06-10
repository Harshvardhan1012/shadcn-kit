import * as React from 'react'
import type { ChartConfig } from '../../ui/chart'
import type { ChartDataPoint } from '../types'

/**
 * Derive the series keys to render.
 *
 * - `allChartKeys`: every plottable key (config keys present in data, else
 *   numeric data keys). Used so hidden series still reserve color slots.
 * - `validYAxisKeys`: the requested `yAxisKeys` that actually exist in the data.
 */
export function useChartSeries(
  data: ChartDataPoint[],
  config: ChartConfig | null | undefined,
  xAxisKey: string,
  yAxisKeys: string[],
) {
  const allChartKeys = React.useMemo(() => {
    if (!data.length) return []
    const dataKeys = Object.keys(data[0])

    if (config && Object.keys(config).length > 0) {
      const validConfigKeys = Object.keys(config).filter((key) =>
        dataKeys.includes(key),
      )
      if (validConfigKeys.length > 0) return validConfigKeys
    }

    return dataKeys.filter(
      (key) => key !== xAxisKey && typeof data[0][key] === 'number',
    )
  }, [data, config, xAxisKey])

  const validYAxisKeys = React.useMemo(() => {
    if (!data.length) return yAxisKeys
    const dataKeys = Object.keys(data[0])
    return yAxisKeys.filter((key) => dataKeys.includes(key))
  }, [data, yAxisKeys])

  return { allChartKeys, validYAxisKeys }
}
