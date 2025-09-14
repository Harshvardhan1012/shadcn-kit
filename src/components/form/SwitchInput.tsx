import { cn } from '@/lib/utils'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { type BaseFormFieldConfig, FormFieldType } from './DynamicForm'
import type { BaseComponentProps } from './type'

export interface SwitchFieldConfig
  extends BaseFormFieldConfig<FormFieldType.SWITCH>,
    Omit<React.ComponentProps<typeof Switch>, 'ref' | 'onBlur' | 'onChange'> {
  fieldType: FormFieldType.SWITCH
  ref?: React.Ref<HTMLButtonElement>
}

export interface ISwitchInputProps
  extends BaseComponentProps<boolean>,
    SwitchFieldConfig {
  checked?: boolean
}

export const SwitchInput: React.FC<ISwitchInputProps> = ({
  label,
  description,
  error,
  className,
  checked = false,
  onChange,
  onBlur,
  disabled,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-row items-center w-full justify-between',
        className
      )}>
      <div className="space-y-0.5">
        {label && <Label>{label}</Label>}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={(value) => onChange?.(value)}
        onBlur={() => onBlur?.(checked)}
        {...props}
      />
      {error}
    </div>
  )
}
