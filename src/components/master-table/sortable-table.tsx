'use client'

import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from '@/components/ui/sortable'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { GripVertical } from 'lucide-react'
import React, { useState } from 'react'

export interface SortableTableData {
  id: string
  [key: string]: any
}

interface SortableTableProps<T extends SortableTableData> {
  data: T[]
  columns: ColumnDef<T>[]
  onDataChange: (data: T[]) => void
  onSort?: (data: T[]) => void
}

export function SortableTable<T extends SortableTableData>({
  data,
  columns,
  onDataChange,
  onSort,
}: SortableTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [tableData, setTableData] = useState<T[]>(data)

  React.useEffect(() => {
    setTableData(data)
  }, [data])

  const handleDataReorder = (reorderedData: T[]) => {
    setTableData(reorderedData)
    onDataChange(reorderedData)
    onSort?.(reorderedData)
  }

  // Add drag handle column
  const enhancedColumns = React.useMemo<ColumnDef<T>[]>(() => {
    return [
      {
        id: 'drag-handle',
        header: '',
        cell: () => (
          <SortableItemHandle className="cursor-grab active:cursor-grabbing">
            <GripVertical className="h-4 w-4 text-gray-400" />
          </SortableItemHandle>
        ),
        size: 40,
      } as ColumnDef<T>,
      ...columns,
    ]
  }, [columns])

  const table = useReactTable({
    data: tableData,
    columns: enhancedColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return React.createElement(
    Sortable as any,
    {
      value: tableData,
      onValueChange: handleDataReorder,
      getItemValue: (item: T) => item.id,
      orientation: 'vertical',
    },
    <div className="rounded-md border">
      <SortableContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <SortableItem
                key={row.id}
                value={row.original.id}
                asChild>
                <TableRow className="cursor-move hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </SortableItem>
            ))}
          </TableBody>
        </Table>
      </SortableContent>
    </div>,
    <SortableOverlay>
      {({ value }) => {
        const item = tableData.find((row) => row.id === value)
        return item ? (
          <div className="rounded border bg-white p-2 shadow-lg">
            {String(item.id)} - {JSON.stringify(item).substring(0, 50)}
          </div>
        ) : null
      }}
    </SortableOverlay>
  )
}
