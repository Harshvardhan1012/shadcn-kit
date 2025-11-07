'use client'

import SectionedDynamicForm from '@/components/form/SectionedDynamicForm'
import { FormDialog } from '@/components/ui/form-dialog'
import type { Option } from '@/types/data-table'
import { useMemo } from 'react'
import { createSectionConfig, createZodSchema } from './form_config'

interface OptionsDialogProps {
  open: boolean
  onClose: () => void
  values: Option[]
  onSave: (values: Option[]) => void
  isBoolean?: boolean // Whether the field is boolean type
}

export function OptionsDialog({
  open,
  onClose,
  values,
  onSave,
  isBoolean = false,
}: OptionsDialogProps) {
  // Create dynamic section config and schema based on field type
  const { sectionConfig, zodSchema } = useMemo(() => {
    return {
      sectionConfig: createSectionConfig(isBoolean),
      zodSchema: createZodSchema(isBoolean),
    }
  }, [isBoolean])

  const handleSubmit = (data: Option[]) => {
    // Convert values based on field type
    const processedData = data.map((item) => {
      let processedValue: string | number | boolean = item.value

      if (isBoolean && typeof item.value === 'string') {
        // Convert string to boolean for boolean fields
        if (item.value.toLowerCase() === 'true') {
          processedValue = true
        } else if (item.value.toLowerCase() === 'false') {
          processedValue = false
        }
      } else if (!isBoolean && typeof item.value === 'string') {
        // Try to parse as number for non-boolean fields
        const numValue = Number(item.value)
        if (!isNaN(numValue) && item.value.trim() !== '') {
          processedValue = numValue
        }
      }

      return {
        label: item.label,
        value: processedValue,
      }
    })

    onSave(processedData)
    onClose()
  }

  // Convert default values to display format for the form
  const formValues = useMemo(() => {
    return values.map((item) => ({
      label: item.label,
      value: String(item.value), // Convert all values to string for form display
    }))
  }, [values])

  const configWithDefaults = {
    ...sectionConfig,
    defaultValues: formValues,
  }

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={isBoolean ? 'Manage Boolean Options' : 'Manage Options'}
      description={
        isBoolean
          ? 'Configure true/false options for boolean fields'
          : 'Add, edit, or remove options for select/multiselect fields'
      }>
      <SectionedDynamicForm
        sectionConfig={configWithDefaults}
        schema={zodSchema}
        onSubmit={handleSubmit}
        submitButtonText="Save Options"
        showResetAllButton={true}
        sectionTitlePrefix={isBoolean ? 'Boolean Option' : 'Option'}
      />
    </FormDialog>
  )
}
