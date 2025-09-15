import type { Table } from "@tanstack/react-table"

// Extended table interface with our custom selection functions
export interface ExtendedTable<TData> extends Table<TData> {
  getAllSelectedRowsCount?: () => number
  getAllSelectedRowIds?: () => Record<string, boolean>
}
