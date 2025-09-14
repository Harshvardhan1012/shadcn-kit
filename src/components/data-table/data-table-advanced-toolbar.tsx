'use client'

import type { Table } from '@tanstack/react-table'
import React, {
  forwardRef,
  startTransition,
  useImperativeHandle,
  useState,
} from 'react'
import { cn } from '@/lib/utils'
import { Download, ListPlusIcon } from 'lucide-react'
import { exportTableToCSV } from '@/lib/export'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@radix-ui/react-tooltip'
import { Button } from '@/components/ui/button'

interface DataTableAdvancedToolbarProps<TData>
  extends React.ComponentProps<'div'> {
  table: Table<TData>
  addItem: any
  filteredData?: TData[]
}

export const DataTableAdvancedToolbar = forwardRef<
  HTMLDivElement,
  DataTableAdvancedToolbarProps<any>
>(({ table, children, className, addItem, filteredData, ...props }, ref) => {
  console.log(addItem)
  const [is_open, setIsOpen] = useState(false)
  console.log(is_open)

  const onExport = React.useCallback(() => {
    startTransition(() => {
      // If filteredData is available, create a temporary table with all filtered data
      if (filteredData && filteredData.length > 0) {
        // Create a temporary table instance with all filtered data
        const tempTable = {
          ...table,
          getRowModel: () => ({
            rows: filteredData.map((data, index) => ({
              id: data.id || index.toString(),
              original: data,
              getValue: (columnId: string) => data[columnId],
              getAllCells: () =>
                table.getAllColumns().map((column) => ({
                  column,
                  getValue: () => data[column.id],
                  getContext: () => ({ row: { original: data }, column }),
                })),
            })),
          }),
          getVisibleLeafColumns: table.getVisibleLeafColumns.bind(table),
          getAllColumns: table.getAllColumns.bind(table),
        }

        exportTableToCSV(tempTable as Table<any>, {
          excludeColumns: ['select', 'actions'],
        })
      } else {
        // Fallback to original behavior if filteredData is not available
        exportTableToCSV(table, {
          excludeColumns: ['select', 'actions'],
        })
      }
    })
  }, [table, filteredData])

  useImperativeHandle(ref, () => ({
    ...((ref as React.RefObject<HTMLDivElement>)?.current ?? {}),
    onSheetClose,
  }))

  const onSheetClose = (value: boolean | ((prevState: boolean) => boolean)) => {
    setIsOpen(value)
  }

  const handle_add_item_click = () => {
    setIsOpen((state) => {
      addItem?.onClick(!state)
      return !state
    })
  }
  React.useEffect(() => {
    // If addItem exists but has a falsy onClick property, it means the sheet was closed externally
    if (addItem && typeof addItem.onClick === 'function' && !addItem.isOpen) {
      setIsOpen(!!addItem.isOpen)
    }
  }, [addItem])

  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn(
        'flex w-full items-start justify-between gap-2 p-1',
        className
      )}
      {...props}>
      <div className="flex items-center gap-2">{children}</div>
      <div
        className={`flex items-center transition-all duration-300 gap-2 ${
          addItem ? '' : 'hidden'
        }`}
        style={{
          opacity: addItem && !is_open ? 1 : 0,
          transform: addItem && !is_open ? 'scale(1)' : 'scale(0.95)',
          pointerEvents: addItem && !is_open ? 'auto' : 'none',
          height: addItem ? 'auto' : 0,
        }}>
        {addItem && (
          <Button
            type="button"
            data-slot="popover-trigger"
            onClick={handle_add_item_click}
            title={addItem?.title}>
            <ListPlusIcon />
            {addItem?.title}
          </Button>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              onClick={onExport}>
              <Download />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Export All (
              {filteredData?.length || table.getRowModel().rows.length} records)
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
})
