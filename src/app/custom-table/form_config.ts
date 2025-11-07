import { FormFieldType } from "@/components/form/DynamicForm"
import type { SectionConfig } from "@/components/form/SectionedDynamicForm"
import z from "zod"

/**
 * Creates form section config based on field type
 * For boolean fields: value field is a SELECT with true/false options
 * For other fields: value field is a TEXT input
 */
export const createSectionConfig = (
  isBoolean: boolean = false
): SectionConfig => ({
  title: isBoolean
    ? "Add and Manage Boolean Options"
    : "Add and Manage Options",
  description: isBoolean
    ? "Add or remove label and value pairs for boolean fields (true/false)"
    : "Add or remove label and value pairs for select/multiselect options",
  fields: [
    {
      fieldName: "label",
      fieldLabel: "Label",
      fieldType: FormFieldType.TEXT,
      placeholder: "Enter label (e.g., Active, True)",
    },
    isBoolean
      ? {
          fieldName: "value",
          fieldLabel: "Boolean Value",
          fieldType: FormFieldType.SELECT,
          placeholder: "Select true or false",
          options: [
            { label: "True", value: "true" },
            { label: "False", value: "false" },
          ],
        }
      : {
          fieldName: "value",
          fieldLabel: "Value (string or number)",
          fieldType: FormFieldType.TEXT,
          placeholder: "Enter value (e.g., active, 1, high)",
          description: "Can be string or number",
        },
  ],
  defaultValues: [],
  allowCopy: true,
  allowReset: true,
  collapsible: true,
})

/**
 * Creates Zod validation schema based on field type
 * For boolean fields: value must be "true" or "false" string
 * For other fields: value can be string or number
 */
export const createZodSchema = (isBoolean: boolean = false) => {
  if (isBoolean) {
    return z.object({
      label: z.string().min(1, "Label is required"),
      value: z
        .string()
        .refine((val) => val === "true" || val === "false", {
          message: "Value must be 'true' or 'false'",
        }),
    })
  }

  return z.object({
    label: z.string().min(1, "Label is required"),
    value: z.union([z.string(), z.number()]).refine(
      (val) => {
        // Try to parse the value intelligently
        if (typeof val === "string") {
          if (val.toLowerCase() === "true" || val.toLowerCase() === "false") {
            return true
          }
          if (!isNaN(Number(val))) {
            return true
          }
          return true // Accept any string
        }
        return true
      },
      { message: "Invalid value" }
    ),
  })
}

// Default exports for backward compatibility
export const sectionConfig: SectionConfig = createSectionConfig(false)
export const zodSchema = createZodSchema(false)
