// 'use client'

// import { DataTableDateFilter } from '@/components/data-table/data-table-date-filter'
// import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter'
// import { DataTableSliderFilter } from '@/components/data-table/data-table-slider-filter'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import type { Option } from '@/types/data-table'
// import { Plus, X } from 'lucide-react'
// import { useMemo, useState } from 'react'
// import type { CardFilter, FilterOperator, FilterVariant } from './types'

// interface CardFilterDialogProps {
//   availableFields: string[]
//   fieldVariants: Record<string, FilterVariant>
//   columnConfig?: any[]
//   onAddFilter: (filter: CardFilter) => void
// }

// // Operators by variant type
// const OPERATORS_BY_VARIANT: Record<
//   FilterVariant,
//   { value: FilterOperator; label: string }[]
// > = {
//   text: [
//     { value: 'iLike', label: 'Contains' },
//     { value: 'notILike', label: 'Not Contains' },
//     { value: 'eq', label: 'Equals' },
//     { value: 'ne', label: 'Not Equals' },
//     { value: 'isEmpty', label: 'Is Empty' },
//     { value: 'isNotEmpty', label: 'Is Not Empty' },
//   ],
//   number: [
//     { value: 'eq', label: 'Equals' },
//     { value: 'ne', label: 'Not Equals' },
//     { value: 'lt', label: 'Less than' },
//     { value: 'lte', label: 'Less or equal' },
//     { value: 'gt', label: 'Greater than' },
//     { value: 'gte', label: 'Greater or equal' },
//     { value: 'isEmpty', label: 'Is Empty' },
//     { value: 'isNotEmpty', label: 'Is Not Empty' },
//   ],
//   multiSelect: [
//     { value: 'inArray', label: 'Is Any Of' },
//     { value: 'notInArray', label: 'Is Not Any Of' },
//     { value: 'isEmpty', label: 'Is Empty' },
//     { value: 'isNotEmpty', label: 'Is Not Empty' },
//   ],
//   array: [
//     { value: 'inArray', label: 'Contains Any' },
//     { value: 'inAll', label: 'Contains All' },
//     { value: 'notInArray', label: 'Contains None' },
//     { value: 'isEmpty', label: 'Is Empty' },
//     { value: 'isNotEmpty', label: 'Is Not Empty' },
//   ],
//   boolean: [
//     { value: 'eq', label: 'Equals' },
//     { value: 'ne', label: 'Not Equals' },
//   ],
//   dateRange: [
//     { value: 'eq', label: 'Equals' },
//     { value: 'ne', label: 'Not Equals' },
//     { value: 'lt', label: 'Before' },
//     { value: 'lte', label: 'Before or On' },
//     { value: 'gt', label: 'After' },
//     { value: 'gte', label: 'After or On' },
//     { value: 'isBetween', label: 'Between' },
//     { value: 'isEmpty', label: 'Is Empty' },
//     { value: 'isNotEmpty', label: 'Is Not Empty' },
//   ],
//   date: [
//     { value: 'eq', label: 'Equals' },
//     { value: 'ne', label: 'Not Equals' },
//     { value: 'lt', label: 'Before' },
//     { value: 'lte', label: 'Before or On' },
//     { value: 'gt', label: 'After' },
//     { value: 'gte', label: 'After or On' },
//     { value: 'isBetween', label: 'Between' },
//     { value: 'isEmpty', label: 'Is Empty' },
//     { value: 'isNotEmpty', label: 'Is Not Empty' },
//   ],
// }

// // Extract multiselect options from column config
// const getMultiSelectOptions = (
//   field: string,
//   columnConfig?: any[]
// ): Option[] => {
//   if (!columnConfig) return []
//   const column = columnConfig.find((col: any) => col.field === field)
//   return column?.options?.values || []
// }

// /**
//  * MockColumn: Creates a mock TanStack Table Column object for use with DataTable filter components
//  * This allows us to reuse the exact filter components from the data-table folder
//  */
// class MockColumn {
//   private filterValue: any = undefined

//   constructor(public id: string, public variant: FilterVariant) {}

//   getFilterValue() {
//     return this.filterValue
//   }

//   setFilterValue(value: any) {
//     this.filterValue = value
//   }

//   getFacetedMinMaxValues() {
//     return undefined
//   }

//   get columnDef() {
//     return {
//       meta: {
//         variant: this.variant,
//         label: this.id,
//         range: undefined,
//         unit: undefined,
//       },
//     }
//   }
// }

