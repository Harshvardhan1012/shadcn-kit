'use client'

import { DynamicChart } from '@/components/chart/DynamicChart'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { BarChart3 } from 'lucide-react'
import { createContext, useContext, useState } from 'react'
import {
  ChartBuilder,
  type ChartConfiguration,
} from '../chart-builder/ChartBuilder'

interface ChartBuilderSheetProps {
  data: Record<string, any>[]
  columns: any[]
  onSave?: (chartConfig: ChartConfiguration) => void
  triggerButton?: React.ReactNode
}

interface ChartPreviewContextType {
  previewConfig: ChartConfiguration | null
  setPreviewConfig: (config: ChartConfiguration | null) => void
}

const ChartPreviewContext = createContext<ChartPreviewContextType | null>(null)

export function useChartPreview() {
  const context = useContext(ChartPreviewContext)
  if (!context) {
    throw new Error('useChartPreview must be used within ChartBuilderSheet')
  }
  return context
}

function ChartPreview() {
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
    <Card>
      <CardContent>
        <DynamicChart
          title={previewConfig.title}
          data={previewConfig.data}
          config={previewConfig.config}
          xAxisKey={previewConfig.xAxisKey}
          yAxisKeys={previewConfig.yAxisKeys}
        />
        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            <strong>Data Points:</strong> {previewConfig.data.length}
          </p>
          <p>
            <strong>Series:</strong> {previewConfig.yAxisKeys.join(', ')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function ChartBuilderSheet({
  data,
  columns,
  onSave,
  triggerButton,
}: ChartBuilderSheetProps) {
  const [open, setOpen] = useState(false)
  const [previewConfig, setPreviewConfig] = useState<ChartConfiguration | null>(
    null
  )

  const handleSave = (config: ChartConfiguration) => {
    onSave?.(config)
    setOpen(false)
    // Reset preview
    setPreviewConfig(null)
  }

  const handleCancel = () => {
    setOpen(false)
    setPreviewConfig(null)
  }

  return (
    <ChartPreviewContext.Provider value={{ previewConfig, setPreviewConfig }}>
      <Sheet
        open={open}
        onOpenChange={setOpen}>
        <SheetTrigger asChild>
          {triggerButton || (
            <Button>
              <BarChart3 className="w-4 h-4 mr-2" />
              Add Chart
            </Button>
          )}
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full sm:max-w-full md:max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw] p-0 flex flex-col">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle>Chart Builder</SheetTitle>
            <SheetDescription>
              Configure your chart with filters, series, and aggregations. Live
              preview updates on the right.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Side - Form */}
            <ScrollArea className="w-full md:w-1/2 lg:w-2/5 border-r">
              <div className="p-6">
                <ChartBuilderWithPreview
                  data={data}
                  columns={columns}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              </div>
            </ScrollArea>

            {/* Right Side - Preview */}
            <div className="hidden md:flex md:w-1/2 lg:w-3/5 flex-col bg-muted/20">
              <div className="p-6 border-b bg-background">
                <h3 className="text-lg font-semibold">Live Preview</h3>
                <p className="text-sm text-muted-foreground">
                  Chart updates as you configure
                </p>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-6">
                  <ChartPreview />
                </div>
              </ScrollArea>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </ChartPreviewContext.Provider>
  )
}

// Wrapper component that updates preview
function ChartBuilderWithPreview({
  data,
  columns,
  onSave,
  onCancel,
}: {
  data: Record<string, any>[]
  columns: any[]
  onSave: (config: ChartConfiguration) => void
  onCancel: () => void
}) {
  const { setPreviewConfig } = useChartPreview()

  // Update preview as user configures
  const handlePreviewUpdate = (config: ChartConfiguration) => {
    setPreviewConfig(config)
  }

  return (
    <ChartBuilder
      data={data}
      columns={columns}
      onSave={onSave}
      onCancel={onCancel}
      onPreviewUpdate={handlePreviewUpdate}
      compact={true}
    />
  )
}
