import { zodResolver } from '@hookform/resolvers/zod'
import React, {
  forwardRef,
  type JSX,
  useImperativeHandle,
  useState,
} from 'react'
import {
  type DefaultValues,
  type FieldValues,
  type Path,
  type PathValue,
  type SubmitHandler,
  useForm,
} from 'react-hook-form'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { FormContext, type FormContextType } from './FormContext'

// (assuming these are properly typed)
import { FileText } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { SingleDatePicker } from './../form/DatePicker'
import { DateRangePicker } from './../form/DateRangePicker'
import { Button } from './../ui/button'
import { Command } from './../ui/command'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './../ui/form'
import { Input } from './../ui/input'
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from './../ui/multi-select'
import { Skeleton } from './../ui/skeleton'
import {
  type CheckboxFieldConfig,
  CheckboxInput,
  type CheckBoxProps,
} from './CheckBoxInput'
import { ComboBox } from './ComboBox'
import { type DateTimeFieldConfig, DateTimeInput } from './DateTime'
import { type RadioFieldConfig, RadioGroupInput } from './RadioGroupInput'
import { type SelectFieldConfig, SelectInput } from './SelectInput'
import { type SwitchFieldConfig, SwitchInput } from './SwitchInput'
import {
  type TextareaFieldConfig,
  TextareaInput,
  type TextAreaProps,
} from './TextAreaInput'
import {
  type InputFieldConfig,
  TextInput,
  type TextInputProps,
} from './TextInput'

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
  fieldType: T
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
  className?: string
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
  schema: any
  customSubmitButton?: React.ReactNode
  className?: string
  loading?: boolean
  submitButtonText?: string
  showResetButton?: boolean
}

const DynamicForm = forwardRef<FormContextType, DynamicFormProps>(
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
      showResetButton = false,
    }: DynamicFormProps<T>,
    ref: React.Ref<unknown> | undefined
  ) => {
    const form = useForm<T>({
      resolver: zodResolver(schema),
      defaultValues,
    })

    // Create form context helper function
    const createFormContext = (): FormContextType => ({
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
      hasErrors: () => {
        return Object.keys(form.formState.errors).length > 0
      },
      getErrors: () => {
        const errors = form.formState.errors
        const errorMessages: Record<string, string> = {}
        Object.keys(errors).forEach((key) => {
          const error = errors[key]
          if (error?.message) {
            errorMessages[key] = error.message as string
          }
        })
        return errorMessages
      },
      getFieldError: (fieldName: string) => {
        const error = form.formState.errors[fieldName]
        return error?.message as string | undefined
      },
      clearErrors: () => {
        form.clearErrors()
      },
      clearFieldError: (fieldName: string) => {
        form.clearErrors(fieldName as Path<T>)
      },
      validateField: async (fieldName: string) => {
        const result = await form.trigger(fieldName as Path<T>)
        return result
      },
      validateForm: async () => {
        const result = await form.trigger()
        return result
      },
      isDirty: () => {
        return form.formState.isDirty
      },
      isFieldDirty: (fieldName: string) => {
        const dirtyFields = form.formState.dirtyFields as Record<
          string,
          boolean
        >
        return !!(dirtyFields && dirtyFields[fieldName])
      },
      getTouchedFields: () => {
        const touchedFields = form.formState.touchedFields as Record<
          string,
          boolean
        >
        return Object.keys(touchedFields || {})
      },
      isFieldTouched: (fieldName: string) => {
        const touchedFields = form.formState.touchedFields as Record<
          string,
          boolean
        >
        return !!(touchedFields && touchedFields[fieldName])
      },
      getFormValues: () => {
        return form.getValues()
      },
      setFormValues: (values: Partial<T>) => {
        Object.entries(values).forEach(([key, value]) => {
          form.setValue(key as Path<T>, value as PathValue<T, Path<T>>)
        })
      },
      isValid: () => {
        return form.formState.isValid
      },
      isSubmitting: () => {
        return form.formState.isSubmitting
      },
      submitCount: () => {
        return form.formState.submitCount
      },
      watchField: (fieldName: string) => {
        return form.watch(fieldName as Path<T>)
      },
      watchAllFields: () => {
        return form.watch()
      },
    })

    // Expose form methods via ref using FormContextType interface
    useImperativeHandle(ref, () => createFormContext())

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
        className,
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
          break
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
                        placeholder={selectProps.placeholder}
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
                      onSearchChange={(searchValue) => 
                        comboboxConfig.onSearchChange?.(name, searchValue)
                      }
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
                        }}
                        onSearchChange={(searchValue) => 
                          multiselectConfig.onSearchChange?.(name, searchValue)
                        }>
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

    // Create form context value using helper
    const formContextValue = createFormContext()

    return (
      <FormContext.Provider value={formContextValue}>
        <Form {...form}>
          <form
            id="dynamic-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn('space-y-6', className)}>
            {formConfig.map(renderField)}
            {customSubmitButton || (
              <div className="flex items-center gap-4">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  loading={form.formState.isSubmitting}>
                  {submitButtonText || 'Submit'}
                </Button>
                {showResetButton && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={form.formState.isSubmitting}>
                    Reset to Default
                  </Button>
                )}
              </div>
            )}
          </form>
        </Form>
      </FormContext.Provider>
    )
  }
)

export default DynamicForm as unknown as <T extends FieldValues>(
  props: DynamicFormProps<T> & { ref?: React.ForwardedRef<FormContextType> }
) => JSX.Element
