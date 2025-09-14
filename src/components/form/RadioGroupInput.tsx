import { cn } from '@/lib/utils'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { type BaseFormFieldConfig, FormFieldType, type FormOption } from './DynamicForm'
import type { BaseComponentProps } from './type'

export interface RadioFieldConfig
  extends BaseFormFieldConfig<FormFieldType.RADIO>,
    Omit<
      React.ComponentProps<typeof RadioGroup>,
      'name' | 'onValueChange' | 'onBlur' | 'onChange'
    > {
  fieldType: FormFieldType.RADIO
  orientation?: 'horizontal' | 'vertical'
}

export interface IRadioGroupInputProps
  extends BaseComponentProps<string>,
    RadioFieldConfig {
  options?: FormOption[]
  value?: string
  orientation?: 'horizontal' | 'vertical'
}

export const RadioGroupInput: React.FC<IRadioGroupInputProps> = ({
  label,
  description,
  error,
  className,
  options,
  value,
  orientation = 'vertical',
  onChange,
  onBlur,
  disabled,
  ...props
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label>{label}</Label>}
      <RadioGroup
        value={value}
        onValueChange={(value) => onChange?.(value)}
        disabled={disabled}
        className={cn(
          orientation === 'horizontal'
            ? 'flex-row space-x-4 space-y-0'
            : 'space-y-2'
        )}
        {...props}>
        {options &&
          options.map((option) => (
            <div
              key={String(option.value)}
              className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value as string}
                id={String(option.value)}
                disabled={option.disabled}
                onBlur={() => onBlur?.(value)}
              />
              <Label
                htmlFor={String(option.value)}
                className="flex items-center">
                {option.icon && <option.icon className="mr-2 h-4 w-4" />}
                {option.label}
              </Label>
            </div>
          ))}
      </RadioGroup>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error}
    </div>
  )
}
