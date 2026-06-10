import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from '../../ui/chart'
import { getColorForKey } from '../lib/colors'
import type { ChartRenderContext } from './types'

const TRANSPARENT = 'transparent'

/**
 * Color / visibility for a series:
 * - `visibleByConfig`: configured to be drawn (others render transparent so the
 *   axis scale stays stable);
 * - `userHidden`: toggled off via a legend click (uses Recharts `hide`, which
 *   keeps the clickable legend entry).
 */
function getSeries(ctx: ChartRenderContext, key: string, index: number) {
  const visibleByConfig = ctx.validYAxisKeys.includes(key)
  return {
    visibleByConfig,
    userHidden: ctx.hiddenSeries.has(key),
    color: visibleByConfig
      ? getColorForKey(key, index, ctx.config, ctx.palette)
      : TRANSPARENT,
  }
}

const commonProps = (ctx: ChartRenderContext) => ({
  width: ctx.dimensions.width,
  height: ctx.dimensions.height,
  syncId: ctx.syncId,
  ...ctx.chartProps,
})

/** Legend click → toggle series (only wired when enabled). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const legendProps = (ctx: ChartRenderContext): any =>
  ctx.enableLegendToggle && ctx.onToggleSeries
    ? {
        onClick: (o: { dataKey?: string | number }) => {
          if (o?.dataKey != null) ctx.onToggleSeries!(String(o.dataKey))
        },
        wrapperStyle: { cursor: 'pointer' },
      }
    : {}

const dataLabel = (ctx: ChartRenderContext, visible: boolean) =>
  ctx.showDataLabels && visible ? (
    <LabelList
      position="top"
      className="fill-foreground text-[10px]"
    />
  ) : null

function ReferenceLines({ ctx }: { ctx: ChartRenderContext }) {
  if (!ctx.referenceLines?.length) return null
  return (
    <>
      {ctx.referenceLines.map((line, i) => (
        <ReferenceLine
          key={i}
          y={line.y}
          x={line.x}
          stroke={line.color ?? 'var(--muted-foreground)'}
          strokeDasharray={line.strokeDasharray ?? '6 4'}
          label={line.label}
        />
      ))}
    </>
  )
}

function BrushControl({ ctx }: { ctx: ChartRenderContext }) {
  if (!ctx.brush) return null
  const cfg = typeof ctx.brush === 'object' ? ctx.brush : {}
  return (
    <Brush
      dataKey={ctx.xAxisKey}
      height={cfg.height ?? 24}
      startIndex={cfg.startIndex}
      endIndex={cfg.endIndex}
      travellerWidth={8}
      stroke="var(--chart-1)"
    />
  )
}

export function renderAreaChart(ctx: ChartRenderContext) {
  return (
    <AreaChart
      data={ctx.data}
      onClick={ctx.onPointClick}
      {...commonProps(ctx)}>
      <CartesianGrid />
      <XAxis dataKey={ctx.xAxisKey} />
      <YAxis />
      {ctx.showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
      {ctx.showLegend && (
        <ChartLegend
          layout="horizontal"
          {...legendProps(ctx)}
        />
      )}
      <ReferenceLines ctx={ctx} />
      {ctx.allChartKeys.map((key, i) => {
        const { visibleByConfig, userHidden, color } = getSeries(ctx, key, i)
        return (
          <Area
            key={key}
            dataKey={key}
            type="monotone"
            stroke={color}
            fill={color}
            strokeWidth={visibleByConfig ? 2 : 0}
            hide={userHidden}
            stackId={ctx.stacked ? 'stack' : undefined}
            dot={false}
            activeDot={false}>
            {dataLabel(ctx, visibleByConfig)}
          </Area>
        )
      })}
      <BrushControl ctx={ctx} />
    </AreaChart>
  )
}

export function renderLineChart(ctx: ChartRenderContext) {
  return (
    <LineChart
      data={ctx.data}
      onClick={ctx.onPointClick}
      {...commonProps(ctx)}>
      <CartesianGrid />
      <XAxis dataKey={ctx.xAxisKey} />
      <YAxis />
      {ctx.showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
      {ctx.showLegend && <ChartLegend {...legendProps(ctx)} />}
      <ReferenceLines ctx={ctx} />
      {ctx.allChartKeys.map((key, i) => {
        const { visibleByConfig, userHidden, color } = getSeries(ctx, key, i)
        return (
          <Line
            key={key}
            dataKey={key}
            type="monotone"
            stroke={color}
            strokeWidth={visibleByConfig ? 1 : 0}
            hide={userHidden}
            activeDot={visibleByConfig ? { r: 5 } : false}>
            {dataLabel(ctx, visibleByConfig)}
          </Line>
        )
      })}
      <BrushControl ctx={ctx} />
    </LineChart>
  )
}

export function renderBarChart(ctx: ChartRenderContext) {
  return (
    <BarChart
      data={ctx.data}
      onClick={ctx.onPointClick}
      barCategoryGap="20%"
      barGap={4}
      {...commonProps(ctx)}>
      <CartesianGrid />
      <XAxis dataKey={ctx.xAxisKey} />
      <YAxis />

      {ctx.showTooltip && (
        <ChartTooltip
          content={<ChartTooltipContent />}
          formatter={(value: any, name: any, props: any) => {
            const row = props?.payload
            if (!row) return [value, name]

            // Surface non-plotted numeric keys as extra tooltip rows.
            const extraKeys = ctx.allChartKeys.filter(
              (key) => !ctx.validYAxisKeys.includes(key),
            )

            return [
              <div className="space-y-1">
                <div>
                  {ctx.config?.[name]?.label || name}: {value}
                </div>
                {extraKeys.map((key) => (
                  <div key={key}>
                    {ctx.config?.[key]?.label || key}: {row[key]}
                  </div>
                ))}
              </div>,
              name,
            ]
          }}
        />
      )}

      {ctx.showLegend && <ChartLegend {...legendProps(ctx)} />}
      <ReferenceLines ctx={ctx} />

      {/* Only render visible bars to avoid spacing gaps. */}
      {ctx.validYAxisKeys.map((key, i) => (
        <Bar
          key={key}
          dataKey={key}
          fill={getColorForKey(key, i, ctx.config, ctx.palette)}
          hide={ctx.hiddenSeries.has(key)}
          stackId={ctx.stacked ? 'stack' : undefined}>
          {dataLabel(ctx, true)}
        </Bar>
      ))}
      <BrushControl ctx={ctx} />
    </BarChart>
  )
}
