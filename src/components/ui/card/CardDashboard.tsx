import { cn } from '@/lib/utils'
import {
  Edit2,
  Trash2,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '../card'
import { Skeleton } from '../skeleton'
import { Button } from '../button'

interface CardDashboardProps {
  title: string
  value?: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: string
    isPositive?: boolean
  }
  footer?: string
  className?: string
  loading?: boolean
  onClick?: () => void
  dragHandle?: React.ReactNode
  editDelete?: {
    onEdit?: () => void
    onDelete?: () => void
  }
}

export const CardDashboard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  footer,
  className,
  loading = false,
  onClick,
  dragHandle,
  editDelete,
}: CardDashboardProps) => {
  if (value === null || value === undefined) {
    return <div>no data found</div>
  }
  const TrendIcon = trend?.isPositive === false ? TrendingDown : TrendingUp
  const [displayValue, setDisplayValue] = useState<string | number>(value)
  const countingRef = useRef(false)

  // Counter animation effect - only for numeric values
  useEffect(() => {
    if (loading || countingRef.current) return

    // Check if value is a pure number
    const isNumericValue = typeof value === 'number'

    // If value is not a pure number, just display it directly without animation
    if (!isNumericValue) {
      setDisplayValue(value)
      return
    }

    countingRef.current = true
    const duration = 200 // 200ms for smoother visual effect
    const steps = 40 // More steps for smoother sliding
    const increment = value / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const currentValue = Math.min(increment * currentStep, value)
      setDisplayValue(Math.round(currentValue))

      if (currentStep >= steps) {
        clearInterval(timer)
        setDisplayValue(value)
        countingRef.current = false
      }
    }, duration / steps)

    return () => {
      clearInterval(timer)
      countingRef.current = false
    }
  }, [value, loading])

  return (
    <Card
      className={cn(
        'group relative w-full overflow-hidden',
        'transition-all duration-500 ease-out',
        'border border-border/50 hover:border-primary/50',
        'bg-gradient-to-br from-background via-background to-primary/5',
        'before:absolute before:inset-0 before:-translate-x-full',
        'before:bg-gradient-to-r before:from-transparent before:via-primary/10 before:to-transparent',
        onClick && ['cursor-pointer', 'active:scale-[0.98]'],
        className
      )}
      onClick={onClick}>
      {dragHandle && (
        <div className="absolute top-2 left-2 z-10">{dragHandle}</div>
      )}

      {editDelete && (
        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
          {editDelete.onEdit && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-1"
              onClick={(e) => {
                e.stopPropagation()
                editDelete.onEdit?.()
              }}>
              <Edit2 className="w-3 h-3" />
            </Button>
          )}
          {editDelete.onDelete && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-1 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                editDelete.onDelete?.()
              }}>
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      )}

      {/* Side accent line */}
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-1',
          'bg-gradient-to-b from-primary/30 via-primary to-primary/30'
        )}
      />

      <CardHeader className="relative z-10">
        {loading ? (
          <Skeleton className="h-5 w-32" />
        ) : (
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-primary" />}
            <CardTitle
              className={cn(
                'text-md uppercase tracking-wider',
                'bg-gradient-to-r from-foreground/70 to-foreground/90 bg-clip-text text-transparent'
              )}>
              {title}
            </CardTitle>
          </div>
        )}
        {loading ? (
          <Skeleton className="mt-1 h-4 w-48" />
        ) : (
          description && (
            <CardDescription className="text-xs mt-1 text-muted-foreground/80 whitespace-pre-line">
              {description}
            </CardDescription>
          )
        )}
      </CardHeader>

      <CardContent className="pb-4 relative z-10">
        <div className="relative overflow-hidden h-12">
          {loading ? (
            <Skeleton className="h-9 w-28" />
          ) : (
            <span
              key={displayValue}
              className={cn(
                'text-3xl font-bold inline-block',
                'bg-gradient-to-r from-foreground via-primary ',
                'bg-size-200 bg-pos-0',
                'transition-all duration-400 ease-out',
                'drop-shadow-sm',
                'animate-in slide-in-from-bottom-4 duration-1000'
              )}>
              {displayValue}
            </span>
          )}
        </div>

        {trend && (
          <div className="mt-3">
            {loading ? (
              <Skeleton className="h-5 w-20" />
            ) : (
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-2 py-1 rounded-full font-medium text-xs',
                  trend.isPositive ? 'text-emerald-600 ' : 'text-red-600 '
                )}>
                <TrendIcon className="h-3.5 w-3.5" />
                {trend.value}
              </span>
            )}
          </div>
        )}
      </CardContent>

      {footer && (
        <CardFooter className="pt-0 pb-4 relative z-10">
          {loading ? (
            <Skeleton className="h-4 w-full" />
          ) : (
            <p className="text-xs text-muted-foreground/70">{footer}</p>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
