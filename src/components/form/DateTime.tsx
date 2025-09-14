'use client'
import { PopoverTrigger } from '@radix-ui/react-popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import React from 'react'
import { DayPicker } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { Label } from '../ui/label'
import { Popover, PopoverContent } from '../ui/popover'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import { type BaseFormFieldConfig, FormFieldType } from './DynamicForm'
import type { DateComponentProps } from './type'

export type TimeFormat = '12-hour' | '24-hour'
export const TimeFormat = {
  TWELVE_HOUR: '12-hour' as TimeFormat,
  TWENTY_FOUR_HOUR: '24-hour' as TimeFormat,
}

export const TimeStructure = {
  HOUR_ONLY: 'hour-only',
  HOUR_MINUTE: 'hour-minute',
  HOUR_MINUTE_SECOND: 'hour-minute-second',
} as const

export type TimeStructure = (typeof TimeStructure)[keyof typeof TimeStructure]
export const DateTimeMode = {
  SINGLE: 'single',
  MULTIPLE: 'multiple',
  RANGE: 'range',
} as const

export type DateTimeMode = (typeof DateTimeMode)[keyof typeof DateTimeMode]

export type DateTimeFieldConfig = BaseFormFieldConfig<FormFieldType.DATETIME> &
  React.ComponentProps<typeof DayPicker> & {
    fieldType: FormFieldType.DATETIME
    mode?: DateTimeMode
    timeFormat?: TimeFormat
    timeStructure?: TimeStructure
    minDate?: Date
    maxDate?: Date
  }

interface DateTimeInputProps extends DateComponentProps {
  value?: Date | string
  timeFormat?: TimeFormat
  timeStructure?: TimeStructure
  minDate?: Date
  maxDate?: Date
  placeholder?: string
}

// Helper function to parse UTC string correctly
const parseUTCString = (utcString: string): Date => {
  const utcDate = new Date(utcString)
  // Create a new date using UTC components as local time
  return new Date(
    utcDate.getUTCFullYear(),
    utcDate.getUTCMonth(),
    utcDate.getUTCDate(),
    utcDate.getUTCHours(),
    utcDate.getUTCMinutes(),
    utcDate.getUTCSeconds(),
    utcDate.getUTCMilliseconds()
  )
}

// Helper function to convert local date back to UTC string
const toUTCString = (date: Date): Date => {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  )
}

