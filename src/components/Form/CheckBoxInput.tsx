import { cn } from '../lib/utils'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'
import { BaseFormFieldConfig, FormFieldType } from './DynamicForm'
import { BaseComponentProps } from './type'

export interface CheckboxFieldConfig
  extends BaseFormFieldConfig<FormFieldType.CHECKBOX>,
    Omit<React.ComponentProps<typeof Checkbox>, 'ref'> {
  fieldType: FormFieldType.CHECKBOX
  ref?: React.Ref<HTMLButtonElement>
}

export type CheckBoxProps = Omit<
  CheckboxFieldConfig,
  | 'fieldName'
  | 'fieldLabel'
  | 'fieldType'
  | 'options'
  | 'icon'
  | 'fileConfig'
  | 'showIf'
  | 'dependsOn'
  | 'onBlur'
  | 'onChange'
>

interface ICheckboxInputProps extends BaseComponentProps, CheckBoxProps {
  checked?: boolean
}
export const CheckboxInput: React.FC<ICheckboxInputProps> = ({
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
        'flex flex-row items-start space-x-3 space-y-0 rounded-md p-4',
        className
      )}>
      <Checkbox
        checked={checked}
        disabled={disabled}
        onCheckedChange={(value) => onChange?.(value)}
        onBlur={() => onBlur?.(checked)}
        {...props}
      />
      <div className="space-y-1 leading-none">
        {label && <Label>{label}</Label>}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {error}
    </div>
  )
}
