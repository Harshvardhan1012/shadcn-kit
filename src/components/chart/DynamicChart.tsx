import { downsampleData } from '@/lib/chart'
import { cn } from '@/lib/utils'
import { AlertCircle, MousePointerClick } from 'lucide-react'
import * as React from 'react'
import {
  Card,
  CardContent,
  CardFooter,
} from '../ui/card'
import { ChartContainer } from '../ui/chart'
import { ChartHeader } from './components/chart-header'
import { ChartSkeleton } from './components/chart-skeleton'
import { ChartTableView } from './components/chart-table-view'
import { DrillDownSheet } from './components/drilldown-sheet'
import { DEFAULT_CONFIG, DEFAULT_PIE_COLORS } from './constants'
import { useChartSeries } from './hooks/use-chart-series'
import { useChartType } from './hooks/use-chart-type'
import { useContainerWidth } from './hooks/use-container-width'
import { useDrillDown } from './hooks/use-drilldown'
import { useSeriesVisibility } from './hooks/use-series-visibility'
import {
  convertToCSV,
  downloadFile,
  prepareDownloadData,
} from './lib/export'
import { renderChart } from './renderers/chart-renderer'
import type { ChartRenderContext } from './renderers/types'
import SheetDemo from '../sheet/page'
import type { DynamicChartProps } from './types'

export type {
  ChartType,
  ChartDataPoint,
  DynamicChartProps,
  DrillDownConfig,
  DrillDownContext,
  DrillDownResponse,
} from './types'

/**
 * Configurable chart card: area / line / bar / pie / donut / table, with a
 * type selector, CSV download, expand-to-sheet, and optional click-to-drill-down.
 *
 * Composition is intentionally split (see `./hooks`, `./renderers`, `./components`,
 * `./lib`) so each concern stays single-responsibility and reusable.
 */
