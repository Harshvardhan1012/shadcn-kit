import { type Option } from "@/types/data-table"

export interface ColumnConfigOptions {
  index?: number
  sortable?: boolean
  hideable?: boolean
  isHide?: boolean // Column is hidden from view but still available for filtering
  variant?:
    | "text"
    | "select"
    | "number"
    | "dateRange"
    | "switch"
    | "multiSelect"
    | "range"
  is_longtext?: boolean
  is_switch?: boolean
  switch_value?: any
  text_size?: "small" | "medium" | "large" // Font size for text: 'small', 'medium', 'large' - applies font-${size} class
  value_type?: "array" | "date" | "string" | "number"
  lable_fields?: string[]
  icons?: Record<string, any> // Map of field values to icon components
  on_click_id?: string
  on_change_id?: string
  values?: Option[]
  icon?: React.FC<React.SVGProps<SVGSVGElement>>
}

export interface ColumnConfig {
  field: string
  header: string
  options?: ColumnConfigOptions
}
