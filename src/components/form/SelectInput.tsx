import { cn } from '@/lib/utils'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { type BaseFormFieldConfig, FormFieldType, type FormOption } from './DynamicForm'
import type { BaseComponentProps } from './type'

export interface SelectFieldConfig
  extends BaseFormFieldConfig<FormFieldType.SELECT>,
    Omit<React.ComponentProps<typeof Select>, 'onValueChange' | 'value'> {
  fieldType: FormFieldType.SELECT
}

interface ISelectInputProps
  extends BaseComponentProps<string>,
    SelectFieldConfig {
  options?: FormOption[]
  value?: string
  placeholder?: string
}

export const SelectInput: React.FC<ISelectInputProps> = ({
  label,
  description,
  error,
  className,
  options,
  value,
  placeholder,
  onChange,
  onBlur,
  disabled,
  ...props
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label>{label}</Label>}
      <Select
        value={value}
        onValueChange={(value) => onChange?.(value)}
        disabled={disabled}
        {...props}>
        <SelectTrigger onBlur={() => onBlur?.(value)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options &&
            options.map((option) => (
              <SelectItem
                key={String(option.value)}
                value={String(option.value)}
                disabled={option.disabled}>
                <div className="flex items-center">
                  {option.icon && <option.icon className="mr-2 h-4 w-4" />}
                  {option.label}
                </div>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error}
    </div>
  )
}
