'use client'
import { cn } from './../lib/utils'
import { Button } from './../ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './../ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from './../ui/sidebar'
import { Skeleton } from './../ui/skeleton'
import  Link  from 'next/link'
import React, { ReactNode, useState } from 'react'
import { SearchResult, SearchWrapper } from './search-wrapper'

// Types for the sidebar items
export interface SidebarSubItem {
  id: string | number
  title: string
  icon?: React.ElementType | React.ReactNode
  url?: string
  onClick?: () => void
  badge?: ReactNode | string | number
  disabled?: boolean
  showIf?: boolean | (() => boolean)
}

export interface SidebarItem {
  id: string | number
  title: string
  icon?: React.ElementType | React.ReactNode
  url?: string
  onClick?: () => void
  badge?: ReactNode | string | number
  subItems?: SidebarSubItem[]
  disabled?: boolean
  defaultOpen?: boolean
  showIf?: boolean | (() => boolean)
}

export interface SidebarGroup {
  id: string | number
  label?: string
  items: SidebarItem[]
}

export interface SidebarHeaderConfig {
  logo?: {
    text?: string
    iconUrl?: string
    iconComponent?: React.ElementType
  }
  user?: {
    name?: string
    email?: string
    avatarUrl?: string
    avatarComponent?: React.ElementType
  }
  className?: string
}

export interface SidebarFooterConfig {
  buttons?: Array<{
    id: string | number
    label: string
    icon?: React.ElementType
    onClick?: () => void
    variant?:
      | 'default'
      | 'destructive'
      | 'outline'
      | 'secondary'
      | 'ghost'
      | 'link'
  }>
  className?: string
}

export interface SidebarConfig {
  groups: SidebarGroup[]
  header?: ReactNode | SidebarHeaderConfig | SidebarGroup[]
  footer?: ReactNode | SidebarFooterConfig | SidebarGroup[]
}

// Badge component to show on sidebar menu items
const SidebarMenuBadge = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => (
  <span
    className={cn(
      'ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-medium text-primary-foreground',
      className
    )}>
    {children}
  </span>
)

