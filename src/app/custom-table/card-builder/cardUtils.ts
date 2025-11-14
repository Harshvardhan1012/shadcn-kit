import { applyFilter } from "@/lib/filter"
import type { Card, CardOperation } from "./types"

export const calculateCardValue = (
  data: Record<string, any>[],
  card: Card
): string | number => {
  if (!data || data.length === 0) return 0

  // Filter data based on card filters using the shared applyFilter function
  let filteredData = data
  if (card.filters && card.filters.length > 0) {
    filteredData = data.filter((row) =>
      card.filters!.every((filter) => {
        // For interval operators, the value is dynamic and calculated at runtime
        // The filter.value contains the configuration (e.g., "7" for lastNDays)
        // applyFilter will handle the date calculation based on current date
        return applyFilter(row, {
          id: filter.field,
          operator: filter.operator,
          value: filter.value,
          variant: filter.variant,
        })
      })
    )
  }

  const values = filteredData
    .map((row) => row[card.field])
    .filter((val) => val !== null && val !== undefined)

  if (values.length === 0) return 0

  switch (card.operation) {
    case "count":
      return values.length

    case "sum":
      return values.reduce((acc, val) => {
        const num = Number(val)
        return acc + (isNaN(num) ? 0 : num)
      }, 0)

    case "avg":
      const sum = values.reduce((acc, val) => {
        const num = Number(val)
        return acc + (isNaN(num) ? 0 : num)
      }, 0)
      return Math.round((sum / values.length) * 100) / 100

    case "min":
      const numValues = values.map((v) => Number(v)).filter((v) => !isNaN(v))
      return numValues.length > 0 ? Math.min(...numValues) : 0

    case "max":
      const maxValues = values.map((v) => Number(v)).filter((v) => !isNaN(v))
      return maxValues.length > 0 ? Math.max(...maxValues) : 0

    case "uniqueCount":
      return new Set(values).size

    case "value":
      return values[0]

    default:
      return 0
  }
}

export const getOperationLabel = (operation: CardOperation): string => {
  const labels: Record<CardOperation, string> = {
    count: "Count",
    sum: "Sum",
    avg: "Average",
    min: "Minimum",
    max: "Maximum",
    uniqueCount: "Unique Count",
    value: "Value",
  }
  return labels[operation]
}
