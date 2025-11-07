export type CardOperation =
  | "count"
  | "sum"
  | "avg"
  | "min"
  | "max"
  | "uniqueCount"

export type FilterVariant =
  | "text"
  | "number"
  | "multiSelect"
  | "array"
  | "boolean"
  | "dateRange"
  | "date"

export type FilterOperator =
  // Text operators
  | "iLike"
  | "notILike"
  | "eq"
  | "ne"
  | "isEmpty"
  | "isNotEmpty"
  // Number operators
  | "lt"
  | "lte"
  | "gt"
  | "gte"
  // MultiSelect operators
  | "inArray"
  | "notInArray"
  // Array operators
  | "inAll"
  // DateRange operators
  | "isBetween"

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
  color: string
  filters?: CardFilter[]
  order?: number
}

export interface CardData {
  value: string | number
  label: string
  icon: string
}
