'use client'

import SectionedDynamicForm from '@/components/form/SectionedDynamicForm'
import { FormDialog } from '@/components/ui/form-dialog'
import { useMemo } from 'react'
import { createIconsSectionConfig, iconsZodSchema } from './icons_form_config'
import { useIconsData } from './use-icons-data'

interface IconsManagerDialogProps {
  open: boolean
  onClose: () => void
  icons: Array<{ label: string; value: string; icon: string }>
  onSave: (icons: Array<{ label: string; value: string; icon: string }>) => void
}

export function IconsManagerDialog({
  open,
  onClose,
  icons,
  onSave,
}: IconsManagerDialogProps) {
  const { iconsData } = useIconsData()

  const iconOptions = useMemo(() => {
    if (!iconsData || Object.keys(iconsData).length === 0) return []
    return Object.keys(iconsData).map((iconName) => ({
      label: iconName,
      value: iconName,
    }))
  }, [iconsData])

  const sectionConfig = useMemo(
    () => createIconsSectionConfig(iconOptions),
    [iconOptions]
  )

  const handleSubmit = (data: Array<any>) => {
    onSave(data)
    onClose()
  }

  const configWithDefaults = {
    ...sectionConfig,
    defaultValues: icons || [],
  }

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Manage Icons"
      description="Add, edit, or remove icon mappings">
      <SectionedDynamicForm
        sectionConfig={configWithDefaults}
        schema={iconsZodSchema}
        onSubmit={handleSubmit}
        submitButtonText="Save Icons"
        showResetAllButton={true}
        sectionTitlePrefix="Icon"
      />
    </FormDialog>
  )
}
