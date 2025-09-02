'use client'

import { Check, ChevronsUpDown, X } from 'lucide-react'
import React, { useState } from 'react'
import { cn } from '../lib/utils'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'
import { Label } from '../ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { FormOption } from './DynamicForm'
import { BaseComponentProps } from './type'

interface MultiSelectProps extends BaseComponentProps {
  options: FormOption[]
  value?: string[]
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  maxSelectedDisplay?: number
  disabled?: boolean
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  description,
  error,
  className,
  options = [],
  value = [],
  placeholder,
  searchPlaceholder,
  emptyMessage = 'No option found.',
  maxSelectedDisplay = 3,
  disabled = false,
  onChange,
  onBlur,
  ...props
}) => {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const selectedValues = Array.isArray(value) ? value : value ? [value] : []

  const handleSelect = (optionValue: string) => {
    const isSelected = selectedValues.some(
      (v) => String(v) === String(optionValue)
    )
    const newValues = isSelected
      ? selectedValues.filter((v) => String(v) !== String(optionValue))
      : [...selectedValues, optionValue]

    onChange?.(newValues)
  }

  const handleRemove = (optionValue: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const newValues = selectedValues.filter(
      (v) => String(v) !== String(optionValue)
    )
    onChange?.(newValues)
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      setSearchValue('')
      onBlur?.(selectedValues)
    }
  }

  const getPlaceholder = () => {
    if (placeholder) return placeholder
    return label ? `Select ${label.toLowerCase()}...` : 'Select options...'
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label>{label}</Label>}
      <Popover
        open={open}
        onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'w-full justify-between min-h-[40px] h-auto',
              selectedValues.length === 0 && 'text-muted-foreground'
            )}>
            {selectedValues.length === 0 ? (
              <span>{getPlaceholder()}</span>
            ) : (
              <div className="flex flex-wrap gap-1 max-w-full">
                {selectedValues.slice(0, maxSelectedDisplay).map((val) => {
                  const option = options.find((opt) => opt.value === val)
                  return (
                    <Badge
                      variant="secondary"
                      key={String(val)}
                      className="text-xs flex items-center gap-1">
                      {option?.icon && <option.icon className="h-3 w-3" />}
                      <span className="truncate">
                        {option?.label || String(val)}
                      </span>
                      <button
                        className="ml-1 hover:bg-muted rounded-sm"
                        onClick={(e) => handleRemove(String(val), e)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )
                })}
                {selectedValues.length > maxSelectedDisplay && (
                  <Badge
                    variant="secondary"
                    className="text-xs">
                    +{selectedValues.length - maxSelectedDisplay} more
                  </Badge>
                )}
              </div>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0"
          align="start">
          <Command {...props}>
            <CommandInput
              placeholder={searchPlaceholder || `Search options...`}
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options
                  .filter((option) =>
                    option.label
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  )
                  .map((option) => {
                    const isSelected = selectedValues.some(
                      (v) => String(v) === String(option.value)
                    )
                    return (
                      <CommandItem
                        key={String(option.value)}
                        value={String(option.value)}
                        disabled={option.disabled}
                        onSelect={() => handleSelect(String(option.value))}
                        className="flex items-center gap-2">
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            isSelected ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {option.icon && <option.icon className="h-4 w-4" />}
                        <span className="truncate">{option.label}</span>
                      </CommandItem>
                    )
                  })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error}
    </div>
  )
}

export default MultiSelect
