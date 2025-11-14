import type { FilterOperator, FilterVariant } from "@/types/data-table"

export type CardOperation =
  | "count"
  | "sum"
  | "avg"
  | "min"
  | "max"
  | "uniqueCount"
  | "value"

export interface CardFilter {
  field: string
  operator: FilterOperator
  value: string | number | boolean | (string | number)[]
  variant?: FilterVariant
}

export interface Card {
  id: string
  title: string
  field: string
  operation: CardOperation
  filters?: CardFilter[]
  order?: number
}

export interface CardData {
  value: string | number
  label: string
  icon: string
}
