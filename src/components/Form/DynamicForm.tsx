"use client"
import { cn } from '@/components/lib/utils'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import Image from 'next/image'
import React, { useState } from 'react'
import {
  DefaultValues,
  FieldValues,
  Path,
  PathValue,
  SubmitHandler,
  useForm,
} from 'react-hook-form'
import * as z from 'zod'

// UI Components (assuming these are properly typed)
import { SingleDatePicker } from '@/components/DatePicker'
import { DateRangePicker } from '@/components/DateRangePicker'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarIcon, Check, FileText } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import {
  CheckboxFieldConfig,
  CheckboxInput,
  CheckBoxProps,
} from './CheckBoxInput'
import { DateTimeFieldConfig } from './DateTime'
import { RadioFieldConfig, RadioGroupInput } from './RadioGroupInput'
import { SelectFieldConfig, SelectInput } from './SelectInput'
import { SwitchFieldConfig, SwitchInput } from './SwitchInput'
import {
  TextareaFieldConfig,
  TextareaInput,
  TextAreaProps,
} from './TextAreaInput'
import { InputFieldConfig, TextInput, TextInputProps } from './TextInput'

// Form field types enum
export enum FormFieldType {
  TEXT = 'text',
  PASSWORD = 'password',
  EMAIL = 'email',
  NUMBER = 'number',
  FILE = 'file',
  CHECKBOX = 'checkbox',
  SWITCH = 'switch',
  DATE = 'date',
  DATETIME = 'datetime',
  RADIO = 'radio',
  SELECT = 'select',
  TEXTAREA = 'textarea',
  COMBOBOX = 'combobox',
  MULTISELECT = 'multiselect',
}

// Option interface
export interface FormOption<T = string | boolean | number> {
  value: T
  label: string
  icon?: React.ElementType
  disabled?: boolean
}

// File configuration
export interface FileConfig {
  accept?: string
  multiple?: boolean
}

// Base form field configuration
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface BaseFormFieldConfig<T extends FormFieldType = FormFieldType> {
  fieldName: string
  fieldLabel: string
  description?: string
  validation?: z.ZodTypeAny
  options?: FormOption[]
  icon?: React.ElementType
  fileConfig?: FileConfig
  hidden?: boolean
  showIf?: (formValues: Record<string, unknown>) => boolean
  dependsOn?: string[]
  disabled?: boolean
  placeholder?: string

  // Event callbacks
  onChangeField?: (value: unknown) => void
  onBlurField?: (value?: unknown) => void
  onErrorField?: (error: unknown) => void
}

type DateFieldConfig = BaseFormFieldConfig<FormFieldType.DATE> &
  React.ComponentProps<typeof DayPicker> & {
    fieldType: FormFieldType.DATE
    mode?: 'single' | 'multiple' | 'range'
    fromDate?: Date
    toDate?: Date
  }

interface ComboboxFieldConfig
  extends BaseFormFieldConfig<FormFieldType.COMBOBOX>,
    Omit<React.ComponentProps<typeof Command>, 'children'> {
  fieldType: FormFieldType.COMBOBOX
  searchPlaceholder?: string
  emptyMessage?: string
  onSearchChange?: (name: string, value: string) => void
  // Add these new properties
  value?: string
  defaultValue?: string
  placeholder?: string
}

// Add these to the MultiselectFieldConfig interface
interface MultiselectFieldConfig
  extends BaseFormFieldConfig<FormFieldType.MULTISELECT>,
    Omit<
      React.ComponentProps<typeof Command>,
      'children' | 'value' | 'defaultValue'
    > {
  fieldType: FormFieldType.MULTISELECT
  searchPlaceholder?: string
  emptyMessage?: string
  maxSelectedDisplay?: number
  onSearchChange?: (name: string, value: string) => void
  value?: string[]
  defaultValue?: string[]
  placeholder?: string
}

interface FileFieldConfig
  extends BaseFormFieldConfig<FormFieldType.FILE>,
    Omit<
      React.ComponentProps<typeof Input>,
      'type' | 'onChange' | 'onBlur' | 'ref'
    > {
  fieldType: FormFieldType.FILE
  buttonText?: string
  buttonVariant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  ref?: React.Ref<HTMLInputElement>
}

