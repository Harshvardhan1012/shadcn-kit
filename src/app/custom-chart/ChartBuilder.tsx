'use client'

import {
  useTableContext,
  type CardOperation,
} from '@/app/custom-table/card-builder'
import DynamicForm, {
  FormFieldType,
  type FormFieldConfig,
} from '@/components/form/DynamicForm'
import { Button } from '@/components/ui/button'
import { ConfigCard } from '@/components/ui/card/ConfigCard'
import type { ChartConfig } from '@/components/ui/chart'
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
  description?: string
  width: 'full' | 'half' | 'third'
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
    debugger

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

  // Create form configuration for all chart settings including y-axis labels
  const formConfig: FormFieldConfig[] = [
    {
      fieldName: 'title',
      fieldLabel: 'Chart Title',
      fieldType: FormFieldType.TEXT,
      placeholder: 'Enter chart title',
      validation: z.string().min(1, 'Title is required'),
    },
    {
      fieldName: 'description',
      fieldLabel: 'Description',
      fieldType: FormFieldType.TEXT,
      placeholder: 'Enter chart description (optional)',
      validation: z.string().optional(),
    },
    {
      fieldName: 'width',
      fieldLabel: 'Chart Width',
      fieldType: FormFieldType.SELECT,
      placeholder: 'Select chart width',
      options: [
        { label: 'Full Width', value: 'full' },
        { label: 'Half Width (1/2)', value: 'half' },
        { label: 'Third Width (1/3)', value: 'third' },
      ],
      validation: z.enum(['full', 'half', 'third']),
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
    // Add dynamic fields for y-axis labels based on selected yAxisKeys
    ...(chartConfig.yAxisKeys.map((field) => ({
      fieldName: `label_${field}`,
      fieldLabel: `Display Label for ${field}`,
      fieldType: FormFieldType.TEXT,
      placeholder: `Label for ${field}`,
      validation: z.string().optional(),
    })) as FormFieldConfig[]),
  ]

  const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    width: z.enum(['full', 'half', 'third']),
    xAxisKey: z.string().min(1, 'X-Axis field is required'),
    yAxisKeys: z
      .array(z.string())
      .min(1, 'At least one Y-Axis field is required'),
    // Add dynamic validation for y-axis labels
    ...chartConfig.yAxisKeys.reduce((acc, field) => {
      acc[`label_${field}`] = z.string().optional()
      return acc
    }, {} as Record<string, z.ZodOptional<z.ZodString>>),
  })

  // Prepare default values including y-axis labels
  const defaultValues = useMemo(() => {
    const values: Record<string, any> = {
      title: chartConfig.title,
      description: chartConfig.description,
      width: chartConfig.width,
      xAxisKey: chartConfig.xAxisKey,
      yAxisKeys: chartConfig.yAxisKeys,
    }

    // Add y-axis label values
    chartConfig.yAxisKeys.forEach((field) => {
      values[`label_${field}`] = getYAxisLabel(field)
    })

    return values
  }, [chartConfig])

  return (
    <div className="space-y-6">
      <ConfigCard title="Chart Configuration">
        <DynamicForm
          formConfig={formConfig}
          schema={formSchema}
          defaultValues={defaultValues}
          onSubmit={(values) => {
            // Update basic chart config
            updateChartConfig({
              title: values.title,
              description: values.description,
              width: values.width as 'full' | 'half' | 'third',
              xAxisKey: values.xAxisKey,
              yAxisKeys: values.yAxisKeys,
            })

            // Initialize config with y-axis labels
            const newConfig: ChartConfig = {}
            values.yAxisKeys.forEach((field: string) => {
              newConfig[field] = {
                label: values[`label_${field}`] || field,
              }
            })
            updateChartConfig({ config: newConfig })
          }}
          customSubmitButton={
            <div className="flex justify-end gap-2 pt-4">
              {onCancel && (
                <Button
                  variant="ghost"
                  onClick={onCancel}
                  type="button">
                  Cancel
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleReset}
                type="button">
                Reset
              </Button>
              <Button
                type="submit"
                disabled={!isValid}>
                {compact ? 'Create Chart' : 'Save Chart Configuration'}
              </Button>
            </div>
          }
        />
      </ConfigCard>
    </div>
  )
}
