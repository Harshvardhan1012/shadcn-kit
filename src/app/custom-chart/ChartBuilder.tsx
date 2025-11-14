'use client'

import {
  useTableContext,
  type CardOperation,
} from '@/app/custom-table/card-builder'
import {
  applyFilters,
  getAvailableOperations,
  OPERATION_LABELS,
} from '@/app/custom-table/card-builder/card-utils'
import { DataTableFilterList } from '@/components/data-table/data-table-filter-list'
import { FormFieldType } from '@/components/form/DynamicForm'
import { SelectInput } from '@/components/form/SelectInput'
import { TextInput } from '@/components/form/TextInput'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

interface SeriesItemProps {
  series: SeriesConfig
  index: number
  availableFields: string[]
  table: any
  onUpdate: (id: string, updates: Partial<SeriesConfig>) => void
  onRemove: (id: string) => void
  onApplyFilters: (
    seriesId: string,
    filters: ExtendedColumnFilter<any>[],
    joinOperator: JoinOperator
  ) => void
  getAvailableOperationsForField: (fieldName: string) => CardOperation[]
}

function SeriesItem({
  series,
  index,
  availableFields,
  table,
  onUpdate,
  onRemove,
  onApplyFilters,
  getAvailableOperationsForField,
}: SeriesItemProps) {
  const [pendingSeriesFilters, setPendingSeriesFilters] = useState<
    ExtendedColumnFilter<any>[]
  >(series.filters)
  const [pendingSeriesJoinOp, setPendingSeriesJoinOp] = useState<JoinOperator>(
    series.joinOperator
  )

  // Update pending filters when series filters change
  useEffect(() => {
    setPendingSeriesFilters(series.filters)
    setPendingSeriesJoinOp(series.joinOperator)
  }, [series.filters, series.joinOperator])

  return (
    <ConfigCard
      key={series.id}
      title={`Series ${index + 1}`}
      actions={
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onRemove(series.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      }>
      <div className="space-y-3">
        <SelectInput
          fieldName="field"
          fieldLabel="Field"
          fieldType={FormFieldType.SELECT}
          label="Field"
          placeholder="Select field"
          value={series.field}
          onChange={(value) => {
            const availableOps = getAvailableOperationsForField(value)
            onUpdate(series.id, {
              field: value,
              operation: availableOps[0] || 'sum',
            })
          }}
          options={availableFields.map((field) => ({
            label: field,
            value: field,
          }))}
        />

        <SelectInput
          fieldName="operation"
          fieldLabel="Operation"
          fieldType={FormFieldType.SELECT}
          label="Operation"
          value={series.operation}
          onChange={(value) =>
            onUpdate(series.id, {
              operation: value as CardOperation,
            })
          }
          options={getAvailableOperationsForField(series.field).map((op) => ({
            label: OPERATION_LABELS[op],
            value: op,
          }))}
        />

        <TextInput
          label="Series Label"
          placeholder="Enter series label"
          value={series.label}
          onChange={(value) =>
            onUpdate(series.id, {
              label: String(value),
            })
          }
        />

        <div>
          <Label className="text-xs mb-2 block">Series Filters</Label>
          <DataTableFilterList
            table={table}
            internalFilters={pendingSeriesFilters}
            onInternalFiltersChange={setPendingSeriesFilters}
            internalJoinOperator={pendingSeriesJoinOp}
            onInternalJoinOperatorChange={setPendingSeriesJoinOp}
            filterOpen
          />
          <Button
            onClick={() =>
              onApplyFilters(
                series.id,
                pendingSeriesFilters,
                pendingSeriesJoinOp
              )
            }
            variant="outline"
            size="sm"
            className="w-full mt-2">
            Apply Series Filters
          </Button>
          {series.filters.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {series.filters.length} filter(s) applied
            </p>
          )}
        </div>
      </div>
    </ConfigCard>
  )
}

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
  yAxisFields: string[]
  yAxisFieldConfigs: YAxisFieldConfig[]
  splitMode: 'none' | 'split'
  seriesConfigs: SeriesConfig[]
  globalFilters: ExtendedColumnFilter<any>[]
  globalJoinOperator: JoinOperator
  // Computed/derived properties
  data?: Record<string, any>[]
  config?: ChartConfig
  yAxisKeys?: string[]
}

