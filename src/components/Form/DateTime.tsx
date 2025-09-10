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
import { BaseFormFieldConfig, FormFieldType } from './DynamicForm'
import { DateComponentProps } from './type'

export enum TimeFormat {
  TWELVE_HOUR = '12-hour',
  TWENTY_FOUR_HOUR = '24-hour',
}

export enum TimeStructure {
  HOUR_ONLY = 'hour-only',
  HOUR_MINUTE = 'hour-minute',
  HOUR_MINUTE_SECOND = 'hour-minute-second',
}
export enum DateTimeMode {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
  RANGE = 'range',
}

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
  value?: Date
  timeFormat?: TimeFormat
  timeStructure?: TimeStructure
  minDate?: Date
  maxDate?: Date
  placeholder?: string
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
  const selectedDate = value ? new Date(value) : undefined
  const is24Hour = timeFormat === TimeFormat.TWENTY_FOUR_HOUR

  // Use minDate/maxDate for date restrictions
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

    return outputDate
  }

  const handleTimeChange = (
    type: 'hour' | 'minute' | 'second' | 'ampm',
    timeValue: string
  ) => {
    const newDate = selectedDate ? new Date(selectedDate) : new Date()

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

    if (timeStructure === TimeStructure.HOUR_ONLY) {
      newDate.setMinutes(0)
      newDate.setSeconds(0)
    } else if (timeStructure === TimeStructure.HOUR_MINUTE) {
      newDate.setSeconds(0)
    }

    const formattedOutput = formatDateTimeOutput(newDate)
    onChange?.(formattedOutput)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    if (selectedDate) {
      date.setHours(
        selectedDate.getHours(),
        selectedDate.getMinutes(),
        timeStructure === TimeStructure.HOUR_MINUTE_SECOND
          ? selectedDate.getSeconds()
          : 0,
        selectedDate.getMilliseconds()
      )
    } else {
      const now = new Date()
      date.setHours(
        now.getHours(),
        timeStructure === TimeStructure.HOUR_ONLY ? 0 : now.getMinutes(),
        timeStructure === TimeStructure.HOUR_MINUTE_SECOND
          ? now.getSeconds()
          : 0,
        0
      )
    }

    if (timeStructure === TimeStructure.HOUR_ONLY) {
      date.setMinutes(0)
      date.setSeconds(0)
    } else if (timeStructure === TimeStructure.HOUR_MINUTE) {
      date.setSeconds(0)
    }

    const formattedOutput = formatDateTimeOutput(date)
    onChange?.(formattedOutput)
  }

  const formatDisplay = (date: Date) => {
    const dateStr = format(date, 'dd MMMM yyyy') // This gives "24 August 2025" format

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
                if (effectiveMinDate && date < effectiveMinDate) return true
                if (effectiveMaxDate && date > effectiveMaxDate) return true
                return false
              }}
              initialFocus
              {...props}
            />

            <div className="flex flex-row h-[300px] divide-x border-l">
              {/* Hours Selector */}
              <div className="flex-1 overflow-y-auto max-h-full">
                <div className="flex flex-col p-2 gap-1 min-h-max">
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
                        size="sm"
                        variant={isSelected ? 'default' : 'ghost'}
                        className="w-full justify-center flex-shrink-0 min-h-[32px]"
                        onClick={() => {
                          if (is24Hour) {
                            handleTimeChange('hour', hour.toString())
                          } else {
                            const currentDate = selectedDate || new Date()
                            const isPM = currentDate.getHours() >= 12

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
              </div>

              {/* Minutes Selector */}
              {(timeStructure === TimeStructure.HOUR_MINUTE ||
                timeStructure === TimeStructure.HOUR_MINUTE_SECOND) && (
                <div className="flex-1 overflow-y-auto max-h-full">
                  <div className="flex flex-col p-2 gap-1 min-h-max">
                    {Array.from({ length: 60 }, (_, i) => i).map((minute) => {
                      const isSelected = selectedDate?.getMinutes() === minute
                      return (
                        <Button
                          key={minute}
                          size="sm"
                          variant={isSelected ? 'default' : 'ghost'}
                          className="w-full justify-center flex-shrink-0 min-h-[32px]"
                          onClick={() =>
                            handleTimeChange('minute', minute.toString())
                          }>
                          {minute.toString().padStart(2, '0')}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Seconds Selector */}
              {timeStructure === TimeStructure.HOUR_MINUTE_SECOND && (
                <div className="flex-1 overflow-y-auto max-h-full">
                  <div className="flex flex-col p-2 gap-1 min-h-max">
                    {Array.from({ length: 60 }, (_, i) => i).map((second) => {
                      const isSelected = selectedDate?.getSeconds() === second
                      return (
                        <Button
                          key={second}
                          size="sm"
                          variant={isSelected ? 'default' : 'ghost'}
                          className="w-full justify-center flex-shrink-0 min-h-[32px]"
                          onClick={() =>
                            handleTimeChange('second', second.toString())
                          }>
                          {second.toString().padStart(2, '0')}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* AM/PM Selector */}
              {!is24Hour && (
                <div className="flex-1 overflow-y-auto h-[300px]">
                  <div className="flex flex-col p-2 gap-1">
                    {['AM', 'PM'].map((ampm) => {
                      const isSelected = selectedDate
                        ? (ampm === 'AM' && selectedDate.getHours() < 12) ||
                          (ampm === 'PM' && selectedDate.getHours() >= 12)
                        : false

                      return (
                        <Button
                          key={ampm}
                          size="sm"
                          variant={isSelected ? 'default' : 'ghost'}
                          className="w-full justify-center flex-shrink-0 min-h-[32px]"
                          onClick={() => handleTimeChange('ampm', ampm)}>
                          {ampm}
                        </Button>
                      )
                    })}
                  </div>
                </div>
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
