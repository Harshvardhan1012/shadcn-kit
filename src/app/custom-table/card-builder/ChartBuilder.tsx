'use client'

import { DataTableFilterList } from '@/components/data-table/data-table-filter-list'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ChartConfig } from '@/components/ui/chart'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/components/ui/multi-select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { generateId } from '@/lib/id'
import type { ExtendedColumnFilter, JoinOperator } from '@/types/data-table'
import { Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTableContext } from './TableContext'
import {
  type CardOperation,
  OPERATION_LABELS,
  applyFilters,
  getAvailableOperations,
} from './card-utils'

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
  data: Record<string, any>[]
  config: ChartConfig
  xAxisKey: string
  yAxisKeys: string[]
  globalFilters?: ExtendedColumnFilter<any>[]
  seriesConfigs?: SeriesConfig[]
}

type SplitMode = 'none' | 'split'

interface ChartBuilderProps {
  data: Record<string, any>[]
  columns: any[]
  onSave?: (chartConfig: ChartConfiguration) => void
  onCancel?: () => void
  onPreviewUpdate?: (chartConfig: ChartConfiguration) => void
  compact?: boolean // For use in sheet layout
}

export function ChartBuilder({
  data,
  columns,
  onSave,
  onCancel,
  onPreviewUpdate,
  compact = false,
}: ChartBuilderProps) {
  const [chartTitle, setChartTitle] = useState('')
  const [globalFilters, setGlobalFilters] = useState<
    ExtendedColumnFilter<any>[]
  >([])
  const [globalJoinOperator, setGlobalJoinOperator] =
    useState<JoinOperator>('and')
  const [xAxisField, setXAxisField] = useState('')
  const [splitMode, setSplitMode] = useState<SplitMode>('none')
  const [yAxisFields, setYAxisFields] = useState<string[]>([])
  const [yAxisFieldConfigs, setYAxisFieldConfigs] = useState<
    YAxisFieldConfig[]
  >([])
  const [seriesConfigs, setSeriesConfigs] = useState<SeriesConfig[]>([])

  const { table } = useTableContext()

  // Get available fields from columns
  const availableFields = useMemo(() => {
    return columns.map((col) => col.field)
  }, [columns])

  // Get available operations for a field using shared utility
  const getAvailableOperationsForField = (
    fieldName: string
  ): CardOperation[] => {
    return getAvailableOperations(fieldName, columns)
  }

  // Sync yAxisFieldConfigs with yAxisFields
  useEffect(() => {
    const newConfigs = yAxisFields.map((field) => {
      const existingConfig = yAxisFieldConfigs.find((c) => c.field === field)
      if (existingConfig) return existingConfig

      const availableOps = getAvailableOperationsForField(field)
      return {
        field,
        operation: availableOps[0] || 'count',
      }
    })
    if (
      JSON.stringify(newConfigs) !== JSON.stringify(yAxisFieldConfigs) &&
      newConfigs.length > 0
    ) {
      setYAxisFieldConfigs(newConfigs)
    }
  }, [yAxisFields])

  // Apply global filters to data using shared utility
  const filteredData = useMemo(() => {
    if (globalFilters.length === 0) return data

    return data.filter((row) =>
      applyFilters(row, globalFilters, globalJoinOperator)
    )
  }, [data, globalFilters, globalJoinOperator])

  // Apply series-specific filters and aggregate
  const processedChartData = useMemo(() => {
    if (!xAxisField) return []

    if (splitMode === 'none' && yAxisFieldConfigs.length > 0) {
      // Multiple Y-axis fields with individual operations
      const grouped = filteredData.reduce((acc, row) => {
        const xValue = row[xAxisField]

        if (!acc[xValue]) {
          acc[xValue] = { [xAxisField]: xValue }
          yAxisFieldConfigs.forEach((config) => {
            acc[xValue][`${config.field}_${config.operation}`] = {
              sum: 0,
              count: 0,
              min: Infinity,
              max: -Infinity,
              values: new Set(),
            }
          })
        }

        yAxisFieldConfigs.forEach((config) => {
          const value = row[config.field]
          const numValue = Number(value) || 0
          const key = `${config.field}_${config.operation}`
          const stats = acc[xValue][key]

          stats.sum += numValue
          stats.count += 1
          stats.min = Math.min(stats.min, numValue)
          stats.max = Math.max(stats.max, numValue)
          stats.values.add(value)
        })

        return acc
      }, {} as Record<string, any>)

      // Calculate final values based on operation
      return Object.values(grouped).map((row) => {
        const result: Record<string, any> = { [xAxisField]: row[xAxisField] }

        yAxisFieldConfigs.forEach((config) => {
          const key = `${config.field}_${config.operation}`
          const stats = row[key]
          const label = `${config.field} (${
            OPERATION_LABELS[config.operation]
          })`

          switch (config.operation) {
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
              result[label] = stats.values.size
              break
          }
        })

        return result
      })
    }

    if (splitMode === 'split' && seriesConfigs.length > 0) {
      // Apply filters for each series and aggregate with operations
      const grouped: Record<string, any> = {}

      filteredData.forEach((row) => {
        const xValue = row[xAxisField]
        if (!grouped[xValue]) {
          grouped[xValue] = { [xAxisField]: xValue }
          seriesConfigs.forEach((series) => {
            grouped[xValue][series.label] = {
              sum: 0,
              count: 0,
              min: Infinity,
              max: -Infinity,
              values: new Set(),
            }
          })
        }

        // Process each series
        seriesConfigs.forEach((series) => {
          // Apply series-specific filters using shared utility
          const passesFilters = applyFilters(
            row,
            series.filters,
            series.joinOperator
          )

          if (passesFilters) {
            const value = row[series.field]
            const numValue = Number(value) || 0
            const stats = grouped[xValue][series.label]

            stats.sum += numValue
            stats.count += 1
            stats.min = Math.min(stats.min, numValue)
            stats.max = Math.max(stats.max, numValue)
            stats.values.add(value)
          }
        })
      })

      // Calculate final values based on operation
      return Object.values(grouped).map((row) => {
        const result: Record<string, any> = { [xAxisField]: row[xAxisField] }

        seriesConfigs.forEach((series) => {
          const stats = row[series.label]

          switch (series.operation) {
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
              result[series.label] = stats.values.size
              break
          }
        })

        return result
      })
    }

    return []
  }, [filteredData, xAxisField, yAxisFieldConfigs, splitMode, seriesConfigs])

  // Generate chart config
  const chartConfig = useMemo((): ChartConfig => {
    const config: ChartConfig = {}

    if (splitMode === 'none' && yAxisFieldConfigs.length > 0) {
      yAxisFieldConfigs.forEach((fieldConfig) => {
        const label = `${fieldConfig.field} (${
          OPERATION_LABELS[fieldConfig.operation]
        })`
        config[label] = {
          label,
        }
      })
    }

    if (splitMode === 'split') {
      seriesConfigs.forEach((series) => {
        config[series.label] = {
          label: series.label,
        }
      })
    }

    return config
  }, [splitMode, yAxisFieldConfigs, seriesConfigs])

  const yAxisKeys = useMemo(() => {
    if (splitMode === 'none' && yAxisFieldConfigs.length > 0) {
      return yAxisFieldConfigs.map(
        (config) => `${config.field} (${OPERATION_LABELS[config.operation]})`
      )
    }
    if (splitMode === 'split') {
      return seriesConfigs.map((s) => s.label)
    }
    return []
  }, [splitMode, yAxisFieldConfigs, seriesConfigs])

  const handleAddSeries = () => {
    setSeriesConfigs([
      ...seriesConfigs,
      {
        id: generateId({ length: 8 }),
        field: '',
        operation: 'sum',
        label: '',
        filters: [],
        joinOperator: 'and',
      },
    ])
  }

  const handleRemoveSeries = (id: string) => {
    setSeriesConfigs(seriesConfigs.filter((s) => s.id !== id))
  }

  const handleUpdateSeries = (id: string, updates: Partial<SeriesConfig>) => {
    setSeriesConfigs(
      seriesConfigs.map((s) => (s.id === id ? { ...s, ...updates } : s))
    )
  }

  const handleSave = () => {
    const configuration: ChartConfiguration = {
      chartKey: generateId({ length: 12 }),
      title: chartTitle,
      data: processedChartData,
      config: chartConfig,
      xAxisKey: xAxisField,
      yAxisKeys,
      globalFilters,
      seriesConfigs: splitMode === 'split' ? seriesConfigs : undefined,
    }

    onSave?.(configuration)
  }

  // Use ref to track if this is the first render
  const isFirstRender = useRef(true)

  // Create stable configuration object
  const currentConfiguration = useMemo((): ChartConfiguration | null => {
    if (!chartTitle || !xAxisField || yAxisKeys.length === 0) return null

    return {
      chartKey: generateId({ length: 12 }),
      title: chartTitle,
      data: processedChartData,
      config: chartConfig,
      xAxisKey: xAxisField,
      yAxisKeys,
      globalFilters,
      seriesConfigs: splitMode === 'split' ? seriesConfigs : undefined,
    }
  }, [
    chartTitle,
    xAxisField,
    yAxisKeys.length,
    processedChartData,
    Object.keys(chartConfig).length,
    globalFilters.length,
    seriesConfigs.length,
    splitMode,
  ])

  // Update preview with stable configuration
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (onPreviewUpdate && currentConfiguration) {
      onPreviewUpdate(currentConfiguration)
    }
  }, [currentConfiguration, onPreviewUpdate])

  const isValid = chartTitle && xAxisField && yAxisKeys.length > 0

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
      {/* Chart Title */}
      <Card>
        <CardHeader>
          <CardTitle>Chart Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="chart-title">Chart Title</Label>
          <Input
            id="chart-title"
            placeholder="Enter chart title"
            value={chartTitle}
            onChange={(e) => setChartTitle(e.target.value)}
          />
          {/* Global Filters */}
          <Label>Global Filters</Label>
          <DataTableFilterList
            table={table}
            internalFilters={globalFilters}
            onInternalFiltersChange={setGlobalFilters}
            internalJoinOperator={globalJoinOperator}
            onInternalJoinOperatorChange={setGlobalJoinOperator}
          />
          <Label>X-Axis Field</Label>
          <Select
            value={xAxisField}
            onValueChange={setXAxisField}>
            <SelectTrigger>
              <SelectValue placeholder="Select X-axis field" />
            </SelectTrigger>
            <SelectContent>
              {availableFields.map((field) => (
                <SelectItem
                  key={field}
                  value={field}>
                  {field}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Split Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Series Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Card
              className={`flex-1 cursor-pointer transition-all ${
                splitMode === 'none'
                  ? 'border-primary ring-2 ring-primary'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setSplitMode('none')}>
              <CardHeader>
                <CardTitle className="text-base">No Splitting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Simple aggregation with single Y-axis field
                </p>
              </CardContent>
            </Card>

            <Card
              className={`flex-1 cursor-pointer transition-all ${
                splitMode === 'split'
                  ? 'border-primary ring-2 ring-primary'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setSplitMode('split')}>
              <CardHeader>
                <CardTitle className="text-base">Split by Series</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Multiple series with individual filters
                </p>
              </CardContent>
            </Card>
          </div>

          {splitMode === 'none' && (
            <div className="space-y-4">
              <div>
                <Label>Y-Axis Fields</Label>
                <MultiSelect
                  values={yAxisFields}
                  onValuesChange={setYAxisFields}>
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

              {/* Operation selectors for each selected Y-axis field */}
              {yAxisFieldConfigs.map((fieldConfig) => {
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
                    <Select
                      value={fieldConfig.operation}
                      onValueChange={(value) => {
                        setYAxisFieldConfigs((prev) =>
                          prev.map((c) =>
                            c.field === fieldConfig.field
                              ? { ...c, operation: value as CardOperation }
                              : c
                          )
                        )
                      }}>
                      <SelectTrigger className="w-40 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableOps.map((op) => (
                          <SelectItem
                            key={op}
                            value={op}>
                            {OPERATION_LABELS[op]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )
              })}

              {yAxisFieldConfigs.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Select Y-axis fields above to configure operations
                </p>
              )}
            </div>
          )}

          {splitMode === 'split' && (
            <div className="space-y-4">
              {seriesConfigs.map((series, index) => (
                <Card
                  key={series.id}
                  className="border-dashed">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">
                        Series {index + 1}
                      </CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveSeries(series.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs">Field</Label>
                      <Select
                        value={series.field}
                        onValueChange={(value) => {
                          // Reset operation to first available when field changes
                          const availableOps =
                            getAvailableOperationsForField(value)
                          handleUpdateSeries(series.id, {
                            field: value,
                            operation: availableOps[0] || 'sum',
                          })
                        }}>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableFields.map((field) => (
                            <SelectItem
                              key={field}
                              value={field}>
                              {field}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs">Operation</Label>
                      <Select
                        value={series.operation}
                        onValueChange={(value) =>
                          handleUpdateSeries(series.id, {
                            operation: value as CardOperation,
                          })
                        }>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(series.field
                            ? getAvailableOperationsForField(series.field)
                            : (['sum', 'avg', 'count'] as CardOperation[])
                          ).map((op) => (
                            <SelectItem
                              key={op}
                              value={op}>
                              {OPERATION_LABELS[op]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs">Series Label</Label>
                      <Input
                        className="h-8"
                        placeholder="Enter series label"
                        value={series.label}
                        onChange={(e) =>
                          handleUpdateSeries(series.id, {
                            label: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label className="text-xs mb-2 block">
                        Series Filters
                      </Label>
                      <div className="border rounded-md p-2 bg-muted/20">
                        {table && (
                          <DataTableFilterList
                            table={table}
                            internalFilters={series.filters}
                            onInternalFiltersChange={(filters) =>
                              handleUpdateSeries(series.id, { filters })
                            }
                            internalJoinOperator={series.joinOperator}
                            onInternalJoinOperatorChange={(op) =>
                              handleUpdateSeries(series.id, {
                                joinOperator: op,
                              })
                            }
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
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

      {/* Preview */}
      {/* {processedChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <DynamicChart
              title={chartTitle || 'Chart Preview'}
              description={`${processedChartData.length} data points`}
              data={processedChartData}
              config={chartConfig}
              xAxisKey={xAxisField}
              yAxisKeys={yAxisKeys}
              chartType="bar"
              height={400}
            />
          </CardContent>
        </Card>
      )} */}

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Title:</span>
            <Badge variant="secondary">{chartTitle || 'Not set'}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Global Filters:
            </span>
            <Badge variant="secondary">{globalFilters.length}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">X-Axis:</span>
            <Badge variant="secondary">{xAxisField || 'Not set'}</Badge>
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
        </CardContent>
      </Card>

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
          onClick={() => {
            setChartTitle('')
            setGlobalFilters([])
            setXAxisField('')
            setYAxisFields([])
            setYAxisFieldConfigs([])
            setSeriesConfigs([])
            setSplitMode('none')
          }}>
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
