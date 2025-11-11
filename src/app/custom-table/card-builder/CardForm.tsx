'use client'

/**
 * CardForm - Form for creating/editing metric cards with filters
 *
 * This component integrates the powerful data-table filter system directly
 * for defining card filters. Instead of building custom filter UI, it reuses:
 *
 * - DataTableFilterList: Advanced filter UI with sortable list and AND/OR operators
 *
 * Features inherited from data-table filters:
 * - Field selection with search
 * - Smart operator selection based on field type
 * - Variant-aware value inputs (text, number, date, multiSelect, etc.)
 * - Date pickers, range inputs, multi-select checkboxes
 * - Keyboard shortcuts (press 'f' to open filter menu)
 * - Full accessibility support
 *
 * Note: Filters are managed internally (not in URL) to support editing cards
 * with pre-existing filters.
 *
 * Dynamic Date Intervals:
 * - Interval operators (isToday, isThisMonth, lastNDays, etc.) automatically
 *   recalculate based on the current date each time the card is displayed
 * - Example: A card with "This Month" filter will show different results each month
 * - No need to update saved cards - they adapt to the current date automatically
 */

import { DataTableFilterList } from '@/components/data-table/data-table-filter-list'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ExtendedColumnFilter, JoinOperator } from '@/types/data-table'
import { useEffect, useState } from 'react'
import { ALL_OPERATIONS, OPERATION_LABELS, getFieldVariant } from './card-utils'
import { useTableContext } from './TableContext'
import type { Card, CardFilter, CardOperation, FilterVariant } from './types'

interface CardFormProps {
  availableFields: string[]
  fieldVariants?: Record<string, FilterVariant> // Kept for backward compatibility, table columns are now from context
  columnConfig?: any[] // Kept for backward compatibility, table columns are now from context
  onSave: (card: Card) => void
  onCancel: () => void
  initialCard?: Card
}

// const COLORS = [
//   { name: 'red', value: '#ef4444' },
//   { name: 'orange', value: '#f97316' },
//   { name: 'yellow', value: '#eab308' },
//   { name: 'green', value: '#22c55e' },
//   { name: 'blue', value: '#3b82f6' },
//   { name: 'purple', value: '#a855f7' },
//   { name: 'pink', value: '#ec4899' },
//   { name: 'slate', value: '#64748b' },
// ]

export function CardForm({
  availableFields,
  columnConfig,
  onSave,
  onCancel,
  initialCard,
}: CardFormProps) {
  const [title, setTitle] = useState(initialCard?.title || '')
  const [field, setField] = useState(initialCard?.field || '')
  const [operation, setOperation] = useState<CardOperation>(
    initialCard?.operation || 'count'
  )

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

  // Get available operations based on selected field's variant
  const availableOperations = field
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
    if (!title || !field) {
      alert('Please fill in all required fields')
      return
    }

    const cardFilters = convertToCardFilters(filters)

    onSave({
      id: initialCard?.id || Date.now().toString(),
      title,
      field,
      operation,
      // color,
      filters: cardFilters,
    })

    // Reset form for next card
    setFilters([])
    setJoinOperator('and')
  }

  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="text-sm font-medium">Card Title *</label>
        <Input
          placeholder="e.g., Total Orders"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Select Field *</label>
        <Select
          value={field}
          onValueChange={setField}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Choose a field" />
          </SelectTrigger>
          <SelectContent>
            {availableFields.map((f) => (
              <SelectItem
                key={f}
                value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Operation</label>
        <Select
          value={operation}
          onValueChange={(v) => setOperation(v as CardOperation)}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableOperations.map((op) => (
              <SelectItem
                key={op}
                value={op}>
                {OPERATION_LABELS[op]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {field && (
          <p className="text-xs text-muted-foreground mt-1">
            Available operations for {getFieldVariantLocal(field)} field
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">
          Filters (Optional)
        </label>
        <div className="mt-2 rounded-lg border p-3 bg-muted/20 space-y-3">
          <DataTableFilterList
            table={table}
            internalFilters={filters}
            onInternalFiltersChange={setFilters}
            internalJoinOperator={joinOperator}
            onInternalJoinOperatorChange={setJoinOperator}
          />

          <p className="text-xs text-muted-foreground mt-2">
            💡 Add filters to refine your card calculations. Interval filters
            (like "This Month" or "Last 30 Days") dynamically update based on
            the current date.
          </p>
        </div>
      </div>

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
