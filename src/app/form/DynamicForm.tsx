import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
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
import { Checkbox } from '@/components/ui/checkbox'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { CalendarIcon, Check, FileText } from 'lucide-react'
import { DayPicker } from 'react-day-picker'

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
export interface FormOption {
  value: string | boolean | number
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

// Component-specific configurations
interface InputFieldConfig
  extends BaseFormFieldConfig<
      | FormFieldType.TEXT
      | FormFieldType.PASSWORD
      | FormFieldType.EMAIL
      | FormFieldType.NUMBER
    >,
    Omit<React.ComponentProps<typeof Input>, 'ref'> {
  fieldType:
    | FormFieldType.TEXT
    | FormFieldType.PASSWORD
    | FormFieldType.EMAIL
    | FormFieldType.NUMBER
  ref?: React.Ref<HTMLInputElement>
}

interface TextareaFieldConfig
  extends BaseFormFieldConfig<FormFieldType.TEXTAREA>,
    Omit<React.ComponentProps<typeof Textarea>, 'ref'> {
  fieldType: FormFieldType.TEXTAREA
  ref?: React.Ref<HTMLTextAreaElement>
}

interface CheckboxFieldConfig
  extends BaseFormFieldConfig<FormFieldType.CHECKBOX>,
    Omit<React.ComponentProps<typeof Checkbox>, 'ref'> {
  fieldType: FormFieldType.CHECKBOX
  ref?: React.Ref<HTMLButtonElement>
}

interface SwitchFieldConfig
  extends BaseFormFieldConfig<FormFieldType.SWITCH>,
    Omit<React.ComponentProps<typeof Switch>, 'ref'> {
  fieldType: FormFieldType.SWITCH
  ref?: React.Ref<HTMLButtonElement>
}

type DateFieldConfig = BaseFormFieldConfig<FormFieldType.DATE> &
  React.ComponentProps<typeof DayPicker> & {
    fieldType: FormFieldType.DATE
    mode?: 'single' | 'multiple' | 'range'
    fromDate?: Date
    toDate?: Date
  }

type DateTimeFieldConfig = BaseFormFieldConfig<FormFieldType.DATETIME> &
  React.ComponentProps<typeof DayPicker> & {
    fieldType: FormFieldType.DATETIME
    mode?: 'single' | 'multiple' | 'range'
    timeFormat?: '12' | '24'
    timeStructure?: 'hh:mm:ss' | 'hh:mm' | 'hh'
    fromDate?: Date
    toDate?: Date
  }

interface RadioFieldConfig
  extends BaseFormFieldConfig<FormFieldType.RADIO>,
    Omit<
      React.ComponentProps<typeof RadioGroup>,
      'name' | 'onValueChange' | 'defaultValue'
    > {
  fieldType: FormFieldType.RADIO
  orientation?: 'horizontal' | 'vertical'
}

interface SelectFieldConfig
  extends BaseFormFieldConfig<FormFieldType.SELECT>,
    Omit<
      React.ComponentProps<typeof Select>,
      'onValueChange' | 'defaultValue' | 'value'
    > {
  fieldType: FormFieldType.SELECT
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
  schema: z.ZodObject<z.ZodRawShape, z.UnknownKeysParam, z.ZodTypeAny>
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
    resolver: zodResolver(schema) as any,
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
              const inputProps = props as Omit<
                InputFieldConfig,
                | 'fieldName'
                | 'fieldLabel'
                | 'fieldType'
                | 'options'
                | 'fileConfig'
                | 'showIf'
                | 'dependsOn'
              >
              return (
                <FormItem className={cn(className)}>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      {inputProps.icon &&
                        React.createElement(inputProps.icon, {
                          className:
                            'absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400',
                        })}
                      <Input
                        {...inputProps}
                        type={fieldType}
                        value={field.value as string | number}
                        onChange={(e) => {
                          const value =
                            fieldType === FormFieldType.NUMBER
                              ? Number(e.target.value)
                              : e.target.value
                          field.onChange(value)
                          handleValueChange(fieldConfig, value)
                        }}
                        onBlur={(e) => {
                          field.onBlur()
                          const value =
                            fieldType === FormFieldType.NUMBER
                              ? Number(e.target.value)
                              : e.target.value
                          handleBlur(fieldConfig, value)
                        }}
                        className={cn(
                          inputProps.icon ? 'pl-10' : '',
                          inputProps.className
                        )}
                        ref={field.ref}
                      />
                    </div>
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

      case FormFieldType.TEXTAREA:
        return (
          <FormField
            key={name}
            control={form.control}
            name={name as Path<T>}
            render={({ field }) => {
              const textareaProps = props as Omit<
                TextareaFieldConfig,
                | 'fieldName'
                | 'fieldLabel'
                | 'fieldType'
                | 'options'
                | 'icon'
                | 'fileConfig'
                | 'showIf'
                | 'dependsOn'
              >
              return (
                <FormItem className={cn(className)}>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Textarea
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
                      ref={field.ref}
                    />
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

      case FormFieldType.CHECKBOX:
        return (
          <FormField
            key={name}
            control={form.control}
            name={name as Path<T>}
            render={({ field }) => {
              const checkboxProps = props as Omit<
                CheckboxFieldConfig,
                | 'fieldName'
                | 'fieldLabel'
                | 'fieldType'
                | 'options'
                | 'icon'
                | 'fileConfig'
                | 'showIf'
                | 'dependsOn'
              >
              return (
                <FormItem
                  className={cn(
                    'flex flex-row items-start space-x-3 space-y-0 rounded-md p-4',
                    className
                  )}>
                  <FormControl>
                    <Checkbox
                      {...checkboxProps}
                      checked={field.value as boolean}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        handleValueChange(fieldConfig, checked)
                      }}
                      onBlur={() => handleBlur(fieldConfig, field.value)}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{label}</FormLabel>
                    {description && (
                      <FormDescription>{description}</FormDescription>
                    )}
                  </div>
                  <FormMessage />
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
              const switchProps = props as Omit<
                SwitchFieldConfig,
                | 'fieldName'
                | 'fieldLabel'
                | 'fieldType'
                | 'options'
                | 'icon'
                | 'fileConfig'
                | 'showIf'
                | 'dependsOn'
              >
              return (
                <FormItem
                  className={cn(
                    'flex flex-row items-center justify-between rounded-lg border p-4',
                    className
                  )}>
                  <div className="space-y-0.5">
                    <FormLabel>{label}</FormLabel>
                    {description && (
                      <FormDescription>{description}</FormDescription>
                    )}
                  </div>
                  <FormControl>
                    <Switch
                      {...switchProps}
                      checked={field.value as boolean}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        handleValueChange(fieldConfig, checked)
                      }}
                      onBlur={() => handleBlur(fieldConfig, field.value)}
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
              // Make fromDate and toDate truly optional - only pass if they exist
              {...(dateConfig.fromDate && { fromDate: dateConfig.fromDate })}
              {...(dateConfig.toDate && { toDate: dateConfig.toDate })}
            />
          )
        if (dateConfig.mode === 'single')
          return (
            <SingleDatePicker
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
              const radioProps = props as Omit<
                RadioFieldConfig,
                | 'fieldName'
                | 'fieldLabel'
                | 'fieldType'
                | 'options'
                | 'icon'
                | 'fileConfig'
                | 'showIf'
                | 'dependsOn'
                | 'orientation'
              >
              return (
                <FormItem className={cn(className)}>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      {...radioProps}
                      onValueChange={(value) => {
                        field.onChange(value as PathValue<T, Path<T>>)
                        handleValueChange(fieldConfig, value)
                      }}
                      defaultValue={field.value as string}
                      className={cn('flex-row space-x-4 space-y-0', className)}>
                      {options?.map((option) => (
                        <div
                          key={String(option.value)}
                          className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={option.value as string}
                            id={`${name}-${option.value}`}
                            disabled={option.disabled}
                          />
                          <FormLabel
                            htmlFor={`${name}-${option.value}`}
                            className="flex items-center">
                            {option.icon && (
                              <option.icon className="mr-2 h-4 w-4" />
                            )}
                            {option.label}
                          </FormLabel>
                        </div>
                      ))}
                    </RadioGroup>
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

      case FormFieldType.SELECT:
        return (
          <FormField
            key={name}
            control={form.control}
            name={name as Path<T>}
            render={({ field }) => {
              const selectProps = props as Omit<
                SelectFieldConfig,
                | 'fieldName'
                | 'fieldLabel'
                | 'fieldType'
                | 'options'
                | 'icon'
                | 'fileConfig'
                | 'showIf'
                | 'dependsOn'
              >
              return (
                <FormItem className={cn(className)}>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Select
                      {...selectProps}
                      onValueChange={(value) => {
                        field.onChange(value as PathValue<T, Path<T>>)
                        handleValueChange(fieldConfig, value)
                      }}
                      defaultValue={field.value as string}
                      value={field.value as string}>
                      <SelectTrigger
                        onBlur={() => handleBlur(fieldConfig, field.value)}>
                        <SelectValue placeholder={fieldConfig.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {options?.map((option) => (
                          <SelectItem
                            key={String(option.value)}
                            value={String(option.value)}
                            disabled={option.disabled}>
                            <div className="flex items-center">
                              {option.icon && (
                                <option.icon className="mr-2 h-4 w-4" />
                              )}
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

                // Create a properly formatted local datetime string
                const year = newDate.getFullYear()
                const month = String(newDate.getMonth() + 1).padStart(2, '0')
                const day = String(newDate.getDate()).padStart(2, '0')
                const hours = String(newDate.getHours()).padStart(2, '0')
                const minutes = String(newDate.getMinutes()).padStart(2, '0')
                const seconds = String(newDate.getSeconds()).padStart(2, '0')

                const localDateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
                field.onChange(localDateTimeString as PathValue<T, Path<T>>)
                handleValueChange(fieldConfig, localDateTimeString)
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

                // Create a properly formatted local datetime string
                const year = date.getFullYear()
                const month = String(date.getMonth() + 1).padStart(2, '0')
                const day = String(date.getDate()).padStart(2, '0')
                const hours = String(date.getHours()).padStart(2, '0')
                const minutes = String(date.getMinutes()).padStart(2, '0')
                const seconds = String(date.getSeconds()).padStart(2, '0')

                const localDateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
                field.onChange(localDateTimeString as PathValue<T, Path<T>>)
                handleValueChange(fieldConfig, localDateTimeString)
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
