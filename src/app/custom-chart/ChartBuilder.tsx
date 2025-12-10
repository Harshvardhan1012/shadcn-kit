'use client'

import {
  useTableContext,
  type CardOperation,
} from '@/app/custom-table/card-builder'
import DynamicForm, {
  FormFieldType,
  type FormFieldConfig,
} from '@/components/form/DynamicForm'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfigCard } from '@/components/ui/card/ConfigCard'
import type { ChartConfig } from '@/components/ui/chart'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { generateId } from '@/lib/id'
import type { ExtendedColumnFilter, JoinOperator } from '@/types/data-table'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as z from 'zod'
import { editCustomChart, postChartConfig } from './api'

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
    data: initialConfig?.data || data || [],
    yAxisKeys: initialConfig?.yAxisKeys || [],
    config: initialConfig?.config || {},
    xAxisKey: initialConfig?.xAxisKey || '',
    index: initialConfig?.index || 0,
  }))

  console.log('ChartBuilder rendered with columns:', columns)

  const { table } = useTableContext()

  // Available fields from columns
  const availableFields = useMemo(() => {
    return columns.map((col) => col.field)
  }, [columns])

  // Update helper function
  const updateChartConfig = (updates: Partial<ChartConfiguration>) => {
    setChartConfig((prev) => ({ ...prev, ...updates }))
  }

  // Update y-axis label in config
  const updateYAxisLabel = (field: string, label: string) => {
    setChartConfig((prev) => {
      const newConfig = {
        ...prev.config,
        [field]: { label },
      }
      return { ...prev, config: newConfig }
    })
  }

  // Get label for a field from config
  const getYAxisLabel = (field: string): string => {
    return chartConfig.config?.[field]?.label?.toString() || field
  }

  // Generate chart config

  const saveChartConfig = postChartConfig()
  const editChartConfig = editCustomChart()

  const handleSave = () => {
    const configuration: ChartConfiguration = {
      ...chartConfig,
      yAxisKeys: chartConfig.yAxisKeys.filter((key) =>
        availableFields.includes(key)
      ),
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

  // Create form configuration for basic chart settings
  const basicFormConfig: FormFieldConfig[] = [
    {
      fieldName: 'title',
      fieldLabel: 'Chart Title',
      fieldType: FormFieldType.TEXT,
      placeholder: 'Enter chart title',
      validation: z.string().min(1, 'Title is required'),
    },
    {
      fieldName: 'xAxisKey',
      fieldLabel: 'X-Axis Field',
      fieldType: FormFieldType.SELECT,
      placeholder: 'Select X-axis field',
      options: availableFields.map((field) => ({
        label: field,
        value: field,
      })),
      validation: z.string().min(1, 'X-Axis field is required'),
    },
    {
      fieldName: 'yAxisKeys',
      fieldLabel: 'Y-Axis Fields',
      fieldType: FormFieldType.MULTISELECT,
      placeholder: 'Select Y-axis fields',
      options: availableFields.map((field) => ({
        label: field,
        value: field,
      })),
      validation: z
        .array(z.string())
        .min(1, 'At least one Y-Axis field is required'),
      overflowBehavior: 'wrap',
    },
  ]

  const basicFormSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    xAxisKey: z.string().min(1, 'X-Axis field is required'),
    yAxisKeys: z
      .array(z.string())
      .min(1, 'At least one Y-Axis field is required'),
  })

  return (
    <div className="space-y-6">
      {/* Chart Title & Basic Config */}
      <ConfigCard title="Chart Configuration">
        <DynamicForm
          formConfig={basicFormConfig}
          schema={basicFormSchema}
          defaultValues={{
            title: chartConfig.title,
            xAxisKey: chartConfig.xAxisKey,
            yAxisKeys: chartConfig.yAxisKeys,
          }}
          onSubmit={(values) => {
            updateChartConfig({
              title: values.title,
              xAxisKey: values.xAxisKey,
              yAxisKeys: values.yAxisKeys,
            })

            // Initialize config for new fields
            const newConfig: ChartConfig = { ...chartConfig.config }
            values.yAxisKeys.forEach((field: string) => {
              if (!newConfig[field]) {
                newConfig[field] = { label: field }
              }
            })
            updateChartConfig({ config: newConfig })
          }}
          customSubmitButton={<></>}
        />
      </ConfigCard>

      <div className="space-y-4">
        {chartConfig.yAxisKeys.map((field) => {
          return (
            <div
              key={field}
              className="space-y-2 p-3 border rounded-md bg-muted/20">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium min-w-[100px]">
                  {field}
                </Label>
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor={`label-${field}`}
                  className="text-xs text-muted-foreground">
                  Display Label
                </Label>
                <Input
                  id={`label-${field}`}
                  placeholder={`Label for ${field}`}
                  value={getYAxisLabel(field)}
                  onChange={(e) => updateYAxisLabel(field, e.target.value)}
                  className="h-8"
                />
              </div>
            </div>
          )
        })}
      </div>

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
