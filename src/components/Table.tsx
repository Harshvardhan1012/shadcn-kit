import { Skeleton } from '@/components/ui/skeleton'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  isLoading?: boolean // <-- add isLoading prop
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
  isLoading = false, // <-- add isLoading prop
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = React.useState({
    pageIndex,
    pageSize,
  })
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    debugTable: true,
    manualPagination: true,
    pageCount,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  })

  return (
    <div className="rounded-md border w-full flex gap-2 flex-col">
      <Table>
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
        <TableBody>
          {isLoading ? (
            Array.from({ length: pageSize }).map((_, idx) => (
              <TableRow key={`skeleton-row-${idx}`}>
                {columns.map((_, colIdx) => (
                  <TableCell key={`skeleton-cell-${colIdx}`}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {pageSize >= 10 && (
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
