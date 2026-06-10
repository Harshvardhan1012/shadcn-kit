'use client'

import type { Column } from '@tanstack/react-table'
import { Check, PlusCircle, XCircle } from 'lucide-react'
import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { Option } from '@/types/data-table'

interface DataTableFacetedFilterProps {
  column?: Column<any, unknown>
  title?: string
  options: Option[]
  multiple?: boolean
  value?: any
  onValueChange?: (value: any) => void
}

export function DataTableFacetedFilter({
  title,
  options,
  multiple,
  value,
  onValueChange,
}: DataTableFacetedFilterProps) {
  const [open, setOpen] = React.useState(false)

  const selectedValues = React.useMemo(() => {
    return new Set(
      Array.isArray(value) ? value : value !== undefined ? [value] : [],
    )
  }, [value])

  const onItemSelect = React.useCallback(
    (option: Option) => {
      if (!onValueChange) return

      const currentSelectedValues = new Set(
        Array.isArray(value) ? value : value !== undefined ? [value] : [],
      )
      console.log('Current Selected Values:', currentSelectedValues)

      const isSelected = currentSelectedValues.has(option.value)

      if (multiple) {
        if (isSelected) {
          currentSelectedValues.delete(option.value)
        } else {
          currentSelectedValues.add(option.value)
        }
        const filterValues = Array.from(currentSelectedValues)
        onValueChange(filterValues)
      } else {
        onValueChange([option.value])
        setOpen(false)
      }
    },
    [multiple, value, onValueChange],
  )

  const onReset = React.useCallback(
    (event?: React.MouseEvent) => {
      event?.stopPropagation()
      onValueChange?.(undefined)
    },
    [onValueChange],
  )

  return (
    <TooltipProvider delayDuration={500}>
      <Popover
        open={open}
        onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-dashed">
            {selectedValues?.size > 0 ? (
              <XCircle
                onClick={(e) => {
                  e.stopPropagation()
                  onReset()
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onReset()
                  }
                }}
                className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            ) : (
              <PlusCircle />
            )}
            {title}
            {selectedValues?.size > 0 && (
              <>
                <Separator
                  orientation="vertical"
                  className="mx-2 h-4"
                />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden">
                  {selectedValues.size}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  {selectedValues.size > 2 ? (
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal">
                      {selectedValues.size} selected
                    </Badge>
                  ) : (
                    options
                      .filter((option) => selectedValues.has(option.value))
                      .map((option) => (
                        <Tooltip key={String(option.value)}>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="secondary"
                              className="max-w-[150px] truncate rounded-sm px-1 font-normal">
                              {option.label}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{option.label}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))
                  )}
                </div>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[200px] p-0"
          align="start">
          <Command>
            <CommandInput placeholder={title} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValues.has(option.value)
                  return (
                    <CommandItem
                      key={String(option.value)}
                      onSelect={() => onItemSelect(option)}>
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible',
                        )}>
                        <Check className={cn('h-4 w-4')} />
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="max-w-[150px] truncate">
                            {option.label}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{option.label}</p>
                        </TooltipContent>
                      </Tooltip>
                      {option.count && (
                        <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                          {option.count}
                        </span>
                      )}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
              {selectedValues.size > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={(e) => onReset()}
                      className="justify-center text-center">
                      Clear filters
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  )
}
