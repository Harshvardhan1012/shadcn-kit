export interface BaseComponentProps {
  label?: string
  description?: string
  error: React.JSX.Element | null
  className?: string
  disabled?: boolean
  onChange?: (value: any) => void
  onBlur?: (value?: any) => void
}
