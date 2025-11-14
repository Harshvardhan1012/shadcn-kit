import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../card'

interface ConfigCardProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
  selected?: boolean
  onClick?: () => void
  actions?: React.ReactNode
}

export const ConfigCard = ({
  title,
  description,
  children,
  className,
  selected = false,
  onClick,
  actions,
}: ConfigCardProps) => {
  return (
    <Card
      className={cn(
        'transition-all',
        onClick && 'cursor-pointer hover:border-primary/50',
        selected && 'border-primary ring-2 ring-primary',
        className
      )}
      onClick={onClick}>
      <CardHeader
        className={cn(
          actions && 'flex-row items-start justify-between space-y-0'
        )}>
        <div className="flex-1">
          <CardTitle className="text-base">{title}</CardTitle>
          {description && (
            <CardDescription className="mt-1.5">{description}</CardDescription>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  )
}
