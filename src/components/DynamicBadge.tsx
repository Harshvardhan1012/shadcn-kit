'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { X, Check, AlertTriangle, Info, Star } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge, badgeVariants } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Extended badge variants
const dynamicBadgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground border-border',
        success:
          'border-transparent bg-green-500 text-white hover:bg-green-600',
        warning:
          'border-transparent bg-yellow-500 text-white hover:bg-yellow-600',
        info:
          'border-transparent bg-blue-500 text-white hover:bg-blue-600',
        neutral:
          'border-transparent bg-gray-500 text-white hover:bg-gray-600',
        gradient:
          'border-transparent bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
      shape: {
        rounded: 'rounded-full',
        square: 'rounded-md',
        pill: 'rounded-full px-4',
      },
      interactive: {
        true: 'cursor-pointer hover:scale-105 active:scale-95',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      shape: 'rounded',
      interactive: false,
    },
  }
)

export interface DynamicBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dynamicBadgeVariants> {
  /**
   * Badge content/text
   */
  children: React.ReactNode
  /**
   * Icon to display before the text
   */
  icon?: React.ElementType | React.ReactNode
  /**
   * Whether to show a dismiss/close button
   */
  dismissible?: boolean
  /**
   * Callback when dismiss button is clicked
   */
  onDismiss?: () => void
  /**
   * Custom dismiss icon
   */
  dismissIcon?: React.ElementType | React.ReactNode
  /**
   * Whether the badge is in a loading state
   */
  loading?: boolean
  /**
   * Loading component to show
   */
  loadingComponent?: React.ReactNode
  /**
   * Dot indicator color (for status badges)
   */
  dotColor?: string
  /**
   * Whether to show a status dot
   */
  showDot?: boolean
  /**
   * Badge count/number (for notification badges)
   */
  count?: number
  /**
   * Maximum count to display (shows "99+" if exceeded)
   */
  maxCount?: number
  /**
   * Whether to pulse (for notifications)
   */
  pulse?: boolean
  /**
   * Custom styles for different states
   */
  customStyles?: {
    default?: string
    hover?: string
    active?: string
  }
  /**
   * Whether badge is disabled
   */
  disabled?: boolean
  /**
   * Tooltip text to show on hover
   */
  tooltip?: string
  /**
   * Badge position (for absolute positioning)
   */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  /**
   * Animation type
   */
  animation?: 'none' | 'bounce' | 'pulse' | 'ping' | 'spin'
}

// Default icons for different variants
const variantIcons = {
  success: Check,
  destructive: X,
  warning: AlertTriangle, 
  info: Info,
  default: undefined,
  secondary: undefined,
  outline: undefined,
  neutral: undefined,
  gradient: Star,
}

// Loading spinner component
const LoadingSpinner = ({ className }: { className?: string }) => (
  <div 
    className={cn(
      'h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent',
      className
    )}
  />
)

