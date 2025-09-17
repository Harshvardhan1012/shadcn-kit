'use client'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip'
import { useDataTable } from '@/hooks/use-data-table'
import { getValidFilters } from '@/lib/data-table'
import { applyFilter, getFilterFields } from '@/lib/filter'
import { getFiltersStateParser } from '@/lib/parsers'
import { TooltipContent } from '@radix-ui/react-tooltip'
import { Expand, Shrink } from 'lucide-react'
import { useQueryState } from 'nuqs'
import * as React from 'react'
import { useMemo } from 'react'
import { DataTable } from '../data-table/data-table'
import { DataTableAdvancedToolbar } from '../data-table/data-table-advanced-toolbar'
import { DataTableFilterList } from '../data-table/data-table-filter-list'
import { DataTableSortList } from '../data-table/data-table-sort-list'
import { DataTableViewOptions } from '../data-table/data-table-view-options'
import { useFeatureFlags } from './feature-flags-provider'
import { TableActionBar } from './table-action-bar'

type TableProps = {
  data: any[]
  columns: any[]
  pageCount?: number
  actionConfig?: any
  addItem?: any
  serverSideFiltering?: boolean // New flag for server-side filtering
  onFiltersChange?: (filters: any[], joinOperator: string) => void // Callback for server-side filtering
  onPaginationChange?: (page: number, perPage: number) => void // Callback for server-side pagination
}

export const Table = React.forwardRef(
  ({
    data,
    columns,
    pageCount = -1,
    actionConfig,
    addItem,
    serverSideFiltering = false, // Default to client-side filtering
    onFiltersChange,
    onPaginationChange,
  }: TableProps) => {
    const { enableAdvancedFilter } = useFeatureFlags()
    const [fullscreen, setFullscreen] = React.useState(false)

    const addvanceTableFilterRef = React.useRef<any>(null)
    const onExpandChange = () => {
      setFullscreen((value) => !value)
    }

    const filterColumns = getFilterFields(columns)
    const [filters] = useQueryState(
      'filters',
      getFiltersStateParser(filterColumns).withDefault([])
    )

    const [joinOperator] = useQueryState('joinOperator', {
      defaultValue: 'and',
    })

    // Notify parent component when filters change (for server-side filtering)
    React.useEffect(() => {
      if (serverSideFiltering && onFiltersChange) {
        const validFilters = getValidFilters(
          Array.isArray(filters) ? filters : []
        )
        onFiltersChange(validFilters, joinOperator)
      }
    }, [filters, joinOperator, serverSideFiltering, onFiltersChange])

    // Client-side filtering (only when not using server-side filtering)
    const filteredData = useMemo(() => {
      if (serverSideFiltering) {
        // For server-side filtering, return data as-is since filtering is handled on the server
        return data
      }

      const validFilters = getValidFilters(
        Array.isArray(filters) ? filters : []
      )
      if (validFilters.length === 0) return data

      return data.filter((row) => {
        if (joinOperator === 'or') {
          return validFilters.some((filter) => applyFilter(row, filter))
        } else {
          return validFilters.every((filter) => applyFilter(row, filter))
        }
      })
    }, [filters, data, joinOperator, serverSideFiltering])

    const [page, setPage] = useQueryState('page', {
      defaultValue: 1,
      parse: (value) => parseInt(value) || 1,
      serialize: (value) => value.toString(),
    })

    const [perPage, setPerPage] = useQueryState('perPage', {
      defaultValue: 10,
      parse: (value) => parseInt(value) || 10,
      serialize: (value) => value.toString(),
    })

    const pageIndex = page - 1
    const pageSize = perPage

    // Calculate page count based on filtering mode
    const pageCountCalc = serverSideFiltering
      ? pageCount // Use provided pageCount for server-side
      : Math.ceil(filteredData.length / pageSize) // Calculate for client-side

    // Client-side pagination (only when not using server-side filtering)
    const paginatedData = useMemo(() => {
      if (serverSideFiltering) {
        // For server-side pagination, return data as-is since pagination is handled on the server
        return filteredData
      }

      const start = pageIndex * pageSize
      const end = start + pageSize
      return filteredData.slice(start, end)
    }, [filteredData, pageIndex, pageSize, serverSideFiltering])

    // Notify parent component when pagination changes (for server-side pagination)
    React.useEffect(() => {
      if (serverSideFiltering && onPaginationChange) {
        onPaginationChange(page, perPage)
      }
    }, [page, perPage, serverSideFiltering, onPaginationChange])

    const { table } = useDataTable({
      data: paginatedData,
      columns,
      pageCount: pageCountCalc,
      enableAdvancedFilter,
      initialState: {
        sorting: [],
        columnPinning: { right: ['actions'] },
      },
      getRowId: (row) => row.id,
      shallow: true,
      clearOnDefault: true,
      onPaginationChange: (updater) => {
        console.log(updater)
        if (typeof updater === 'function') {
          const newPagination = updater({ pageIndex, pageSize })
          setPage(newPagination.pageIndex + 1)
          setPerPage(newPagination.pageSize)
        } else {
          setPage(updater.pageIndex + 1)
          setPerPage(updater.pageSize)
        }
      },
    })

    return (
      <>
        {fullscreen ? (
          <div className="fixed inset-0 z-50 bg-background p-4 flex flex-col h-screen">
            <div className="flex-shrink-0">
              <DataTableAdvancedToolbar
                table={table}
                addItem={addItem}
                filteredData={filteredData}
                ref={addvanceTableFilterRef}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      onClick={onExpandChange}>
                      <Shrink />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Collapse</p>
                  </TooltipContent>
                </Tooltip>
                <DataTableFilterList table={table} />
                <DataTableSortList
                  table={table}
                  align="start"
                />
                <DataTableViewOptions table={table} />
              </DataTableAdvancedToolbar>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
              <DataTable
                table={table}
                filteredData={filteredData}
                actionBar={
                  <TableActionBar
                    table={table}
                    config={actionConfig}
                    filteredData={filteredData}
                  />
                }
              />
            </div>
          </div>
        ) : (
          <DataTable
            table={table}
            filteredData={filteredData}
            actionBar={
              <TableActionBar
                table={table}
                config={actionConfig}
                filteredData={filteredData}
              />
            }>
            <DataTableAdvancedToolbar
              table={table}
              addItem={addItem}
              filteredData={filteredData}
              ref={addvanceTableFilterRef}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    onClick={onExpandChange}>
                    <Expand />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Expand</p>
                </TooltipContent>
              </Tooltip>
              <DataTableFilterList table={table} />
              <DataTableSortList
                table={table}
                align="start"
              />
              <DataTableViewOptions table={table} />
            </DataTableAdvancedToolbar>
          </DataTable>
        )}
      </>
    )
  }
)
