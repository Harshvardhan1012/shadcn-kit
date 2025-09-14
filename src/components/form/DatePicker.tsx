import { cn } from '@/lib/utils'
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
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

interface SingleDatePickerProps {
  value?: string | Date
  onChange: (value: Date) => void // Changed to return Date object
  label?: string
  description?: string
  disabled?: boolean
  className?: string
  minDate?: Date
  maxDate?: Date
}

export function SingleDatePicker({
  value,
  onChange,
  label,
  description,
  disabled = false,
  className,
  minDate,
  maxDate,
}: SingleDatePickerProps) {
  const selectedDate = value ? new Date(value) : undefined

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date)
    }
  }

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
                !selectedDate && 'text-muted-foreground'
              )}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => {
              if (disabled) return true
              if (minDate && date < minDate) return true
              if (maxDate && date > maxDate) return true
              return false
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  )
}
