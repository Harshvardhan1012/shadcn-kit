'use client'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableActionBar } from '@/components/data-table/data-table-action-bar'
import { DataTableAdvancedToolbar } from '@/components/data-table/data-table-advanced-toolbar'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableFilterList } from '@/components/data-table/data-table-filter-list'
import { DataTableSortList } from '@/components/data-table/data-table-sort-list'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useDataTable } from '@/hooks/use-data-table'
import { Column, ColumnDef } from '@tanstack/react-table'
import { TouchpadOff } from 'lucide-react'
import { todos } from './data'

interface Todos {
  id: number
  todo: string
  completed: boolean
  userId: number
}

const Table = () => {
  const columns: ColumnDef<Todos>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: ({ column }: { column: Column<Todos, unknown> }) => (
        <DataTableColumnHeader
          column={column}
          title="ID"
        />
      ),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'todo',
      header: ({ column }: { column: Column<Todos, unknown> }) => (
        <DataTableColumnHeader
          column={column}
          title="Todo"
        />
      ),
      enableColumnFilter: true,
      filterFn: 'includesString',
      meta: {
        label: 'Todo',
        placeholder: 'Search todos...',
        variant: 'text',
        icon: TouchpadOff,
      },
    },
    {
      accessorKey: 'completed',
      header: ({ column }: { column: Column<Todos, unknown> }) => (
        <DataTableColumnHeader
          column={column}
          title="Completed"
        />
      ),
      size: 100,
      enableColumnFilter: true,
      filterFn: 'equals',
      cell: ({ getValue }) => (
        <Badge variant={getValue<boolean>() ? 'default' : 'secondary'}>
          {getValue<boolean>() ? 'Yes' : 'No'}
        </Badge>
      ),
      meta: {
        label: 'Status',
        variant: 'select',
        options: [
          { value: 'true', label: 'Completed' },
          { value: 'false', label: 'Pending' },
        ],
      },
    },
    {
      accessorKey: 'userId',
      header: ({ column }: { column: Column<Todos, unknown> }) => (
        <DataTableColumnHeader
          column={column}
          title="User ID"
        />
      ),
      size: 100,
      enableColumnFilter: true,
      filterFn: 'equals',
      meta: {
        label: 'User ID',
        placeholder: 'Enter user ID...',
        variant: 'number',
      },
    },
  ]

  const { table } = useDataTable({
    data: todos,
    columns,
    rowCount: todos.length,
    getRowId: (row) => row.id.toString(),
    enableMultiRowSelection: true,
    enableRowSelection: true,
    debounceMs: 0, // Set to 0 for immediate filtering (no debounce)
    pageCount: -1, // Use -1 for client-side filtering, sorting, and pagination
    enableAdvancedFilter: false, // Use simple column filters instead
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0, // Changed back to 0 (0-indexed)
      },
      sorting: [{ id: 'id', desc: true }],
      columnPinning: { right: ['completed'] },
    },
    enableColumnFilters: true,
    enableGlobalFilter: true,
  })

  return (
    <div className="p-4">
      <div className="space-y-4">
        {/* Simple Filter Inputs */}
        <div className="flex gap-2 flex-wrap">
          <Input
            placeholder="Filter todos..."
            value={(table.getColumn('todo')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('todo')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <select
            value={(table.getColumn('completed')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('completed')?.setFilterValue(
                event.target.value === 'all' ? '' : event.target.value === 'true'
              )
            }
            className="px-3 py-2 border rounded"
          >
            <option value="all">All Status</option>
            <option value="true">Completed</option>
            <option value="false">Pending</option>
          </select>
          <Input
            placeholder="Filter by User ID..."
            value={(table.getColumn('userId')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('userId')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            type="number"
          />
        </div>
        
        <DataTable
          table={table}
          actionBar={<DataTableActionBar table={table}>Actions</DataTableActionBar>}>
          <DataTableToolbar table={table} />
        </DataTable>
      </div>
    </div>
  )
}

export default Table
