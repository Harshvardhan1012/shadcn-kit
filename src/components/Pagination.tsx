import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

interface PaginationProps {
  page: number
  pageSize: number
  pageCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  isLoading?: boolean
}

export function DataTablePagination({
  page,
  pageSize,
  pageCount,
  onPageChange,
  onPageSizeChange,
  isLoading,
}: PaginationProps) {
  const startRow = pageSize * (page - 1) + 1
  const endRow = Math.min(page * pageSize, pageCount * pageSize)
  const totalRows = pageCount * pageSize

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between px-2 w-full gap-2">
      <div className="flex items-center space-x-6 lg:space-x-8">
        {/* Rows per page selector */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={String(pageSize)}
            onValueChange={(value: string) => onPageSizeChange(Number(value))}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem
                  key={size}
                  value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Page info */}
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {isLoading ? (
            <Skeleton className="h-5 w-full" />
          ) : (
            `Page ${page} of ${pageCount}`
          )}
        </div>
      </div>
      {/* Total rows info */}
      <div className="flex items-center text-sm text-muted-foreground">
        {isLoading ? (
          <Skeleton className="h-5 w-32" />
        ) : (
          `Showing ${startRow}-${endRow} of ${totalRows} rows`
        )}
      </div>
      {/* Pagination controls */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => onPageChange(1)}
          disabled={page === 1}>
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}>
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(page + 1)}
          disabled={page === pageCount}>
          <span className="sr-only">Go to next page</span>
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => onPageChange(pageCount)}
          disabled={page === pageCount}>
          <span className="sr-only">Go to last page</span>
          <ChevronsRight />
        </Button>
      </div>
    </div>
  )
}
