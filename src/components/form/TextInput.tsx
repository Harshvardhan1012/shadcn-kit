import React from 'react'
import { cn } from '@/lib/utils'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { type BaseFormFieldConfig, FormFieldType } from './DynamicForm'
import type { StringOrNumberComponentProps } from './type'

// Component-specific configurations
export interface InputFieldConfig
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

export interface TextInputProps
  extends Omit<
    React.ComponentProps<typeof Input>,
    'onFocus' | 'onBlur' | 'onChange'
  > {
  icon?: React.ElementType
}

interface ITextInputType extends StringOrNumberComponentProps, TextInputProps {
  type?: 'text' | 'password' | 'email' | 'number'
  value?: string | number
  placeholder?: string
  icon?: React.ElementType
}

export const TextInput: React.FC<ITextInputType> = ({
  label,
  description,
  error,
  className,
  type = 'text',
  value = '',
  placeholder,
  icon,
  onChange,
  onBlur,
  disabled,
  ...props
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label>{label}</Label>}
      <div className="relative">
        {icon &&
          React.createElement(icon, {
            className:
              'absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400',
          })}
        <Input
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            const newValue =
              type === 'number' ? Number(e.target.value) : e.target.value
            onChange?.(newValue)
          }}
          onBlur={(e) => {
            const newValue =
              type === 'number' ? Number(e.target.value) : e.target.value
            onBlur?.(newValue)
          }}
          className={cn(icon ? 'pl-10' : '')}
          {...props}
        />
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error}
    </div>
  )
}
