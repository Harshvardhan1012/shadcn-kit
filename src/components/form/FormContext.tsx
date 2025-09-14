import { createContext, useContext } from 'react'
import { type FieldValues, type UseFormReturn } from 'react-hook-form'

export interface FormContextType<T extends FieldValues = any> {
  form: UseFormReturn<T>
  setFieldValue: (fieldName: string, value: unknown) => void
  getFieldValue: (fieldName: string) => unknown
  resetField: (fieldName: string) => void
  resetForm: () => void
  hasErrors: () => boolean
  getErrors: () => Record<string, string>
  getFieldError: (fieldName: string) => string | undefined
  clearErrors: () => void
  clearFieldError: (fieldName: string) => void
  validateField: (fieldName: string) => Promise<boolean>
  validateForm: () => Promise<boolean>
  isDirty: () => boolean
  isFieldDirty: (fieldName: string) => boolean
  getTouchedFields: () => string[]
  isFieldTouched: (fieldName: string) => boolean
  getFormValues: () => T
  setFormValues: (values: Partial<T>) => void
  isValid: () => boolean
  isSubmitting: () => boolean
  submitCount: () => number
  watchField: (fieldName: string) => unknown
  watchAllFields: () => T
}

export const FormContext = createContext<FormContextType | undefined>(undefined)

export const useFormContext = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider')
  }
  return context
}
