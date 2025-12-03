'use client'

// Removed unused callApi import
import { generateColumnConfig } from '@/app/custom-table/generateColumnConfig'
import datatableConfig from '@/app/table/table_config'
import type { ColumnConfig } from '@/components/master-table/get-columns'
import DynamicMaster from '@/components/master-table/master-table'
import SheetDemo from '@/components/sheet/page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TitleDescription } from '@/components/ui/title-description'
import { BarChart3, Table } from 'lucide-react'
import { createContext, useContext, useMemo, useState } from 'react'
import { ChartBuilder, type ChartConfiguration } from './ChartBuilder'
import { execSp } from './api'
import { ChartPreview } from './preview'

interface ChartBuilderSheetProps {
  data: Record<string, any>[]
  columns: any[]
  onSave?: (chartConfig: ChartConfiguration) => void
  onCancel?: () => void
  triggerButton?: React.ReactNode
  initialConfig?: ChartConfiguration
  autoOpen?: boolean
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

export function ChartBuilderSheet({
  data,
  columns,
  onSave,
  onCancel,
  triggerButton,
  initialConfig,
  autoOpen = false,
}: ChartBuilderSheetProps) {
  const isAutoOpenMode = triggerButton === null
  const [open, setOpen] = useState(isAutoOpenMode ? false : autoOpen)
  const [previewConfig, setPreviewConfig] = useState<ChartConfiguration | null>(
    initialConfig || null
  )
  const [leftWidth, setLeftWidth] = useState(40) // percentage
  const [isDragging, setIsDragging] = useState(false)

  const handleSave = (config: ChartConfiguration) => {
    // Delegate persistence to API layer; parent will handle state refresh.
    onSave?.(config)
    if (!isAutoOpenMode) {
      setOpen(false)
    }
    // Reset preview
    setPreviewConfig(null)
  }

  const handleCancel = () => {
    if (isAutoOpenMode) {
      onCancel?.()
    } else {
      setOpen(false)
    }
    setPreviewConfig(null)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const container = e.currentTarget as HTMLElement
    const newLeftWidth = (e.clientX / container.clientWidth) * 100

    // Constrain between 20% and 80%
    if (newLeftWidth >= 20 && newLeftWidth <= 80) {
      setLeftWidth(newLeftWidth)
    }
  }

  return (
    <ChartPreviewContext.Provider value={{ previewConfig, setPreviewConfig }}>
      <>
        {triggerButton !== null && (
          <div onClick={() => setOpen(true)}>
            {triggerButton || (
              <Button>
                <BarChart3 className="w-4 h-4 mr-2" />
                Add Chart
              </Button>
            )}
          </div>
        )}

        <SheetDemo
          open={isAutoOpenMode ? autoOpen : open}
          onOpenChange={
            isAutoOpenMode
              ? (isOpen) => {
                  if (!isOpen) onCancel?.()
                }
              : setOpen
          }
          size="3xl">
          <div className="flex flex-col h-[calc(100vh-80px)]">
            <TitleDescription
              size="lg"
              icon={<BarChart3 className="w-4 h-4" />}
              title="Chart Builder"
              description="Create and customize your chart using the options below. See a live preview as you configure."
            />

            <div
              className="flex flex-1 overflow-hidden min-h-0"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseUp}
              onMouseUp={handleMouseUp}>
              {/* Left Side - Form */}
              <div
                style={{ width: `${leftWidth}%` }}
                className="overflow-hidden border-r">
                <ScrollArea className="h-full">
                  <div className="p-6">
                    <ChartBuilderWithPreview
                      data={data}
                      columns={columns}
                      spName={initialConfig?.spName || ''}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      initialConfig={initialConfig}
                    />
                  </div>
                </ScrollArea>
              </div>

              {/* Resizable Divider */}
              <div
                onMouseDown={handleMouseDown}
                className={`w-1 bg-border hover:bg-primary/50 cursor-col-resize transition-colors ${
                  isDragging ? 'bg-primary' : ''
                }`}
                style={{ userSelect: isDragging ? 'none' : 'auto' }}
              />

              {/* Right Side - Preview */}
              <div
                style={{ width: `${100 - leftWidth}%` }}
                className="hidden md:flex md:flex-col bg-muted/20 overflow-hidden">
                <div className="p-6 border-b bg-background flex-shrink-0">
                  <h3 className="text-lg font-semibold">Live Preview</h3>
                  <p className="text-sm text-muted-foreground">
                    Chart updates as you configure
                  </p>
                </div>

                <ScrollArea className="flex-1 h-full">
                  <ChartPreview />
                </ScrollArea>
              </div>
            </div>
          </div>
        </SheetDemo>
      </>
    </ChartPreviewContext.Provider>
  )
}

// Wrapper component that updates preview
function ChartBuilderWithPreview({
  data: initialData,
  columns: _initialColumns,
  onSave,
  onCancel,
  spName,
  initialConfig,
}: {
  data: Record<string, any>[]
  columns: any[]
  onSave: (config: ChartConfiguration) => void
  onCancel: () => void
  spName?: string
  initialConfig?: ChartConfiguration
}) {
  const { setPreviewConfig } = useChartPreview()
  const [open, setOpen] = useState(false)
  const [sp, setSP] = useState(spName || '')
  // Use the callApi hook
  const { data: apiResponse, error } = execSp(sp)

  // Determine which data to use - API data or initial data
  const activeData = apiResponse?.data || initialData

  // Update preview as user configures
  const handlePreviewUpdate = (config: ChartConfiguration) => {
    setPreviewConfig(config)
  }
  const columnConfig: ColumnConfig[] = useMemo(() => {
    return generateColumnConfig(apiResponse?.data)
  }, [apiResponse])

  return (
    <div className="space-y-6">
      {/* API Configuration Section */}
      <div className="space-y-2">
        <Label htmlFor="api-url">SP NAME</Label>
        <div className="flex gap-2">
          <Input
            id="api-url"
            value={sp}
            onChange={(e) => setSP(e.target.value)}
            className="flex-1"
            placeholder="Enter SP Name"
          />
          {/* <Button
            disabled={!sp || isLoading}
            onClick={() => setSpName(sp)}>
            Execute SP
          </Button> */}
        </div>
        {error && (
          <p className="text-sm text-destructive">
            Error fetching data: {error.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {apiResponse?.data
            ? `Loaded ${apiResponse.data.length} records from API`
            : `Local records: ${activeData.length}`}
        </div>

        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          aria-label="View table">
          <Table /> View Table
        </Button>
      </div>

      <SheetDemo
        open={open}
        size="2xl"
        onOpenChange={() => setOpen(false)}>
        <DynamicMaster
          data={activeData}
          datatableConfig={{
            ...datatableConfig,
            columnsConfig: columnConfig,
          }}
        />
      </SheetDemo>
      <ChartBuilder
        data={activeData}
        columns={columnConfig}
        onSave={onSave}
        onCancel={onCancel}
        spName={sp}
        onPreviewUpdate={handlePreviewUpdate}
        compact={true}
        initialConfig={initialConfig}
      />
    </div>
  )
}
