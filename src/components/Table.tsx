import { Skeleton } from '@/components/ui/skeleton'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  OnChangeFn,
  RowSelectionState,
  useReactTable,
} from '@tanstack/react-table'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { FileText, FileType } from 'lucide-react'
import * as XLSX from 'xlsx'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
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
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = React.useState({
    pageIndex,
    pageSize,
  })

  // Add checkbox column if row selection is enabled
  const columnsWithSelection = React.useMemo(() => {
    if (!onRowSelectionChange) return columns // Create a selection column with checkboxes
    const selectionColumn: ColumnDef<TData, TValue> = {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(checked) => {
            table.toggleAllPageRowsSelected(!!checked)
          }}
          aria-label="Select all rows"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(checked) => {
            row.toggleSelected(!!checked)
          }}
          aria-label="Select row"
        />
      ),
    }

    // Return new array with selection column first
    return [selectionColumn, ...columns]
  }, [columns, onRowSelectionChange])
  const handleExportExcel = () => {
    if (!exportData) return

    // Exclude selection column for exports
    const exportColumns = onRowSelectionChange
      ? columnsWithSelection.filter((col) => col.id !== 'select')
      : columnsWithSelection

    // Filter out just the data we want to export (exclude selection column)
    const exportable = exportData.map((row) => {
      const result: Record<string, unknown> = {}
      exportColumns.forEach((col) => {
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

    // Exclude selection column for exports
    const exportColumns = onRowSelectionChange
      ? columnsWithSelection.filter((col) => col.id !== 'select')
      : columnsWithSelection

    // Extend jsPDF instance with autoTable plugin
    autoTable(doc, {
      head: [
        exportColumns
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
        exportColumns
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
    },
    enableRowSelection: !!onRowSelectionChange,
    enableMultiRowSelection: !!onRowSelectionChange,
    enableSubRowSelection: !!onRowSelectionChange,
    onRowSelectionChange: onRowSelectionChange,
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
                    key={cell.id}
                    >
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
      {pageSize >= 10 && table.getRowModel().rows?.length > 0 && (
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
        />
      )}
    </div>
  )
}
