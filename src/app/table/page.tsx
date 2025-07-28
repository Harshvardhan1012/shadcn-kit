'use client'
import { DataTable } from '@/components/table/Table'
import { ColumnDef } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { AlertProvider, useAlert } from '../services/AlertService'

interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}

const columns: ColumnDef<Todo>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (row.original.id + 1).toString(), // Adjusting ID to start from 1
    enableSorting: false, // Disable sorting for ID column
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
  const [fullData, setFullData] = useState<Todo[]>([])
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

        if (fullData.length === 0) {
          const fullResponse = await fetch(
            'https://jsonplaceholder.typicode.com/todos'
          )
          const fullResult = await fullResponse.json()
          setFullData(fullResult)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
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
      <div>
        <h1 className="text-2xl font-bold mb-4">Todos</h1>
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
          rowId={(row) => (row.id + 1).toString()}
          classNameCell="p-2"
          exportData={fullData}
          fileName="todos"
          heading="Todos List"
          errorMessage="Failed to load todos. Please try again later."
        />
      </div>
    </AlertProvider>
  )
}
