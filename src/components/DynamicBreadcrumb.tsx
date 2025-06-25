'use client'

import * as React from 'react'
import Link from 'next/link'
import { ChevronRight, Home, MoreHorizontal } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Types for breadcrumb configuration
export interface BreadcrumbItemConfig {
  /**
   * Unique identifier for the breadcrumb item
   */
  id: string | number
  /**
   * Display text for the breadcrumb item
   */
  label: string
  /**
   * URL path for the breadcrumb item
   */
  href?: string
  /**
   * Icon component to display before the label
   */
  icon?: React.ElementType
  /**
   * Whether this item is the current/active page
   */
  isCurrent?: boolean
  /**
   * Custom onClick handler (overrides href navigation)
   */
  onClick?: () => void
  /**
   * Whether this item is disabled
   */
  disabled?: boolean
  /**
   * Additional metadata for the item
   */
  metadata?: Record<string, unknown>
}

export interface DynamicBreadcrumbProps {
  /**
   * Array of breadcrumb items to display
   */
  items: BreadcrumbItemConfig[]
  /**
   * Custom separator component or string
   */
  separator?: React.ReactNode
  /**
   * Maximum number of items to show before collapsing
   */
  maxItems?: number
  /**
   * Whether to show the home icon for the first item
   */
  showHomeIcon?: boolean
  /**
   * Custom home icon component
   */
  homeIcon?: React.ElementType
  /**
   * Whether to collapse items in the middle when maxItems is exceeded
   */
  collapseMode?: 'start' | 'middle' | 'end'
  /**
   * Custom class name for the breadcrumb container
   */
  className?: string
  /**
   * Custom class names for different parts
   */
  classNames?: {
    container?: string
    list?: string
    item?: string
    link?: string
    separator?: string
    current?: string
    dropdown?: string
  }
  /**
   * Loading state
   */
  isLoading?: boolean
  /**
   * Custom loading component
   */
  loadingComponent?: React.ReactNode
  /**
   * Whether to use Next.js Link component
   */
  useNextLink?: boolean
  /**
   * Custom link component
   */
  linkComponent?: React.ComponentType<any>
  /**
   * Custom render function for breadcrumb items
   */
  renderItem?: (
    item: BreadcrumbItemConfig,
    index: number,
    isLast: boolean
  ) => React.ReactNode
  /**
   * Custom render function for collapsed items
   */
  renderCollapsed?: (items: BreadcrumbItemConfig[]) => React.ReactNode
  /**
   * Callback when a breadcrumb item is clicked
   */
  onItemClick?: (item: BreadcrumbItemConfig, index: number) => void
  /**
   * Separator type preset
   */
  separatorType?: 'chevron' | 'slash' | 'dot' | 'custom'
  /**
   * Whether to show icons for all items
   */
  showIcons?: boolean
}

