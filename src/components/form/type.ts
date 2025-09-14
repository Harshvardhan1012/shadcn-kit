// Generic base component props for form components
export interface BaseComponentProps<T = unknown> {
  label?: string
  description?: string
  error: React.JSX.Element | null
  className?: string
  disabled?: boolean
  onChange?: (value: T) => void
  onBlur?: (value?: T) => void
}

export enum TimeFormat {
  TWELVE_HOUR = "12-hour",
  TWENTY_FOUR_HOUR = "24-hour",
}

export enum TimeStructure {
  HOUR_ONLY = "hour-only",
  HOUR_MINUTE = "hour-minute",
  HOUR_MINUTE_SECOND = "hour-minute-second",
}
export enum DateTimeMode {
  SINGLE = "single",
  MULTIPLE = "multiple",
  RANGE = "range",
}

// Common form value types
export type FormValue =
  | string
  | number
  | boolean
  | Date
  | File
  | null
  | string[]
  | { from?: Date; to?: Date }

// Specific component prop types for better type safety
export type StringComponentProps = BaseComponentProps<string>
export type NumberComponentProps = BaseComponentProps<number>
export type BooleanComponentProps = BaseComponentProps<boolean>
export type DateComponentProps = BaseComponentProps<Date>
export type FileComponentProps = BaseComponentProps<File | null>
export type StringArrayComponentProps = BaseComponentProps<string[]>
export type StringOrNumberComponentProps = BaseComponentProps<string | number>
