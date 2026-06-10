import type { ChartConfig } from '../../ui/chart'
import { CHART_COLOR_VARS } from '../constants'

/**
 * Resolve the color for a given series key, preferring (in order):
 * 1. a themeable color in the chart config (`--color-<key>` CSS var),
 * 2. an explicit string color in the config,
 * 3. a value from the custom `palette` (when provided),
 * 4. a theme-aware fallback from {@link CHART_COLOR_VARS}.
 */
export function getColorForKey(
  key: string,
  index: number,
  config: ChartConfig,
  palette?: string[],
): string {
  if (config?.[key]?.theme) {
    return `var(--color-${key})`
  }
  if (typeof config?.[key]?.color === 'string') {
    return config[key]!.color!
  }
  if (palette && palette.length > 0) {
    return palette[index % palette.length]
  }
  return CHART_COLOR_VARS[index % CHART_COLOR_VARS.length]
}
