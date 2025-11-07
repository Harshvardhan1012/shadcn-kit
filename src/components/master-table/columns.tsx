import React from 'react'
import { get_columns } from './get-columns'

export const getColumns = (
  columnConfig: any,
  tableConfig: any,
  columnActions: any
) =>
  React.useMemo(
    () => get_columns(columnConfig, tableConfig, columnActions),
    [columnConfig, tableConfig, columnActions]
  )
