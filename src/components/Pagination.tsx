import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

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

  // Generate page numbers to show (show 5 pages max)
  const getPageNumbers = () => {
    const maxPagesToShow = 3
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2))
    const endPage = Math.min(pageCount, startPage + maxPagesToShow - 1)

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    )
  }

  const pageNumbers = getPageNumbers()
  const showStartEllipsis = pageNumbers[0] > 1
  const showEndEllipsis = pageNumbers[pageNumbers.length - 1] < pageCount

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between px-2 w-full gap-4">
      <div className="flex items-center space-x-6 lg:space-x-8 w-full">
        <div className="flex items-center justify-start w-full gap-2">
          <p className="text-sm font-medium w-fit">Rows per page</p>
          <Select
            value={String(pageSize)}
            onValueChange={(value: string) => onPageSizeChange(Number(value))}>
            <SelectTrigger className="h-8">
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

        <div className="hidden md:flex w-full items-center justify-start text-sm font-medium">
          {isLoading ? (
            <Skeleton className="h-5 w-full" />
          ) : (
            `Page ${page} of ${pageCount}`
          )}
        </div>
      </div>

      <div className="flex items-center justify-center w-full text-sm text-muted-foreground">
        {isLoading ? (
          <Skeleton className="h-5 w-32" />
        ) : (
          `Showing ${startRow}-${endRow} of ${totalRows} rows`
        )}
      </div>

      <Pagination className='justify-start md:justify-end '>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onPageChange(1)
              }}
              className={page === 1 ? 'pointer-events-none opacity-50' : ''}>
              <ChevronsLeft className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>{' '}
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (page > 1) onPageChange(page - 1)
              }}
              className={page === 1 ? 'pointer-events-none opacity-50' : ''}>
              <ChevronLeft className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
          {showStartEllipsis && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {pageNumbers.map((num) => (
            <PaginationItem
              key={num}>
              <PaginationLink
                href="#"
                isActive={page === num}
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(num)
                }}>
                {num}
              </PaginationLink>
            </PaginationItem>
          ))}
          {showEndEllipsis && (
            <PaginationItem >
              <PaginationEllipsis />
            </PaginationItem>
          )}{' '}
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (page < pageCount) onPageChange(page + 1)
              }}
              className={
                page === pageCount ? 'pointer-events-none opacity-50' : ''
              }>
              <ChevronRight className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>{' '}
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onPageChange(pageCount)
              }}
              className={
                page === pageCount ? 'pointer-events-none opacity-50' : ''
              }>
              <ChevronsRight className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
