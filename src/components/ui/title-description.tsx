import React from 'react'

interface TitleDescriptionProps {
  title: string
  description?: string
  icon?: React.ReactNode
  size: 'sm' | 'md' | 'lg'
}

export const TitleDescription: React.FC<TitleDescriptionProps> = ({
  title,
  description,
  icon,
  size = 'md',
}) => {
  return (
    <div className="px-6 py-4 border-b flex-shrink-0">
      <h2 className={`text-${size} font-semibold flex items-center`}>
        {icon && <span className="mr-2 flex items-center">{icon}</span>}
        {title}
      </h2>
      {description && (
        <p className={`text-${size} text-muted-foreground`}>{description}</p>
      )}
    </div>
  )
}
