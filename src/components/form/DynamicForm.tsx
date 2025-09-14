'use client'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { forwardRef, JSX, useImperativeHandle, useState } from 'react'
import {
  DefaultValues,
  FieldValues,
  Path,
  PathValue,
  SubmitHandler,
  useForm,
} from 'react-hook-form'
import * as z from 'zod'
import { FormContext, FormContextType } from './FormContext'

// (assuming these are properly typed)
import { FileText } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { Button } from '../ui/button'
import { Command } from '../ui/command'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '../ui/multi-select'
import { Skeleton } from '../ui/skeleton'
import {
  CheckboxFieldConfig,
  CheckboxInput,
  CheckBoxProps,
} from './CheckBoxInput'
import { ComboBox } from './ComboBox'
import { SingleDatePicker } from './DatePicker'
import { DateRangePicker } from './DateRangePicker'
import { DateTimeFieldConfig, DateTimeInput } from './DateTime'
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
    minDate?: Date
    maxDate?: Date
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
  overflowBehavior?: 'wrap' | 'wrap-when-open' | 'cutoff'
  enableSearch?: boolean
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
  submitButtonText?: string
}

export interface DynamicFormRef {
  setFieldValue: (fieldName: string, value: unknown) => void
  getFieldValue: (fieldName: string) => unknown
  resetField: (fieldName: string) => void
  resetForm: () => void
}

const DynamicForm = forwardRef<DynamicFormRef, DynamicFormProps>(
  <T extends FieldValues = FieldValues>(
    {
      formConfig,
      onSubmit,
      defaultValues,
      schema,
      customSubmitButton,
      className,
      loading = false,
      submitButtonText,
    }: DynamicFormProps<T>,
    ref: React.Ref<unknown> | undefined
  ) => {
    const form = useForm<T>({
      resolver: zodResolver(schema),
      defaultValues,
    })

    // Expose form methods via ref
    useImperativeHandle(ref, () => ({
      setFieldValue: (fieldName: string, value: unknown) => {
        form.setValue(fieldName as Path<T>, value as PathValue<T, Path<T>>)
      },
      getFieldValue: (fieldName: string) => {
        return form.getValues(fieldName as Path<T>)
      },
      resetField: (fieldName: string) => {
        form.resetField(fieldName as Path<T>)
      },
      resetForm: () => {
        form.reset()
      },
    }))

    const [filePreviews, setFilePreviews] = useState<Record<string, string>>({})
    const formValues = form.watch()

    // Common event handlers
    const handleValueChange = (
      fieldConfig: FormFieldConfig,
      value: unknown
    ) => {
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
                          field.onChange(e)
                          handleValueChange(fieldConfig, e)
                        }}
                        onBlur={(e) => {
                          field.onBlur()
                          handleBlur(fieldConfig, e)
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
                {...(dateConfig.minDate && { minDate: dateConfig.minDate })}
                {...(dateConfig.maxDate && { maxDate: dateConfig.maxDate })}
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
                {...(dateConfig.minDate && { minDate: dateConfig.minDate })}
                {...(dateConfig.maxDate && { maxDate: dateConfig.maxDate })}
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
                        onChange={(value) => {
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
                        className={cn(
                          'flex-row space-x-4 space-y-0',
                          className
                        )}
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
                        onChange={(value) => {
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
                          <img
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
                const comboboxConfig = fieldConfig as ComboboxFieldConfig
                return (
                  <FormItem className={cn(className)}>
                    <ComboBox
                      label={label}
                      description={description}
                      options={options || []}
                      value={field.value}
                      onChange={(val) => {
                        field.onChange(val as PathValue<T, Path<T>>)
                        handleValueChange(fieldConfig, val)
                      }}
                      onBlur={() => handleBlur(fieldConfig, field.value)}
                      placeholder={comboboxConfig.placeholder}
                      searchPlaceholder={comboboxConfig.searchPlaceholder}
                      emptyMessage={comboboxConfig.emptyMessage}
                      disabled={comboboxConfig.disabled}
                      error={<FormMessage />}
                    />
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
                return (
                  <FormItem className={cn(className)}>
                    <DateTimeInput
                      label={label}
                      description={description}
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(date as PathValue<T, Path<T>>)
                        handleValueChange(fieldConfig, date)
                      }}
                      onBlur={() => handleBlur(fieldConfig, field.value)}
                      timeFormat={dateTimeConfig.timeFormat}
                      timeStructure={dateTimeConfig.timeStructure}
                      minDate={dateTimeConfig.minDate}
                      maxDate={dateTimeConfig.maxDate}
                      placeholder={dateTimeConfig.placeholder}
                      disabled={dateTimeConfig.disabled}
                      error={<FormMessage />}
                    />
                  </FormItem>
                )
              }}
            />
          )

        case FormFieldType.MULTISELECT:
          return (
            <FormField
              key={name}
              control={form.control}
              name={name as Path<T>}
              render={({ field }) => {
                const multiselectConfig = fieldConfig as MultiselectFieldConfig
                return (
                  <FormItem className={cn(className)}>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <MultiSelect
                        values={field.value}
                        onValuesChange={(values: string[]) => {
                          field.onChange(values as PathValue<T, Path<T>>)
                          handleValueChange(fieldConfig, values)
                        }}>
                        <MultiSelectTrigger className="w-full">
                          <MultiSelectValue
                            placeholder={multiselectConfig.placeholder}
                            overflowBehavior={
                              multiselectConfig.overflowBehavior ||
                              'wrap-when-open'
                            }
                          />
                        </MultiSelectTrigger>
                        <MultiSelectContent
                          search={
                            multiselectConfig.enableSearch !== false
                              ? {
                                  placeholder:
                                    multiselectConfig.searchPlaceholder,
                                  emptyMessage: multiselectConfig.emptyMessage,
                                }
                              : false
                          }>
                          {options?.map((option) => (
                            <MultiSelectItem
                              key={option.value.toString()}
                              value={option.value.toString()}>
                              {option.label}
                            </MultiSelectItem>
                          ))}
                        </MultiSelectContent>
                      </MultiSelect>
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
              Unsupported field type:{' '}
              {(fieldConfig as FormFieldConfig).fieldType}
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

    // Create form context value
    const formContextValue: FormContextType = {
      form,
      setFieldValue: (fieldName: string, value: unknown) => {
        form.setValue(fieldName as Path<T>, value as PathValue<T, Path<T>>)
      },
      getFieldValue: (fieldName: string) => {
        return form.getValues(fieldName as Path<T>)
      },
      resetField: (fieldName: string) => {
        form.resetField(fieldName as Path<T>)
      },
      resetForm: () => {
        form.reset()
      },
    }

    return (
      <FormContext.Provider value={formContextValue}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn('space-y-6', className)}>
            {formConfig.map(renderField)}
            {customSubmitButton || (
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                loading={form.formState.isSubmitting}>
                {submitButtonText || 'Submit'}
              </Button>
            )}
          </form>
        </Form>
      </FormContext.Provider>
    )
  }
)

export default DynamicForm as unknown as <T extends FieldValues>(
  props: DynamicFormProps<T> & { ref?: React.ForwardedRef<DynamicFormRef> }
) => JSX.Element
