'use client'

/**
 * CardForm - Form for creating/editing metric cards with filters
 *
 * This component integrates the powerful data-table filter system directly
 * for defining card filters. Instead of building custom filter UI, it reuses:
 *
 * - DataTableFilterMenu: Compact filter UI with inline filter chips
 * - DataTableFilterList: Advanced filter UI with sortable list and AND/OR operators
 *
 * Features inherited from data-table filters:
 * - Field selection with search
 * - Smart operator selection based on field type
 * - Variant-aware value inputs (text, number, date, multiSelect, etc.)
 * - Date pickers, range inputs, multi-select checkboxes
 * - Keyboard shortcuts (press 'f' to open filter menu)
 * - Query parameter persistence via nuqs
 * - Full accessibility support
 *
 * The form creates a virtual TanStack table instance just for the filter components,
 * then converts the resulting filters to the card's filter format on save.
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
import { getFiltersStateParser } from '@/lib/parsers'
import type { ExtendedColumnFilter } from '@/types/data-table'
import { useQueryStates } from 'nuqs'
import { useEffect, useState } from 'react'
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

const OPERATIONS: CardOperation[] = [
  'count',
  'sum',
  'avg',
  'min',
  'max',
  'uniqueCount',
]

const COLORS = [
  { name: 'red', value: '#ef4444' },
  { name: 'orange', value: '#f97316' },
  { name: 'yellow', value: '#eab308' },
  { name: 'green', value: '#22c55e' },
  { name: 'blue', value: '#3b82f6' },
  { name: 'purple', value: '#a855f7' },
  { name: 'pink', value: '#ec4899' },
  { name: 'slate', value: '#64748b' },
]

export function CardForm({
  availableFields,
  fieldVariants,
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
  const [color, setColor] = useState(initialCard?.color || COLORS[4].value)

  // Get the table instance from context (shared with the main data table)
  const { table, columns } = useTableContext()
  console.log('CardForm - table from context:', table)

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

  // Parse filters from query state (managed by DataTableFilterList/Menu)
  const [queryFilters] = useQueryStates({
    filters: getFiltersStateParser(
      columns.map((col) => col.id || col.accessorKey).filter(Boolean)
    )
      .withDefault([])
      .withOptions({
        clearOnDefault: true,
        shallow: true,
      }),
  })

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

  // Initialize filters from initialCard if editing
  useEffect(() => {
    if (initialCard?.filters && initialCard.filters.length > 0) {
      // Note: Setting filters programmatically would require direct query state manipulation
      // For now, users will need to re-add filters when editing
      // This is a known limitation of the current implementation
    }
  }, [initialCard])

  const handleSave = () => {
    if (!title || !field) {
      alert('Please fill in all required fields')
      return
    }

    const cardFilters = convertToCardFilters(queryFilters.filters)

    onSave({
      id: initialCard?.id || Date.now().toString(),
      title,
      field,
      operation,
      color,
      filters: cardFilters,
    })
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
            {OPERATIONS.map((op) => (
              <SelectItem
                key={op}
                value={op}>
                {op.charAt(0).toUpperCase() + op.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Card Color</label>
        <div className="flex gap-2 mt-2 flex-wrap">
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => setColor(c.value)}
              className={`w-8 h-8 rounded-lg border-2 transition ${
                color === c.value ? 'border-gray-800' : 'border-gray-200'
              }`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">
          Filters (Optional)
        </label>
        <div className="mt-2 rounded-lg border p-3 bg-muted/20 space-y-3">
          {/* 
            DataTableFilterMenu: Displays inline filter chips with quick add/remove
            - Compact UI that shows each active filter as a chip
            - Good for limited space scenarios
            - Each filter is individually editable inline
            
            Alternative: DataTableFilterList (uncomment below to switch)
            - Shows filters in a sortable list inside a popover
            - Supports AND/OR join operators between filters
            - Drag-and-drop to reorder filters
            - Better for complex multi-filter scenarios
          */}
          <DataTableFilterList
            table={table}
            debounceMs={300}
            throttleMs={50}
            shallow={true}
          />

          {/* Alternative: Use DataTableFilterList for a different UI
          <DataTableFilterList
            table={table}
            debounceMs={300}
            throttleMs={50}
            shallow={true}
          />
          */}

          <p className="text-xs text-muted-foreground mt-2">
            💡 Add filters to refine your card calculations. These filters will
            be applied when computing the card value.
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
