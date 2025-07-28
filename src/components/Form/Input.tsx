import React from 'react'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { cn } from '@/lib/utils'
import { Input } from '../ui/input'
import { Control, FieldValues, Path } from 'react-hook-form'

// InputField.tsx
type InputFieldProps<T extends FieldValues> = {
  name: Path<T>
  label: string
  control: Control<T>
  icon?: React.ElementType
  description?: string
  className?: string
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'name' | 'type' | 'value' | 'onChange'
>

export function InputField<T extends FieldValues>({
  name,
  label,
  control,
  icon: Icon,
  description,
  className,
  ...rest
}: InputFieldProps<T>) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative flex items-center">
              {Icon && (
                <Icon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              )}
              <Input
                {...field}
                {...rest}
                id={name}
                className={cn(Icon ? 'pl-10' : '', className)}
                onChange={(e) => {
                  field.onChange(e.target.value)
                }}
              />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
