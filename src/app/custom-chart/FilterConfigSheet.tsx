'use client'

import type { FormFieldConfig } from '@/components/form/DynamicForm'
import { FormFieldType } from '@/components/form/DynamicForm'
import SectionedDynamicForm, {
  type SectionedFormContextType,
} from '@/components/form/SectionedDynamicForm'
import SheetDemo from '@/components/sheet/page'
import { Button } from '@/components/ui/button'
import { Settings2 } from 'lucide-react'
import { useRef, useState } from 'react'
import * as z from 'zod'

export interface FilterConfig {
  filterId: string
  columnKey: string
  variant: 'text' | 'number' | 'select' | 'multiSelect' | 'dateRange' | 'range'
  enabled: boolean
  spName?: string // For multiSelect - stored procedure to fetch options
  placeholder?: string
  options: { value: string; label: string }[]
}

interface FilterConfigSheetProps {
  filterConfigs: FilterConfig[]
  onSave: (configs: FilterConfig[]) => void
  triggerButton?: React.ReactNode
}

export function FilterConfigSheet({
  filterConfigs,
  onSave,
  triggerButton,
}: FilterConfigSheetProps) {
  const [open, setOpen] = useState(false)
  const formRef = useRef<SectionedFormContextType>(null)

  // Create form config for each filter
  const filterFieldsConfig: FormFieldConfig[] = [
    {
      fieldName: 'columnKey',
      fieldLabel: 'Column Name',
      fieldType: FormFieldType.TEXT,
      placeholder: 'e.g., status, category, date',
      description: 'Enter the exact column name from your data',
      validation: z.string().min(1, 'Column name is required'),
    },
    {
      fieldName: 'variant',
      fieldLabel: 'Type',
      fieldType: FormFieldType.SELECT,
      options: [
        { value: 'text', label: 'Text' },
        { value: 'number', label: 'Number' },
        { value: 'select', label: 'Select' },
        { value: 'multiSelect', label: 'Multi-Select' },
        { value: 'dateRange', label: 'Date Range' },
        { value: 'range', label: 'Range (Slider)' },
      ],
      validation: z.enum([
        'text',
        'number',
        'select',
        'multiSelect',
        'dateRange',
        'range',
      ]),
    },
    {
      fieldName: 'spName',
      fieldLabel: 'Stored Procedure',
      fieldType: FormFieldType.TEXT,
      placeholder: 'e.g., sp_GetFilterOptions',
      description:
        'For select/multiselect: SP must return value and label columns',
      showIf: (values) =>
        values.variant === 'multiSelect' || values.variant === 'select',
    },
    {
      fieldName: 'placeholder',
      fieldLabel: 'Placeholder',
      fieldType: FormFieldType.TEXT,
      placeholder: 'e.g., Search...',
    },
  ]

  const filterSchema = z.object({
    columnKey: z.string().min(1, 'Column name is required'),
    variant: z.enum([
      'text',
      'number',
      'select',
      'multiSelect',
      'dateRange',
      'range',
    ]),
    spName: z.string().optional(),
    placeholder: z.string().optional(),
  })

  const handleSave = (data: any[]) => {
    // Transform data to include ids
    const transformedConfigs = data.map((item, index) => ({
      filterId:
        filterConfigs[index]?.filterId || `filter_${Date.now()}_${index}`,
      columnKey: item.columnKey,
      variant: item.variant,
      enabled: item.enabled !== false, // Default to true if not specified
      spName: item.spName,
      placeholder: item.placeholder,
      options: [], // Options will be fetched based on SP or left empty
    }))

    onSave(transformedConfigs)
    setOpen(false)
  }

  // Convert filterConfigs to default values format for SectionedDynamicForm
  const defaultValues = filterConfigs.map((config) => ({
    columnKey: config.columnKey,
    variant: config.variant,
    spName: config.spName || '',
    placeholder: config.placeholder || '',
  }))

  return (
    <>
      {triggerButton ? (
        <div onClick={() => setOpen(true)}>{triggerButton}</div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}>
          <Settings2 className="h-4 w-4 mr-2" />
          Configure Filters
        </Button>
      )}

      <SheetDemo
        open={open}
        onOpenChange={setOpen}
        size="xl"
        storageKey="filter-config-sheet">
        <h2 className="text-lg font-semibold">Configure Filters</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select which columns to show as filters and configure their settings.
        </p>

        <SectionedDynamicForm
          ref={formRef}
          sectionConfig={{
            title: '',
            description: '',
            fields: filterFieldsConfig,
            defaultValues: defaultValues.length > 0 ? defaultValues : [{}],
            minSections: 0,
            allowCopy: true,
            allowReset: true,
            collapsible: false,
          }}
          schema={filterSchema}
          onSubmit={handleSave}
          submitButtonText="Save Configuration"
          addButtonText="Add Filter"
          sectionTitlePrefix="Filter"
        />
      </SheetDemo>
    </>
  )
}