// export function CardFilterDialog({
//   availableFields,
//   fieldVariants,
//   columnConfig,
//   onAddFilter,
// }: CardFilterDialogProps) {
//   const [showForm, setShowForm] = useState(false)
//   const [field, setField] = useState('')
//   const [operator, setOperator] = useState<FilterOperator>('eq')
//   const [stringValue, setStringValue] = useState('')
//   const [numberValue, setNumberValue] = useState<number | ''>('')
//   const [selectedValues, setSelectedValues] = useState<any[]>([])
//   const [dateFrom, setDateFrom] = useState<Date | undefined>()
//   const [dateTo, setDateTo] = useState<Date | undefined>()
//   const [boolValue, setBoolValue] = useState<'true' | 'false'>('true')

//   const currentVariant = field ? fieldVariants[field] || 'text' : 'text'
//   const availableOperators = OPERATORS_BY_VARIANT[currentVariant] || []
//   const multiSelectOptions = getMultiSelectOptions(field, columnConfig)

//   // Create a mock column for use with DataTable filter components
//   const mockColumn = useMemo(() => {
//     if (!field) return null
//     return new MockColumn(field, currentVariant) as any
//   }, [field, currentVariant])

//   const handleAdd = () => {
//     if (!field) return

//     // Check if operator needs a value
//     if (['isEmpty', 'isNotEmpty'].includes(operator)) {
//       onAddFilter({
//         field,
//         operator,
//         value: '',
//         variant: currentVariant,
//       })
//       resetForm()
//       return
//     }

//     // Validate based on variant
//     let filterValue: string | number | boolean | (string | number)[] = ''
//     let isValid = true

//     switch (currentVariant) {
//       case 'multiSelect':
//         if (multiSelectOptions.length > 0) {
//           if (selectedValues.length === 0) isValid = false
//           filterValue = selectedValues.map((opt: any) => opt.value)
//         } else {
//           if (!stringValue) isValid = false
//           filterValue = stringValue
//         }
//         break

//       case 'dateRange':
//       case 'date':
//         if (operator === 'isBetween') {
//           if (!dateFrom || !dateTo) isValid = false
//           filterValue = [dateFrom?.getTime() || 0, dateTo?.getTime() || 0]
//         } else {
//           if (!dateFrom) isValid = false
//           filterValue = dateFrom?.getTime() || 0
//         }
//         break

//       case 'number':
//         if (numberValue === '') isValid = false
//         filterValue = numberValue
//         break

//       case 'boolean':
//         filterValue = boolValue === 'true'
//         break

//       default:
//         if (!stringValue) isValid = false
//         filterValue = stringValue
//     }

//     if (isValid) {
//       onAddFilter({
//         field,
//         operator,
//         value: filterValue,
//         variant: currentVariant,
//       })
//       resetForm()
//     }
//   }

//   const resetForm = () => {
//     setField('')
//     setOperator('eq')
//     setStringValue('')
//     setNumberValue('')
//     setSelectedValues([])
//     setDateFrom(undefined)
//     setDateTo(undefined)
//     setBoolValue('true')
//     setShowForm(false)
//   }

//   const handleOperatorChange = (newOperator: string) => {
//     setOperator(newOperator as FilterOperator)
//     // Reset values when operator changes
//     setStringValue('')
//     setNumberValue('')
//     setDateFrom(undefined)
//     setDateTo(undefined)
//     setSelectedValues([])
//   }

//   const renderValueInput = () => {
//     if (['isEmpty', 'isNotEmpty'].includes(operator)) {
//       return null
//     }

//     switch (currentVariant) {
//       case 'multiSelect':
//         if (multiSelectOptions.length > 0 && mockColumn) {
//           return (
//             <div className="border rounded p-2">
//               <DataTableFacetedFilter
//                 column={mockColumn}
//                 title={field}
//                 options={multiSelectOptions}
//                 multiple={true}
//               />
//             </div>
//           )
//         }
//         return (
//           <Input
//             placeholder="Enter comma-separated values"
//             value={stringValue}
//             onChange={(e) => setStringValue(e.target.value)}
//             className="h-8 text-xs"
//           />
//         )

//       case 'dateRange':
//       case 'date':
//         if (mockColumn) {
//           return (
//             <div className="border rounded p-2">
//               <DataTableDateFilter
//                 column={mockColumn}
//                 title={field}
//                 multiple={operator === 'isBetween'}
//               />
//             </div>
//           )
//         }
//         break

