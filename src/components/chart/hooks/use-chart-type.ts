import * as React from 'react'
import { CHART_TYPE_VALUES, chartTypeStorageKey } from '../constants'
import type { ChartType } from '../types'

/**
 * Chart-type state persisted to localStorage per `chartKey`, so a user's choice
 * survives reloads. Returns the current type and a setter that also persists
 * and invokes the optional `onChange` callback.
 */
export function useChartType(
  initial: ChartType,
  chartKey?: string,
  onChange?: (type: ChartType) => void,
) {
  const [chartType, setChartType] = React.useState<ChartType>(() => {
    if (typeof window !== 'undefined' && chartKey) {
      const saved = localStorage.getItem(chartTypeStorageKey(chartKey))
      if (saved && CHART_TYPE_VALUES.includes(saved as ChartType)) {
        return saved as ChartType
      }
    }
    return initial
  })

  const changeChartType = React.useCallback(
    (next: ChartType) => {
      setChartType(next)
      onChange?.(next)
      if (typeof window !== 'undefined' && chartKey) {
        localStorage.setItem(chartTypeStorageKey(chartKey), next)
      }
    },
    [chartKey, onChange],
  )

  return { chartType, changeChartType }
}
