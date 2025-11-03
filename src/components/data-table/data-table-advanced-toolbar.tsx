'use client'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { exportTableToCSV } from '@/lib/export'
import { cn } from '@/lib/utils'
import type { Table } from '@tanstack/react-table'
import {
  FileSpreadsheet,
  ListPlusIcon,
  UploadCloudIcon
} from 'lucide-react'
import React, {
  forwardRef,
  startTransition,
  useImperativeHandle,
  useState,
} from 'react'

interface DataTableAdvancedToolbarProps<TData>
  extends React.ComponentProps<'div'> {
  table: Table<TData>
  addItem?: any
  bulkUploadItem?: any
  filteredData?: TData[]
}

export const DataTableAdvancedToolbar = forwardRef<
  HTMLDivElement,
  DataTableAdvancedToolbarProps<any>
>(
  (
    {
      table,
      children,
      className,
      addItem,
      bulkUploadItem,
      filteredData,
      ...props
    },
    ref
  ) => {
    const [is_open, setIsOpen] = useState(false)

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

    const onSheetClose = (
      value: boolean | ((prevState: boolean) => boolean)
    ) => {
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
        <div className="flex flex-row gap-2">
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
          </div>

          {/* Bulk Upload Button */}
          {bulkUploadItem && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={bulkUploadItem.onClick}
                  title={bulkUploadItem.title}>
                  <UploadCloudIcon />
                  {bulkUploadItem.title}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{bulkUploadItem.title}</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                onClick={onExport}>
                <FileSpreadsheet /> Excel
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Export All (
              {filteredData?.length || table.getRowModel().rows.length} records)
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    )
  }
)
