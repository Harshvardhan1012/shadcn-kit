import {
  FormFieldType,
  type FormFieldConfig,
} from "@/components/form/DynamicForm"
import { z } from "zod"

export const formSchema = z.object({
  todo: z.string().min(1, { message: "Todo cannot be empty" }),
  completed: z.enum([true, false]).transform((val) => val === "true"),
  edit: z.boolean().optional().default(false),
  id: z.number().optional().nullable(),
})

export const exampleFormConfig: FormFieldConfig[] = [
  {
    fieldName: "todo",
    fieldLabel: "Todo",
    fieldType: FormFieldType.TEXT,
    placeholder: "Enter your todo",
    description: "What task do you want to add?",
  },
  {
    fieldName: "completed",
    fieldLabel: "Completed",
    fieldType: FormFieldType.RADIO,
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ],
    description: "Mark if this task is completed",
  },
]
