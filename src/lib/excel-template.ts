import {
  FormFieldType,
  type FormFieldConfig,
} from "@/components/form/DynamicForm"

export const extractFormFieldMetadata = (
  config: FormFieldConfig[],
  excludeKeys: string[] = [] 
) => {
  return config
    .filter((field) => !excludeKeys.includes(field.fieldName)) 
    .map((field) => {
      const fieldMeta: any = {
        key: field.fieldName,
        label: field.fieldLabel,
        type: field.fieldType,
      }

      // Handle dropdown or combobox options
      if (
        field.fieldType === FormFieldType.SELECT ||
        field.fieldType === FormFieldType.COMBOBOX
      ) {
        fieldMeta.dropdownOptions = field.options
      }

      return fieldMeta
    })
}
