import { DynamicChart } from '@/components/chart/DynamicChart'
import { BarChart3 } from 'lucide-react'
import { useChartPreview } from './ChartBuilderSheet'

export function ChartPreview() {
  const { previewConfig } = useChartPreview()

  if (!previewConfig || !previewConfig.title || !previewConfig.xAxisKey) {
    return (
      <div className="flex items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
        <div className="text-center text-muted-foreground">
          <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Configure your chart to see a preview</p>
          <p className="text-sm mt-1">
            Add a title and select X-axis field to start
          </p>
        </div>
      </div>
    )
  }

  return (
    <DynamicChart
      title={previewConfig.title}
      data={previewConfig?.data}
      config={previewConfig.config}
      xAxisKey={previewConfig.xAxisKey}
      yAxisKeys={previewConfig.yAxisKeys}
      zoom={{
        enabled: true,
      }}
    />
  )
}