export function DynamicChart({
  title,
  description,
  footer,
  chartType = 'line',
  data = [],
  config = DEFAULT_CONFIG,
  xAxisKey = 'name',
  yAxisKeys = ['value'],
  showTooltip = true,
  showLegend = true,
  chartKey,
  className,
  height = 400,
  chartProps = {},
  classNames,
  showTypeSelector = true,
  onChartTypeChange,
  pieColors = DEFAULT_PIE_COLORS,
  onDataPointClick,
  highlightActive = true,
  showDownload = true,
  downloadFilename = 'chart-data',
  loading = false,
  tableConfig = {},
  onAction,
  chartIndex,
  showActions = false,
  showFullscreen = true,
  onRefresh,
  emptyMessage = 'No data available',
  error,
  drillDown,
  colors,
  stacked = false,
  showStackToggle = false,
  brush,
  referenceLines,
  showDataLabels = false,
  enableLegendToggle = false,
  syncId,
  maxDataPoints,
}: DynamicChartProps) {
  const chartConfig = config ?? DEFAULT_CONFIG

  const { ref: containerRef, width: containerWidth } = useContainerWidth()
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [isStacked, setIsStacked] = React.useState(stacked)

  const { chartType: currentChartType, changeChartType } = useChartType(
    chartType,
    chartKey,
    onChartTypeChange,
  )

  const { allChartKeys, validYAxisKeys } = useChartSeries(
    data,
    config,
    xAxisKey,
    yAxisKeys,
  )

  const { hidden: hiddenSeries, toggle: toggleSeries } =
    useSeriesVisibility(allChartKeys)

  // Downsample large datasets for rendering only (full data feeds export/table).
  const chartData = React.useMemo(() => {
    if (!maxDataPoints || data.length <= maxDataPoints) return data
    return downsampleData(data, maxDataPoints, allChartKeys) as typeof data
  }, [data, maxDataPoints, allChartKeys])

  const drill = useDrillDown({
    drillDown,
    xAxisKey,
    yAxisKeys,
    config: chartConfig,
    onDataPointClick,
  })

  const chartDimensions = React.useMemo(
    () => ({
      height: typeof height === 'number' ? height : 400,
      width: containerWidth > 0 ? containerWidth : 500,
    }),
    [containerWidth, height],
  )

  const handleDownload = React.useCallback(() => {
    const downloadData = prepareDownloadData(
      data,
      currentChartType,
      allChartKeys,
      chartConfig,
    )
    downloadFile(
      convertToCSV(downloadData),
      `${downloadFilename}-${currentChartType}.csv`,
      'text/csv',
    )
  }, [data, currentChartType, allChartKeys, chartConfig, downloadFilename])

  const renderContext: ChartRenderContext = {
    data: chartData,
    config: chartConfig,
    xAxisKey,
    allChartKeys,
    validYAxisKeys,
    dimensions: chartDimensions,
    chartProps,
    pieColors,
    highlightActive,
    showTooltip,
    showLegend,
    onPointClick: drill.handleClick,
    palette: colors,
    stacked: isStacked,
    referenceLines,
    brush,
    showDataLabels,
    hiddenSeries,
    onToggleSeries: enableLegendToggle ? toggleSeries : undefined,
    enableLegendToggle,
    syncId,
    emptyMessage,
  }

  if (!data) {
    return <div>No data available</div>
  }

  const isTable = currentChartType === 'table'
  const isEmpty = !data.length
  // Stacking only applies to grouped bar/area charts.
  const canStack =
    showStackToggle &&
    (currentChartType === 'bar' || currentChartType === 'area')

  const chartBody = error ? (
    <div className="flex h-full min-h-40 items-center justify-center gap-2 text-sm text-destructive">
      <AlertCircle className="h-4 w-4" />
      {typeof error === 'boolean' ? 'Failed to load chart data.' : error}
    </div>
  ) : isTable ? (
    <ChartTableView
      data={data}
      height={height}
      config={tableConfig}
      emptyMessage={emptyMessage}
    />
  ) : isEmpty ? (
    <div
      className="flex items-center justify-center text-sm text-muted-foreground"
      style={{ height: chartDimensions.height }}>
      {emptyMessage}
    </div>
  ) : (
    <div
      style={{
        height: height ?? '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ChartContainer
        config={chartConfig}
        className={cn('w-full', classNames?.chart)}
        style={{ height: chartDimensions.height }}>
        {renderChart(currentChartType, renderContext)}
      </ChartContainer>
    </div>
  )

  return (
    <Card
      className={cn(
        'gap-0 py-3 rounded-none bg-secondary',
        className,
        classNames?.card,
      )}>
      {loading ? (
        <ChartSkeleton
          cardHeaderClassName={classNames?.cardHeader}
          cardContentClassName={classNames?.cardContent}
          containerRef={containerRef}
        />
      ) : (
        <>
          <ChartHeader
            title={title}
            description={description}
            chartType={currentChartType}
            chartIndex={chartIndex}
            classNames={classNames}
            showTypeSelector={showTypeSelector}
            onChartTypeChange={changeChartType}
            showDownload={showDownload}
            onDownload={handleDownload}
            showFullscreen={showFullscreen}
            onExpand={() => setIsExpanded(true)}
            onRefresh={onRefresh}
            showActions={showActions}
            onAction={onAction}
            showStackToggle={canStack}
            stacked={isStacked}
            onToggleStacked={() => setIsStacked((s) => !s)}
          />

          <CardContent
            ref={containerRef}
            className={cn(
              'flex-1 p-1 w-full bg-gradient-to-b from-transparent to-muted/5',
              classNames?.cardContent,
            )}>
            {drill.enabled && !isTable && (
              <div className="flex items-center gap-1 px-2 pb-1 text-xs text-muted-foreground">
                <MousePointerClick className="h-3 w-3" />
                Click a point to drill down
              </div>
            )}
            {chartBody}
          </CardContent>

          {footer && (
            <CardFooter
              className={cn(
                'flex justify-between text-xs text-muted-foreground',
                classNames?.cardFooter,
              )}>
              {footer}
            </CardFooter>
          )}
        </>
      )}

      {/* Expanded view */}
      <SheetDemo
        open={isExpanded}
        onOpenChange={setIsExpanded}
        size="2xl">
        <div className="space-y-6">
          <ChartContainer
            config={chartConfig}
            className="w-full"
            style={{ height: 420 }}>
            {renderChart(currentChartType === 'table' ? 'bar' : currentChartType, {
              ...renderContext,
              dimensions: { ...chartDimensions, height: 420 },
            })}
          </ChartContainer>
          <ChartTableView
            data={data}
            height={height}
            config={{ ...tableConfig, sortable: true }}
            emptyMessage={emptyMessage}
          />
        </div>
      </SheetDemo>

      {/* Drill-down */}
      {drill.enabled && (
        <DrillDownSheet
          open={drill.open}
          onOpenChange={drill.setOpen}
          target={drill.target}
          drillDown={drillDown}
        />
      )}
    </Card>
  )
}
