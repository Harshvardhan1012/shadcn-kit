import { FormFieldType } from "@/components/form/DynamicForm"
import type { SectionConfig } from "@/components/form/SectionedDynamicForm"
import z from "zod"

// Note: icon options need to be passed dynamically from the component
// as they're fetched from the CDN
export const createIconsSectionConfig = (
  iconOptions: Array<{ label: string; value: string }>
): SectionConfig => ({
  title: "Map Values to Icons",
  description: "Assign Lucide icons to column values",
  fields: [
    {
      fieldName: "value",
      fieldLabel: "Value for which icon is assigned",
      fieldType: FormFieldType.TEXT,
      placeholder: "Enter value (e.g., active, true)",
    },
    {
      fieldName: "icon",
      fieldLabel: "Icon Selection Luicide react ",
      fieldType: FormFieldType.COMBOBOX,
      placeholder: "Search and select icon...",
      searchPlaceholder: "Search icons...",
      description: `visit https://lucide.dev/icons to explore available icons.`,
      options: iconOptions,
    },
  ],
  defaultValues: [],
  allowCopy: true,
  allowReset: true,
  collapsible: true,
})

export const iconsZodSchema = z.object({
  value: z.string().min(1, "Value is required"),
  icon: z.string().min(1, "Icon is required"),
})