//       case 'number':
//         if (mockColumn) {
//           return (
//             <div className="border rounded p-2">
//               <DataTableSliderFilter
//                 column={mockColumn}
//                 title={field}
//               />
//             </div>
//           )
//         }
//         return (
//           <Input
//             type="number"
//             placeholder="Enter number"
//             value={numberValue}
//             onChange={(e) =>
//               setNumberValue(
//                 e.target.value === '' ? '' : Number(e.target.value)
//               )
//             }
//             className="h-8 text-xs"
//           />
//         )

//       case 'boolean':
//         return (
//           <Select
//             value={boolValue}
//             onValueChange={(v) => setBoolValue(v as 'true' | 'false')}>
//             <SelectTrigger className="h-8 text-xs">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="true">True</SelectItem>
//               <SelectItem value="false">False</SelectItem>
//             </SelectContent>
//           </Select>
//         )

//       default:
//         return (
//           <Input
//             placeholder="Enter value"
//             value={stringValue}
//             onChange={(e) => setStringValue(e.target.value)}
//             className="h-8 text-xs"
//           />
//         )
//     }
//   }

//   const isValid = () => {
//     if (!field) return false
//     if (['isEmpty', 'isNotEmpty'].includes(operator)) return true

//     switch (currentVariant) {
//       case 'multiSelect':
//         if (multiSelectOptions.length > 0) return selectedValues.length > 0
//         return stringValue.length > 0

//       case 'dateRange':
//       case 'date':
//         if (operator === 'isBetween') return !!(dateFrom && dateTo)
//         return !!dateFrom

//       case 'number':
//         return numberValue !== ''

//       case 'boolean':
//         return true

//       default:
//         return stringValue.length > 0
//     }
//   }

//   return (
//     <div className="space-y-3">
//       {showForm && (
//         <div className="rounded-lg border p-3 space-y-2">
//           <Select
//             value={field}
//             onValueChange={setField}>
//             <SelectTrigger className="h-8 text-xs">
//               <SelectValue placeholder="Select field" />
//             </SelectTrigger>
//             <SelectContent>
//               {availableFields.map((f) => (
//                 <SelectItem
//                   key={f}
//                   value={f}>
//                   {f}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Select
//             value={operator}
//             onValueChange={handleOperatorChange}>
//             <SelectTrigger className="h-8 text-xs">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               {availableOperators.map((op) => (
//                 <SelectItem
//                   key={op.value}
//                   value={op.value}>
//                   {op.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           {renderValueInput()}

//           <div className="flex gap-2">
//             <Button
//               size="sm"
//               className="h-7 text-xs flex-1"
//               onClick={handleAdd}
//               disabled={!isValid()}>
//               Add
//             </Button>
//             <Button
//               size="sm"
//               variant="outline"
//               className="h-7 text-xs flex-1"
//               onClick={resetForm}>
//               Cancel
//             </Button>
//           </div>
//         </div>
//       )}

//       {!showForm && (
//         <Button
//           size="sm"
//           variant="outline"
//           className="h-7 text-xs w-full"
//           onClick={() => setShowForm(true)}>
//           <Plus className="w-3 h-3 mr-1" />
//           Add Filter
//         </Button>
//       )}
//     </div>
//   )
// }

// export function CardFilterList({
//   filters,
//   onRemoveFilter,
// }: {
//   filters: CardFilter[]
//   onRemoveFilter: (index: number) => void
// }) {
//   if (filters.length === 0) return null

//   return (
//     <div className="space-y-1">
//       {filters.map((filter, index) => (
//         <div
//           key={index}
//           className="flex items-center justify-between bg-muted p-2 rounded text-xs hover:bg-muted/80 transition-colors">
//           <span className="truncate font-medium">{filter.field}</span>
//           <span className="text-muted-foreground mx-1">{filter.operator}</span>
//           <span className="truncate flex-1">
//             {Array.isArray(filter.value)
//               ? `[${filter.value.join(', ')}]`
//               : typeof filter.value === 'boolean'
//               ? filter.value
//                 ? 'true'
//                 : 'false'
//               : String(filter.value)}
//           </span>
//           <button
//             onClick={() => onRemoveFilter(index)}
//             className="text-destructive hover:text-destructive/80 flex-shrink-0 ml-2 transition-colors"
//             title="Remove filter">
//             <X className="w-3 h-3" />
//           </button>
//         </div>
//       ))}
//     </div>
//   )
// }
