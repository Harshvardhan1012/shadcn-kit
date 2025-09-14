import { cn } from '@/lib/utils'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { BaseFormFieldConfig, FormFieldType } from './DynamicForm'
import { BaseComponentProps } from './type'

export interface TextareaFieldConfig
  extends BaseFormFieldConfig<FormFieldType.TEXTAREA>,
    Omit<React.ComponentProps<typeof Textarea>, 'ref'> {
  fieldType: FormFieldType.TEXTAREA
  ref?: React.Ref<HTMLTextAreaElement>
}
export type TextAreaProps = Omit<
  TextareaFieldConfig,
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

interface ITextareaInput extends BaseComponentProps<string>, TextAreaProps {
  value?: string
  placeholder?: string
  rows?: number
}

export const TextareaInput: React.FC<ITextareaInput> = ({
  label,
  description,
  error,
  className,
  value = '',
  placeholder,
  rows,
  onChange,
  onBlur,
  disabled,
  ...props
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label>{label}</Label>}
      <Textarea
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={(e) => onBlur?.(e.target.value)}
        {...props}
      />
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error}
    </div>
  )
}