// Union type for all field configurations
export type FormFieldConfig =
  | InputFieldConfig
  | TextareaFieldConfig
  | CheckboxFieldConfig
  | SwitchFieldConfig
  | DateFieldConfig
  | DateTimeFieldConfig
  | RadioFieldConfig
  | SelectFieldConfig
  | ComboboxFieldConfig
  | MultiselectFieldConfig
  | FileFieldConfig

// Dynamic form props
interface DynamicFormProps<T extends FieldValues = FieldValues> {
  formConfig: FormFieldConfig[]
  onSubmit: SubmitHandler<T>
  defaultValues?: DefaultValues<T>
  schema: z.ZodSchema<T>
  customSubmitButton?: React.ReactNode
  className?: string
  loading?: boolean
}

const DynamicForm = <T extends FieldValues = FieldValues>({
  formConfig,
  onSubmit,
  defaultValues,
  schema,
  customSubmitButton,
  className,
  loading = false,
}: DynamicFormProps<T>) => {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const [filePreviews, setFilePreviews] = useState<Record<string, string>>({})
  const formValues = form.watch()

  // Common event handlers
  const handleValueChange = (fieldConfig: FormFieldConfig, value: unknown) => {
    try {
      fieldConfig.onChangeField?.(value)
    } catch (error) {
      fieldConfig.onErrorField?.(error)
    }
  }

  const handleBlur = (fieldConfig: FormFieldConfig, value?: unknown) => {
    try {
      fieldConfig.onBlurField?.(value)
    } catch (error) {
      fieldConfig.onErrorField?.(error)
    }
  }

  const handleFilePreview = (name: string, file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreviews((prev) => ({
          ...prev,
          [name]: reader.result as string,
        }))
      }
      reader.readAsDataURL(file)
    } else {
      setFilePreviews((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  // Render field based on type
  const renderField = (fieldConfig: FormFieldConfig) => {
    const {
      fieldLabel: label,
      fieldType,
      description,
      hidden,
      showIf,
      fieldName: name,
      options,
      ...props
    } = fieldConfig

    // Handle visibility
    if (hidden || (showIf && !showIf(formValues))) return null

    switch (fieldType) {
      case FormFieldType.TEXT:
      case FormFieldType.PASSWORD:
      case FormFieldType.EMAIL:
      case FormFieldType.NUMBER:
        return (
          <FormField
            key={name}
            control={form.control}
            name={name as Path<T>}
            render={({ field }) => {
              const inputProps = props as TextInputProps
              return (
                <FormItem className={cn(className)}>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <TextInput
                      {...inputProps}
                      type={fieldType}
                      value={field.value as string | number}
                      placeholder={inputProps.placeholder}
                      icon={inputProps.icon}
                      disabled={inputProps.disabled}
                      onChange={(value) => {
                        field.onChange(value)
                        handleValueChange(fieldConfig, value)
                      }}
                      onBlur={(value) => {
                        field.onBlur()
                        handleBlur(fieldConfig, value)
                      }}
                      className={inputProps.className}
                      ref={field.ref}
                      description={description}
                      error={<FormMessage />}
                    />
                  </FormControl>
                </FormItem>
              )
            }}
          />
        )

      case FormFieldType.TEXTAREA:
        return (
          <FormField
            key={name}
            control={form.control}
            name={name as Path<T>}
            render={({ field }) => {
              const textareaProps = props as TextAreaProps
              return (
                <FormItem className={cn(className)}>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <TextareaInput
                      {...textareaProps}
                      value={field.value as string}
                      onChange={(e) => {
                        field.onChange(e.target.value)
                        handleValueChange(fieldConfig, e.target.value)
                      }}
                      onBlur={(e) => {
                        field.onBlur()
                        handleBlur(fieldConfig, e.target.value)
                      }}
                      description={description}
                      error={<FormMessage />}
                      ref={field.ref}
                    />
                  </FormControl>
                </FormItem>
              )
            }}
          />
        )

      case FormFieldType.CHECKBOX:
        return (
          <FormField
            key={name}
            control={form.control}
            name={name as Path<T>}
            render={({ field }) => {
              const checkboxProps = props as CheckBoxProps
              return (
                <FormItem
                  className={cn(
                    'flex flex-row items-start space-x-3 space-y-0 rounded-md p-4',
                    className
                  )}>
                  <FormControl>
                    <CheckboxInput
                      {...checkboxProps}
                      checked={field.value as boolean}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        handleValueChange(fieldConfig, checked)
                      }}
                      onBlur={() => handleBlur(fieldConfig, field.value)}
                      error={<FormMessage />}
                      description={description}
                      label={label}
                    />
                  </FormControl>
                </FormItem>
              )
            }}
          />
        )

      case FormFieldType.SWITCH:
        return (
          <FormField
            key={name}
            control={form.control}
            name={name as Path<T>}
            render={({ field }) => {
              const switchProps = props as SwitchFieldConfig
              return (
                <FormItem
                  className={cn(
                    'flex flex-row items-center justify-between rounded-lg border p-4',
                    className
                  )}>
                  <FormControl>
                    <SwitchInput
                      {...switchProps}
                      checked={field.value as boolean}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        handleValueChange(fieldConfig, checked)
                      }}
                      onBlur={() => handleBlur(fieldConfig, field.value)}
                      description={description}
                      error={<FormMessage />}
                      label={label}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        )

      case FormFieldType.DATE:
        const dateConfig = fieldConfig as DateFieldConfig
        if (dateConfig.mode === 'range')
          return (
            <DateRangePicker
              key={name}
              value={form.watch(name as Path<T>)}
              onChange={(value) => {
                form.setValue(name as Path<T>, value as PathValue<T, Path<T>>)
                handleValueChange(fieldConfig, value)
              }}
              label={label}
              description={description}
              className={className}
              disabled={dateConfig.disabled}
              {...(dateConfig.fromDate && { fromDate: dateConfig.fromDate })}
              {...(dateConfig.toDate && { toDate: dateConfig.toDate })}
            />
          )
        if (dateConfig.mode === 'single')
          return (
            <SingleDatePicker
              key={name}
              value={form.watch(name as Path<T>)}
              onChange={(value: Date) => {
                form.setValue(name as Path<T>, value as PathValue<T, Path<T>>)
                handleValueChange(fieldConfig, value)
              }}
              label={label}
              description={description}
              className={className}
              disabled={dateConfig.disabled}
              // Make fromDate and toDate truly optional - only pass if they exist
              {...(dateConfig.fromDate && { fromDate: dateConfig.fromDate })}
              {...(dateConfig.toDate && { toDate: dateConfig.toDate })}
            />
          )

      case FormFieldType.RADIO:
        return (
          <FormField
            key={name}
            control={form.control}
            name={name as Path<T>}
            render={({ field }) => {
              const radioProps = props as RadioFieldConfig
              return (
                <FormItem className={cn(className)}>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <RadioGroupInput
                      {...radioProps}
                      onChange={(value: any) => {
                        field.onChange(value as PathValue<T, Path<T>>)
                        handleValueChange(fieldConfig, value)
                      }}
                      onBlur={() => {
                        field.onBlur()
                        handleBlur(fieldConfig, field.value)
                      }}
                      options={options}
                      error={<FormMessage />}
                      description={description}
                      value={field.value}
                      className={cn('flex-row space-x-4 space-y-0', className)}
                    />
                  </FormControl>
                </FormItem>
              )
            }}
          />
        )

      case FormFieldType.SELECT:
        return (
          <FormField
            key={name}
            control={form.control}
            name={name as Path<T>}
            render={({ field }) => {
              const selectProps = props as SelectFieldConfig
              return (
                <FormItem className={cn(className)}>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <SelectInput
                      {...selectProps}
                      onChange={(value: any) => {
                        field.onChange(value as PathValue<T, Path<T>>)
                        handleValueChange(fieldConfig, value)
                      }}
                      value={field.value}
                      error={<FormMessage />}
                      description={description}
                      options={options}
                      onBlur={() => {
                        field.onBlur()
                        handleBlur(fieldConfig, field.value)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )
            }}
          />
        )

      case FormFieldType.FILE:
        return (
          <FormField
            key={name}
            control={form.control}
            name={name as Path<T>}
            render={({ field }) => {
              const fileProps = props as Omit<
                FileFieldConfig,
                | 'fieldName'
                | 'fieldLabel'
                | 'fieldType'
                | 'options'
                | 'icon'
                | 'fileConfig'
                | 'showIf'
                | 'dependsOn'
                | 'buttonText'
                | 'buttonVariant'
              >
              const currentFile = field.value as File | null | undefined
              return (
                <FormItem className={cn(className)}>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      {filePreviews[name] ? (
                        <Image
                          width={40}
                          height={40}
                          src={filePreviews[name]}
                          alt="Preview"
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : fieldConfig.icon ? (
                        React.createElement(fieldConfig.icon, {
                          className: 'h-10 w-10 text-gray-400',
                        })
                      ) : (
                        <FileText className="h-10 w-10 text-gray-400" />
                      )}
                      <Input
                        {...fileProps}
                        type="file"
                        accept={fileProps?.accept}
                        multiple={fileProps?.multiple}
                        ref={field.ref}
                        className="flex-1"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          field.onChange(file as PathValue<T, Path<T>>)
                          handleValueChange(fieldConfig, file)
                          handleFilePreview(name, file)
                        }}
                        onBlur={(e) => {
                          field.onBlur()
                          handleBlur(fieldConfig, e.target.files?.[0])
                        }}
                      />
                    </div>
                  </FormControl>
                  {currentFile && !fileProps?.multiple && (
                    <FormDescription>
                      Selected file: {currentFile.name}
                    </FormDescription>
                  )}
                  {description && (
                    <FormDescription>{description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        )

      case FormFieldType.COMBOBOX:
        return (
          <FormField
            key={name}
            control={form.control}
            name={name as Path<T>}
            render={({ field }) => {
              const commandProps = props as Omit<
                ComboboxFieldConfig,
                | 'fieldName'
                | 'fieldLabel'
                | 'fieldType'
                | 'options'
                | 'icon'
                | 'fileConfig'
                | 'showIf'
                | 'dependsOn'
                | 'defaultValue'
              >
              const selectedValue = field.value
              const allOptions = options || []
              const selectedOption = allOptions.find(
                (opt) => opt.value === selectedValue
              )
              return (
                <FormItem className={cn(className)}>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full justify-between',
                            !selectedValue && 'text-muted-foreground'
                          )}
                          onBlur={() => handleBlur(fieldConfig, selectedValue)}>
                          {selectedOption?.label ||
                            fieldConfig.placeholder ||
                            `Select ${label.toLowerCase()}`}
                          <Check
                            className={cn('ml-2 h-4 w-4 shrink-0 opacity-50')}
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command {...commandProps}>
                          <CommandInput
                            placeholder={
                              commandProps.searchPlaceholder ||
                              `Search ${label}...`
                            }
                            onValueChange={(value) =>
                              commandProps.onSearchChange?.(name, value)
                            }
                          />
                          <CommandList>
                            <CommandEmpty>
                              {commandProps.emptyMessage || 'No option found.'}
                            </CommandEmpty>
                            <CommandGroup>
                              {allOptions.map((option) => (
                                <CommandItem
                                  value={option.label}
                                  key={String(option.value)}
                                  disabled={option.disabled}
                                  onSelect={() => {
                                    const newValue =
                                      String(selectedValue) ===
                                      String(option.value)
                                        ? ''
                                        : option.value
                                    field.onChange(
                                      newValue as PathValue<T, Path<T>>
                                    )
                                    handleValueChange(fieldConfig, newValue)
                                  }}>
                                  <div className="flex items-center">
                                    {option.icon && (
                                      <option.icon className="mr-2 h-4 w-4" />
                                    )}
                                    {option.label}
                                  </div>
                                  <Check
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      String(selectedValue) ===
                                        String(option.value)
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
                  </FormControl>
                  {description && (
                    <FormDescription>{description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        )

      case FormFieldType.DATETIME:
        return (
          <FormField
            key={name}
            control={form.control}
            name={name as Path<T>}
            render={({ field }) => {
              const dateTimeConfig = fieldConfig as DateTimeFieldConfig
              const selectedDate = field.value
                ? new Date(field.value)
                : undefined
              const is24Hour = dateTimeConfig.timeFormat === '24'
              const timeStructure = dateTimeConfig.timeStructure || 'hh:mm:ss'

              const formatDateTimeOutput = (date: Date) => {
                // Create a copy to avoid mutating the original
                const outputDate = new Date(date)

                // Set default values based on timeStructure
                if (timeStructure === 'hh') {
                  outputDate.setMinutes(0)
                  outputDate.setSeconds(0)
                } else if (timeStructure === 'hh:mm') {
                  outputDate.setSeconds(0)
                }

                // Return the Date object directly (not string)
                return outputDate
              }

              const handleTimeChange = (
                type: 'hour' | 'minute' | 'second' | 'ampm',
                value: string
              ) => {
                const newDate = selectedDate
                  ? new Date(selectedDate)
                  : new Date()

                switch (type) {
                  case 'hour':
                    const hour = parseInt(value)
                    newDate.setHours(hour)
                    break
                  case 'minute':
                    newDate.setMinutes(parseInt(value))
                    break
                  case 'second':
                    newDate.setSeconds(parseInt(value))
                    break
                  case 'ampm':
                    const currentHour = newDate.getHours()
                    if (value === 'AM' && currentHour >= 12) {
                      newDate.setHours(currentHour - 12)
                    } else if (value === 'PM' && currentHour < 12) {
                      newDate.setHours(currentHour + 12)
                    }
                    break
                }

                // Set default values based on timeStructure
                if (timeStructure === 'hh') {
                  newDate.setMinutes(0)
                  newDate.setSeconds(0)
                } else if (timeStructure === 'hh:mm') {
                  newDate.setSeconds(0)
                }

                const formattedOutput = formatDateTimeOutput(newDate)
                field.onChange(formattedOutput as PathValue<T, Path<T>>)
                handleValueChange(fieldConfig, formattedOutput)
              }

              const handleDateSelect = (date: Date | undefined) => {
                if (!date) return

                // Preserve existing time if available
                if (selectedDate) {
                  date.setHours(
                    selectedDate.getHours(),
                    selectedDate.getMinutes(),
                    timeStructure === 'hh:mm:ss'
                      ? selectedDate.getSeconds()
                      : 0,
                    selectedDate.getMilliseconds()
                  )
                } else {
                  // Default to current time if no time is selected
                  const now = new Date()
                  date.setHours(
                    now.getHours(),
                    timeStructure === 'hh' ? 0 : now.getMinutes(),
                    timeStructure === 'hh:mm:ss' ? now.getSeconds() : 0,
                    0
                  )
                }

                // Ensure proper defaults based on timeStructure
                if (timeStructure === 'hh') {
                  date.setMinutes(0)
                  date.setSeconds(0)
                } else if (timeStructure === 'hh:mm') {
                  date.setSeconds(0)
                }

                const formattedOutput = formatDateTimeOutput(date)
                field.onChange(formattedOutput as PathValue<T, Path<T>>)
                handleValueChange(fieldConfig, formattedOutput)
              }
              const formatDisplay = (date: Date) => {
                switch (timeStructure) {
                  case 'hh':
                    return is24Hour
                      ? format(date, 'MM/dd/yyyy HH')
                      : format(date, 'MM/dd/yyyy hh aa')
                  case 'hh:mm':
                    return is24Hour
                      ? format(date, 'MM/dd/yyyy HH:mm')
                      : format(date, 'MM/dd/yyyy hh:mm aa')
                  case 'hh:mm:ss':
                  default:
                    return is24Hour
                      ? format(date, 'MM/dd/yyyy HH:mm:ss')
                      : format(date, 'MM/dd/yyyy hh:mm:ss aa')
                }
              }

              const getPlaceholder = () => {
                if (dateTimeConfig.placeholder)
                  return dateTimeConfig.placeholder

                switch (timeStructure) {
                  case 'hh':
                    return is24Hour ? 'MM/DD/YYYY HH' : 'MM/DD/YYYY hh aa'
                  case 'hh:mm':
                    return is24Hour ? 'MM/DD/YYYY HH:mm' : 'MM/DD/YYYY hh:mm aa'
                  case 'hh:mm:ss':
                  default:
                    return is24Hour
                      ? 'MM/DD/YYYY HH:mm:ss'
                      : 'MM/DD/YYYY hh:mm:ss aa'
                }
              }

              return (
                <FormItem className={cn(className)}>
                  <FormLabel>{label}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !selectedDate && 'text-muted-foreground'
                          )}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? (
                            formatDisplay(selectedDate)
                          ) : (
                            <span>{getPlaceholder()}</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      align="start">
                      <div className="flex flex-col sm:flex-row">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateSelect}
                          disabled={dateTimeConfig.disabled}
                          fromDate={dateTimeConfig.fromDate}
                          toDate={dateTimeConfig.toDate}
                          initialFocus
                        />

                        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                          {/* Hours Selector */}
                          <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2 gap-1">
                              {Array.from(
                                { length: is24Hour ? 24 : 12 },
                                (_, i) => (is24Hour ? i : i + 1)
                              ).map((hour) => {
                                const isSelected = selectedDate
                                  ? is24Hour
                                    ? selectedDate.getHours() === hour
                                    : (selectedDate.getHours() % 12 || 12) ===
                                      hour
                                  : false

                                return (
                                  <Button
                                    key={hour}
                                    size="sm"
                                    variant={isSelected ? 'default' : 'ghost'}
                                    className="sm:w-full justify-center"
                                    onClick={() => {
                                      if (is24Hour) {
                                        handleTimeChange(
                                          'hour',
                                          hour.toString()
                                        )
                                      } else {
                                        // For 12-hour format, convert display hour to 24-hour
                                        const currentDate =
                                          selectedDate || new Date()
                                        const isPM =
                                          currentDate.getHours() >= 12

                                        let hourValue: number
                                        if (hour === 12) {
                                          // 12 AM = 0, 12 PM = 12
                                          hourValue = isPM ? 12 : 0
                                        } else {
                                          // 1-11 AM = 1-11, 1-11 PM = 13-23
                                          hourValue = isPM ? hour + 12 : hour
                                        }

                                        handleTimeChange(
                                          'hour',
                                          hourValue.toString()
                                        )
                                      }
                                    }}>
                                    {hour}
                                  </Button>
                                )
                              })}
                            </div>
                            <ScrollBar
                              orientation="horizontal"
                              className="sm:hidden"
                            />
                          </ScrollArea>
                          {/* Minutes Selector */}
                          {(timeStructure === 'hh:mm' ||
                            timeStructure === 'hh:mm:ss') && (
                            <ScrollArea className="w-64 sm:w-auto">
                              <div className="flex sm:flex-col p-2 gap-1">
                                {Array.from(
                                  { length: 60 },
                                  (_, i) => i * 1
                                ).map((minute) => {
                                  const isSelected =
                                    selectedDate?.getMinutes() === minute
                                  return (
                                    <Button
                                      key={minute}
                                      size="sm"
                                      variant={isSelected ? 'default' : 'ghost'}
                                      className="sm:w-full justify-center"
                                      onClick={() =>
                                        handleTimeChange(
                                          'minute',
                                          minute.toString()
                                        )
                                      }>
                                      {minute.toString().padStart(2, '0')}
                                    </Button>
                                  )
                                })}
                              </div>
                              <ScrollBar
                                orientation="horizontal"
                                className="sm:hidden"
                              />
                            </ScrollArea>
                          )}
                          {/* Seconds Selector */}
                          {timeStructure === 'hh:mm:ss' && (
                            <ScrollArea className="w-64 sm:w-auto">
                              <div className="flex sm:flex-col p-2 gap-1">
                                {Array.from(
                                  { length: 60 },
                                  (_, i) => i * 1
                                ).map((second) => {
                                  const isSelected =
                                    selectedDate?.getSeconds() === second
                                  return (
                                    <Button
                                      key={second}
                                      size="sm"
                                      variant={isSelected ? 'default' : 'ghost'}
                                      className="sm:w-full justify-center"
                                      onClick={() =>
                                        handleTimeChange(
                                          'second',
                                          second.toString()
                                        )
                                      }>
                                      {second.toString().padStart(2, '0')}
                                    </Button>
                                  )
                                })}
                              </div>
                              <ScrollBar
                                orientation="horizontal"
                                className="sm:hidden"
                              />
                            </ScrollArea>
                          )}
                          {/* AM/PM Selector */}
                          {!is24Hour && (
                            <ScrollArea>
                              <div className="flex sm:flex-col p-2 gap-1">
                                {['AM', 'PM'].map((ampm) => {
                                  const isSelected = selectedDate
                                    ? (ampm === 'AM' &&
                                        selectedDate.getHours() < 12) ||
                                      (ampm === 'PM' &&
                                        selectedDate.getHours() >= 12)
                                    : false

                                  return (
                                    <Button
                                      key={ampm}
                                      size="sm"
                                      variant={isSelected ? 'default' : 'ghost'}
                                      className="sm:w-full justify-center"
                                      onClick={() =>
                                        handleTimeChange('ampm', ampm)
                                      }>
                                      {ampm}
                                    </Button>
                                  )
                                })}
                              </div>
                            </ScrollArea>
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  {description && (
                    <FormDescription>{description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        )

      // ...existing code...

      case FormFieldType.MULTISELECT:
        return (
          <FormField
            key={name}
            control={form.control}
            name={name as Path<T>}
            render={({ field }) => {
              const commandProps = props as Omit<
                MultiselectFieldConfig,
                | 'fieldName'
                | 'fieldLabel'
                | 'fieldType'
                | 'options'
                | 'icon'
                | 'fileConfig'
                | 'showIf'
                | 'dependsOn'
                | 'maxSelectedDisplay'
                | 'defaultValue'
                | 'value'
              >
              const selectedValues = Array.isArray(field.value)
                ? field.value
                : field.value
                ? [field.value]
                : []
              const allOptions = options || []
              const maxDisplay =
                (props as MultiselectFieldConfig).maxSelectedDisplay || 5
              return (
                <FormItem className={cn(className)}>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full justify-between',
                            selectedValues.length === 0 &&
                              'text-muted-foreground'
                          )}
                          onBlur={() =>
                            handleBlur(fieldConfig, selectedValues)
                          }>
                          {selectedValues.length === 0 ? (
                            fieldConfig.placeholder ||
                            `Select ${label.toLowerCase()}`
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {selectedValues
                                .slice(0, maxDisplay)
                                .map((val) => {
                                  const option = allOptions.find(
                                    (opt) => opt.value === val
                                  )
                                  return (
                                    <Badge
                                      variant="outline"
                                      key={String(val)}
                                      className="text-xs">
                                      {option?.label || val}
                                    </Badge>
                                  )
                                })}
                              {selectedValues.length > maxDisplay && (
                                <Badge
                                  variant="outline"
                                  className="text-xs">
                                  +{selectedValues.length - maxDisplay} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command {...commandProps}>
                          <CommandInput
                            placeholder={
                              commandProps.searchPlaceholder ||
                              `Search ${label.toLowerCase()}...`
                            }
                            className="h-9"
                            onValueChange={(value) =>
                              commandProps.onSearchChange?.(name, value)
                            }
                          />
                          <CommandList>
                            <CommandEmpty>
                              {commandProps.emptyMessage || 'No option found.'}
                            </CommandEmpty>
                            <CommandGroup>
                              {allOptions.map((option) => (
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
                                          (v) =>
                                            String(v) !== String(option.value)
                                        )
                                      : [...selectedValues, option.value]

                                    field.onChange(
                                      newValues as PathValue<T, Path<T>>
                                    )
                                    handleValueChange(fieldConfig, newValues)
                                  }}>
                                  <div className="flex items-center">
                                    {option.icon && (
                                      <option.icon className="mr-2 h-4 w-4" />
                                    )}
                                    {option.label}
                                  </div>
                                  <Check
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      selectedValues.some(
                                        (v) =>
                                          String(v) === String(option.value)
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
                  </FormControl>
                  {description && (
                    <FormDescription>{description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        )

      default:
        return (
          <p key={name}>
            Unsupported field type: {(fieldConfig as FormFieldConfig).fieldType}
          </p>
        )
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {formConfig.map((field, idx) => (
          <div
            key={field.fieldName || idx}
            className={className || ''}>
            <div className="mb-2">
              <Skeleton className="h-4 w-32 rounded" />
            </div>
            <Skeleton className={cn('h-10 w-full rounded', className)} />
          </div>
        ))}
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-6', className)}>
        {formConfig.map(renderField)}
        {customSubmitButton || <Button type="submit">Submit</Button>}
      </form>
    </Form>
  )
}

export default DynamicForm
