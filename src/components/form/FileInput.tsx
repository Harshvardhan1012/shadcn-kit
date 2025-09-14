import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import type { BaseComponentProps } from './type'
import { FileTextIcon } from 'lucide-react'

interface FileInputProps extends BaseComponentProps<File | null> {
  value?: File | null
  accept?: string
  multiple?: boolean
  icon?: React.ElementType
}

export const FileInput: React.FC<FileInputProps> = ({
  label,
  description,
  error,
  className,
  value,
  accept,
  multiple,
  icon,
  onChange,
  onBlur,
  disabled,
  ...props
}) => {
  const [preview, setPreview] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    onChange?.(file)

    // Handle preview
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setPreview('')
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label>{label}</Label>}
      <div className="flex items-center space-x-2">
        {preview ? (
          <img
            width={40}
            height={40}
            src={preview}
            alt="Preview"
            className="h-10 w-10 rounded-md object-cover"
          />
        ) : icon ? (
          React.createElement(icon, {
            className: 'h-10 w-10 text-gray-400',
          })
        ) : (
          <FileTextIcon className="h-10 w-10 text-gray-400" />
        )}
        <Input
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="flex-1"
          onChange={handleFileChange}
          onBlur={(e) => onBlur?.(e.target.files?.[0])}
          {...props}
        />
      </div>
      {value && !multiple && (
        <p className="text-sm text-muted-foreground">
          Selected file: {value.name}
        </p>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error}
    </div>
  )
}
