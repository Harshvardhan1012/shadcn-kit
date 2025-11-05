import { FormFieldType } from "@/components/form/DynamicForm"
import type { SectionConfig } from "@/components/form/SectionedDynamicForm"
import z from "zod"

export const sectionConfig: SectionConfig = {
  title: "Add and Manage Options",
  description:
    "Add or remove label and value pairs for select/multiselect options",
  fields: [
    {
      fieldName: "label",
      fieldLabel: "Label",
      fieldType: FormFieldType.TEXT,
      placeholder: "Enter label (e.g., Active)",
    },
    {
      fieldName: "value",
      fieldLabel: "Value",
      fieldType: FormFieldType.TEXT,
      placeholder: "Enter value (e.g., active)",
    },
  ],
  defaultValues: [],
  allowCopy: true,
  allowReset: true,
  collapsible: true,
}

export const zodSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.union([z.string(), z.number(), z.boolean()]),
})
