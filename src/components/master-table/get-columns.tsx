'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatDate } from '@/lib/format'
import { resolveLucideIcon } from '@/lib/icon-resolver'
import { invokeActionClickHandler } from '@/lib/utils'
import { MoreHorizontal } from 'lucide-react'
import { DataTableColumnHeader } from '../data-table/data-table-column-header'
import { Switch } from '../ui/switch'
import type { ColumnDef } from '@tanstack/react-table'

export const createHeader =
  (title: string) =>
  ({ column }: any) =>
    (
      <DataTableColumnHeader
        column={column}
        title={title}
      />
    )

// Type definitions for column configuration
export interface ColumnOption {
  label: string
  value: string | number | boolean
}

export interface ColumnConfigOptions {
  index?: number
  sortable?: boolean
  hideable?: boolean
  isHide?: boolean // Column is hidden from view but still available for filtering
  variant?:
    | 'text'
    | 'number'
    | 'dateRange'
    | 'switch'
    | 'multiSelect'
    | 'range'
    | 'dateRange'
  is_longtext?: boolean
  is_switch?: boolean
  switch_value?: any
  text_size?: 'small' | 'medium' | 'large' // Font size for text: 'small', 'medium', 'large' - applies font-${size} class
  value_type?: 'array' | 'date'
  lable_fields?: string[]
  icons?: Array<{ value: string | number | boolean; icon: string }> // Array of value-to-icon mappings. Example: [{ value: true, icon: 'check' }, { value: false, icon: 'x' }]
  on_click_id?: string
  on_change_id?: string
  values?: ColumnOption[]
  icon?: React.FC<React.SVGProps<SVGSVGElement>>
}

export interface ColumnConfig {
  field: string
  header: string
  options?: ColumnConfigOptions
}

export interface TableConfig {
  selectAll?: boolean
  actionColumn?: boolean
}

export interface ColumnAction {
  title: string
  type: string
}

// Helper function to invoke table action handlers
const invokeTableActionHandler = (actionId: string, value: any, row: any) => {
  // This function should be implemented based on your action handling logic
  // For now, it will log the action
  console.log('Table action:', actionId, 'Value:', value, 'Row:', row)
  // You can emit custom events or call callbacks here
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('table-action', {
        detail: { actionId, value, row: row.original },
      })
    )
  }
}

const text_render = (column: any, details: any) => {
  return details?.options?.value_type == 'array'
    ? column?.row?.getValue(details?.field).join(', ')
    : details?.options?.value_type == 'date'
    ? formatDate(column?.row?.getValue(details?.field))
    : column?.row?.getValue(details?.field)
}

const get_array_badges = (column: any, details: any) => {
  const arrayValue = column?.row?.getValue(details?.field)

  if (!Array.isArray(arrayValue)) {
    return null
  }

  // Tailwind color combos to apply to each badge (bg / text / border)
  const colorClasses = [
    'bg-blue-100 text-blue-800 border-blue-200',
    'bg-green-100 text-green-800 border-green-200',
    'bg-yellow-100 text-yellow-800 border-yellow-200',
    'bg-pink-100 text-pink-800 border-pink-200',
    'bg-purple-100 text-purple-800 border-purple-200',
    'bg-red-100 text-red-800 border-red-200',
    'bg-indigo-100 text-indigo-800 border-indigo-200',
    'bg-teal-100 text-teal-800 border-teal-200',
  ]

  return (
    <div className="flex flex-wrap w-50 gap-1">
      {arrayValue.map((item: any, index: number) => {
        // pick a random color for each badge
        const colorCls =
          colorClasses[Math.floor(Math.random() * colorClasses.length)]

        return (
          <Badge
            key={index}
            variant="outline"
            className={`${colorCls} border px-2 py-0.5`}
          >
            {item}
          </Badge>
        )
      })}
    </div>
  )
}

const get_simple_text = (column: any, details: any) => {
  const textContent = text_render(column, details)
  const isLongText = details?.options?.is_longtext
  const isArray = details?.options?.value_type === 'array'

  // If it's an array type, render as badges
  if (isArray) {
    return get_array_badges(column, details)
  }

  if (isLongText) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="truncate cursor-default">{textContent}</div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{textContent}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return <div className="w-full">{textContent}</div>
}

const get_text_size_config = (column: any, details: any) => {
  const textContent = text_render(column, details)
  const isLongText = details?.options?.is_longtext
  const isArray = details?.options?.value_type === 'array'

  // If it's an array type, render as badges
  if (isArray) {
    return get_array_badges(column, details)
  }

  // For long text, show truncated text with tooltip on hover
  if (isLongText) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`truncate font-${details?.options?.text_size} cursor-default`}>
            {textContent}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{textContent}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  // Apply custom text size: font-small, font-medium, or font-large
  return (
    <span
      className={`max-w-[31.25rem] truncate font-${details?.options?.text_size}`}>
      {textContent}
    </span>
  )
}

