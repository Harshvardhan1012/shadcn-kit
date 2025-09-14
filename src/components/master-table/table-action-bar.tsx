'use client'

import { SelectTrigger } from '@radix-ui/react-select'
import type { Table } from '@tanstack/react-table'
import { Download } from 'lucide-react'
import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { exportTableToCSV } from '@/lib/export'
import { invokeCheckedClickHandler } from '@/lib/utils'
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
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
}

export function TableActionBar({ table, config }: TableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows
  const [isPending, startTransition] = React.useTransition()
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null)

  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction]
  )

  const onTaskUpdate = React.useCallback(
    ({ field, value, api }) => {
      console.log(rows)
    },
    [rows]
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

  const onTaskDelete = React.useCallback(() => {
    setCurrentAction('delete')
  }, [rows, table])

  console.log(config)
  return (
    <DataTableActionBar
      table={table}
      visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      />
      <div className="flex items-center gap-1.5">
        {config.map((item, index) => {
          if (item.is_direct_action) {
            return (
              <DataTableActionBarAction
                size="icon"
                tooltip={item.tooltip}
                // isPending={getIsActionPending("export")}
                onClick={
                  item.is_export
                    ? onTaskExport
                    : () =>
                        invokeCheckedClickHandler(
                          item.action,
                          'delete',
                          rows.map((item) => item.original)
                        )
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
                  invokeCheckedClickHandler(
                    item.action,
                    value,
                    rows.map((item) => item.original)
                  )
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
                    {item?.values?.map((status) => (
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
