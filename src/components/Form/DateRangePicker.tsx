import { cn } from './../lib/utils'
import { Button } from './../ui/button'
import { Calendar } from './../ui/calendar'
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from './../ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './../ui/popover'
import { format } from 'date-fns/format'
import { CalendarDays } from 'lucide-react'

interface DateRangePickerProps {
  value?: { from?: Date; to?: Date }
  onChange: (value: { from?: Date; to?: Date }) => void
  label?: string
  description?: string
  disabled?: boolean
  className?: string
  minDate?: Date
  maxDate?: Date
}

export function DateRangePicker({
  value,
  onChange,
  label,
  description,
  disabled = false,
  className,
  minDate,
  maxDate,
}: DateRangePickerProps) {
  const from = value?.from ? new Date(value.from) : undefined
  const to = value?.to ? new Date(value.to) : undefined
  return (
    <FormItem className={cn(className)}>
      {label && <FormLabel>{label}</FormLabel>}
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              disabled={disabled}
              className={cn(
                'w-full justify-start text-left font-normal',
                !value?.from && 'text-muted-foreground'
              )}>
              <CalendarDays className="mr-2 h-4 w-4" />
              {from && to ? (
                `${format(from, 'PPP')} - ${format(to, 'PPP')}`
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="range"
            selected={{ from, to }}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                onChange({
                  from: range.from,
                  to: range.to,
                })
              }
            }}
            disabled={(date) => {
              if (disabled) return true
              if (minDate && date < minDate) return true
              if (maxDate && date > maxDate) return true
              return false
            }}
            initialFocus
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  )
}
