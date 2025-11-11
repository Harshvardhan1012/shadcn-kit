'use client'

import type {
  ColumnConfig,
  ColumnConfigOptions,
} from '@/components/master-table/get-columns'
import { SortableTable } from '@/components/master-table/sortable-table'
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
import { type ColumnDef } from '@tanstack/react-table'
import React, { useState } from 'react'
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
  { value: 'number', label: 'Number' },
  { value: 'dateRange', label: 'Date Range' },
  { value: 'switch', label: 'Switch' },
  { value: 'multiSelect', label: 'Multi Select' },
  { value: 'range', label: 'Range' },
]

const valueTypeOptions = [
  { value: 'date', label: 'Date' },
  { value: 'array', label: 'Array' },
]

export function SortableColumnConfigTable({
  columns,
  onColumnsChange,
}: SortableColumnConfigTableProps) {
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

  const handleUpdateColumn = React.useCallback(
    (id: string, updates: Partial<ColumnConfigTableData>) => {
      setTableData((prev) => {
        const newData = prev.map((row) =>
          row.id === id ? { ...row, ...updates } : row
        )
        onColumnsChange(newData.map(({ id: _id, ...col }) => col))
        return newData
      })
    },
    [onColumnsChange]
  )

  const handleColumnsReorder = (reorderedData: ColumnConfigTableData[]) => {
    setTableData(reorderedData)
    onColumnsChange(reorderedData.map(({ id, ...col }) => col))
  }

  const tableCols = React.useMemo<ColumnDef<ColumnConfigTableData, unknown>[]>(
    () => [
      {
        accessorKey: 'field',
        header: 'Field',
        cell: ({ row }) => (
          <Input
            type="text"
            value={row.original.field}
            className="w-full rounded border px-2 py-1 text-sm"
          />
        ),
      },
      {
        accessorKey: 'header',
        header: 'Header',
        cell: ({ row }) => {
          const [editingValue, setEditingValue] = React.useState(
            row.original.header
          )

          // Update local state when row data changes externally
          React.useEffect(() => {
            setEditingValue(row.original.header)
          }, [row.original.header])

          const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              // Apply change and blur
              handleUpdateColumn(row.original.id, { header: editingValue })
              ;(e.target as HTMLInputElement).blur()
            }
            if (e.key === 'Escape') {
              // Revert and blur
              setEditingValue(row.original.header)
              ;(e.target as HTMLInputElement).blur()
            }
          }

          return (
            <Input
              type="text"
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              // onFocus={(e) => e.target.select()} // Optional: auto-select text on focus
              onKeyDown={handleKeyDown}
              className="w-full rounded border px-2 py-1 text-sm"
            />
          )
        },
      },

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
      },
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
      },
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
      },
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
      },
      {
        id: 'selectValues',
        header: 'Options',
        cell: ({ row }) => {
          const variant = row.original.options?.variant
          if (variant !== 'multiSelect') {
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
      },
      {
        id: 'icons',
        header: 'Icons',
        cell: ({ row }) => {
          const variant = row.original.options?.variant
          if (variant !== 'multiSelect') {
            return <span className="text-xs text-gray-400">N/A</span>
          }
          return (
            <button
              onClick={() => {
                setSelectedIconsRowId(row.original.id)
                setIconsOpen(true)
              }}
              className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-700 hover:bg-purple-200">
              Manage (
              {Array.isArray(row.original.options?.icons)
                ? row.original.options.icons.length
                : 0}
              )
            </button>
          )
        },
      },
    ],
    [handleUpdateColumn]
  )

  return (
    <div className="w-full">
      <SortableTable
        data={tableData}
        columns={tableCols}
        onDataChange={handleColumnsReorder}
      />

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
          isBoolean={
            tableData
              .find((row) => row.id === selectedRowId)
              ?.options?.values?.some(
                (v: any) => typeof v.value === 'boolean'
              ) ?? false
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
              value: boolean
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
