import type {
  ColumnConfig,
  ColumnConfigOptions,
} from "@/components/master-table/get-columns"
import type { Option } from "@/types/data-table"

/**
 * Auto-detects the data type of a value and returns the appropriate variant
 */
function getVariantFromValue(value: any): ColumnConfigOptions["variant"] {
  if (typeof value === "boolean") {
    return "multiSelect"
  }
  if (typeof value === "number") {
    return "number"
  }
  // Check if it's a Date object or valid date string
  if (value instanceof Date) {
    return "dateRange"
  }
  if (typeof value === "string") {
    // Try to parse as date - check if it's a valid date string
    const dateRegex =
      /^\d{4}-\d{2}-\d{2}|^\d{2}\/\d{2}\/\d{4}|^\d{2}-\d{2}-\d{4}/
    if (dateRegex.test(value)) {
      const parsed = new Date(value)
      if (!isNaN(parsed.getTime())) {
        return "dateRange"
      }
    }
    return "text"
  }
  return "text"
}

/**
 * Auto-detects the value type of a value
 */
function getValueTypeFromValue(value: any): ColumnConfigOptions["value_type"] {
  if (value instanceof Date) {
    return "date"
  }
  if (typeof value === "string") {
    // Try to parse as date
    const dateRegex =
      /^\d{4}-\d{2}-\d{2}|^\d{2}\/\d{2}\/\d{4}|^\d{2}-\d{2}-\d{4}/
    if (dateRegex.test(value)) {
      const parsed = new Date(value)
      if (!isNaN(parsed.getTime())) {
        return "date"
      }
    }
  }
  if (Array.isArray(value)) {
    return "array"
  }
  return undefined
}

/**
 * Generates options for select/multiselect based on data type
 */
function generateOptionsForField(
  fieldName: string,
  sampleValue: any,
  allData: Record<string, any>[]
): Option[] {
  // For boolean fields, always use true/false
  if (typeof sampleValue === "boolean") {
    return [
      { label: "True", value: true },
      { label: "False", value: false },
    ]
  }

  // For other types, extract unique values from the dataset
  const uniqueValues = new Set<string>()
  allData.forEach((item) => {
    const value = item[fieldName]
    if (value !== null && value !== undefined) {
      uniqueValues.add(String(value))
    }
  })

  return Array.from(uniqueValues)
    .sort()
    .map((value) => ({
      label: String(value).charAt(0).toUpperCase() + String(value).slice(1),
      value: String(value),
    }))
}

/**
 * Generates icons configuration for boolean multiselect fields
 * Returns array format: [{ label, value, icon }]
 */
function generateIconsForBooleanField(): Array<{
  value: boolean
  icon: string
}> {
  return [
    {
      value: true,
      icon: "check", // Default icon for true
    },
    {
      value: false,
      icon: "circle-x", // Default icon for false
    },
  ]
}

/**
 * Auto-generates column configuration from data
 * - Auto-detects data types (boolean → multiSelect, number → number, string → text, date → dateRange)
 * - For boolean multiSelect: generates true/false options + icons
 * - For date fields: sets variant to dateRange and value_type to date
 * - For other multiSelect: extracts unique values from dataset
 * - Removes switch property
 * - Icons only shown for multiSelect boolean fields
 */
export function generateColumnConfig(
  data: Record<string, any>[]
): ColumnConfig[] {
  if (!data || data.length === 0) {
    return []
  }

  const firstRow = data[0]
  const keys = Object.keys(firstRow)

  return keys.map((key, index) => {
    const sampleValue = firstRow[key]
    const variant = getVariantFromValue(sampleValue)
    const valueType = getValueTypeFromValue(sampleValue)

    const options: ColumnConfigOptions = {
      index: index,
      variant: variant,
      isHide: false,
      sortable: true,
      value_type: valueType,
    }

    // Add values for multiSelect
    if (variant === "multiSelect") {
      options.values = generateOptionsForField(key, sampleValue, data)

      // Add icons only for boolean fields (true/false)
      if (typeof sampleValue === "boolean") {
        options.icons = generateIconsForBooleanField()
      }
    }

    return {
      field: key,
      header: key.charAt(0).toUpperCase() + key.slice(1),
      options,
    }
  })
}

export default generateColumnConfig