// Default loading skeleton
const BreadcrumbSkeleton = ({ items = 3 }: { items?: number }) => (
  <div className="flex items-center space-x-2">
    {Array.from({ length: items }).map((_, index) => (
      <React.Fragment key={index}>
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
        {index < items - 1 && (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </React.Fragment>
    ))}
  </div>
)

// Separator components
const separatorMap = {
  chevron: <ChevronRight className="h-4 w-4" />,
  slash: <span className="text-muted-foreground">/</span>,
  dot: <span className="text-muted-foreground">•</span>,
}

export function DynamicBreadcrumb({
  items = [],
  separator,
  maxItems = 5,
  showHomeIcon = true,
  homeIcon: HomeIcon = Home,
  collapseMode = 'middle',
  className,
  classNames,
  isLoading = false,
  loadingComponent,
  useNextLink = true,
  linkComponent: CustomLink,
  renderItem,
  renderCollapsed,
  onItemClick,
  separatorType = 'chevron',
  showIcons = false,
}: DynamicBreadcrumbProps) {
  // Handle loading state
  if (isLoading) {
    return (
      <div className={cn('w-full', className, classNames?.container)}>
        {loadingComponent || <BreadcrumbSkeleton items={Math.min(maxItems, 4)} />}
      </div>
    )
  }

  // Handle empty items
  if (!items || items.length === 0) {
    return null
  }

  // Determine which items to show and which to collapse
  const shouldCollapse = items.length > maxItems
  let visibleItems = items
  let collapsedItems: BreadcrumbItemConfig[] = []

  if (shouldCollapse) {
    switch (collapseMode) {
      case 'start':
        collapsedItems = items.slice(0, items.length - maxItems + 1)
        visibleItems = items.slice(items.length - maxItems + 1)
        break
      case 'end':
        visibleItems = items.slice(0, maxItems - 1)
        collapsedItems = items.slice(maxItems - 1)
        break
      case 'middle':
      default:
        const startItems = items.slice(0, 1) // Always show first item
        const endItems = items.slice(-2) // Always show last 2 items
        const middleItems = items.slice(1, -2)
        
        if (middleItems.length > 0) {
          collapsedItems = middleItems
          visibleItems = [...startItems, ...endItems]
        } else {
          visibleItems = items
        }
        break
    }
  }

  // Get separator component
  const getSeparator = () => {
    if (separator) return separator
    if (separatorType === 'custom') return <ChevronRight className="h-4 w-4" />
    return separatorMap[separatorType] || separatorMap.chevron
  }

  // Render individual breadcrumb item
  const renderBreadcrumbItem = (
    item: BreadcrumbItemConfig,
    index: number,
    isLast: boolean
  ) => {
    // Use custom render function if provided
    if (renderItem) {
      return renderItem(item, index, isLast)
    }

    const Icon = item.icon || (index === 0 && showHomeIcon ? HomeIcon : null)
    const LinkComp = CustomLink || (useNextLink ? Link : 'a')

    const handleClick = () => {
      if (onItemClick) {
        onItemClick(item, index)
      }
      if (item.onClick) {
        item.onClick()
      }
    }

    // Render current page (no link)
    if (item.isCurrent || isLast) {
      return (
        <BreadcrumbItem key={item.id} className={classNames?.item}>
          <BreadcrumbPage className={cn(classNames?.current)}>
            <span className="flex items-center gap-2">
              {(showIcons || Icon) && Icon && (
                <Icon className="h-4 w-4" />
              )}
              {item.label}
            </span>
          </BreadcrumbPage>
        </BreadcrumbItem>
      )
    }

    // Render clickable link
    return (
      <BreadcrumbItem key={item.id} className={classNames?.item}>
        <BreadcrumbLink asChild className={classNames?.link}>
          {item.href && !item.onClick ? (
            <LinkComp
              href={item.href}
              onClick={handleClick}
              className={cn(
                item.disabled && 'pointer-events-none opacity-50',
                'flex items-center gap-2'
              )}
            >
              {(showIcons || Icon) && Icon && (
                <Icon className="h-4 w-4" />
              )}
              {item.label}
            </LinkComp>
          ) : (
            <button
              onClick={handleClick}
              disabled={item.disabled}
              className={cn(
                'flex items-center gap-2 text-left',
                item.disabled && 'pointer-events-none opacity-50'
              )}
            >
              {(showIcons || Icon) && Icon && (
                <Icon className="h-4 w-4" />
              )}
              {item.label}
            </button>
          )}
        </BreadcrumbLink>
      </BreadcrumbItem>
    )
  }

  // Render collapsed items dropdown
  const renderCollapsedDropdown = (collapsed: BreadcrumbItemConfig[]) => {
    if (renderCollapsed) {
      return renderCollapsed(collapsed)
    }

    return (
      <BreadcrumbItem>
        <DropdownMenu>
          <DropdownMenuTrigger 
            className={cn(
              "flex h-9 w-9 items-center justify-center",
              classNames?.dropdown
            )}
          >
            <BreadcrumbEllipsis className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {collapsed.map((item) => {
              const Icon = item.icon
              return (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => {
                    if (onItemClick) {
                      onItemClick(item, items.indexOf(item))
                    }
                    if (item.onClick) {
                      item.onClick()
                    } else if (item.href) {
                      window.location.href = item.href
                    }
                  }}
                  disabled={item.disabled}
                >
                  <span className="flex items-center gap-2">
                    {Icon && <Icon className="h-4 w-4" />}
                    {item.label}
                  </span>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </BreadcrumbItem>
    )
  }

  return (
    <Breadcrumb className={cn(className, classNames?.container)}>
      <BreadcrumbList className={classNames?.list}>
        {shouldCollapse && collapseMode === 'middle' && collapsedItems.length > 0 ? (
          <>
            {/* First item */}
            {renderBreadcrumbItem(visibleItems[0], 0, visibleItems.length === 1)}
            <BreadcrumbSeparator className={classNames?.separator}>
              {getSeparator()}
            </BreadcrumbSeparator>
            
            {/* Collapsed items dropdown */}
            {renderCollapsedDropdown(collapsedItems)}
            <BreadcrumbSeparator className={classNames?.separator}>
              {getSeparator()}
            </BreadcrumbSeparator>
            
            {/* Last items */}
            {visibleItems.slice(1).map((item, index) => (
              <React.Fragment key={item.id}>
                {renderBreadcrumbItem(
                  item,
                  items.indexOf(item),
                  index === visibleItems.slice(1).length - 1
                )}
                {index < visibleItems.slice(1).length - 1 && (
                  <BreadcrumbSeparator className={classNames?.separator}>
                    {getSeparator()}
                  </BreadcrumbSeparator>
                )}
              </React.Fragment>
            ))}
          </>
        ) : (
          // Regular rendering or other collapse modes
          <>
            {shouldCollapse && collapseMode === 'start' && collapsedItems.length > 0 && (
              <>
                {renderCollapsedDropdown(collapsedItems)}
                <BreadcrumbSeparator className={classNames?.separator}>
                  {getSeparator()}
                </BreadcrumbSeparator>
              </>
            )}
            
            {visibleItems.map((item, index) => (
              <React.Fragment key={item.id}>
                {renderBreadcrumbItem(
                  item,
                  shouldCollapse && collapseMode === 'start' 
                    ? collapsedItems.length + index 
                    : items.indexOf(item),
                  index === visibleItems.length - 1
                )}
                {index < visibleItems.length - 1 && (
                  <BreadcrumbSeparator className={classNames?.separator}>
                    {getSeparator()}
                  </BreadcrumbSeparator>
                )}
              </React.Fragment>
            ))}
            
            {shouldCollapse && collapseMode === 'end' && collapsedItems.length > 0 && (
              <>
                <BreadcrumbSeparator className={classNames?.separator}>
                  {getSeparator()}
                </BreadcrumbSeparator>
                {renderCollapsedDropdown(collapsedItems)}
              </>
            )}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
