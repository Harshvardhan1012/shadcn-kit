import { exportTableToCSV } from '@/components/lib/export'
import { cn } from '@/components/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@radix-ui/react-tooltip'
import type { Table } from '@tanstack/react-table'
import { Download, ListPlusIcon } from 'lucide-react'
import React, {
  forwardRef,
  startTransition,
  useImperativeHandle,
  useState,
} from 'react'

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

  const onSheetClose = (value: boolean) => {
    setIsOpen(value)
  }

  const handle_add_item_click = () => {
    setIsOpen((state) => {
      addItem?.onClick(!state)
      return !state
    })
  }

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
          <button
            type="button"
            data-slot="popover-trigger"
            className="inline-flex shrink-0 items-center justify-center whitespace-nowrap font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5"
            onClick={handle_add_item_click}
            title={addItem?.title}>
            <ListPlusIcon />
            {addItem?.title}
          </button>
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
