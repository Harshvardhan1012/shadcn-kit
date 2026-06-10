import type { ChartConfig } from '../../ui/chart'
import type {
  ChartClickData,
  ChartDataPoint,
  DrillDownConfig,
  DrillDownContext,
  DrillDownParams,
  DrillDownTarget,
  PieChartEntryData,
} from '../types'

interface BuildTargetArgs {
  clickData: ChartClickData | PieChartEntryData
  xAxisKey: string
  yAxisKeys: string[]
  config: ChartConfig
  drillDown?: DrillDownConfig
}

/** Read a config label for a key, falling back to the key itself. */
function labelFor(config: ChartConfig, key: string): string {
  const label = config?.[key]?.label
  return typeof label === 'string' ? label : key
}

/**
 * Normalize a Recharts click event (cartesian charts expose `activePayload`,
 * pie slices expose the entry directly) into the underlying data row plus the
 * clicked series key/value.
 */
function extractClick(
  clickData: ChartClickData | PieChartEntryData,
  xAxisKey: string,
  yAxisKeys: string[],
): { row: ChartDataPoint; xValue: string | number; yKey: string } | null {
  const cartesian = clickData as ChartClickData

  // Cartesian charts (area/line/bar)
  if (Array.isArray(cartesian.activePayload) && cartesian.activePayload.length) {
    const first = cartesian.activePayload[0]
    const row = first.payload ?? {}
    return {
      row,
      xValue: cartesian.activeLabel ?? row[xAxisKey] ?? '',
      yKey: first.dataKey ?? yAxisKeys[0],
    }
  }

  // Pie/donut slices: the entry object itself is the payload
  const entry = clickData as PieChartEntryData
  if (entry && typeof entry === 'object') {
    const row =
      (entry.payload as unknown as ChartDataPoint) ??
      (entry as unknown as ChartDataPoint)
    return {
      row,
      xValue: (row[xAxisKey] as string | number) ?? (entry.name as string) ?? '',
      // multi-series pie carries the originating series in `dataKey`
      yKey: (entry.dataKey as string) ?? yAxisKeys[0],
    }
  }

  return null
}

/**
 * Default params attached to the drill-down request: every field of the clicked
 * row (e.g. `date`, `value1`, `value2`, …) plus the clicked-series metadata.
 * The internal `apiPath` field is stripped so it never leaks into the query.
 */
export function defaultParamsBuilder(ctx: DrillDownContext): DrillDownParams {
  const { apiPath: _apiPath, ...rowValues } = ctx.row
  return {
    [ctx.xAxisKey]: ctx.xValue,
    ...rowValues,
    yKey: ctx.yKey,
    yLabel: ctx.yLabel,
    yValue: ctx.yValue,
    yAxisKeys: ctx.yAxisKeys.join(','),
    yAxisCount: ctx.yAxisCount,
  }
}

/**
 * Resolve a chart click into a drill-down target, or `null` when drill-down is
 * disabled or no endpoint is available. A per-point `apiPath` wins over the
 * chart-level `drillDown.apiPath`.
 */
export function resolveDrillDownTarget({
  clickData,
  xAxisKey,
  yAxisKeys,
  config,
  drillDown,
}: BuildTargetArgs): DrillDownTarget | null {
  if (!drillDown?.enabled) return null

  const click = extractClick(clickData, xAxisKey, yAxisKeys)
  if (!click) return null

  const apiPath = click.row.apiPath ?? drillDown.apiPath
  if (!apiPath) return null

  const context: DrillDownContext = {
    xAxisKey,
    xValue: click.xValue,
    yKey: click.yKey,
    yLabel: labelFor(config, click.yKey),
    yValue: (click.row[click.yKey] as string | number) ?? '',
    yAxisKeys,
    yAxisCount: yAxisKeys.length,
    row: click.row,
  }

  const buildParams = drillDown.paramsBuilder ?? defaultParamsBuilder

  // Merge any static/extra params (e.g. constant filters) on top.
  const params = { ...buildParams(context), ...(drillDown.extraParams ?? {}) }

  return { apiPath, params, context }
}
