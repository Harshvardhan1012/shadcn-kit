'use client'

import SectionedDynamicForm from '@/components/form/SectionedDynamicForm'
import { FormDialog } from '@/components/ui/form-dialog'
import { useMemo } from 'react'
import { createIconsSectionConfig, iconsZodSchema } from './icons_form_config'
import { useIconsData } from './use-icons-data'

interface IconsManagerDialogProps {
  open: boolean
  onClose: () => void
  icons: Array<{ label?: string; value: boolean; icon: string }>
  onSave: (icons: Array<{ value: boolean; icon: string }>) => void
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
    // Convert string values to boolean for saving
    const processedData = data.map((item) => ({
      value: item.value === 'true', // Convert string to boolean
      icon: item.icon,
    }))
    onSave(processedData)
    onClose()
  }

  // Convert boolean values back to strings for form display
  const formData = icons.map((icon) => ({
    value: icon.value === true ? 'true' : 'false',
    icon: {
      label: icon.icon,
      value: icon.icon,
    },
  }))

  const configWithDefaults = {
    ...sectionConfig,
    defaultValues: formData || [],
    maxSections: 2, // Only allow true and false
    minSections: 1, // At least one icon mapping
  }

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Manage Icons for Boolean Values"
      description="Assign Lucide icons to true and false values">
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
