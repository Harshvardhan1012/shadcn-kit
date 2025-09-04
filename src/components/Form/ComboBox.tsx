'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import React, { useState } from 'react'
import { cn } from '../lib/utils'
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
import { StringComponentProps } from './type'

interface ComboBoxProps extends StringComponentProps {
  options: FormOption[]
  value?: string
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
}

export const ComboBox: React.FC<ComboBoxProps> = ({
  label,
  description,
  error,
  className,
  options = [],
  value,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No option found.',
  disabled = false,
  onChange,
  onBlur,
  ...props
}) => {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const selectedOption = options.find((option) => option.value === value)

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? '' : currentValue
    onChange?.(newValue)
    setOpen(false)
    setSearchValue('')
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      setSearchValue('')
      onBlur?.(value)
    }
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
              'w-full justify-between',
              !selectedOption && 'text-muted-foreground'
            )}>
            <div className="flex items-center gap-2">
              {selectedOption?.icon && (
                <selectedOption.icon className="h-4 w-4" />
              )}
              <span className="truncate">
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0"
          align="start">
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onValueChange={setSearchValue}
              {...props}
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
                  .map((option) => (
                    <CommandItem
                      key={String(option.value)}
                      value={String(option.value)}
                      disabled={option.disabled}
                      onSelect={() => handleSelect(String(option.value))}
                      className="flex items-center gap-2">
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === option.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {option.icon && <option.icon className="h-4 w-4" />}
                      <span className="truncate">{option.label}</span>
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
      {error}
    </div>
  )
}

export default ComboBox
