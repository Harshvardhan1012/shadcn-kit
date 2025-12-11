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
  value: string | number | boolean | (string | number | boolean)[]
  variant?: FilterVariant
}

export interface Card {
  cardId: number
  order?: number
  title: string
  description?: string
  field: string
  value?: string | number
  operation: CardOperation
  filters?: CardFilter[]
  sp?: boolean
  spName?: string
  url?: string
  urlField?: string
}

export interface CardData {
  value: string | number
  label: string
  icon: string
}
