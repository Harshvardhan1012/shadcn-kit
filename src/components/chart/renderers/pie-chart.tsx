import { Cell, Pie, PieChart } from 'recharts'
import {
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from '../../ui/chart'
import { getColorForKey } from '../lib/colors'
import { renderActiveShape } from './active-shape'
import type { ChartRenderContext } from './types'

/** Returns the raw PieChart element so ResponsiveContainer can size it. */
export function renderPieChart(ctx: ChartRenderContext, donut: boolean) {
  if (!ctx.data.length || !ctx.allChartKeys.length) {
    return (
      <div className="flex items-center justify-center h-full">
        No data available
      </div>
    )
  }

  const isMultiSeries = ctx.allChartKeys.length > 1
  const sliceColors = ctx.palette ?? ctx.pieColors

  // Multi-series → one summed slice per numeric key.
  // Single-series → one slice per row.
  const pieData = isMultiSeries
    ? ctx.allChartKeys.map((key) => ({
        dataKey: key,
        name: ctx.config?.[key]?.label || key,
        value: ctx.data.reduce((sum, item) => sum + (Number(item[key]) || 0), 0),
      }))
    : ctx.data.map((item) => ({
        ...item,
        name: item[ctx.xAxisKey],
        value: Number(item[ctx.allChartKeys[0]]) || 0,
      }))

  return (
    <PieChart
      width={ctx.dimensions.width}
      height={ctx.dimensions.height}
      {...ctx.chartProps}>
      <Pie
        data={pieData}
        nameKey="name"
        dataKey="value"
        cx="50%"
        cy="50%"
        outerRadius="90%"
        innerRadius={donut ? '60%' : '0%'}
        label={ctx.showDataLabels ? true : undefined}
        activeShape={ctx.highlightActive ? renderActiveShape : undefined}
        onClick={ctx.onPointClick}>
        {pieData.map((entry: any, index: number) => {
          const fillColor = isMultiSeries
            ? getColorForKey(entry.dataKey, index, ctx.config, ctx.palette)
            : sliceColors[index % sliceColors.length]
          return (
            <Cell
              key={`cell-${index}`}
              fill={fillColor}
            />
          )
        })}
      </Pie>

      {ctx.showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
      {ctx.showLegend && (
        <ChartLegend
          layout="vertical"
          align="right"
          verticalAlign="middle"
        />
      )}
    </PieChart>
  )
}