const get_label_field_config = (column: any, details: any) => {
  return details?.options?.lable_fields?.map((lable: any) => {
    return (
      <Badge
        variant="outline"
        key={lable}>
        {column?.row?.getValue(lable)}
      </Badge>
    )
  })
}

const get_render = (column: any, details: any) => {
  const { options } = details
  const {
    is_longtext,
    icons,
    text_size,
    lable_fields,
    is_switch,
    switch_value,
    on_click_id,
    on_change_id,
  } = options

  const row = column.row
  const fieldValue = row.getValue(details.field)
  const isSwitchChecked = fieldValue == switch_value

  let simple_render = get_simple_text(column, details)
  let lable_render
  let icon_render
  let switch_render

  if (lable_fields && lable_fields.length > 0) {
    lable_render = get_label_field_config(column, details)
  }

  if (is_switch) {
    switch_render = (
      <div className="flex items-center gap-2">
        <Switch
          id={details.field}
          checked={isSwitchChecked}
          onCheckedChange={(value) => {
            if (on_change_id) {
              invokeTableActionHandler(on_change_id, value, row)
            }
          }}
        />
      </div>
    )
  }

  // Render icon based on field value
  // icons = [{ value: true, icon: 'arrow-up' }, { value: false, icon: 'activity' }]
  // Finds icon matching fieldValue and resolves the icon name to Lucide component
  if (icons && Array.isArray(icons)) {
    const iconMapping = icons.find((e: any) => e.value === fieldValue)
    if (iconMapping?.icon) {
      const Icon = resolveLucideIcon(iconMapping.icon)
      if (Icon) {
        icon_render = <Icon className="py-1 [&>svg]:size-3.5" />
      }
    }
  }

  const logtext_class = is_longtext
    ? 'max-w-[10.25rem] truncate font-medium'
    : ''

  return (
    <div
      className={`flex w-full items-center gap-2 ${logtext_class}`}
      key={column.id}>
      {lable_render}
      {icon_render}
      {switch_render}
      {on_click_id ? (
        <span
          onClick={() => invokeTableActionHandler(on_click_id, fieldValue, row)}
          className="cursor-pointer">
          {text_size != null
            ? get_text_size_config(column, details)
            : simple_render}
        </span>
      ) : text_size != null ? (
        get_text_size_config(column, details)
      ) : (
        simple_render
      )}
    </div>
  )
}

export function get_columns(
  columnConfigs: ColumnConfig[],
  tableConfig: TableConfig,
  columnActions: ColumnAction[]
) {
  const { selectAll, actionColumn } = tableConfig

  // Sort columns by index
  columnConfigs = columnConfigs.sort(
    (a: ColumnConfig, b: ColumnConfig) =>
      (a?.options?.index ?? 0) - (b?.options?.index ?? 0)
  )

  // Map all columns including hidden ones (for filtering)
  let columns = columnConfigs.map((col: any) => {
    const baseColumn: ColumnDef<any> = {
      ...col,
      header: col?.options?.isHide ? '' : createHeader(col.header || col.field),
      accessorKey: col.field,
      cell: (cellProps: any) =>
        col?.options?.isHide ? null : get_render(cellProps, col),
      enableSorting: col?.options?.sortable !== false,
      enableHiding: col?.options?.hideable !== false,
      enableColumnFilter: true,
      meta: {
        label: col.header,
        variant: col?.options?.variant,
        options: col?.options?.values,
        icon: col?.options?.icon,
        isHidden: col?.options?.isHide || false,
      },
    }

    // If column should be hidden, set size to 0
    if (col?.options?.isHide) {
      return {
        ...baseColumn,
        size: 0,
        minSize: 0,
        maxSize: 0,
      }
    }

    return baseColumn
  })

  if (selectAll) {
    columns = [
      {
        id: 'select',
        header: ({ table }: any) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-0.5"
          />
        ),
        cell: ({ row }: any) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-0.5"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      },
      ...columns,
    ]
  }

  if (actionColumn) {
    columns = [
      ...columns,
      {
        id: 'actions',
        cell: function Cell(details: any) {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {columnActions.map((item: any) => {
                  return (
                    <DropdownMenuItem
                      key={item?.title}
                      onClick={() =>
                        invokeActionClickHandler(item?.type, details?.row)
                      }
                      variant={
                        item?.title?.toLowerCase() == 'delete'
                          ? 'destructive'
                          : 'default'
                      }>
                      {item?.title}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
        size: 32,
      },
    ]
  }
  return columns
}
