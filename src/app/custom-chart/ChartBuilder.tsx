'use client'

import {
  useTableContext,
  type CardOperation,
} from '@/app/custom-table/card-builder'
import type { FormContextType } from '@/components/form'
import DynamicForm from '@/components/form/DynamicForm'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfigCard } from '@/components/ui/card/ConfigCard'
import type { ChartConfig } from '@/components/ui/chart'
import { generateId } from '@/lib/id'
import type { ExtendedColumnFilter, JoinOperator } from '@/types/data-table'
import { useEffect, useMemo, useRef, useState } from 'react'
import { editCustomChart, postChartConfig } from './api'
import { createChartFormConfig, createChartFormSchema } from './form-config'
import { width as widthConfig } from './utils'

export interface SeriesConfig {
  id: string
  field: string
  operation: CardOperation
  label: string
  filters: ExtendedColumnFilter<any>[]
  joinOperator: JoinOperator
}

export interface ChartConfiguration {
  chartKey: string
  title: string
  description?: string
  width: keyof typeof widthConfig
  xAxisKey: string
  yAxisKeys: string[]
  spName?: string
  // Computed/derived properties
  data?: Record<string, any>[]
  config?: ChartConfig
  index: number
}

interface ChartBuilderProps {
  data: Record<string, any>[]
  columns: any[]
  onSave?: (chartConfig: ChartConfiguration) => void
  onCancel?: () => void
  spName: string
  onPreviewUpdate?: (chartConfig: ChartConfiguration) => void
  compact?: boolean
  initialConfig?: ChartConfiguration
}

