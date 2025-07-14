import { Skeleton } from '@/components/ui/skeleton'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type OnChangeFn,
  type RowSelectionState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { FileText, FileType, Settings2 } from 'lucide-react'
import * as XLSX from 'xlsx'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import React from 'react'
import { DataTablePagination } from './Pagination'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  pageIndex?: number
  pageSize?: number
  page: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  isLoading?: boolean
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  rowId?: (originalRow: TData) => string
  classNameCell?: string
  exportData?: TData[] // Full data for export
  fileName?: string // Base name for export files
  heading?: string // Optional heading for the table
  classNameTable?: string
  errorMessage?: string
  hasNextPage?: boolean // For infinite query support
  isFetchingNextPage?: boolean // For infinite query loading state
  onLoadMore?: () => void // Function to load more data for infinite queries
  havePagination?: boolean // Control pagination display
}

export function DataTable<TData, TValue>({
  columns,
  data,
  page,
  pageCount,
  pageIndex = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  rowSelection = {},
  onRowSelectionChange,
  rowId,
  classNameCell,
  exportData,
  fileName = 'table-export',
  heading,
  classNameTable = '',
  errorMessage = 'An error occurred while fetching data',
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  havePagination = true, // Default to true for backward compatibility
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = React.useState({
    pageIndex,
    pageSize,
  })

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  // Add checkbox column if row selection is enabled
  const columnsWithSelection = React.useMemo(() => {
    if (!onRowSelectionChange) return columns // Create a selection column with checkboxes
    const selectionColumn: ColumnDef<TData, TValue> = {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(checked: boolean) => {
            table.toggleAllPageRowsSelected(!!checked)
          }}
          aria-label="Select all rows"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(checked: boolean) => {
            row.toggleSelected(!!checked)
          }}
          aria-label="Select row"
        />
      ),
      enableHiding: false, // Don't allow hiding the selection column
    }

    // Return new array with selection column first
    return [selectionColumn, ...columns]
  }, [columns, onRowSelectionChange])

  const handleExportExcel = () => {
    if (!exportData) return

    // Get visible columns for export (exclude selection column)
    const visibleColumns = columnsWithSelection.filter(
      (col) => col.id !== 'select' && (col.id ? columnVisibility[col.id] !== false : true)
    )

    // Filter out just the data we want to export (only visible columns)
    const exportable = exportData.map((row) => {
      const result: Record<string, unknown> = {}
      visibleColumns.forEach((col) => {
        const accessorKey = (col as unknown as { accessorKey?: string })
          .accessorKey
        if (accessorKey) {
          result[accessorKey] = row[accessorKey as keyof typeof row]
        }
      })
      return result
    })

    const ws = XLSX.utils.json_to_sheet(exportable)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Data')
    XLSX.writeFile(wb, `${fileName}.xlsx`)
  }

  const handleExportPDF = () => {
    if (!exportData) return
    const doc = new jsPDF()

    // Get visible columns for export (exclude selection column)
    const visibleColumns = columnsWithSelection.filter(
      (col) => col.id !== 'select' && (col.id ? columnVisibility[col.id] !== false : true)
    )

    // Extend jsPDF instance with autoTable plugin
    autoTable(doc, {
      head: [
        visibleColumns
          .filter(
            (col): col is ColumnDef<TData, TValue> & { accessorKey: string } =>
              typeof (col as unknown as { accessorKey?: string })
                .accessorKey === 'string'
          )
          .map((col) =>
            typeof col.header === 'string'
              ? col.header
              : (col as unknown as { accessorKey: string }).accessorKey
          ),
      ],
      body: exportData.map((item) =>
        visibleColumns
          .filter(
            (col): col is ColumnDef<TData, TValue> & { accessorKey: string } =>
              typeof (col as unknown as { accessorKey?: string })
                .accessorKey === 'string'
          )
          .map((col) =>
            String(
              item[
                (col as unknown as { accessorKey: string })
                  .accessorKey as keyof typeof item
              ] ?? ''
            )
          )
      ),
    })

    doc.save(`${fileName}.pdf`)
  }

  const table = useReactTable({
    data,
    columns: columnsWithSelection,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    debugTable: true,
    manualPagination: true,
    pageCount,
    state: {
      pagination,
      rowSelection,
      columnVisibility,
    },
    enableRowSelection: !!onRowSelectionChange,
    enableMultiRowSelection: !!onRowSelectionChange,
    enableSubRowSelection: !!onRowSelectionChange,
    onRowSelectionChange: onRowSelectionChange,
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: rowId,
  })

  return (
    <div
      className={cn(
        'rounded-md border w-full flex gap-2 flex-col',
        classNameTable
      )}>
      <div className="flex gap-2 justify-end items-end w-full p-1">
        {heading && (
          <div className="flex-1 text-center font-medium text-xl">
            {heading}
          </div>
        )}
        {exportData && table.getRowModel().rows?.length > 0 && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleExportExcel}
                    variant="outline"
                    size="icon"
                    className="h-8 w-8">
                    <FileType className="h-4 w-4" />
                    <span className="sr-only">Export Excel</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export to Excel</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleExportPDF}
                    variant="outline"
                    size="icon"
                    className="h-8 w-8">
                    <FileText className="h-4 w-4" />
                    <span className="sr-only">Export PDF</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export to PDF</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
        {/* Column visibility dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8">
              <Settings2 className="h-4 w-4" />
              <span className="sr-only">Toggle columns</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== 'undefined' && column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table>
        {table.getRowModel().rows?.length > 0 && (
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
        )}
        <TableBody>
          {isLoading ? (
            Array.from({ length: pageSize }).map((_, idx) => (
              <TableRow
                className="h-5"
                key={`skeleton-row-${idx}`}>
                {columnsWithSelection.map((_, colIdx) => (
                  <TableCell key={`skeleton-cell-${colIdx}`}>
                    <Skeleton
                      className={cn('h-5 w-full rounded', classNameCell)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="text-center hover:bg-muted/50 cursor-pointer"
                data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    className={cn(classNameCell)}
                    key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columnsWithSelection.length}
                className="h-24 text-center">
                {errorMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {havePagination && pageCount > page && table.getRowModel().rows?.length > 0 && (
        <DataTablePagination
          page={page}
          pageSize={pageSize}
          pageCount={pageCount}
          onPageChange={(newPage) => {
            setPagination({
              ...pagination,
              pageIndex: newPage,
            })
            onPageChange(newPage)
          }}
          onPageSizeChange={(newSize) => {
            setPagination({
              ...pagination,
              pageSize: newSize,
            })
            onPageSizeChange(newSize)
          }}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={onLoadMore}
        />
      )}
    </div>
  )
}