interface ChartBuilderProps {
  data: Record<string, any>[]
  columns: any[]
  onSave?: (chartConfig: ChartConfiguration) => void
  onCancel?: () => void
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
  compact = false,
  initialConfig,
}: ChartBuilderProps) {
  // Single state object for all chart configuration
  const [chartConfig, setChartConfig] = useState<ChartConfiguration>(() => ({
    chartKey: initialConfig?.chartKey || generateId({ length: 12 }),
    title: initialConfig?.title || '',
    xAxisKey: initialConfig?.xAxisKey || '',
    yAxisFields: initialConfig?.yAxisFields || [],
    yAxisFieldConfigs: initialConfig?.yAxisFieldConfigs || [],
    splitMode: initialConfig?.splitMode || 'none',
    seriesConfigs: initialConfig?.seriesConfigs || [],
    globalFilters: initialConfig?.globalFilters || [],
    globalJoinOperator: initialConfig?.globalJoinOperator || 'and',
  }))

  // Pending filters (not applied yet)
  const [pendingGlobalFilters, setPendingGlobalFilters] = useState<
    ExtendedColumnFilter<any>[]
  >(chartConfig.globalFilters)
  const [pendingGlobalJoinOperator, setPendingGlobalJoinOperator] =
    useState<JoinOperator>(chartConfig.globalJoinOperator)

  const { table } = useTableContext()

  // Available fields from columns
  const availableFields = useMemo(() => {
    return columns.map((col) => col.field)
  }, [columns])

  // Get available operations for a field
  const getAvailableOperationsForField = (
    fieldName: string
  ): CardOperation[] => {
    return getAvailableOperations(fieldName, columns)
  }

  // Update helper function
  const updateChartConfig = (updates: Partial<ChartConfiguration>) => {
    setChartConfig((prev) => ({ ...prev, ...updates }))
  }

  // Apply global filters
  const handleApplyGlobalFilters = () => {
    updateChartConfig({
      globalFilters: pendingGlobalFilters,
      globalJoinOperator: pendingGlobalJoinOperator,
    })
  }

  // Apply series filters
  const handleApplySeriesFilters = (
    seriesId: string,
    filters: ExtendedColumnFilter<any>[],
    joinOperator: JoinOperator
  ) => {
    const updatedSeries = chartConfig.seriesConfigs.map((s) =>
      s.id === seriesId ? { ...s, filters, joinOperator } : s
    )
    updateChartConfig({ seriesConfigs: updatedSeries })
  }

  // Sync yAxisFieldConfigs with yAxisFields
  useEffect(() => {
    const newConfigs = chartConfig.yAxisFields.map((field) => {
      const existingConfig = chartConfig.yAxisFieldConfigs.find(
        (c) => c.field === field
      )
      if (existingConfig) return existingConfig

      const availableOps = getAvailableOperationsForField(field)
      return {
        field,
        operation: availableOps[0] || 'count',
      }
    })
    if (
      JSON.stringify(newConfigs) !==
        JSON.stringify(chartConfig.yAxisFieldConfigs) &&
      newConfigs.length > 0
    ) {
      updateChartConfig({ yAxisFieldConfigs: newConfigs })
    }
  }, [chartConfig.yAxisFields])

  // Apply global filters to data
  const filteredData = useMemo(() => {
    if (chartConfig.globalFilters.length === 0) return data

    return data.filter((row) =>
      applyFilters(
        row,
        chartConfig.globalFilters,
        chartConfig.globalJoinOperator
      )
    )
  }, [data, chartConfig.globalFilters, chartConfig.globalJoinOperator])

  // Process chart data
  const processedChartData = useMemo(() => {
    if (!chartConfig.xAxisKey) return []

    if (
      chartConfig.splitMode === 'none' &&
      chartConfig.yAxisFieldConfigs.length > 0
    ) {
      const allValuesOperation = chartConfig.yAxisFieldConfigs.every(
        (config) => config.operation === 'value'
      )

      if (allValuesOperation) {
        return filteredData.map((row) => {
          const result: Record<string, any> = {
            [chartConfig.xAxisKey]: row[chartConfig.xAxisKey],
          }

          chartConfig.yAxisFieldConfigs.forEach((config) => {
            const label = `${config.field} (${
              OPERATION_LABELS[config.operation]
            })`
            result[label] = Number(row[config.field]) || 0
          })

          return result
        })
      }

      // Grouped aggregation
      const grouped = filteredData.reduce((acc, row) => {
        const xValue = row[chartConfig.xAxisKey]

        if (!acc[xValue]) {
          acc[xValue] = { [chartConfig.xAxisKey]: xValue }
          chartConfig.yAxisFieldConfigs.forEach((config) => {
            acc[xValue][`${config.field}_${config.operation}`] = {
              directValue: 0,
              sum: 0,
              count: 0,
              min: Infinity,
              max: -Infinity,
              uniqueValues: new Set(),
            }
          })
        }

        chartConfig.yAxisFieldConfigs.forEach((config) => {
          const value = row[config.field]
          const numValue = Number(value) || 0
          const key = `${config.field}_${config.operation}`
          const stats = acc[xValue][key]

          if (config.operation === 'value') {
            stats.directValue = numValue
          } else {
            stats.sum += numValue
            stats.count += 1
            stats.min = Math.min(stats.min, numValue)
            stats.max = Math.max(stats.max, numValue)
            stats.uniqueValues.add(value)
          }
        })

        return acc
      }, {} as Record<string, any>)

      return Object.values(grouped).map((row) => {
        const result: Record<string, any> = {
          [chartConfig.xAxisKey]: row[chartConfig.xAxisKey],
        }

        chartConfig.yAxisFieldConfigs.forEach((config) => {
          const key = `${config.field}_${config.operation}`
          const stats = row[key]
          const label = `${config.field} (${
            OPERATION_LABELS[config.operation]
          })`

          switch (config.operation) {
            case 'value':
              result[label] = stats.directValue
              break
            case 'sum':
              result[label] = stats.sum
              break
            case 'avg':
              result[label] = stats.count > 0 ? stats.sum / stats.count : 0
              break
            case 'min':
              result[label] = stats.min === Infinity ? 0 : stats.min
              break
            case 'max':
              result[label] = stats.max === -Infinity ? 0 : stats.max
              break
            case 'count':
              result[label] = stats.count
              break
            case 'uniqueCount':
              result[label] = stats.uniqueValues.size
              break
          }
        })

        return result
      })
    }

    if (
      chartConfig.splitMode === 'split' &&
      chartConfig.seriesConfigs.length > 0
    ) {
      const grouped: Record<string, any> = {}

      filteredData.forEach((row) => {
        const xValue = row[chartConfig.xAxisKey]
        if (!grouped[xValue]) {
          grouped[xValue] = { [chartConfig.xAxisKey]: xValue }
          chartConfig.seriesConfigs.forEach((series) => {
            grouped[xValue][series.label] = {
              directValue: 0,
              sum: 0,
              count: 0,
              min: Infinity,
              max: -Infinity,
              uniqueValues: new Set(),
            }
          })
        }

        chartConfig.seriesConfigs.forEach((series) => {
          const passesFilters = applyFilters(
            row,
            series.filters,
            series.joinOperator
          )

          if (passesFilters) {
            const value = row[series.field]
            const numValue = Number(value) || 0
            const stats = grouped[xValue][series.label]

            if (series.operation === 'value') {
              stats.directValue = numValue
            } else {
              stats.sum += numValue
              stats.count += 1
              stats.min = Math.min(stats.min, numValue)
              stats.max = Math.max(stats.max, numValue)
              stats.uniqueValues.add(value)
            }
          }
        })
      })

      return Object.values(grouped).map((row) => {
        const result: Record<string, any> = {
          [chartConfig.xAxisKey]: row[chartConfig.xAxisKey],
        }

        chartConfig.seriesConfigs.forEach((series) => {
          const stats = row[series.label]

          switch (series.operation) {
            case 'value':
              result[series.label] = stats.directValue
              break
            case 'sum':
              result[series.label] = stats.sum
              break
            case 'avg':
              result[series.label] =
                stats.count > 0 ? stats.sum / stats.count : 0
              break
            case 'min':
              result[series.label] = stats.min === Infinity ? 0 : stats.min
              break
            case 'max':
              result[series.label] = stats.max === -Infinity ? 0 : stats.max
              break
            case 'count':
              result[series.label] = stats.count
              break
            case 'uniqueCount':
              result[series.label] = stats.uniqueValues.size
              break
          }
        })

        return result
      })
    }

    return []
  }, [filteredData, chartConfig])

  // Generate chart config
  const generatedChartConfig = useMemo((): ChartConfig => {
    const config: ChartConfig = {}

    if (
      chartConfig.splitMode === 'none' &&
      chartConfig.yAxisFieldConfigs.length > 0
    ) {
      chartConfig.yAxisFieldConfigs.forEach((fieldConfig) => {
        const label = `${fieldConfig.field} (${
          OPERATION_LABELS[fieldConfig.operation]
        })`
        config[label] = { label }
      })
    }

    if (chartConfig.splitMode === 'split') {
      chartConfig.seriesConfigs.forEach((series) => {
        config[series.label] = { label: series.label }
      })
    }

    return config
  }, [chartConfig])

  const yAxisKeys = useMemo(() => {
    if (
      chartConfig.splitMode === 'none' &&
      chartConfig.yAxisFieldConfigs.length > 0
    ) {
      return chartConfig.yAxisFieldConfigs.map(
        (config) => `${config.field} (${OPERATION_LABELS[config.operation]})`
      )
    }
    if (chartConfig.splitMode === 'split') {
      return chartConfig.seriesConfigs.map((s) => s.label)
    }
    return []
  }, [chartConfig])

  // Handle series operations
  const handleAddSeries = () => {
    const newSeries: SeriesConfig = {
      id: generateId({ length: 8 }),
      field: '',
      operation: 'sum',
      label: '',
      filters: [],
      joinOperator: 'and',
    }
    updateChartConfig({
      seriesConfigs: [...chartConfig.seriesConfigs, newSeries],
    })
  }

  const handleRemoveSeries = (id: string) => {
    updateChartConfig({
      seriesConfigs: chartConfig.seriesConfigs.filter((s) => s.id !== id),
    })
  }

  const handleUpdateSeries = (id: string, updates: Partial<SeriesConfig>) => {
    const updatedSeries = chartConfig.seriesConfigs.map((s) =>
      s.id === id ? { ...s, ...updates } : s
    )
    updateChartConfig({ seriesConfigs: updatedSeries })
  }

  const handleSave = () => {
    const configuration: ChartConfiguration = {
      ...chartConfig,
      data: processedChartData,
      config: generatedChartConfig,
      yAxisKeys,
    }

    onSave?.(configuration)
  }

  const handleReset = () => {
    setChartConfig({
      chartKey: generateId({ length: 12 }),
      title: '',
      xAxisKey: '',
      yAxisFields: [],
      yAxisFieldConfigs: [],
      splitMode: 'none',
      seriesConfigs: [],
      globalFilters: [],
      globalJoinOperator: 'and',
    })
    setPendingGlobalFilters([])
    setPendingGlobalJoinOperator('and')
  }

  // Preview update
  const isFirstRender = useRef(true)
  const currentConfiguration = useMemo((): ChartConfiguration | null => {
    if (!chartConfig.title || !chartConfig.xAxisKey || yAxisKeys.length === 0)
      return null

    return {
      ...chartConfig,
      data: processedChartData,
      config: generatedChartConfig,
      yAxisKeys,
    }
  }, [chartConfig, processedChartData, generatedChartConfig, yAxisKeys])

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
    chartConfig.title && chartConfig.xAxisKey && yAxisKeys.length > 0

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

      {/* Global Filters */}
      <ConfigCard
        title="Global Filters"
        description="Apply filters to all data before aggregation">
        <div className="space-y-3">
          <DataTableFilterList
            table={table}
            internalFilters={pendingGlobalFilters}
            onInternalFiltersChange={setPendingGlobalFilters}
            internalJoinOperator={pendingGlobalJoinOperator}
            onInternalJoinOperatorChange={setPendingGlobalJoinOperator}
            filterOpen
          />
          <Button
            onClick={handleApplyGlobalFilters}
            variant="outline"
            size="sm"
            className="w-full">
            Apply Global Filters
          </Button>
          {chartConfig.globalFilters.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {chartConfig.globalFilters.length} filter(s) applied
            </p>
          )}
        </div>
      </ConfigCard>

      {/* Split Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Series Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <ConfigCard
              title="No Splitting"
              description="Simple aggregation with multiple Y-axis fields"
              selected={chartConfig.splitMode === 'none'}
              onClick={() => updateChartConfig({ splitMode: 'none' })}
              className="flex-1"
            />

            <ConfigCard
              title="Split by Series"
              description="Multiple series with individual filters"
              selected={chartConfig.splitMode === 'split'}
              onClick={() => updateChartConfig({ splitMode: 'split' })}
              className="flex-1"
            />
          </div>

          {chartConfig.splitMode === 'none' && (
            <div className="space-y-4">
              <div>
                <Label>Y-Axis Fields</Label>
                <MultiSelect
                  values={chartConfig.yAxisFields}
                  onValuesChange={(values) =>
                    updateChartConfig({ yAxisFields: values })
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

              {chartConfig.yAxisFieldConfigs.map((fieldConfig) => {
                const availableOps = getAvailableOperationsForField(
                  fieldConfig.field
                )
                return (
                  <div
                    key={fieldConfig.field}
                    className="flex items-center gap-2 p-3 border rounded-md bg-muted/20">
                    <Label className="flex-1 text-sm font-medium">
                      {fieldConfig.field}
                    </Label>
                    <SelectInput
                      fieldName="operation"
                      fieldLabel="Operation"
                      fieldType={FormFieldType.SELECT}
                      value={fieldConfig.operation}
                      onChange={(value) => {
                        const updated = chartConfig.yAxisFieldConfigs.map((c) =>
                          c.field === fieldConfig.field
                            ? { ...c, operation: value as CardOperation }
                            : c
                        )
                        updateChartConfig({ yAxisFieldConfigs: updated })
                      }}
                      options={availableOps.map((op) => ({
                        label: OPERATION_LABELS[op],
                        value: op,
                      }))}
                      className="w-40"
                    />
                  </div>
                )
              })}

              {chartConfig.yAxisFieldConfigs.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Select Y-axis fields above to configure operations
                </p>
              )}
            </div>
          )}

          {chartConfig.splitMode === 'split' && (
            <div className="space-y-4">
              {chartConfig.seriesConfigs.map((series, index) => (
                <SeriesItem
                  key={series.id}
                  series={series}
                  index={index}
                  availableFields={availableFields}
                  table={table}
                  onUpdate={handleUpdateSeries}
                  onRemove={handleRemoveSeries}
                  onApplyFilters={handleApplySeriesFilters}
                  getAvailableOperationsForField={
                    getAvailableOperationsForField
                  }
                />
              ))}

              <Button
                variant="outline"
                className="w-full"
                onClick={handleAddSeries}>
                <Plus className="w-4 h-4 mr-2" />
                Add Series
              </Button>
            </div>
          )}
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
            <Badge variant="secondary">
              {chartConfig.globalFilters.length}
            </Badge>
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
              {yAxisKeys.map((key) => (
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
            <Badge variant="secondary">{processedChartData.length}</Badge>
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
