import type { ColumnDef, RowData } from '@tanstack/react-table'
import * as React from 'react'
import DynamicForm from '../form/DynamicForm'
import type { FormContextType } from '../form/FormContext'
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
  data?: any[]
  serverSideFiltering?: boolean
  sheetOpen?: boolean
  onSheetOpenChange?: (open: boolean) => void
  isLoading?: boolean
  errorMessage?: string
  onClickAddItem?: () => void,
  children?: React.ReactNode
  //   columns: ColumnDef<TData, unknown>[]
}

export default function DynamicMaster<TData extends RowData = RowData>({
  datatableConfig,
  data,
  serverSideFiltering = false,
  sheetOpen = false,
  onSheetOpenChange,
  isLoading = false,
  errorMessage,
  onClickAddItem = () => {},
  children,
}: DynamicMasterProps<TData>) {
  React.useEffect(() => {
    if (onSheetOpenChange) {
      onSheetOpenChange(sheetOpen)
    }
  }, [sheetOpen])
  const handleSheetOpenChange = (value: boolean) => {
    if (onSheetOpenChange) {
      onSheetOpenChange(value)
    }
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

  if (errorMessage) {
    return (
      <div className="flex items-center justify-center h-64">
        {errorMessage}
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

  const itemData: ActionConfig = {
    title: addItemData.title,
    onClick: () => {
      handleSheetOpenChange(true)
      onClickAddItem()
    },
  }

  return (
    <div className="relative flex flex-col w-full">
      <Shell
        variant="sidebar"
        className={`transition-all duration-300 w-full ${
          sheetOpen ? 'md:w-[calc(100%-24rem)]' : ''
        }`}>
        <FeatureFlagsProvider>
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
        </FeatureFlagsProvider>
      </Shell>

      {sheetOpen && (
        <SheetDemo
          open={sheetOpen}
          onOpenChange={() => {
            handleSheetOpenChange(false)
          }}>
          {children}
        </SheetDemo>
      )}
    </div>
  )
}
