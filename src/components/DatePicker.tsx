import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/components/lib/utils'
import { CalendarIcon } from 'lucide-react'

interface SingleDatePickerProps {
  value?: string | Date
  onChange: (value: Date) => void  // Changed to return Date object
  label?: string
  description?: string
  disabled?: boolean
  className?: string
  fromDate?: Date
  toDate?: Date
}

export function SingleDatePicker({
  value,
  onChange,
  label,
  description,
  disabled = false,
  className,
  fromDate,
  toDate,
}: SingleDatePickerProps) {
  // Convert string value to Date for display and calendar selection
  const selectedDate = value ? new Date(value) : undefined

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Return the Date object directly (not string)
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
            disabled={disabled}
            fromDate={fromDate}
            toDate={toDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  )
}