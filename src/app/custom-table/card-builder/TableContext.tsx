'use client'

import type { Table } from '@tanstack/react-table'
import { createContext, useContext, useState, type ReactNode } from 'react'

interface TableContextValue {
  table: Table<any> | null
  columns: any[]
  setTable: (table: Table<any> | null) => void
  setColumns: (columns: any[]) => void
}

const TableContext = createContext<TableContextValue | undefined>(undefined)

export function TableProvider({ children }: { children: ReactNode }) {
  const [table, setTable] = useState<Table<any> | null>(null)
  const [columns, setColumns] = useState<any[]>([])

  return (
    <TableContext.Provider value={{ table, columns, setTable, setColumns }}>
      {children}
    </TableContext.Provider>
  )
}

export function useTableContext() {
  const context = useContext(TableContext)
  if (context === undefined) {
    throw new Error('useTableContext must be used within a TableProvider')
  }
  return context
}
