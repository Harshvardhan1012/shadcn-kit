/**
 * Shared utilities and constants for Card and Chart builders
 */

import { applyFilter } from "@/lib/filter"
import type { CardOperation } from "./types"
import type { FilterVariant } from "@/types/data-table"

export const ALL_OPERATIONS: Record<string, CardOperation[]> = {
  text: ["count", "uniqueCount"],
  number: ["count", "sum", "avg", "min", "max", "uniqueCount", "value"],
  range: ["count", "sum", "avg", "min", "max", "uniqueCount"],
  date: ["count", "min", "max", "uniqueCount"],
  dateRange: ["count", "min", "max", "uniqueCount"],
  boolean: ["count", "uniqueCount"],
  select: ["count", "uniqueCount"],
  multiSelect: ["count", "uniqueCount"],
  default: ["count", "uniqueCount"],
}

export const OPERATION_LABELS: Record<CardOperation, string> = {
  count: "Count",
  sum: "Sum",
  avg: "Average",
  min: "Minimum",
  max: "Maximum",
  uniqueCount: "Unique Count",
  value: "Value",
}

/**
 * Apply an array of filters to a data row using the shared applyFilter from lib/filter.ts
 */
export function applyFilters(
  row: Record<string, any>,
  filters: Array<{
    id: string
    operator: string
    value: any
    variant?: string
  }>,
  joinOperator: "and" | "or" = "and"
): boolean {
  if (filters.length === 0) return true

  const results = filters.map((filter) => {
    return applyFilter(row, {
      id: filter.id,
      operator: filter.operator,
      value: filter.value,
      variant: filter.variant || "text",
    })
  })

  return joinOperator === "and" ? results.every(Boolean) : results.some(Boolean)
}

/**
 * Get available operations for a field based on its variant
 */
export function getAvailableOperations(
  fieldName: string,
  columns: any[]
): CardOperation[] {
  const column = columns.find((col) => col.field === fieldName)
  const variant = (column?.options?.variant || "text") as string
  return ALL_OPERATIONS[variant] || ALL_OPERATIONS.default
}

/**
 * Get field variant from column config
 */
export function getFieldVariant(
  fieldName: string,
  columns: any[]
): FilterVariant {
  const column = columns.find((col) => col.field === fieldName)
  return (column?.options?.variant || "text") as FilterVariant
}
