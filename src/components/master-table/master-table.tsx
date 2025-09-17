import type { ColumnDef, RowData } from '@tanstack/react-table'
import * as React from 'react'
import DynamicForm from '../form/DynamicForm'
import { DataTableSkeleton } from './../data-table/data-table-skeleton'
import SheetDemo from './../sheet/page'
import { FeatureFlagsProvider } from './feature-flags-provider'
import { get_columns } from './get-columns'
import { Shell } from './shell'
import { Table } from './table'
import type { FormContextType } from '../form/FormContext'

interface TableRefType {
  handleSheet: (value: boolean) => void
}

interface ActionConfig {
  title: string
  onClick: () => void
}

interface DatatableConfig<TData extends RowData = RowData> {
  columnsConfig: ColumnDef<TData, unknown>[]
  columnActions: any[]
  tableConfig: any
  actionConfig: any
  addItemData: any
}

interface DynamicMasterProps<TData extends RowData = RowData> {
  datatableConfig: DatatableConfig<TData>
  data?: any[]
  formConfig: any
  serverSideFiltering?: boolean
  formSchema?: any
  defaultFormValues?: any
  sheetOpen?: boolean
  onSheetOpenChange?: (open: boolean) => void
  isLoading?: boolean
  //   columns: ColumnDef<TData, unknown>[]
}

export default function DynamicMaster<TData extends RowData = RowData>({
  datatableConfig,
  data,
  formConfig,
  serverSideFiltering = false,
  formSchema,
  defaultFormValues,
  sheetOpen,
  onSheetOpenChange,
  isLoading = false,
}: DynamicMasterProps<TData>) {
  // Allow controlling the open state from parent or use internal state
  const [open, setOpenSheet] = React.useState(sheetOpen)
  const setOpen = (value: boolean) => {
    setOpenSheet(value)
    if (onSheetOpenChange) onSheetOpenChange(value)
  }

  const formRef = React.useRef<FormContextType>(null)
  const {
    columnsConfig,
    columnActions,
    tableConfig,
    actionConfig,
    addItemData,
  } = datatableConfig

  const columns = React.useMemo(
    () => get_columns(columnsConfig, tableConfig, columnActions),
    [columnsConfig, tableConfig, columnActions]
  )

  // ✅ Sync drawer state from formConfig
  React.useEffect(() => {
    // Only auto-open if we're not being controlled from parent
    if (!onSheetOpenChange) {
      setOpen(Boolean(formConfig?.type))
    }
  }, [formConfig?.type, onSheetOpenChange])

  // Show skeleton when loading
  if (isLoading) {
    return (
      <div className="relative flex flex-col w-full">
        <Shell className="w-full">
          <FeatureFlagsProvider>
            <DataTableSkeleton
              columnCount={10}
              filterCount={2}
              cellWidths={[
                '8rem',
                '12rem',
                '10rem',
                '8rem',
                '10rem',
                '8rem',
                '6rem',
                '6rem',
                '6rem',
                '6rem',
              ]}
              shrinkZero
            />
          </FeatureFlagsProvider>
        </Shell>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Missing required configuration or data</p>
      </div>
    )
  }
  const tableRef = React.useRef<TableRefType>(null)
  const itemData: ActionConfig = {
    title: addItemData.title,
    onClick: () => {
      setOpen(true)
      tableRef.current?.handleSheet(false)
    },
  }

  return (
    <div className="relative flex flex-col w-full">
      <Shell
        variant="sidebar"
        className={`transition-all duration-300 w-full ${
          open ? 'md:w-[calc(100%-24rem)]' : ''
        }`}>
        <FeatureFlagsProvider>
          <Table
            data={data}
            columns={columns}
            actionConfig={actionConfig}
            ref={tableRef}
            addItem={itemData}
            serverSideFiltering={serverSideFiltering}
            onFiltersChange={(filters, joinOperator) => {
              console.log('Filters changed:', filters, joinOperator)
            }}
            onPaginationChange={(page, perPage) => {
              // Make API call with pagination
              console.log('Pagination changed:', page, perPage)
            }}
          />
        </FeatureFlagsProvider>
      </Shell>

      {open && (
        <SheetDemo
          open={open}
          onOpenChange={() => {
            setOpen(false)
          }}>
          <DynamicForm
            ref={formRef}
            formConfig={formConfig}
            schema={formSchema}
            onSubmit={(formData) => {
              debugger
              console.log('✅ Sheet form submitted:', formData)
              debugger
              //   handleSheetOpenChange(false)
            }}
            defaultValues={defaultFormValues}
            showResetButton
            // className={formClassName}
          />
        </SheetDemo>
      )}
    </div>
  )
}
