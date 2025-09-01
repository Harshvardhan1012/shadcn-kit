import { CommandInput } from 'cmdk'
import { Check } from 'lucide-react'
import { cn } from '../lib/utils'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '../ui/command'
import { Label } from '../ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { FormOption } from './DynamicForm'
import { BaseComponentProps } from './type'

// Multiselect Component
interface MultiselectInputProps extends BaseComponentProps {
  options: FormOption[]
  value?: string[]
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  maxSelectedDisplay?: number
  onSearchChange?: (value: string) => void
}

export const MultiselectInput: React.FC<MultiselectInputProps> = ({
  label,
  description,
  error,
  className,
  options,
  value = [],
  placeholder,
  searchPlaceholder,
  emptyMessage,
  maxSelectedDisplay = 5,
  onChange,
  onBlur,
  onSearchChange,
  disabled,
  ...props
}) => {
  const selectedValues = Array.isArray(value) ? value : []

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label>{label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            disabled={disabled}
            className={cn(
              'w-full justify-between',
              selectedValues.length === 0 && 'text-muted-foreground'
            )}
            onBlur={() => onBlur?.(selectedValues)}>
            {selectedValues.length === 0 ? (
              placeholder || `Select ${label}`
            ) : (
              <div className="flex flex-wrap gap-1">
                {selectedValues.slice(0, maxSelectedDisplay).map((val) => {
                  const option = options.find((opt) => opt.value === val)
                  return (
                    <Badge
                      variant="outline"
                      key={String(val)}
                      className="text-xs">
                      {option?.label || val}
                    </Badge>
                  )
                })}
                {selectedValues.length > maxSelectedDisplay && (
                  <Badge
                    variant="outline"
                    className="text-xs">
                    +{selectedValues.length - maxSelectedDisplay} more
                  </Badge>
                )}
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command {...props}>
            <CommandInput
              placeholder={
                searchPlaceholder || `Search ${label?.toLowerCase()}...`
              }
              className="h-9"
              onValueChange={onSearchChange}
            />
            <CommandList>
              <CommandEmpty>{emptyMessage || 'No option found.'}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    value={option.label}
                    key={String(option.value)}
                    disabled={option.disabled}
                    onSelect={() => {
                      const isSelected = selectedValues.some(
                        (v) => String(v) === String(option.value)
                      )
                      const newValues = isSelected
                        ? selectedValues.filter(
                            (v) => String(v) !== String(option.value)
                          )
                        : [...selectedValues, option.value]

                      onChange?.(newValues)
                    }}>
                    <div className="flex items-center">
                      {option.icon && <option.icon className="mr-2 h-4 w-4" />}
                      {option.label}
                    </div>
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        selectedValues.some(
                          (v) => String(v) === String(option.value)
                        )
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
