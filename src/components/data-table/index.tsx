'use client'

import * as React from 'react'
import { get_columns } from './config/get-columns'
import { FeatureFlagsProvider } from './config/feature-flags-provider'
import { DataTableSkeleton } from './data-table-skeleton'
// import { Shell } from "@/components/shell";
// import SheetDemo from "@/components/sheet/page";
// import DynamicForm from "@/components/forms/DynamicForm/dynamic-form";
import { Table } from './config/table'
import DynamicForm, { FormFieldConfig } from '../form/DynamicForm'
import SheetDemo from '../Sheet/page'
import { z } from 'zod'

interface TableRefType {
  handleSheet: (value: boolean) => void
}

interface ActionConfig {
  title: string
  onClick: () => void
}

interface DatatableConfig {
  columnConfig: any[]
  columnActions: any[]
  tableConfig: any
  actionConfig: any
}

interface DynamicMasterProps {
  datatableConfig: DatatableConfig
  data: any[]
  formConfig: FormFieldConfig[]
  onFormConfigChange?: (config: any) => void
}

export default function DynamicMaster({
  datatableConfig,
  data,
  formConfig,
  onFormConfigChange,
}: DynamicMasterProps) {
  const [open, setOpen] = React.useState(false)
  const tableRef = React.useRef<TableRefType>(null)

  // ✅ Sync drawer state from formConfig
  //   React.useEffect(() => {
  //     setOpen(Boolean(formConfig?.type))
  //   }, [formConfig?.type])

  //   const form_columns =
  //     (formConfig?.sectionColumns >= formConfig?.subFormColumn
  //       ? formConfig?.sectionColumns
  //       : formConfig?.subFormColumn) || 1

  if (!datatableConfig || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Missing required configuration or data</p>
      </div>
    )
  }

  const { columnConfig, columnActions, tableConfig, actionConfig } =
    datatableConfig

  // ✅ Only handle extra side effects, not setOpen (avoids Radix loop)
  const handleSheetOpenChange = React.useCallback(
    (isOpen: boolean) => {
      if (!isOpen && onFormConfigChange) {
        setTimeout(() => {
          onFormConfigChange({
            ...formConfig,
            type: undefined,
            defaultValue: undefined,
          })
          tableRef.current?.handleSheet(false)
        }, 0)
      }
    },
    [formConfig, onFormConfigChange]
  )

  const handleAddItem = React.useCallback(() => {
    if (onFormConfigChange) {
      setTimeout(() => {
        onFormConfigChange({
          ...formConfig,
          type: 'add',
          defaultValue: undefined,
        })
      }, 0)
    } else {
      setOpen(true)
    }
  }, [formConfig, onFormConfigChange])

  const columns = React.useMemo(
    () => get_columns(columnConfig, tableConfig, columnActions),
    [columnConfig, tableConfig, columnActions]
  )

  const addItemData: ActionConfig = React.useMemo(
    () => ({
      title: 'Add Item',
      onClick: handleAddItem,
    }),
    [handleAddItem]
  )

  const ZodSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2).max(100),
    email: z.string().email(),
    age: z.number().min(0).optional(),
  })

  return (
    <div className="relative flex flex-col w-full">
      {/* <Shell
                className={`transition-all duration-300 w-full ${open ? "md:w-[calc(100%-24rem)]" : ""
                    }`}
            > */}
      <FeatureFlagsProvider>
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={7}
              filterCount={2}
              cellWidths={[
                '10rem',
                '30rem',
                '10rem',
                '10rem',
                '6rem',
                '6rem',
                '6rem',
              ]}
              shrinkZero
            />
          }>
          <Table
            data={data}
            columns={columns}
            actionConfig={actionConfig}
            addItem={addItemData}
            ref={tableRef}
          />
        </React.Suspense>
      </FeatureFlagsProvider>
      {/* </Shell> */}

      {open && (
        <SheetDemo
          open={open}
          onOpenChange={handleSheetOpenChange}
          columns={1}>
          <DynamicForm
            formConfig={formConfig}
            loading={false}
            onSubmit={(formData) => {
              console.log('✅ Sheet form submitted:', formData)
              handleSheetOpenChange(false)
            }}
            schema={ZodSchema}
            // onCancel={() => {}}
          />
        </SheetDemo>
      )}
    </div>
  )
}
