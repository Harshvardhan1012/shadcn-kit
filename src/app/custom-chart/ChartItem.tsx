import { DynamicChart } from '@/components/chart/DynamicChart'
import type { ChartConfiguration } from './ChartBuilder'

// Component for each chart - data is already filtered by parent
export function ChartItem({
  chart,
  onDelete,
  onEdit,
  index,
}: {
  chart: ChartConfiguration
  onDelete: (key: string) => void
  onEdit: (chart: ChartConfiguration) => void
  index?: number
}) {
  return (
    <div className="relative">
      {/* Chart */}
      <DynamicChart
        title={chart.title}
        chartType="bar"
        data={chart.data || []}
        config={chart.config}
        xAxisKey={chart.xAxisKey}
        yAxisKeys={chart.yAxisKeys}
        downloadFilename={`${chart.title}-data`}
        chartKey={chart.chartKey}
        height={300}
        legendPosition="top"
        chartIndex={index}
        onAction={(action) => {
          if (action === 'edit') {
            onEdit(chart)
          } else if (action === 'delete') {
            onDelete(chart.chartKey)
          }
        }}
      />
    </div>
  )
}
