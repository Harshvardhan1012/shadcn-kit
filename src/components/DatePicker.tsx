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
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'

interface SingleDatePickerProps {
  value?: string
  onChange: (value: string) => void
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
                !value && 'text-muted-foreground'
              )}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(new Date(value), 'PPP') : 'Pick a date'}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={(date) => date && onChange(date.toISOString())}
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
