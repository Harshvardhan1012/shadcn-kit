'use client'

import type { Column } from '@tanstack/react-table'
import { CalendarIcon, XCircle } from 'lucide-react'
import * as React from 'react'
import type { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/format'

type DateSelection = Date[] | DateRange

function getIsDateRange(value: DateSelection): value is DateRange {
  return value && typeof value === 'object' && !Array.isArray(value)
}

function parseAsDate(timestamp: number | string | undefined): Date | undefined {
  if (!timestamp) return undefined
  const numericTimestamp =
    typeof timestamp === 'string' ? Number(timestamp) : timestamp
  const date = new Date(numericTimestamp)
  return !Number.isNaN(date.getTime()) ? date : undefined
}

function parseColumnFilterValue(value: unknown) {
  if (value === null || value === undefined) {
    return []
  }

  if (Array.isArray(value)) {
    return value.map((item) => {
      if (typeof item === 'number' || typeof item === 'string') {
        return item
      }
      return undefined
    })
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return [value]
  }

  return []
}

// Date preset functions
function getDateRangePreset(preset: string): DateRange {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  switch (preset) {
    case 'last-week': {
      const lastWeekEnd = new Date(today)
      lastWeekEnd.setDate(today.getDate() - 1)
      const lastWeekStart = new Date(lastWeekEnd)
      lastWeekStart.setDate(lastWeekEnd.getDate() - 6)
      return { from: lastWeekStart, to: lastWeekEnd }
    }
    case 'current-week': {
      const currentWeekStart = new Date(today)
      const dayOfWeek = today.getDay()
      currentWeekStart.setDate(today.getDate() - dayOfWeek)
      return { from: currentWeekStart, to: today }
    }
    case 'this-month': {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      return { from: monthStart, to: today }
    }
    case 'last-month': {
      const lastMonthStart = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      )
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
      return { from: lastMonthStart, to: lastMonthEnd }
    }
    case 'this-year': {
      const yearStart = new Date(today.getFullYear(), 0, 1)
      return { from: yearStart, to: today }
    }
    default:
      return { from: undefined, to: undefined }
  }
}

interface DataTableDateFilterProps<TData> {
  column: Column<TData, unknown>
  title?: string
  multiple?: boolean
  onValueChange?: (value: Date | DateRange | undefined) => void
}

export function DataTableDateFilter<TData>({
  column,
  title,
  multiple = true,
  onValueChange,
}: DataTableDateFilterProps<TData>) {
  const columnFilterValue = column.getFilterValue()

  const selectedDates = React.useMemo<DateSelection>(() => {
    if (!columnFilterValue) {
      return multiple ? { from: undefined, to: undefined } : []
    }

    // If it's the new format { value, operator }
    let filterValue = columnFilterValue
    if (
      typeof columnFilterValue === 'object' &&
      columnFilterValue &&
      'value' in columnFilterValue
    ) {
      filterValue = (columnFilterValue as any).value
    }

    if (multiple) {
      const timestamps = parseColumnFilterValue(filterValue)
      return {
        from: parseAsDate(timestamps[0]),
        to: parseAsDate(timestamps[1]),
      }
    }

    const timestamps = parseColumnFilterValue(filterValue)
    const date = parseAsDate(timestamps[0])
    return date ? [date] : []
  }, [columnFilterValue, multiple])

  const onSelect = React.useCallback(
    (date: Date | DateRange | undefined) => {
      if (onValueChange) {
        onValueChange(date)
      } else {
        if (!date) {
          column.setFilterValue(undefined)
          return
        }

        if (multiple && !('getTime' in date)) {
          const from = date.from?.getTime()
          const to = date.to?.getTime()
          column.setFilterValue(from || to ? [from, to] : undefined)
        } else if (!multiple && 'getTime' in date) {
          column.setFilterValue(date.getTime())
        }
      }
    },
    [column, multiple, onValueChange]
  )

  const handlePresetSelect = React.useCallback(
    (preset: string) => {
      const dateRange = getDateRangePreset(preset)
      onSelect(dateRange)
    },
    [onSelect]
  )

  const onReset = React.useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      if (onValueChange) {
        onValueChange(undefined)
      } else {
        column.setFilterValue(undefined)
      }
    },
    [column, onValueChange]
  )

  const hasValue = React.useMemo(() => {
    if (multiple) {
      if (!getIsDateRange(selectedDates)) return false
      return selectedDates.from || selectedDates.to
    }
    if (!Array.isArray(selectedDates)) return false
    return selectedDates.length > 0
  }, [multiple, selectedDates])

  const formatDateRange = React.useCallback((range: DateRange) => {
    if (!range.from && !range.to) return ''
    if (range.from && range.to) {
      return `${formatDate(range.from)} - ${formatDate(range.to)}`
    }
    return formatDate(range.from ?? range.to)
  }, [])

  const label = React.useMemo(() => {
    if (multiple) {
      if (!getIsDateRange(selectedDates)) return null

      const hasSelectedDates = selectedDates.from || selectedDates.to
      const dateText = hasSelectedDates
        ? formatDateRange(selectedDates)
        : 'Select date range'

      return (
        <span className="flex items-center gap-2">
          <span>{title}</span>
          {hasSelectedDates && (
            <>
              <Separator
                orientation="vertical"
                className="mx-0.5 data-[orientation=vertical]:h-4"
              />
              <span>{dateText}</span>
            </>
          )}
        </span>
      )
    }

    if (getIsDateRange(selectedDates)) return null

    const hasSelectedDate = selectedDates.length > 0
    const dateText = hasSelectedDate
      ? formatDate(selectedDates[0])
      : 'Select date'

    return (
      <span className="flex items-center gap-2">
        <span>{title}</span>
        {hasSelectedDate && (
          <>
            <Separator
              orientation="vertical"
              className="mx-0.5 data-[orientation=vertical]:h-4"
            />
            <span>{dateText}</span>
          </>
        )}
      </span>
    )
  }, [selectedDates, multiple, formatDateRange, title])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-dashed">
          {hasValue ? (
            <div
              role="button"
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              onClick={onReset}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              <XCircle />
            </div>
          ) : (
            <CalendarIcon />
          )}
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="start">
        <div className="flex flex-col">
          {/* Date Presets */}
          {multiple && (
            <div className="flex flex-col gap-1 p-3 border-b">
              <p className="text-sm font-medium mb-2">Quick Select</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetSelect('last-week')}
                  className="justify-start">
                  Last Week
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetSelect('current-week')}
                  className="justify-start">
                  This Week
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetSelect('last-month')}
                  className="justify-start">
                  Last Month
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetSelect('this-month')}
                  className="justify-start">
                  This Month
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetSelect('this-year')}
                  className="col-span-2 justify-start">
                  This Year
                </Button>
              </div>
            </div>
          )}

          {/* Calendar */}
          <div className="p-3">
            {multiple ? (
              <Calendar
                initialFocus
                mode="range"
                selected={
                  getIsDateRange(selectedDates)
                    ? selectedDates
                    : { from: undefined, to: undefined }
                }
                onSelect={onSelect}
              />
            ) : (
              <Calendar
                initialFocus
                mode="single"
                selected={
                  !getIsDateRange(selectedDates) ? selectedDates[0] : undefined
                }
                onSelect={onSelect}
              />
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
