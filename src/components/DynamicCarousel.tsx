'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

// Types for carousel configuration
export interface CarouselItemData {
  /**
   * Unique identifier for the carousel item
   */
  id: string | number
  /**
   * Content to display in the carousel item
   */
  content: React.ReactNode
  /**
   * Optional image source for image carousels
   */
  image?: string
  /**
   * Alt text for images
   */
  alt?: string
  /**
   * Title for the carousel item
   */
  title?: string
  /**
   * Description for the carousel item
   */
  description?: string
  /**
   * Custom link for clickable items
   */
  href?: string
  /**
   * Click handler for carousel items
   */
  onClick?: () => void
  /**
   * Custom class name for the item
   */
  className?: string
  /**
   * Additional metadata
   */
  metadata?: Record<string, unknown>
}

export interface DynamicCarouselProps {
  /**
   * Array of items to display in the carousel
   */
  items: CarouselItemData[]
  /**
   * Carousel orientation
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * Number of items to show at once
   */
  itemsPerView?: number | 'auto'
  /**
   * Space between items
   */
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  /**
   * Whether to show navigation arrows
   */
  showNavigation?: boolean
  /**
   * Whether to show dots/pagination indicators
   */
  showDots?: boolean
  /**
   * Whether to auto-play the carousel
   */
  autoPlay?: boolean
  /**
   * Auto-play interval in milliseconds
   */
  autoPlayInterval?: number
  /**
   * Whether to loop the carousel infinitely
   */
  loop?: boolean
  /**
   * Custom class name for the carousel container
   */
  className?: string
  /**
   * Custom class names for different parts
   */
  classNames?: {
    container?: string
    content?: string
    item?: string
    navigation?: string
    dots?: string
    dot?: string
    activeDot?: string
  }
  /**
   * Loading state
   */
  isLoading?: boolean
  /**
   * Number of skeleton items to show when loading
   */
  loadingItems?: number
  /**
   * Custom loading component
   */
  loadingComponent?: React.ReactNode
  /**
   * Custom render function for carousel items
   */
  renderItem?: (
    item: CarouselItemData,
    index: number,
    isActive: boolean
  ) => React.ReactNode
  /**
   * Callback when carousel item is clicked
   */
  onItemClick?: (item: CarouselItemData, index: number) => void
  /**
   * Callback when slide changes
   */
  onSlideChange?: (index: number) => void
  /**
   * Custom navigation button components
   */
  customNavigation?: {
    previous?: React.ReactNode
    next?: React.ReactNode
  }
  /**
   * Whether items should be draggable
   */
  draggable?: boolean
  /**
   * Responsive breakpoints configuration
   */
  responsive?: {
    [key: string]: {
      itemsPerView?: number
      gap?: string
    }
  }
  /**
   * Height of the carousel (for vertical carousels or fixed height)
   */
  height?: string | number
  /**
   * Aspect ratio for carousel items
   */
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto' | string
  /**
   * Whether to fade between slides instead of sliding
   */
  fade?: boolean
  /**
   * Carousel variant style
   */
  variant?: 'default' | 'card' | 'minimal' | 'full-width'
}

