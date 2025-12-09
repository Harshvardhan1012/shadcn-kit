'use client'

import type { FormFieldConfig } from '@/components/form/DynamicForm'
import DynamicForm, { FormFieldType } from '@/components/form/DynamicForm'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Plus, Settings2, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import * as z from 'zod'

export interface FilterConfig {
  id: string
  columnKey: string
  label: string
  variant: 'text' | 'number' | 'select' | 'multiSelect' | 'dateRange' | 'range'
  enabled: boolean
  spName?: string // For multiSelect - stored procedure to fetch options
  placeholder?: string
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
  const [configs, setConfigs] = useState<FilterConfig[]>(filterConfigs)

  useEffect(() => {
    setConfigs(filterConfigs)
  }, [filterConfigs])

  const handleAddFilter = () => {
    const newConfig: FilterConfig = {
      id: `filter_${Date.now()}`,
      columnKey: '',
      label: 'New Filter',
      variant: 'text',
      enabled: true,
      placeholder: 'Enter value...',
    }

    setConfigs([...configs, newConfig])
  }

  const handleRemoveFilter = (id: string) => {
    setConfigs(configs.filter((c) => c.id !== id))
  }

  const handleSave = () => {
    onSave(configs)
    setOpen(false)
  }

  // Create form config for each filter
  const createFilterFormConfig = (): FormFieldConfig[] => {
    return [
      {
        fieldName: 'enabled',
        fieldLabel: 'Enabled',
        fieldType: FormFieldType.SWITCH,
        description: 'Enable or disable this filter',
      },
      {
        fieldName: 'columnKey',
        fieldLabel: 'Column Name',
        fieldType: FormFieldType.TEXT,
        placeholder: 'e.g., status, category, date',
        description: 'Enter the exact column name from your data',
      },
      {
        fieldName: 'label',
        fieldLabel: 'Label',
        fieldType: FormFieldType.TEXT,
        placeholder: 'Filter label',
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
  }

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {triggerButton || (
          <Button
            variant="outline"
            size="sm">
            <Settings2 className="h-4 w-4 mr-2" />
            Configure Filters
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="sm:max-w-[540px] w-full">
        <SheetHeader>
          <SheetTitle>Configure Filters</SheetTitle>
          <SheetDescription>
            Select which columns to show as filters and configure their
            settings.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="space-y-4 py-4">
            {configs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No filters configured yet
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddFilter}
                  className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Filter
                </Button>
              </div>
            ) : (
              configs.map((config, index) => {
                const schema = z.object({
                  enabled: z.boolean(),
                  columnKey: z.string().min(1, 'Column name is required'),
                  label: z.string().min(1, 'Label is required'),
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

                return (
                  <div key={config.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold">{config.label}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFilter(config.id)}
                          className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <DynamicForm
                        formConfig={createFilterFormConfig()}
                        schema={schema}
                        defaultValues={{
                          enabled: config.enabled,
                          columnKey: config.columnKey,
                          label: config.label,
                          variant: config.variant,
                          spName: config.spName || '',
                          placeholder: config.placeholder || '',
                        }}
                        onSubmit={(values) => {
                          const updatedConfigs = configs.map((c) =>
                            c.id === config.id ? { ...c, ...values } : c
                          )
                          setConfigs(updatedConfigs)
                        }}
                        customSubmitButton={<></>}
                      />
                    </Card>
                  </div>
                )
              })
            )}

            {configs.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddFilter}
                className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Filter
              </Button>
            )}
          </div>
        </ScrollArea>

        <SheetFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Configuration</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
