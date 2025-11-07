import { applyFilter } from "@/lib/filter"
import type { Card } from "./types"

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
        // Convert card filter format to the format expected by applyFilter
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

    default:
      return 0
  }
}

export const getOperationLabel = (operation: string): string => {
  const labels: Record<string, string> = {
    count: "Count",
    sum: "Sum",
    avg: "Average",
    min: "Minimum",
    max: "Maximum",
    uniqueCount: "Unique Count",
  }
  return labels[operation] || operation
}

export const getOperationIcon = (operation: string): string => {
  const icons: Record<string, string> = {
    count: "Hash",
    sum: "Plus",
    avg: "BarChart3",
    min: "ArrowDown",
    max: "ArrowUp",
    uniqueCount: "Layers",
  }
  return icons[operation] || "Square"
}