export const DateTimeInput: React.FC<DateTimeInputProps> = ({
  label,
  description,
  error,
  className,
  value,
  timeFormat = TimeFormat.TWENTY_FOUR_HOUR,
  timeStructure = TimeStructure.HOUR_MINUTE_SECOND,
  minDate,
  maxDate,
  placeholder,
  onChange,
  onBlur,
  disabled,
  ...props
}) => {
  // Check if input is UTC string
  const isUTCInput =
    typeof value === 'string' && value.includes('T') && value.endsWith('Z')

  // Parse the input value correctly
  const selectedDate = React.useMemo(() => {
    if (!value) return undefined

    if (isUTCInput) {
      return parseUTCString(value as string)
    }

    return new Date(value)
  }, [value, isUTCInput])

  const is24Hour = timeFormat === TimeFormat.TWENTY_FOUR_HOUR
  const effectiveMinDate = minDate
  const effectiveMaxDate = maxDate

  const formatDateTimeOutput = (date: Date) => {
    const outputDate = new Date(date)
    if (timeStructure === TimeStructure.HOUR_ONLY) {
      outputDate.setMinutes(0)
      outputDate.setSeconds(0)
    } else if (timeStructure === TimeStructure.HOUR_MINUTE) {
      outputDate.setSeconds(0)
    }

    // If original input was UTC, convert back to UTC
    if (isUTCInput) {
      return toUTCString(outputDate)
    }

    return outputDate
  }

  const handleTimeChange = (
    type: 'hour' | 'minute' | 'second' | 'ampm',
    timeValue: string
  ) => {
    const baseDate = selectedDate ? new Date(selectedDate) : new Date()
    if (!selectedDate) {
      baseDate.setHours(0, 0, 0, 0)
    }
    const newDate = new Date(baseDate)

    switch (type) {
      case 'hour':
        const hour = parseInt(timeValue)
        newDate.setHours(hour)
        break
      case 'minute':
        newDate.setMinutes(parseInt(timeValue))
        break
      case 'second':
        newDate.setSeconds(parseInt(timeValue))
        break
      case 'ampm':
        const currentHour = newDate.getHours()
        if (timeValue === 'AM' && currentHour >= 12) {
          newDate.setHours(currentHour - 12)
        } else if (timeValue === 'PM' && currentHour < 12) {
          newDate.setHours(currentHour + 12)
        }
        break
    }

    const formattedOutput = formatDateTimeOutput(newDate)
    onChange?.(formattedOutput)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    if (selectedDate) {
      // Preserve existing time
      date.setHours(
        selectedDate.getHours(),
        selectedDate.getMinutes(),
        timeStructure === TimeStructure.HOUR_MINUTE_SECOND
          ? selectedDate.getSeconds()
          : 0,
        selectedDate.getMilliseconds()
      )
    } else {
      // Set to beginning of day
      date.setHours(0, 0, 0, 0)
    }

    const formattedOutput = formatDateTimeOutput(date)
    onChange?.(formattedOutput)
  }

  const formatDisplay = (date: Date) => {
    const dateStr = format(date, 'dd MMMM yyyy')
    switch (timeStructure) {
      case TimeStructure.HOUR_ONLY:
        return `${dateStr} ${
          is24Hour ? format(date, 'HH') : format(date, 'hh aa')
        }`
      case TimeStructure.HOUR_MINUTE:
        return `${dateStr} ${
          is24Hour ? format(date, 'HH:mm') : format(date, 'hh:mm aa')
        }`
      case TimeStructure.HOUR_MINUTE_SECOND:
      default:
        return `${dateStr} ${
          is24Hour ? format(date, 'HH:mm:ss') : format(date, 'hh:mm:ss aa')
        }`
    }
  }

  const getPlaceholder = () => {
    if (placeholder) return placeholder
    switch (timeStructure) {
      case TimeStructure.HOUR_ONLY:
        return is24Hour ? 'DD MMMM YYYY HH' : 'DD MMMM YYYY hh aa'
      case TimeStructure.HOUR_MINUTE:
        return is24Hour ? 'DD MMMM YYYY HH:mm' : 'DD MMMM YYYY hh:mm aa'
      case TimeStructure.HOUR_MINUTE_SECOND:
      default:
        return is24Hour ? 'DD MMMM YYYY HH:mm:ss' : 'DD MMMM YYYY hh:mm:ss aa'
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label>{label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal',
              !selectedDate && 'text-muted-foreground'
            )}
            onBlur={() => onBlur?.(selectedDate)}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              formatDisplay(selectedDate)
            ) : (
              <span>{getPlaceholder()}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start">
          <div className="flex flex-col sm:flex-row">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => {
                if (disabled) return true
                if (
                  effectiveMinDate &&
                  date < new Date(effectiveMinDate.setHours(0, 0, 0, 0))
                )
                  return true
                if (
                  effectiveMaxDate &&
                  date > new Date(effectiveMaxDate.setHours(23, 59, 59, 999))
                )
                  return true
                return false
              }}
              initialFocus
              {...props}
            />

            <div className="flex flex-row h-[300px] divide-x border-l">
              <ScrollArea className="flex-1">
                <div className="flex sm:flex-col p-2 gap-1">
                  {Array.from({ length: is24Hour ? 24 : 12 }, (_, i) =>
                    is24Hour ? i : i + 1
                  ).map((hour) => {
                    const isSelected = selectedDate
                      ? is24Hour
                        ? selectedDate.getHours() === hour
                        : (selectedDate.getHours() % 12 || 12) === hour
                      : false

                    return (
                      <Button
                        key={hour}
                        size="icon"
                        variant={isSelected ? 'default' : 'ghost'}
                        className="sm:w-full shrink-0 aspect-square"
                        onClick={() => {
                          if (is24Hour) {
                            handleTimeChange('hour', hour.toString())
                          } else {
                            const baseDate =
                              selectedDate ||
                              (() => {
                                const d = new Date()
                                d.setHours(0, 0, 0, 0)
                                return d
                              })()
                            const isPM = baseDate.getHours() >= 12

                            let hourValue: number
                            if (hour === 12) {
                              hourValue = isPM ? 12 : 0
                            } else {
                              hourValue = isPM ? hour + 12 : hour
                            }
                            handleTimeChange('hour', hourValue.toString())
                          }
                        }}>
                        {hour}
                      </Button>
                    )
                  })}
                </div>
                <ScrollBar
                  orientation="horizontal"
                  className="sm:hidden"
                />
              </ScrollArea>

              {(timeStructure === TimeStructure.HOUR_MINUTE ||
                timeStructure === TimeStructure.HOUR_MINUTE_SECOND) && (
                <ScrollArea className="flex-1">
                  <div className="flex sm:flex-col p-2 gap-1">
                    {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                      <Button
                        key={minute}
                        size="icon"
                        variant={
                          selectedDate?.getMinutes() === minute
                            ? 'default'
                            : 'ghost'
                        }
                        className="sm:w-full shrink-0 aspect-square"
                        onClick={() =>
                          handleTimeChange('minute', minute.toString())
                        }>
                        {minute.toString().padStart(2, '0')}
                      </Button>
                    ))}
                  </div>
                  <ScrollBar
                    orientation="horizontal"
                    className="sm:hidden"
                  />
                </ScrollArea>
              )}

              {timeStructure === TimeStructure.HOUR_MINUTE_SECOND && (
                <ScrollArea className="flex-1">
                  <div className="flex sm:flex-col p-2 gap-1">
                    {Array.from({ length: 60 }, (_, i) => i).map((second) => (
                      <Button
                        key={second}
                        size="icon"
                        variant={
                          selectedDate?.getSeconds() === second
                            ? 'default'
                            : 'ghost'
                        }
                        className="sm:w-full shrink-0 aspect-square"
                        onClick={() =>
                          handleTimeChange('second', second.toString())
                        }>
                        {second.toString().padStart(2, '0')}
                      </Button>
                    ))}
                  </div>
                  <ScrollBar
                    orientation="horizontal"
                    className="sm:hidden"
                  />
                </ScrollArea>
              )}

              {!is24Hour && (
                <ScrollArea className="flex-1">
                  <div className="flex sm:flex-col p-2 gap-1">
                    {['AM', 'PM'].map((ampm) => (
                      <Button
                        key={ampm}
                        size="icon"
                        variant={
                          selectedDate &&
                          ((ampm === 'AM' && selectedDate.getHours() < 12) ||
                            (ampm === 'PM' && selectedDate.getHours() >= 12))
                            ? 'default'
                            : 'ghost'
                        }
                        className="sm:w-full shrink-0 aspect-square"
                        onClick={() => handleTimeChange('ampm', ampm)}>
                        {ampm}
                      </Button>
                    ))}
                  </div>
                  <ScrollBar
                    orientation="horizontal"
                    className="sm:hidden"
                  />
                </ScrollArea>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error}
    </div>
  )
}
