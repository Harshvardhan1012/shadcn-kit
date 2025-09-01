import { cn } from '@/components/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns/format'
import { CalendarDays } from 'lucide-react'

interface DateRangePickerProps {
  value?: { from?: Date; to?: Date }
  onChange: (value: { from?: Date; to?: Date }) => void
  label?: string
  description?: string
  disabled?: boolean
  className?: string
  fromDate?: Date
  toDate?: Date
}

export function DateRangePicker({
  value,
  onChange,
  label,
  description,
  disabled = false,
  className,
  fromDate,
  toDate,
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
            disabled={disabled}
            fromDate={fromDate}
            toDate={toDate}
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
