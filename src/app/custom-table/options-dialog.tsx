'use client'

import SectionedDynamicForm from '@/components/form/SectionedDynamicForm'
import { FormDialog } from '@/components/ui/form-dialog'
import type { Option } from '@/types/data-table'
import { sectionConfig, zodSchema } from './form_config'

interface OptionsDialogProps {
  open: boolean
  onClose: () => void
  values: Option[]
  onSave: (values: Option[]) => void
}

export function OptionsDialog({ open, onClose, onSave }: OptionsDialogProps) {
  const handleSubmit = (data: Option[]) => {
    onSave(data)
    onClose()
  }

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Manage Options"
      description="Add, edit, or remove options for select/multiselect fields">
      <SectionedDynamicForm
        sectionConfig={sectionConfig}
        schema={zodSchema}
        onSubmit={handleSubmit}
        submitButtonText="Save Options"
        showResetAllButton={true}
        sectionTitlePrefix="Option"
      />
    </FormDialog>
  )
}
