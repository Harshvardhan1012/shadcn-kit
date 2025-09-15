'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { exportTableToCSV } from '@/lib/export'
import { invokeCheckedClickHandler } from '@/lib/utils'
import { SelectTrigger } from '@radix-ui/react-select'
import type { Table } from '@tanstack/react-table'
import { Download, X } from 'lucide-react'
import * as React from 'react'
import {
  DataTableActionBar,
  DataTableActionBarAction,
} from '../data-table/data-table-action-bar'

const actions = [
  'update-status',
  'update-priority',
  'export',
  'delete',
] as const

type Action = (typeof actions)[number]

interface TableActionBarProps {
  table: Table<any>
  config: any
  // Add the complete filtered data to access all rows across pages
  filteredData?: any[]
}

export function TableActionBar({
  table,
  config,
  filteredData = [],
}: TableActionBarProps) {
  // Get rows from current page only
  const currentPageRows = table.getSelectedRowModel().rows

  // Get all selected row IDs from table state (across all pages)
  const rowSelection = table.getState().rowSelection
  const selectedRowIds = Object.keys(rowSelection).filter(
    (id) => rowSelection[id]
  )

  // Calculate total selected count across all pages
  const totalSelectedCount = selectedRowIds.length
  const getAllSelectedRowsData = React.useCallback(() => {
    console.log({ filteredData, selectedRowIds })
    if (filteredData.length === 0 || selectedRowIds.length === 0) {
      return {
        data: currentPageRows.map((row) => row.original),
        selectedIds: selectedRowIds
          .map((id) => Number(id))
          .filter((id) => !isNaN(id)),
      }
    }

    // Filter the complete dataset based on selected row IDs
    const allSelectedRows = filteredData.filter((item) =>
      selectedRowIds.includes(String(item.id))
    )

    return {
      data: allSelectedRows,
      selectedIds: selectedRowIds
        .map((id) => Number(id))
        .filter((id) => !isNaN(id)),
    }
  }, [filteredData, selectedRowIds, currentPageRows])

  const [isPending, startTransition] = React.useTransition()
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null)

  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction]
  )

  const onTaskExport = React.useCallback(() => {
    setCurrentAction('export')
    startTransition(() => {
      exportTableToCSV(table, {
        excludeColumns: ['select', 'actions'],
        onlySelected: true,
      })
    })
  }, [table])

  console.log(config)

  // Force visibility for debugging
  const isVisible = totalSelectedCount > 0

  return (
    <DataTableActionBar
      table={table}
      visible={isVisible}>
      <div className="flex h-7 items-center rounded-md border pr-1 pl-2.5">
        <span className="whitespace-nowrap text-xs">
          {totalSelectedCount} selected
        </span>
        <Separator
          orientation="vertical"
          className="mr-1 ml-2 data-[orientation=vertical]:h-4"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-5"
              onClick={() => table.toggleAllRowsSelected(false)}>
              <X className="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            sideOffset={10}
            className="flex items-center gap-2 border bg-accent px-2 py-1 font-semibold text-foreground dark:bg-zinc-900 [&>span]:hidden">
            <p>Clear selection</p>
            <kbd className="select-none rounded border bg-background px-1.5 py-px font-mono font-normal text-[0.7rem] text-foreground shadow-xs">
              <abbr
                title="Escape"
                className="no-underline">
                Esc
              </abbr>
            </kbd>
          </TooltipContent>
        </Tooltip>
      </div>
      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      />
      <div className="flex items-center gap-1.5">
        {config.map((item: any, index: number) => {
          if (item.is_direct_action) {
            return (
              <DataTableActionBarAction
                key={index}
                size="icon"
                tooltip={item.tooltip}
                // isPending={getIsActionPending("export")}
                onClick={
                  item.is_export
                    ? onTaskExport
                    : () => {
                        const selectedData = getAllSelectedRowsData()
                        // Create enhanced data object with selected IDs
                        const enhancedData = {
                          rows: selectedData.data,
                          selectedIds: selectedData.selectedIds,
                          count: selectedData.selectedIds.length,
                        }
                        invokeCheckedClickHandler(
                          item.action,
                          item.action,
                          enhancedData
                        )
                      }
                }>
                {item.icon ? <item.icon /> : <Download />}
              </DataTableActionBarAction>
            )
          } else {
            const Icon = item.icon
            return (
              <Select
                key={index}
                onValueChange={(value) => {
                  console.log(value)
                  const selectedData = getAllSelectedRowsData()
                  // Create enhanced data object with selected IDs
                  const enhancedData = {
                    rows: selectedData.data,
                    selectedIds: selectedData.selectedIds,
                    count: selectedData.selectedIds.length,
                  }
                  invokeCheckedClickHandler(item.action, value, enhancedData)
                }}>
                <SelectTrigger asChild>
                  <DataTableActionBarAction
                    size="icon"
                    tooltip={item.tooltip}
                    isPending={getIsActionPending('update-status')}>
                    {Icon && <Icon />}
                  </DataTableActionBarAction>
                </SelectTrigger>
                <SelectContent align="center">
                  <SelectGroup>
                    {item?.values?.map((status: any) => (
                      <SelectItem
                        key={status.key}
                        value={status.key}
                        className="capitalize">
                        {status?.value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )
          }
        })}
      </div>
    </DataTableActionBar>
  )
}
