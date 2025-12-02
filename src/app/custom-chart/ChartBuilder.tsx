'use client'

import {
  useTableContext,
  type CardOperation,
} from '@/app/custom-table/card-builder'
import { FormFieldType } from '@/components/form/DynamicForm'
import { SelectInput } from '@/components/form/SelectInput'
import { TextInput } from '@/components/form/TextInput'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ConfigCard } from '@/components/ui/card/ConfigCard'
import type { ChartConfig } from '@/components/ui/chart'
import { Label } from '@/components/ui/label'
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/components/ui/multi-select'
import { generateId } from '@/lib/id'
import type { ExtendedColumnFilter, JoinOperator } from '@/types/data-table'
import { useEffect, useMemo, useRef, useState } from 'react'
import { editCustomChart, postChartConfig } from './api'

export interface YAxisFieldConfig {
  field: string
  operation: CardOperation
}

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
    xAxisKey: initialConfig?.xAxisKey || '',
    index: initialConfig?.index || 0,
  }))

  const { table } = useTableContext()

  // Available fields from columns
  const availableFields = useMemo(() => {
    return columns.map((col) => col.field)
  }, [columns])

  // Update helper function
  const updateChartConfig = (updates: Partial<ChartConfiguration>) => {
    setChartConfig((prev) => ({ ...prev, ...updates }))
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

  return (
    <div className="space-y-6">
      {/* Chart Title & Basic Config */}
      <ConfigCard title="Chart Configuration">
        <div className="space-y-4">
          <TextInput
            label="Chart Title"
            placeholder="Enter chart title"
            value={chartConfig.title}
            onChange={(value) => updateChartConfig({ title: String(value) })}
          />

          <SelectInput
            fieldName="xAxis"
            fieldLabel="X-Axis Field"
            fieldType={FormFieldType.SELECT}
            label="X-Axis Field"
            placeholder="Select X-axis field"
            value={chartConfig.xAxisKey}
            onChange={(value) => updateChartConfig({ xAxisKey: value })}
            options={availableFields.map((field) => ({
              label: field,
              value: field,
            }))}
          />
        </div>
      </ConfigCard>

      {/* Split Mode Selection */}
      <Card>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label>Y-Axis Fields</Label>
              <MultiSelect
                values={chartConfig.yAxisKeys}
                onValuesChange={(values) =>
                  updateChartConfig({ yAxisKeys: values })
                }>
                <MultiSelectTrigger className="w-full mt-1">
                  <MultiSelectValue placeholder="Select Y-axis fields" />
                </MultiSelectTrigger>
                <MultiSelectContent>
                  {availableFields.map((field) => (
                    <MultiSelectItem
                      key={field}
                      value={field}>
                      {field}
                    </MultiSelectItem>
                  ))}
                </MultiSelectContent>
              </MultiSelect>
            </div>

            {chartConfig.yAxisKeys.map((fieldConfig) => {
              return (
                <div
                  key={fieldConfig}
                  className="flex items-center gap-2 p-3 border rounded-md bg-muted/20">
                  <Label className="flex-1 text-sm font-medium">
                    {fieldConfig}
                  </Label>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

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
                  variant="secondary">
                  {key}
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
