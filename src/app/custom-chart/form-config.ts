import {
  FormFieldType,
  type FormFieldConfig,
} from "@/components/form/DynamicForm"
import * as z from "zod"
import { width as widthConfig } from "./utils"

export const createChartFormConfig = (
  availableFields: string[],
  yAxisKeys: string[] = []
): FormFieldConfig[] => {
  const baseConfig: FormFieldConfig[] = [
    {
      fieldName: "title",
      fieldLabel: "Chart Title",
      fieldType: FormFieldType.TEXT,
      placeholder: "Enter chart title",
      validation: z.string().min(1, "Title is required"),
    },
    {
      fieldName: "description",
      fieldLabel: "Description",
      fieldType: FormFieldType.TEXT,
      placeholder: "Enter chart description (optional)",
      validation: z.string().optional(),
    },
    {
      fieldName: "width",
      fieldLabel: "Chart Width",
      fieldType: FormFieldType.SELECT,
      placeholder: "Select chart width",
      options: Object.entries(widthConfig).map(([key, value]) => ({
        label: (value as { name: string; className: string }).name,
        value: key,
      })),
    },
    {
      fieldName: "xAxisKey",
      fieldLabel: "X-Axis Field",
      fieldType: FormFieldType.SELECT,
      placeholder: "Select X-axis field",
      options: availableFields.map((field) => ({
        label: field,
        value: field,
      })),
      validation: z.string().min(1, "X-Axis field is required"),
    },
    {
      fieldName: "yAxisKeys",
      fieldLabel: "Y-Axis Fields",
      fieldType: FormFieldType.MULTISELECT,
      placeholder: "Select Y-axis fields",
      options: availableFields.map((field) => ({
        label: field,
        value: field,
      })),
      validation: z
        .array(z.string())
        .min(1, "At least one Y-Axis field is required"),
      overflowBehavior: "wrap",
    },
  ]

  // Add dynamic Y-axis label fields based on selected yAxisKeys
  const labelFields: FormFieldConfig[] = yAxisKeys.map((field) => ({
    fieldName: `label_${field}`,
    fieldLabel: `${field} - Display Label`,
    fieldType: FormFieldType.TEXT,
    placeholder: `Label for ${field}`,
    validation: z.string().optional(),
  }))

  return [...baseConfig, ...labelFields]
}

export const createChartFormSchema = (yAxisKeys: string[] = []) => {
  const schemaObj: Record<string, z.ZodTypeAny> = {
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    width: z.enum(["full", "half", "third"]),
    xAxisKey: z.string().min(1, "X-Axis field is required"),
    yAxisKeys: z
      .array(z.string())
      .min(1, "At least one Y-Axis field is required"),
  }

  // Add dynamic label field validations
  yAxisKeys.forEach((field) => {
    schemaObj[`label_${field}`] = z.string().optional()
  })

  return z.object(schemaObj)
}
