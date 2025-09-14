import type { ColumnDef, RowData } from '@tanstack/react-table'
import * as React from 'react'
import DynamicForm from '../Form/DynamicForm'
import { DataTableSkeleton } from './../data-table/data-table-skeleton'
import SheetDemo from './../sheet/page'
import { FeatureFlagsProvider } from './feature-flags-provider'
import { get_columns } from './get-columns'
import { Shell } from './shell'
import { Table } from './table'

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
  data: any[]
  formConfig: any
  onFormConfigChange?: (config: any) => void
  serverSideFiltering?: boolean
  formSchema?: any
  defaultFormValues?: any
  sheetOpen?: boolean
  onSheetOpenChange?: (open: boolean) => void
  //   columns: ColumnDef<TData, unknown>[]
}

export default function DynamicMaster<TData extends RowData = RowData>({
  datatableConfig,
  data,
  formConfig,
  onFormConfigChange,
  serverSideFiltering = false,
  formSchema,
  defaultFormValues,
  sheetOpen = false,
  onSheetOpenChange,
}: DynamicMasterProps<TData>) {
  // Allow controlling the open state from parent or use internal state
  const [internalOpen, setInternalOpen] = React.useState(sheetOpen)
  const open = onSheetOpenChange ? sheetOpen : internalOpen
  const setOpen = (value: boolean) => {
    setInternalOpen(value)
    if (onSheetOpenChange) onSheetOpenChange(value)
  }

  const tableRef = React.useRef<TableRefType>(null)

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

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Missing required configuration or data</p>
      </div>
    )
  }

  const handleAddItem = () => {
    setOpen(true)
  }
  // console.log()

  const itemData: ActionConfig = React.useMemo(
    () => ({
      title: addItemData.title,
      onClick: handleAddItem,
    }),
    [handleAddItem]
  )

  return (
    <div className="relative flex flex-col w-full">
      <Shell
        className={`transition-all duration-300 w-full ${
          open ? 'md:w-[calc(100%-24rem)]' : ''
        }`}>
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
              addItem={itemData}
              ref={tableRef}
              serverSideFiltering={serverSideFiltering}
              onFiltersChange={(filters, joinOperator) => {
                console.log('Filters changed:', filters, joinOperator)
              }}
              onPaginationChange={(page, perPage) => {
                // Make API call with pagination
                console.log('Pagination changed:', page, perPage)
              }}
            />
          </React.Suspense>
        </FeatureFlagsProvider>
      </Shell>

      {open && (
        <SheetDemo
          open={open}
          onOpenChange={() => {
            setOpen(false)
          }}>
          <DynamicForm
            formConfig={formConfig}
            schema={formSchema}
            onSubmit={(formData) => {
              console.log('✅ Sheet form submitted:', formData)
              setOpen(false)
              //   handleSheetOpenChange(false)
            }}
            defaultValues={defaultFormValues}
            showResetButton
            className="w-full"
            // onCancel={() => handleSheetOpenChange(false)}
          />
        </SheetDemo>
      )}
    </div>
  )
}