// Default loading skeleton
const CarouselSkeleton = ({ 
  items = 3,
  itemsPerView = 1,
  aspectRatio = 'video'
}: { 
  items?: number
  itemsPerView?: number 
  aspectRatio?: string
}) => {
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square'
      case 'video': return 'aspect-video'
      case 'portrait': return 'aspect-[3/4]'
      default: return 'aspect-video'
    }
  }

  return (
    <div className="flex gap-4">
      {Array.from({ length: Math.min(items, itemsPerView) }).map((_, index) => (
        <div key={index} className="flex-1">
          <Skeleton className={cn('w-full rounded-lg', getAspectRatioClass())} />
          <div className="mt-2 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function DynamicCarousel({
  items = [],
  orientation = 'horizontal',
  itemsPerView = 1,
  gap = 'md',
  showNavigation = true,
  showDots = false,
  autoPlay = false,
  autoPlayInterval = 3000,
  loop = true,
  className,
  classNames,
  isLoading = false,
  loadingItems = 3,
  loadingComponent,
  renderItem,
  onItemClick,
  onSlideChange,
  customNavigation,
  draggable = true,
  height,
  aspectRatio = 'auto',
  fade = false,
  variant = 'default',
}: DynamicCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  // Handle loading state
  if (isLoading) {
    return (
      <div className={cn('w-full', className, classNames?.container)}>
        {loadingComponent || (
          <CarouselSkeleton
            items={loadingItems}
            itemsPerView={typeof itemsPerView === 'number' ? itemsPerView : 1}
            aspectRatio={aspectRatio}
          />
        )}
      </div>
    )
  }

  // Handle empty items
  if (!items || items.length === 0) {
    return (
      <div className={cn(
        'flex items-center justify-center p-8 text-muted-foreground',
        className,
        classNames?.container
      )}>
        No items to display
      </div>
    )
  }

  // Set up carousel API effects
  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      const newIndex = api.selectedScrollSnap()
      setCurrent(newIndex + 1)
      if (onSlideChange) {
        onSlideChange(newIndex)
      }
    })
  }, [api, onSlideChange])

  // Auto-play functionality
  React.useEffect(() => {
    if (!api || !autoPlay) {
      return
    }

    const interval = setInterval(() => {
      if (loop || current < count) {
        api.scrollNext()
      }
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [api, autoPlay, autoPlayInterval, current, count, loop])

  // Get gap class
  const getGapClass = () => {
    switch (gap) {
      case 'sm': return 'gap-2'
      case 'md': return 'gap-4'
      case 'lg': return 'gap-6'
      case 'xl': return 'gap-8'
      default: return 'gap-4'
    }
  }

  // Get aspect ratio class
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square'
      case 'video': return 'aspect-video'
      case 'portrait': return 'aspect-[3/4]'
      case 'auto': return ''
      default: return aspectRatio ? `aspect-[${aspectRatio}]` : ''
    }
  }

  // Get item basis class based on itemsPerView
  const getItemBasisClass = () => {
    if (itemsPerView === 'auto') return 'basis-auto'
    if (typeof itemsPerView === 'number') {
      const percentage = 100 / itemsPerView
      return `basis-[${percentage}%]`
    }
    return 'basis-full'
  }

  // Render individual carousel item
  const renderCarouselItem = (item: CarouselItemData, index: number) => {
    if (renderItem) {
      return renderItem(item, index, index === current - 1)
    }

    const handleClick = () => {
      if (onItemClick) {
        onItemClick(item, index)
      }
      if (item.onClick) {
        item.onClick()
      }
    }

    const itemContent = (
      <div
        className={cn(
          'w-full',
          aspectRatio !== 'auto' && getAspectRatioClass(),
          item.className
        )}
        style={{ height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined }}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.alt || item.title || `Carousel item ${index + 1}`}
            className="h-full w-full object-cover rounded-lg"
          />
        ) : (
          item.content
        )}
        
        {(item.title || item.description) && (
          <div className="mt-2 space-y-1">
            {item.title && (
              <h3 className="font-semibold text-sm">{item.title}</h3>
            )}
            {item.description && (
              <p className="text-xs text-muted-foreground">{item.description}</p>
            )}
          </div>
        )}
      </div>
    )

    if (variant === 'card') {
      return (
        <Card 
          className={cn(
            'cursor-pointer transition-all hover:shadow-md',
            (item.onClick || item.href) && 'hover:scale-105'
          )}
          onClick={handleClick}
        >
          <CardContent className="p-4">
            {itemContent}
          </CardContent>
        </Card>
      )
    }

    return (
      <div
        className={cn(
          (item.onClick || item.href) && 'cursor-pointer',
          'transition-all'
        )}
        onClick={handleClick}
      >
        {itemContent}
      </div>
    )
  }

  // Render pagination dots
  const renderDots = () => {
    if (!showDots || count <= 1) return null

    return (
      <div className={cn(
        'flex justify-center gap-2 mt-4',
        classNames?.dots
      )}>
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={cn(
              'h-2 w-2 rounded-full transition-all',
              index === current - 1
                ? 'bg-primary'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50',
              classNames?.dot,
              index === current - 1 && classNames?.activeDot
            )}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    )
  }

  const carouselOptions = {
    align: 'start' as const,
    loop,
    ...(orientation === 'vertical' && { axis: 'y' as const }),
    ...(fade && { 
      containScroll: 'trimSnaps' as const,
      dragFree: false 
    }),
  }

  return (
    <div className={cn('w-full', className, classNames?.container)}>
      <Carousel
        opts={carouselOptions}
        orientation={orientation}
        setApi={setApi}
        className={cn(
          'w-full',
          variant === 'full-width' && 'mx-0',
          variant === 'minimal' && 'border-none shadow-none'
        )}
      >
        <CarouselContent 
          className={cn(
            orientation === 'horizontal' ? '-ml-4' : '-mt-4',
            classNames?.content
          )}
        >
          {items.map((item, index) => (
            <CarouselItem
              key={item.id}
              className={cn(
                getItemBasisClass(),
                orientation === 'horizontal' ? 'pl-4' : 'pt-4',
                classNames?.item
              )}
            >
              {renderCarouselItem(item, index)}
            </CarouselItem>
          ))}
        </CarouselContent>

        {showNavigation && items.length > (typeof itemsPerView === 'number' ? itemsPerView : 1) && (
          <>
            {customNavigation?.previous || (
              <CarouselPrevious className={cn(
                'absolute',
                orientation === 'horizontal' ? '-left-12' : '-top-12',
                classNames?.navigation
              )} />
            )}
            {customNavigation?.next || (
              <CarouselNext className={cn(
                'absolute',
                orientation === 'horizontal' ? '-right-12' : '-bottom-12',
                classNames?.navigation
              )} />
            )}
          </>
        )}
      </Carousel>

      {renderDots()}
    </div>
  )
}
