import { FormFieldType } from "@/components/form/DynamicForm"
import type { SectionConfig } from "@/components/form/SectionedDynamicForm"
import z from "zod"

// Note: icon options need to be passed dynamically from the component
// as they're fetched from the CDN
export const createIconsSectionConfig = (
  iconOptions: Array<{ label: string; value: string }>
): SectionConfig => ({
  title: "Map Boolean Values to Icons",
  description: "Assign Lucide icons to true/false values (boolean fields only)",
  fields: [
    {
      fieldName: "value",
      fieldLabel: "Boolean Value",
      fieldType: FormFieldType.SELECT,
      placeholder: "Select true or false",
      options: [
        { label: "True", value: "true" },
        { label: "False", value: "false" },
      ],
    },
    {
      fieldName: "icon",
      fieldLabel: "Icon Selection (Lucide React)",
      fieldType: FormFieldType.COMBOBOX,
      placeholder: "Search and select icon...",
      searchPlaceholder: "Search icons...",
      description: `Visit https://lucide.dev/icons to explore available icons`,
      options: iconOptions,
    },
  ],
  defaultValues: [],
  allowCopy: false, // Don't allow copy for boolean values (only true/false allowed)
  allowReset: true,
  collapsible: true,
})

export const iconsZodSchema = z.object({
  value: z
    .enum(["true", "false"])
    .refine((val) => val === "true" || val === "false", {
      message: "Value must be 'true' or 'false'",
    }),
  icon: z.string().min(1, "Icon is required"),
})