export function DynamicBadge({
  children,
  className,
  variant = 'default',
  size = 'md',
  shape = 'rounded',
  interactive = false,
  icon,
  dismissible = false,
  onDismiss,
  dismissIcon = X,
  loading = false,
  loadingComponent,
  dotColor,
  showDot = false,
  count,
  maxCount = 99,
  pulse = false,
  customStyles,
  disabled = false,
  tooltip,
  position,
  animation = 'none',
  onClick,
  ...props
}: DynamicBadgeProps) {
  const [isVisible, setIsVisible] = React.useState(true)

  // Handle dismiss
  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDismiss) {
      onDismiss()
    } else {
      setIsVisible(false)
    }
  }

  // Don't render if dismissed
  if (!isVisible) {
    return null
  }

  // Get icon component
  const getIcon = () => {
    if (loading) {
      return loadingComponent || <LoadingSpinner />
    }
    
    if (icon) {
      if (React.isValidElement(icon)) {
        return icon
      }
      const IconComponent = icon as React.ElementType
      return <IconComponent className="h-3 w-3" />
    }

    // Use default icon for variant
    const DefaultIcon = variantIcons[variant as keyof typeof variantIcons]
    if (DefaultIcon) {
      return <DefaultIcon className="h-3 w-3" />
    }

    return null
  }

  // Get dismiss icon component
  const getDismissIcon = () => {
    if (React.isValidElement(dismissIcon)) {
      return dismissIcon
    }
    const DismissIconComponent = dismissIcon as React.ElementType
    return <DismissIconComponent className="h-3 w-3" />
  }

  // Format count display
  const formatCount = (num: number) => {
    if (num > maxCount) {
      return `${maxCount}+`
    }
    return num.toString()
  }

  // Get animation class
  const getAnimationClass = () => {
    switch (animation) {
      case 'bounce': return 'animate-bounce'
      case 'pulse': return 'animate-pulse'
      case 'ping': return 'animate-ping'
      case 'spin': return 'animate-spin'
      default: return ''
    }
  }

  // Get position classes
  const getPositionClass = () => {
    if (!position) return ''
    
    const baseClasses = 'absolute'
    switch (position) {
      case 'top-right': return `${baseClasses} -top-2 -right-2`
      case 'top-left': return `${baseClasses} -top-2 -left-2`
      case 'bottom-right': return `${baseClasses} -bottom-2 -right-2`
      case 'bottom-left': return `${baseClasses} -bottom-2 -left-2`
      default: return baseClasses
    }
  }

  const badgeContent = (
    <>
      {/* Status dot */}
      {showDot && (
        <span 
          className={cn(
            'h-2 w-2 rounded-full',
            dotColor ? '' : 'bg-current'
          )}
          style={dotColor ? { backgroundColor: dotColor } : undefined}
        />
      )}

      {/* Icon */}
      {getIcon()}

      {/* Content */}
      <span className="flex-1">
        {count !== undefined ? formatCount(count) : children}
      </span>

      {/* Dismiss button */}
      {dismissible && (
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 p-0 hover:bg-transparent"
          onClick={handleDismiss}
        >
          {getDismissIcon()}
        </Button>
      )}
    </>
  )

  return (
    <div
      className={cn(
        dynamicBadgeVariants({ variant, size, shape, interactive }),
        getAnimationClass(),
        getPositionClass(),
        pulse && 'animate-pulse',
        disabled && 'opacity-50 cursor-not-allowed',
        customStyles?.default,
        className
      )}
      onClick={disabled ? undefined : onClick}
      title={tooltip}
      {...props}
    >
      {badgeContent}
    </div>
  )
}

// Preset badge components for common use cases
export const StatusBadge = ({ 
  status, 
  ...props 
}: Omit<DynamicBadgeProps, 'variant'> & { 
  status: 'online' | 'offline' | 'busy' | 'away' 
}) => {
  const statusConfig = {
    online: { variant: 'success' as const, dotColor: '#10b981' },
    offline: { variant: 'neutral' as const, dotColor: '#6b7280' },
    busy: { variant: 'destructive' as const, dotColor: '#ef4444' },
    away: { variant: 'warning' as const, dotColor: '#f59e0b' },
  }

  return (
    <DynamicBadge
      variant={statusConfig[status].variant}
      showDot
      dotColor={statusConfig[status].dotColor}
      {...props}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </DynamicBadge>
  )
}

export const NotificationBadge = ({ 
  count, 
  ...props 
}: Omit<DynamicBadgeProps, 'count'> & { 
  count: number 
}) => (
  <DynamicBadge
    variant="destructive"
    size="sm"
    shape="pill"
    count={count}
    position="top-right"
    animation={count > 0 ? 'pulse' : 'none'}
    {...props}
  />
)

export const TrendingBadge = (props: Omit<DynamicBadgeProps, 'variant' | 'animation'>) => (
  <DynamicBadge
    variant="gradient"
    icon={Star}
    animation="pulse"
    {...props}
  >
    Trending
  </DynamicBadge>
)
