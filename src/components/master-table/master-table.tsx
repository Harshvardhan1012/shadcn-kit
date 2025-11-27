import type { RowData } from '@tanstack/react-table'
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

interface DatatableConfig<TData extends RowData = RowData> {
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

interface DynamicMasterProps<TData extends RowData = RowData> {
  datatableConfig: DatatableConfig<TData>
  data?: any[]
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
  bulkUploadConfig,
}: DynamicMasterProps<TData>) {
  console.log(datatableConfig.columnsConfig)
  const [bulkUploadSheetOpen, setBulkUploadSheetOpen] = React.useState(false)

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

  const columns = getColumns(columnsConfig, tableConfig, columnActions)

  console.log('Columns for table:', columns)

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
    title: addItemData?.title,
    onClick: () => {
      handleSheetOpenChange(true)
      onClickAddItem()
    },
  }

  const columnsKey = React.useMemo(() => {
    // Create a hash of the entire columns configuration
    // This includes options, values, icons, and any other metadata
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

  const bulkUploadItemData: ActionConfig | undefined = bulkUploadConfig
    ? {
        title: bulkUploadConfig.buttonTitle || 'Bulk Upload',
        onClick: handleBulkUploadClick,
      }
    : undefined

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
              onFiltersChange={(filters, joinOperator) => {
                console.log('Filters changed:', filters, joinOperator)
              }}
              onPaginationChange={(page, perPage) => {
                // Make API call with pagination
                console.log('Pagination changed:', page, perPage)
              }}>
            </Table>

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
