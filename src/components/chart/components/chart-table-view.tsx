import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table'
import { useSortedData } from '../hooks/use-sorted-data'
import type { ChartDataPoint, ChartTableViewConfig } from '../types'

interface ChartTableViewProps {
  data: ChartDataPoint[]
  height: number | string
  config: ChartTableViewConfig
  emptyMessage?: React.ReactNode
}

/** The "table" chart type: a lightweight, optionally-sortable HTML table. */
export function ChartTableView({
  data,
  height,
  config,
  emptyMessage = 'No data available',
}: ChartTableViewProps) {
  const {
    showRowNumbers = false,
    columnHeaders = {},
    hiddenColumns = [],
    cellRenderer,
    sortable = false,
  } = config

  const { sortedData, sortConfig, handleSort } = useSortedData(data, sortable)

  if (!data.length) {
    return <div className="py-8 text-center">{emptyMessage}</div>
  }

  const columns = Object.keys(data[0]).filter(
    (key) => !hiddenColumns.includes(key) && key !== 'url',
  )

  return (
    <div
      className="w-full overflow-auto border rounded-none"
      style={{ height: typeof height === 'number' ? height : '100%' }}>
      <Table>
        <TableHeader>
          <TableRow>
            {showRowNumbers && <TableHead className="text-center">#</TableHead>}
            {columns.map((key) => (
              <TableHead
                key={key}
                className={sortable ? 'cursor-pointer hover:bg-muted' : ''}
                onClick={() => handleSort(key)}>
                <div>
                  {columnHeaders[key] || key}
                  {sortable && sortConfig?.key === key && (
                    <span className="ml-2">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((row, index) => (
            <TableRow key={index}>
              {showRowNumbers && (
                <TableCell className="text-center text-muted-foreground">
                  {index + 1}
                </TableCell>
              )}
              {columns.map((key) => (
                <TableCell key={key}>
                  {cellRenderer
                    ? cellRenderer(row[key] as string | number, key, row)
                    : (row[key] as React.ReactNode)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