export function ChartBuilder({
  data,
  columns,
  onSave,
  onCancel,
  onPreviewUpdate,
  spName,
  compact = false,
  initialConfig,
}: ChartBuilderProps) {
  const [chartConfig, setChartConfig] = useState<ChartConfiguration>(() => ({
    chartKey: initialConfig?.chartKey || generateId({ length: 12 }),
    title: initialConfig?.title || '',
    description: initialConfig?.description || '',
    width: initialConfig?.width || 'full',
    data: initialConfig?.data || data || [],
    yAxisKeys: initialConfig?.yAxisKeys || [],
    config: initialConfig?.config || {},
    xAxisKey: initialConfig?.xAxisKey || '',
    index: initialConfig?.index || 0,
  }))

  const formRef = useRef<FormContextType<any>>(null)

  const { table } = useTableContext()

  // Available fields from columns
  const availableFields = useMemo(() => {
    return columns.map((col) => col.field)
  }, [columns])

  // Update helper function
  const updateChartConfig = (updates: Partial<ChartConfiguration>) => {
    setChartConfig((prev) => ({ ...prev, ...updates }))
  }

  // Get label for a field from config
  const getYAxisLabel = useMemo(
    () =>
      (field: string): string => {
        return chartConfig.config?.[field]?.label?.toString() || field
      },
    [chartConfig.config]
  )

  // Generate chart config

  const saveChartConfig = postChartConfig()
  const editChartConfig = editCustomChart()

  const handleSave = () => {
    const configuration: ChartConfiguration = {
      ...chartConfig,
      yAxisKeys: chartConfig.yAxisKeys.filter((key) =>
        availableFields.includes(key)
      ),
      data: undefined, // Do not save data
    }

    if (initialConfig) {
      // Editing existing chart
      editChartConfig.mutate(
        { ...configuration, spName },
        {
          onSuccess: () => {
            onSave?.(configuration)
          },
        }
      )
    } else {
      saveChartConfig.mutate(
        { ...configuration, spName },
        {
          onSuccess: () => {
            onSave?.(configuration)
          },
        }
      )
    }
  }

  const handleReset = () => {
    setChartConfig({
      chartKey: generateId({ length: 12 }),
      title: '',
      description: '',
      width: 'full',
      yAxisKeys: [],
      config: {},
      xAxisKey: '',
      index: 1,
    })
  }

  // Preview update
  const isFirstRender = useRef(true)
  const currentConfiguration = useMemo((): ChartConfiguration | null => {
    if (
      !chartConfig.title ||
      !chartConfig.xAxisKey ||
      chartConfig.yAxisKeys.length === 0
    )
      return null

    return {
      ...chartConfig,
      data: data,
    }
  }, [chartConfig, data, chartConfig.yAxisKeys])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (onPreviewUpdate && currentConfiguration) {
      onPreviewUpdate(currentConfiguration)
    }
  }, [currentConfiguration, onPreviewUpdate])

  const isValid =
    chartConfig.title && chartConfig.xAxisKey && chartConfig.yAxisKeys

  // Watch form values for instant preview updates
  useEffect(() => {
    if (!formRef.current || !onPreviewUpdate) return

    const interval = setInterval(() => {
      const values = formRef.current?.getFormValues()
      console.log('Form values changed:', values)
      if (
        !values ||
        !values.title ||
        !values.xAxisKey ||
        !values.yAxisKeys ||
        values.yAxisKeys.length === 0
      ) {
        return
      }

      // Build config with labels
      const newConfig: ChartConfig = {}

      if (values.xAxisLabel) {
        newConfig[values.xAxisKey] = { label: values.xAxisLabel }
      }

      if (values.yAxisKeys) {
        values.yAxisKeys.forEach((field: string) => {
          newConfig[field] = {
            label: values[`label_${field}`] || field,
          }
        })
      }

      const previewConfig: ChartConfiguration = {
        chartKey: chartConfig.chartKey,
        title: values.title || '',
        description: values.description,
        width: values.width as keyof typeof widthConfig,
        xAxisKey: values.xAxisKey || '',
        yAxisKeys: values.yAxisKeys || [],
        config: newConfig,
        data: data,
        index: chartConfig.index,
      }
      setChartConfig(previewConfig)

      onPreviewUpdate(previewConfig)
    }, 500) // Debounce to 500ms

    return () => clearInterval(interval)
  }, [
    formRef.current,
    onPreviewUpdate,
    data,
    chartConfig.chartKey,
    chartConfig.index,
  ])

  // Create form configuration for basic chart settings with dynamic Y-axis label fields
  const basicFormConfig = useMemo(
    () => createChartFormConfig(availableFields, chartConfig.yAxisKeys),
    [availableFields, chartConfig.yAxisKeys]
  )

  const basicFormSchema = useMemo(
    () => createChartFormSchema(chartConfig.yAxisKeys),
    [chartConfig.yAxisKeys]
  )

  if (!table) {
    return (
      <div className="space-y-4 p-4">
        <p className="text-sm text-muted-foreground">
          Table context not available. Please ensure this form is wrapped with
          TableProvider.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Chart Title & Basic Config */}
      <ConfigCard title="Chart Configuration">
        <DynamicForm
          formConfig={basicFormConfig}
          ref={formRef}
          schema={basicFormSchema}
          defaultValues={{
            title: chartConfig.title,
            description: chartConfig.description,
            width: chartConfig.width,
            xAxisKey: chartConfig.xAxisKey,
            yAxisKeys: chartConfig.yAxisKeys,
            ...chartConfig.yAxisKeys.reduce((acc, field) => {
              acc[`label_${field}`] = getYAxisLabel(field)
              return acc
            }, {} as Record<string, string>),
          }}
          onSubmit={(values: any) => {
            // Build config with labels from form
            const newConfig: ChartConfig = {}
            values.yAxisKeys.forEach((field: string) => {
              newConfig[field] = {
                label: values[`label_${field}`] || field,
              }
            })

            updateChartConfig({
              title: values.title,
              description: values.description,
              width: values.width as keyof typeof widthConfig,
              xAxisKey: values.xAxisKey,
              yAxisKeys: values.yAxisKeys,
              config: newConfig,
            })
          }}
          customSubmitButton={<></>}
        />
      </ConfigCard>

      {/* Summary */}
      <ConfigCard title="Configuration Summary">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Title:</span>
            <Badge variant="secondary">{chartConfig.title || 'Not set'}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Global Filters:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">X-Axis:</span>
            <Badge variant="secondary">
              {chartConfig.xAxisKey || 'Not set'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Y-Axis:</span>
            <div className="flex flex-wrap gap-1">
              {chartConfig.yAxisKeys.map((key) => (
                <Badge
                  key={key}
                  variant="secondary"
                  className="flex items-center gap-1">
                  {key}
                  {getYAxisLabel(key) !== key && (
                    <span className="text-xs text-muted-foreground">
                      ({getYAxisLabel(key)})
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Data Points:</span>
            <Badge variant="secondary">{data.length}</Badge>
          </div>
        </div>
      </ConfigCard>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            variant="ghost"
            onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          variant="outline"
          onClick={handleReset}>
          Reset
        </Button>
        <Button
          onClick={handleSave}
          disabled={!isValid}>
          {compact ? 'Create Chart' : 'Save Chart Configuration'}
        </Button>
      </div>
    </div>
  )
}
