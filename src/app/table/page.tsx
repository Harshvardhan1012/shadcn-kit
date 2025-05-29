'use client'
import { DataTable } from '@/components/Table'
import { ColumnDef } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { AlertProvider, useAlert } from '../services/AlertService'
import { Checkbox } from '@/components/ui/checkbox'

interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}

const columns: ColumnDef<Todo>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(checked) => {
          table.toggleAllPageRowsSelected(!!checked)
        }}
        aria-label="Select all rows"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => {
          row.toggleSelected(!!checked)
        }}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'userId',
    header: 'User ID',
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'completed',
    header: 'Completed',
    cell: ({ row }) => (row.original.completed ? 'Yes' : 'No'),
  },
]

export default function HomePage() {
  const [data, setData] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [rowSelection, setRowSelection] = useState({})
  const { showAlert } = useAlert()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=${pageSize}`
        )
        const result = await response.json()
        const totalCount = Number(response.headers.get('x-total-count'))
        setData(result)
        setPageCount(Math.ceil(totalCount / pageSize))
      } catch (error) {
        console.error('Failed to fetch data:', error)
        // Handle error appropriately in a real application
      }
      setIsLoading(false)
      console.log(data, columns, page, pageCount, isLoading)
    }

    fetchData()
  }, [page, pageSize])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1) // Reset to first page when page size changes
  }

  useEffect(() => {
    const selectedIds = Object.keys(rowSelection)
    if (selectedIds.length > 0) {
      showAlert(
        'default',
        'Row Selection',
        `Selected row IDs: ${selectedIds.join(', ')}`
      )
    }
  }, [rowSelection])

  return (
    <AlertProvider>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Todos</h1>{' '}
        <DataTable
          columns={columns}
          data={data}
          page={page}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={isLoading}
          pageSize={pageSize}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          getRowId={(row) => row.id.toString()}
          classNameCell='p-2'
        />
      </div>
    </AlertProvider>
  )
}
