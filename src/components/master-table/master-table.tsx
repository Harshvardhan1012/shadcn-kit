import * as React from 'react'
import { z } from 'zod'
import { DataTableSkeleton } from './../data-table/data-table-skeleton'
import SheetDemo from './../sheet/page'
import { BulkUploadSheet } from './bulk-upload-sheet'
import { getColumns } from './columns'
import { FeatureFlagsProvider } from './feature-flags-provider'
import { type ColumnConfig } from './get-columns'
import { Shell } from './shell'
import { Table } from './table'

interface TableRefType {
  handleSheet: (value: boolean) => void
}

interface ActionConfig {
  title: string
  onClick: () => void
}

// Form field types enum
export enum FormFieldType {
  TEXT = 'text',
  PASSWORD = 'password',
  EMAIL = 'email',
  NUMBER = 'number',
  FILE = 'file',
  CHECKBOX = 'checkbox',
  SWITCH = 'switch',
  DATE = 'date',
  DATETIME = 'datetime',
  RADIO = 'radio',
  SELECT = 'select',
  TEXTAREA = 'textarea',
  COMBOBOX = 'combobox',
  MULTISELECT = 'multiselect',
}

// Excel column configuration with dropdown support
export interface ExcelColumnConfig {
  key: string
  label: string
  width?: number
  type?: FormFieldType // Optional field type based on form field types
  dropdownOptions?: Array<{
    label: string // What user sees in Excel dropdown
    value: string // What gets stored in your data
  }>
}

export interface ExcelTemplate {
  columns: ExcelColumnConfig[]
}

export interface ValidationError {
  row: number
  column: string
  message: string
  value?: any
  expected?: string // For showing expected values (e.g., "HR, ENG, SAL" for enums)
}

export interface BulkUploadResult {
  success: boolean
  validRows: any[]
  errors: ValidationError[]
  totalRows: number
  validCount: number
  errorCount: number
}

interface DatatableConfig {
  columnsConfig: ColumnConfig[]
  columnActions: any[]
  tableConfig: any
  actionConfig: any
  addItemData?: any
}
// Bulk upload configuration
export interface BulkUploadConfig {
  template: ExcelTemplate
  schema: z.ZodSchema<any>
  onUpload: (data: any[]) => Promise<void>
  buttonTitle?: string // Optional custom button title
  emptyRowCount?: number // Number of empty rows to add (default: 10)
}

interface DynamicMasterProps<TData = unknown> {
  datatableConfig: DatatableConfig
  data?: TData[]
  serverSideFiltering?: boolean
  sheetOpen?: boolean
  onSheetOpenChange?: (open: boolean) => void
  isLoading?: boolean
  errorMessage?: string
  onClickAddItem?: () => void
  children?: React.ReactNode
  // Bulk upload props

  bulkUploadConfig?: BulkUploadConfig
  //   columns: ColumnDef<TData, unknown>[]
}

// Generic param is accepted (and defaulted) so callers can write
// `DynamicMaster<SomeRow>` for readability even though the props are untyped.
export default function DynamicMaster<TData = unknown>({
  datatableConfig,
  data,
  serverSideFiltering = false,
  sheetOpen = false,
  onSheetOpenChange,
  isLoading = false,
  errorMessage,
  onClickAddItem = () => {},
  children,
  bulkUploadConfig,
}: DynamicMasterProps<TData>) {
  const [bulkUploadSheetOpen, setBulkUploadSheetOpen] = React.useState(false)

  React.useEffect(() => {
    if (onSheetOpenChange) {
      onSheetOpenChange(sheetOpen)
    }
  }, [sheetOpen, onSheetOpenChange])

  const handleSheetOpenChange = (value: boolean) => {
    if (onSheetOpenChange) {
      onSheetOpenChange(value)
    }
  }

  const handleBulkUploadClick = () => {
    setBulkUploadSheetOpen(true)
  }

  const tableRef = React.useRef<TableRefType>(null)

  const {
    columnsConfig,
    columnActions,
    tableConfig,
    actionConfig,
    addItemData,
  } = datatableConfig

  // `getColumns` is itself a hook (it calls React.useMemo internally), so it
  // must be called directly at the top level — never wrapped in another
  // useMemo, or its inner hook runs only on some renders and the hook count
  // varies between renders ("Rendered fewer hooks than expected").
  const columns = getColumns(columnsConfig, tableConfig, columnActions)

  const columnsKey = React.useMemo(() => {
    // Create a hash of the entire columns configuration
    const configString = JSON.stringify(
      columns.map((col: any) => ({
        accessorKey: col.accessorKey,
        meta: col.meta,
        header: col.header,
        options: col.options,
      }))
    )

    // Simple hash function to create a shorter key
    let hash = 0
    for (let i = 0; i < configString.length; i++) {
      const char = configString.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }

    return `columns-${Math.abs(hash).toString(36)}`
  }, [columns])

  const itemData: ActionConfig = React.useMemo(
    () => ({
      title: addItemData?.title,
      onClick: () => {
        handleSheetOpenChange(true)
        onClickAddItem()
      },
    }),
    [addItemData?.title, onClickAddItem]
  )

  const bulkUploadItemData: ActionConfig | undefined = React.useMemo(
    () =>
      bulkUploadConfig
        ? {
            title: bulkUploadConfig.buttonTitle || 'Bulk Upload',
            onClick: handleBulkUploadClick,
          }
        : undefined,
    [bulkUploadConfig]
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

  return (
    <div className="relative flex flex-col w-full">
      <Shell
        variant="sidebar"
        className={`transition-all duration-300 w-full ${
          sheetOpen || bulkUploadSheetOpen ? 'md:w-[calc(100%-24rem)]' : ''
        }`}>
        <FeatureFlagsProvider>
          <Table
            key={columnsKey}
            data={data}
            columns={columns}
            actionConfig={actionConfig}
            addItem={addItemData ? itemData : undefined}
            bulkUploadItem={bulkUploadItemData}
            ref={tableRef}
            serverSideFiltering={serverSideFiltering}
            enableGlobalFilter={
              tableConfig?.enableGlobalFilter ?? tableConfig?.globalFilter
            }
            globalFilterPlaceholder={tableConfig?.globalFilterPlaceholder}
            onFiltersChange={(filters, joinOperator) => {
              console.log('Filters changed:', filters, joinOperator)
            }}
            onPaginationChange={(page, perPage) => {
              // Make API call with pagination
              console.log('Pagination changed:', page, perPage)
            }}></Table>

          {sheetOpen && (
            <SheetDemo
              open={sheetOpen}
              onOpenChange={() => {
                handleSheetOpenChange(false)
              }}>
              {children}
            </SheetDemo>
          )}
        </FeatureFlagsProvider>
      </Shell>

      {bulkUploadSheetOpen && bulkUploadConfig && (
        <BulkUploadSheet
          open={bulkUploadSheetOpen}
          onOpenChange={setBulkUploadSheetOpen}
          template={bulkUploadConfig.template as any}
          schema={bulkUploadConfig.schema as any}
          onUpload={bulkUploadConfig.onUpload as any}
          emptyRowCount={bulkUploadConfig.emptyRowCount}
        />
      )}
    </div>
  )
}