const SidebarLoadingSkeleton = () => (
  <div className="space-y-6 p-4">
    {/* Header Skeleton */}
    <div className="flex flex-col items-center gap-4">
      <Skeleton className="h-8 w-24 rounded" />
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-3 w-24 rounded" />
      </div>
    </div>

    {/* Search Skeleton */}
    <Skeleton className="h-9 w-full rounded" />

    {/* Menu Groups Skeleton */}
    <div className="space-y-8">
      {[1, 2, 3].map((group) => (
        <div
          key={group}
          className="space-y-3">
          <Skeleton className="h-4 w-24 rounded" />
          <div className="space-y-2 ml-2">
            {[1, 2].map((item) => (
              <Skeleton
                key={item}
                className="h-8 w-full rounded"
              />
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Footer Skeleton */}
    <div className="space-y-2">
      <Skeleton className="h-9 w-full rounded" />
      <Skeleton className="h-9 w-full rounded" />
    </div>
  </div>
)

// Helper function to evaluate showIf condition
const shouldShow = (showIf?: boolean | (() => boolean)): boolean => {
  if (showIf === undefined) return true
  if (typeof showIf === 'boolean') return showIf
  if (typeof showIf === 'function') return showIf()
  return true
}

const renderHeaderAndFooter = (
  header: ReactNode | SidebarHeaderConfig | SidebarGroup[],
  isHeader: boolean = true
) => {
  if (React.isValidElement(header)) {
    return header
  }

  if (Array.isArray(header)) {
    return renderGroups(header)
  }
  if (isHeader) return renderHeaderFromConfig(header as SidebarHeaderConfig)
  return renderFooterFromConfig(header as SidebarFooterConfig)
}

const renderIcon = (icon?: React.ElementType | React.ReactNode) => {
  if (!icon) return null
  if (React.isValidElement(icon)) return icon
  const IconComponent = icon as React.ElementType
  return <IconComponent className="h-4 w-4" />
}

const renderGroups = (groups: SidebarGroup[]) => (
  <>
    {groups &&
      groups.length > 0 &&
      groups.map((group) => (
        <SidebarGroup
          key={group.id}
          className="p-0">
          {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items
                .filter((item) => shouldShow(item.showIf))
                .map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild={!!item.url}
                      onClick={item.onClick}
                      tooltip={item.title}
                      disabled={item.disabled}>
                      {item.url ? (
                        <Link href={item.url}>
                          {item.icon && renderIcon(item.icon)}
                          <span className="group-data-[collapsible=icon]:hidden">
                            {item.title}
                          </span>
                          {item.badge && (
                            <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                          )}
                        </Link>
                      ) : (
                        <>
                          {item.icon && renderIcon(item.icon)}
                          <span className="group-data-[collapsible=icon]:hidden">
                            {item.title}
                          </span>
                          {item.badge && (
                            <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                          )}
                        </>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
  </>
)

const renderHeaderFromConfig = (config: SidebarHeaderConfig) => {
  return (
    <div className={cn('flex flex-col items-center', config.className)}>
      {config.logo && (
        <div className="flex items-center gap-2">
          {config.logo.iconUrl && (
            <div className="relative h-6 w-6">
              <img
                src={config.logo.iconUrl}
                alt="Logo"
                className="object-contain"
              />
            </div>
          )}
          {config.logo.iconComponent && (
            <config.logo.iconComponent className="h-6 w-6" />
          )}
          {config.logo.text && (
            <span className="font-bold text-xl group-data-[collapsible=icon]:hidden">
              {config.logo.text}
            </span>
          )}
        </div>
      )}

      {config.user && (
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="relative h-10 w-10 rounded-full overflow-hidden">
            {config.user.avatarUrl ? (
              <img
                src={config.user.avatarUrl}
                alt={config.user.name || 'User'}
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                {config.user.avatarComponent ? (
                  <config.user.avatarComponent className="h-5 w-5" />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-primary" />
                )}
              </div>
            )}
          </div>
          <div className="text-center group-data-[collapsible=icon]:hidden">
            {config.user.name && (
              <p className="text-sm font-medium">{config.user.name}</p>
            )}
            {config.user.email && (
              <p className="text-xs text-muted-foreground">
                {config.user.email}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const renderFooterFromConfig = (config: SidebarFooterConfig) => {
  return (
    <div className={cn(config.className)}>
      {config.buttons?.map((button) => (
        <Button
          key={button.id}
          variant={button.variant || 'outline'}
          className="w-full group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:p-2"
          onClick={button.onClick}>
          {button.icon && (
            <button.icon className="mr-2 h-4 w-4 group-data-[collapsible=icon]:mr-0" />
          )}
          <span className="group-data-[collapsible=icon]:hidden">
            {button.label}
          </span>
        </Button>
      ))}
    </div>
  )
}

interface DynamicSidebarProps {
  config: SidebarConfig
  enableSearch?: boolean
  isLoading?: boolean
}

export function DynamicSidebar({
  config,
  enableSearch = true,
  isLoading = false,
}: DynamicSidebarProps) {
  const [openItems, setOpenItems] = useState<Record<string | number, boolean>>(
    {}
  )
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const { state } = useSidebar()

  const searchSidebarItems = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const results: SearchResult[] = []

    config.groups.forEach((group) => {
      group.items
        .filter((item) => shouldShow(item.showIf))
        .forEach((item) => {
          if (item.title.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              id: item.id,
              title: item.title,
              groupLabel: group.label,
              path: group.label ? [group.label] : [],
              url: item.url,
              icon: item.icon,
            })
          }

          item.subItems
            ?.filter((subItem) => shouldShow(subItem.showIf))
            .forEach((subItem) => {
              if (subItem.title.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                  id: subItem.id,
                  title: subItem.title,
                  groupLabel: group.label,
                  path: [...(group.label ? [group.label] : []), item.title],
                  isSubItem: true,
                  url: subItem.url,
                  icon: subItem.icon,
                })
              }
            })
        })
    })

    setSearchResults(results)
  }

  const toggleCollapsible = (id: string | number) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const isCollapsibleOpen = (id: string | number, defaultOpen?: boolean) => {
    return openItems[id] === undefined ? !!defaultOpen : openItems[id]
  }

  const renderMenuItem = (item: SidebarItem) => {
    // Filter visible sub-items
    const visibleSubItems = item.subItems?.filter((subItem) =>
      shouldShow(subItem.showIf)
    )

    const menuButtonContent = (
      <>
        {item.icon && renderIcon(item.icon)}
        <span className="group-data-[collapsible=icon]:hidden">
          {item.title}
        </span>
        {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
      </>
    )

    if (visibleSubItems?.length) {
      return (
        <Collapsible
          key={item.id}
          defaultOpen={item.defaultOpen}
          open={isCollapsibleOpen(item.id, item.defaultOpen)}
          onOpenChange={() => toggleCollapsible(item.id)}
          className="w-full">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={item.title}>
                {menuButtonContent}
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {visibleSubItems.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.id}>
                    <SidebarMenuSubButton
                      asChild={!!subItem.url}
                      onClick={subItem.onClick}>
                      {subItem.url ? (
                        <a href={subItem.url}>
                          {renderIcon(subItem.icon)}
                          <span className="group-data-[collapsible=icon]:hidden">
                            {subItem.title}
                          </span>
                          {subItem.badge && (
                            <SidebarMenuBadge>{subItem.badge}</SidebarMenuBadge>
                          )}
                        </a>
                      ) : (
                        <>
                          {renderIcon(subItem.icon)}
                          <span className="group-data-[collapsible=icon]:hidden">
                            {subItem.title}
                          </span>
                          {subItem.badge && (
                            <SidebarMenuBadge>{subItem.badge}</SidebarMenuBadge>
                          )}
                        </>
                      )}
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      )
    }

    return (
      <SidebarMenuItem key={item.id}>
        <SidebarMenuButton
          asChild={!!item.url}
          onClick={item.onClick}
          tooltip={item.title}>
          {item.url ? (
            <a href={item.url}>{menuButtonContent}</a>
          ) : (
            menuButtonContent
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  if (isLoading) {
    return (
      <Sidebar
        variant="inset"
        collapsible="icon">
        <SidebarLoadingSkeleton />
      </Sidebar>
    )
  }

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="sidebar-fixed-bg">
      {/* Header */}
      {config.header && (
        <SidebarHeader>{renderHeaderAndFooter(config.header)}</SidebarHeader>
      )}

      {/* Content */}
      <SidebarContent>
        {enableSearch && state === 'expanded' && (
          <SearchWrapper
            onSearch={searchSidebarItems}
            searchResults={searchResults}
            className="w-full"
          />
        )}

        {config.groups.map((group) => (
          <SidebarGroup key={group.id}>
            {group.label && (
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items
                  .filter((item) => shouldShow(item.showIf))
                  .map(renderMenuItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      {config.footer && (
        <SidebarFooter>
          {renderHeaderAndFooter(config.footer, false)}
        </SidebarFooter>
      )}

      <SidebarRail />
    </Sidebar>
  )
}
