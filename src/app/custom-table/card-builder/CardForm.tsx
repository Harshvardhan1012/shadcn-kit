'use client'
import { execSp } from '@/app/custom-chart/api'
import { DataTableFilterList } from '@/components/data-table/data-table-filter-list'
import { FormFieldType } from '@/components/form/DynamicForm'
import { SelectInput } from '@/components/form/SelectInput'
import { TextInput } from '@/components/form/TextInput'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type {
  ExtendedColumnFilter,
  FilterVariant,
  JoinOperator,
} from '@/types/data-table'
import { useEffect, useState } from 'react'
import { useTableContext } from '../../../context/TableContext'
import { ALL_OPERATIONS, OPERATION_LABELS, getFieldVariant } from './card-utils'
import type { Card, CardFilter, CardOperation } from './types'

interface CardFormProps {
  availableFields?: string[]
  fieldVariants?: Record<string, FilterVariant> // Kept for backward compatibility, table columns are now from context
  columnConfig?: any[] // Kept for backward compatibility, table columns are now from context
  onSave: (card: Card) => void
  onCancel: () => void
  initialCard?: Card
  sp?: boolean
}

export function CardForm({
  availableFields,
  columnConfig,
  onSave,
  onCancel,
  initialCard,
  sp = false,
}: CardFormProps) {
  const [title, setTitle] = useState(initialCard?.title || '')
  const [description, setDescription] = useState(initialCard?.description || '')
  const [field, setField] = useState(initialCard?.field || '')
  const [operation, setOperation] = useState<CardOperation>(
    initialCard?.operation || (sp ? 'value' : 'count')
  )
  const [spName, setSpName] = useState(initialCard?.spName || '')
  const [, setSpData] = useState<any[]>([])
  const [spFields, setSpFields] = useState<string[]>([])

  // Get the table instance from context (shared with the main data table)
  const { table } = useTableContext()

  // Manage filters internally (not in URL query params)
  const [filters, setFilters] = useState<ExtendedColumnFilter<any>[]>([])
  const [joinOperator, setJoinOperator] = useState<JoinOperator>('and')

  // Get field variant from columnConfig using shared utility
  const getFieldVariantLocal = (fieldName: string): FilterVariant => {
    if (!columnConfig) return 'text'
    return getFieldVariant(fieldName, columnConfig)
  }

  // Fetch SP data when spName changes (only in SP mode)
  const {
    data: spApiResponse,
    error: spApiError,
    isLoading: isLoadingSP,
  } = execSp(sp && spName ? spName : '')

  // Extract fields and data from SP response
  useEffect(() => {
    if (sp && spApiResponse?.data) {
      setSpData(spApiResponse.data)
      if (spApiResponse.data.length > 0) {
        const fields = Object.keys(spApiResponse.data[0])
        setSpFields(fields)
      } else {
        setSpFields([])
      }
    } else if (sp && spApiError) {
      setSpFields([])
      setSpData([])
    }
  }, [sp, spApiResponse, spApiError])

  // Get available operations based on selected field's variant
  const availableOperations = sp
    ? ['value' as CardOperation]
    : field
    ? ALL_OPERATIONS[getFieldVariantLocal(field)] || ALL_OPERATIONS.default
    : ALL_OPERATIONS.default

  // Reset operation if it's not available for the new field
  useEffect(() => {
    if (field && !availableOperations.includes(operation)) {
      setOperation(availableOperations[0] || 'count')
    }
  }, [field, availableOperations, operation])

  // Initialize filters from initialCard if editing
  useEffect(() => {
    if (initialCard?.filters && initialCard.filters.length > 0) {
      const convertedFilters: ExtendedColumnFilter<any>[] =
        initialCard.filters.map((f) => ({
          id: f.field as any,
          value: f.value as any,
          variant: (f.variant || 'text') as any,
          operator: f.operator as any,
          filterId: `${f.field}-${Date.now()}-${Math.random()}`,
        }))
      setFilters(convertedFilters)
    } else {
      // Clear filters when creating a new card
      setFilters([])
      setJoinOperator('and')
    }
  }, [initialCard])

  if (!table && !sp) {
    return (
      <div className="space-y-4 p-4">
        <p className="text-sm text-muted-foreground">
          Table context not available. Please ensure this form is wrapped with
          TableProvider.
        </p>
      </div>
    )
  }

  // Convert data-table filters to card filters when saving
  const convertToCardFilters = (
    dataTableFilters: ExtendedColumnFilter<any>[]
  ): CardFilter[] => {
    return dataTableFilters.map((filter) => ({
      field: filter.id,
      operator: filter.operator as any,
      value: filter.value,
      variant: filter.variant as FilterVariant,
    }))
  }

  const handleSave = () => {
    const cardFilters = sp ? [] : convertToCardFilters(filters)

    onSave({
      cardId: initialCard?.cardId || Math.floor(Math.random() * 100),
      order: initialCard?.order,
      title,
      description: description || undefined,
      field,
      operation,
      filters: cardFilters,
      sp,
      spName: sp ? spName : undefined,
    })

    // Reset form for next card
    setFilters([])
    setJoinOperator('and')
    if (sp) {
      setSpName('')
      setSpData([])
      setSpFields([])
    }
  }

  return (
    <div className="space-y-4 p-4">
      {sp ? (
        <>
          <TextInput
            label="Stored Procedure Name"
            placeholder="e.g., sp_GetTotalRevenue"
            value={spName}
            onChange={(value) => setSpName(value as string)}
          />

          {isLoadingSP && (
            <p className="text-sm text-muted-foreground">Loading SP data...</p>
          )}

          {spApiError && (
            <p className="text-sm text-destructive">
              Failed to fetch data from stored procedure
            </p>
          )}

          {spFields.length > 0 && (
            <SelectInput
              fieldName="field"
              fieldLabel="Select Field"
              fieldType={FormFieldType.SELECT}
              label="Select Field for Value"
              placeholder="Choose a field"
              value={field}
              onChange={(value) => setField(value)}
              options={spFields.map((f) => ({
                label: f,
                value: f,
              }))}
            />
          )}
        </>
      ) : (
        <>
          <SelectInput
            fieldName="field"
            fieldLabel="Select Field"
            fieldType={FormFieldType.SELECT}
            label="Select Field"
            placeholder="Choose a field"
            value={field}
            onChange={(value) => setField(value)}
            options={availableFields?.map((f) => ({
              label: f,
              value: f,
            }))}
          />

          <SelectInput
            fieldName="operation"
            fieldLabel="Operation"
            fieldType={FormFieldType.SELECT}
            label="Operation"
            value={operation}
            onChange={(value) => setOperation(value as CardOperation)}
            options={availableOperations.map((op) => ({
              label: OPERATION_LABELS[op],
              value: op,
            }))}
          />

          <div>
            <Label className="text-sm font-medium mb-2 block">
              Filters (Optional)
            </Label>
            <DataTableFilterList
              table={table!}
              internalFilters={filters}
              onInternalFiltersChange={setFilters}
              internalJoinOperator={joinOperator}
              onInternalJoinOperatorChange={setJoinOperator}
              filterOpen={true}
            />
          </div>
        </>
      )}

      <TextInput
        label="Card Title"
        placeholder="e.g., Total Orders"
        value={title}
        onChange={(value) => setTitle(value as string)}
      />

      <TextInput
        label="Description (Optional)"
        placeholder="e.g., Total number of orders this month"
        value={description}
        onChange={(value) => setDescription(value as string)}
      />
      <div className="flex gap-2 pt-4">
        <Button
          onClick={handleSave}
          className="flex-1">
          {initialCard ? 'Update Card' : 'Create Card'}
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  )
}
