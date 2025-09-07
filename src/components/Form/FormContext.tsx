'use client'
import { createContext, useContext } from 'react'
import { FieldValues, UseFormReturn } from 'react-hook-form'

export interface FormContextType<T extends FieldValues = any> {
  form: UseFormReturn<T>
  setFieldValue: (fieldName: string, value: unknown) => void
  getFieldValue: (fieldName: string) => unknown
  resetField: (fieldName: string) => void
  resetForm: () => void
}

export const FormContext = createContext<FormContextType | undefined>(undefined)

export const useFormContext = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider')
  }
  return context
}
