'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import type { ColumnConfig, ColumnConfigOptions } from './columns_config'
import { IconsManagerDialog } from './icons-manager-dialog'
import { OptionsDialog } from './options-dialog'

export interface ColumnConfigTableData extends ColumnConfig {
  id: string
}

interface SortableColumnConfigTableProps {
  columns: ColumnConfig[]
  onColumnsChange: (columns: ColumnConfig[]) => void
}

const variantOptions = [
  { value: 'text', label: 'Text' },
  { value: 'select', label: 'Select' },
  { value: 'number', label: 'Number' },
  { value: 'dateRange', label: 'Date Range' },
  { value: 'switch', label: 'Switch' },
  { value: 'multiSelect', label: 'Multi Select' },
  { value: 'range', label: 'Range' },
]

const textSizeOptions = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
]

const valueTypeOptions = [
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'array', label: 'Array' },
]

export function SortableColumnConfigTable({
  columns,
  onColumnsChange,
}: SortableColumnConfigTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [tableData, setTableData] = useState<ColumnConfigTableData[]>(
    columns.map((col, idx) => ({
      ...col,
      id: `col-${idx}`,
    }))
  )
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null)
  const [iconsOpen, setIconsOpen] = useState(false)
  const [selectedIconsRowId, setSelectedIconsRowId] = useState<string | null>(
    null
  )

  const handleUpdateColumn = (
    id: string,
    updates: Partial<ColumnConfigTableData>
  ) => {
    const newData = tableData.map((row) =>
      row.id === id ? { ...row, ...updates } : row
    )
    setTableData(newData)
    onColumnsChange(newData.map(({ id, ...col }) => col))
  }

  const handleColumnsReorder = (reorderedData: ColumnConfigTableData[]) => {
    setTableData(reorderedData)
    onColumnsChange(reorderedData.map(({ id, ...col }) => col))
  }

  const tableCols = React.useMemo<ColumnDef<ColumnConfigTableData, unknown>[]>(
    () => [
      {
        id: 'drag-handle',
        header: '',
        cell: () => (
          <SortableItemHandle className="cursor-grab active:cursor-grabbing">
            <GripVertical className="h-4 w-4 text-gray-400" />
          </SortableItemHandle>
        ),
        size: 40,
      } as ColumnDef<ColumnConfigTableData, unknown>,
      {
        accessorKey: 'field',
        header: 'Field',
        cell: ({ row }) => (
          <Input
            type="text"
            value={row.original.field}
            onChange={(e) =>
              handleUpdateColumn(row.original.id, {
                field: e.target.value,
              })
            }
            className="w-full rounded border px-2 py-1 text-sm"
          />
        ),
      } as ColumnDef<ColumnConfigTableData, unknown>,
      {
        accessorKey: 'header',
        header: 'Header',
        cell: ({ row }) => (
          <Input
            type="text"
            value={row.original.header}
            onChange={(e) =>
              handleUpdateColumn(row.original.id, {
                header: e.target.value,
              })
            }
            className="w-full rounded border px-2 py-1 text-sm"
          />
        ),
      } as ColumnDef<ColumnConfigTableData, unknown>,
      {
        id: 'sortable',
        header: 'Sortable',
        cell: ({ row }) => (
          <Checkbox
            checked={row.original.options?.sortable ?? false}
            onCheckedChange={(checked) =>
              handleUpdateColumn(row.original.id, {
                options: {
                  ...row.original.options,
                  sortable: checked as boolean,
                },
              })
            }
          />
        ),
        size: 60,
      } as ColumnDef<ColumnConfigTableData, unknown>,
      {
        id: 'isHide',
        header: 'Hide',
        cell: ({ row }) => (
          <Checkbox
            checked={row.original.options?.isHide ?? false}
            onCheckedChange={(checked) =>
              handleUpdateColumn(row.original.id, {
                options: {
                  ...row.original.options,
                  isHide: checked as boolean,
                },
              })
            }
          />
        ),
        size: 50,
      } as ColumnDef<ColumnConfigTableData, unknown>,
      {
        id: 'hideable',
        header: 'Hideable',
        cell: ({ row }) => (
          <Checkbox
            checked={row.original.options?.hideable ?? false}
            onCheckedChange={(checked) =>
              handleUpdateColumn(row.original.id, {
                options: {
                  ...row.original.options,
                  hideable: checked as boolean,
                },
              })
            }
          />
        ),
        size: 60,
      } as ColumnDef<ColumnConfigTableData, unknown>,
      {
        id: 'variant',
        header: 'Variant',
        cell: ({ row }) => (
          <Select
            value={row.original.options?.variant ?? 'text'}
            onValueChange={(value) =>
              handleUpdateColumn(row.original.id, {
                options: {
                  ...row.original.options,
                  variant: value as ColumnConfigOptions['variant'],
                },
              })
            }>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {variantOptions.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
      } as ColumnDef<ColumnConfigTableData, unknown>,
      {
        id: 'textSize',
        header: 'Text Size',
        cell: ({ row }) => (
          <Select
            value={row.original.options?.text_size ?? 'medium'}
            onValueChange={(value) =>
              handleUpdateColumn(row.original.id, {
                options: {
                  ...row.original.options,
                  text_size: value as ColumnConfigOptions['text_size'],
                },
              })
            }>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {textSizeOptions.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
      } as ColumnDef<ColumnConfigTableData, unknown>,
      {
        id: 'valueType',
        header: 'Value Type',
        cell: ({ row }) => (
          <Select
            value={row.original.options?.value_type ?? 'string'}
            onValueChange={(value) =>
              handleUpdateColumn(row.original.id, {
                options: {
                  ...row.original.options,
                  value_type: value as ColumnConfigOptions['value_type'],
                },
              })
            }>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {valueTypeOptions.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
      } as ColumnDef<ColumnConfigTableData, unknown>,
      {
        id: 'isLongtext',
        header: 'Long Text',
        cell: ({ row }) => (
          <Checkbox
            checked={row.original.options?.is_longtext ?? false}
            onCheckedChange={(checked) =>
              handleUpdateColumn(row.original.id, {
                options: {
                  ...row.original.options,
                  is_longtext: checked as boolean,
                },
              })
            }
          />
        ),
        size: 70,
      } as ColumnDef<ColumnConfigTableData, unknown>,
      {
        id: 'isSwitch',
        header: 'Is Switch',
        cell: ({ row }) => (
          <Checkbox
            checked={row.original.options?.is_switch ?? false}
            onCheckedChange={(checked) =>
              handleUpdateColumn(row.original.id, {
                options: {
                  ...row.original.options,
                  is_switch: checked as boolean,
                },
              })
            }
          />
        ),
        size: 70,
      } as ColumnDef<ColumnConfigTableData, unknown>,
      {
        id: 'switchValue',
        header: 'Switch Value',
        cell: ({ row }) => (
          <Input
            type="text"
            value={row.original.options?.switch_value ?? ''}
            onChange={(e) =>
              handleUpdateColumn(row.original.id, {
                options: {
                  ...row.original.options,
                  switch_value: e.target.value,
                },
              })
            }
            placeholder="Switch value"
            className="w-full rounded border px-2 py-1 text-sm"
          />
        ),
      } as ColumnDef<ColumnConfigTableData, unknown>,
      {
        id: 'selectValues',
        header: 'Options',
        cell: ({ row }) => {
          const variant = row.original.options?.variant
          if (variant !== 'select' && variant !== 'multiSelect') {
            return <span className="text-xs text-gray-400">N/A</span>
          }
          return (
            <Button
              onClick={() => {
                setSelectedRowId(row.original.id)
                setOptionsOpen(true)
              }}
              className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700 hover:bg-blue-200">
              Manage ({row.original.options?.values?.length ?? 0})
            </Button>
          )
        },
      } as ColumnDef<ColumnConfigTableData, unknown>,
      {
        id: 'icons',
        header: 'Icons',
        cell: ({ row }) => {
          return (
            <button
              onClick={() => {
                setSelectedIconsRowId(row.original.id)
                setIconsOpen(true)
              }}
              className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-700 hover:bg-purple-200">
              Manage ({Object.keys(row.original.options?.icons || {}).length})
            </button>
          )
        },
      } as ColumnDef<ColumnConfigTableData, unknown>,
    ],
    [
      tableData,
      setSelectedRowId,
      setOptionsOpen,
      setSelectedIconsRowId,
      setIconsOpen,
    ]
  )

  const table = useReactTable({
    data: tableData,
    columns: tableCols,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="w-full">
      <Sortable
        value={tableData}
        onValueChange={handleColumnsReorder}
        getItemValue={(item) => item.id}
        orientation="vertical">
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
        </div>
        <SortableOverlay>
          {({ value }) => {
            const item = tableData.find((col) => col.id === value)
            return item ? (
              <div className="rounded border bg-white p-2 shadow-lg">
                {item.header} ({item.field})
              </div>
            ) : null
          }}
        </SortableOverlay>
      </Sortable>

      {selectedRowId && (
        <OptionsDialog
          open={optionsOpen}
          onClose={() => {
            setOptionsOpen(false)
            setSelectedRowId(null)
          }}
          values={
            tableData.find((row) => row.id === selectedRowId)?.options
              ?.values || []
          }
          onSave={(values) => {
            handleUpdateColumn(selectedRowId, {
              options: {
                ...tableData.find((row) => row.id === selectedRowId)?.options,
                values,
              },
            })
          }}
        />
      )}

      {selectedIconsRowId && (
        <IconsManagerDialog
          open={iconsOpen}
          onClose={() => {
            setIconsOpen(false)
            setSelectedIconsRowId(null)
          }}
          icons={
            (tableData.find((row) => row.id === selectedIconsRowId)?.options
              ?.icons as Array<{
              label: string
              value: string
              icon: string
            }>) || []
          }
          onSave={(icons) => {
            handleUpdateColumn(selectedIconsRowId, {
              options: {
                ...tableData.find((row) => row.id === selectedIconsRowId)
                  ?.options,
                icons,
              },
            })
          }}
        />
      )}
    </div>
  )
}
