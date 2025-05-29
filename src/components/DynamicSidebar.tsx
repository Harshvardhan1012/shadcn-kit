'use client'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
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
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import React, { ReactNode, useState } from 'react'
import { SearchForm, SearchResult } from './SearchForm'

// Types for the sidebar items
export interface SidebarSubItem {
  id: string | number
  title: string
  icon?: React.ElementType | React.ReactNode
  url?: string
  onClick?: () => void
  badge?: ReactNode | string | number
  disabled?: boolean
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
  customComponent?: ReactNode
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
  customComponent?: ReactNode
  className?: string
}

export interface SidebarConfig {
  groups: SidebarGroup[]
  header?: ReactNode | SidebarHeaderConfig
  footer?: ReactNode | SidebarFooterConfig
  headerConfig?: SidebarHeaderConfig
  footerConfig?: SidebarFooterConfig
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

const renderHeaderFromConfig = (config: SidebarHeaderConfig) => {
  if (config.customComponent) {
    return config.customComponent
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center flex-col',
        config.className
      )}>
      {config.logo && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {config.logo.iconUrl && (
              <div className="relative h-6 w-6">
                <Image
                  src={config.logo.iconUrl}
                  alt="Logo"
                  fill
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
        </div>
      )}
      {config.user && (
        <div className="flex items-center  rounded-md border p-2 group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:justify-center w-full">
          <div className="relative h-10 w-10 overflow-hidden rounded-full shrink-0">
            {config.user.avatarUrl ? (
              <div className="relative h-full w-full">
                <Image
                  src={config.user.avatarUrl}
                  alt={config.user.name || 'User'}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                {config.user.avatarComponent ? (
                  <config.user.avatarComponent className="h-5 w-5" />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-primary" />
                )}
              </div>
            )}
          </div>
          <div className="space-y-1 group-data-[collapsible=icon]:hidden">
            {config.user.name && (
              <p className="text-sm font-medium leading-none">
                {config.user.name}
              </p>
            )}
            {config.user.email && (
              <p className="text-xs leading-none text-muted-foreground">
                {config.user.email}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Renders footer from JSON configuration
const renderFooterFromConfig = (config: SidebarFooterConfig) => {
  if (config.customComponent) {
    return config.customComponent
  }

  return (
    <div className={cn('flex flex-col gap-2 p-4', config.className)}>
      {config.buttons &&
        config.buttons.map((button) => (
          <Button
            key={button.id}
            variant={button.variant || 'outline'}
            className="w-full group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center"
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
}

export function DynamicSidebar({
  config,
  enableSearch = true,
}: DynamicSidebarProps) {
  const [openItems, setOpenItems] = useState<Record<string | number, boolean>>(
    {}
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  // Function to search through sidebar items
  const searchSidebarItems = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const results: SearchResult[] = []

    // Search through all groups and their items
    config.groups.forEach((group) => {
      group.items.forEach((item) => {
        // Check main item
        if (item.title.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            id: item.id,
            title: item.title,
            groupLabel: group.label,
            path: group.label ? [group.label] : [],
            url: item.url,
          })
        }

        // Check sub items
        if (item.subItems) {
          item.subItems.forEach((subItem) => {
            if (subItem.title.toLowerCase().includes(query.toLowerCase())) {
              results.push({
                id: subItem.id,
                title: subItem.title,
                groupLabel: group.label,
                path: [...(group.label ? [group.label] : []), item.title],
                isSubItem: true,
                url: subItem.url,
              })
            }
          })
        }
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

  const renderIcon = (
    icon: React.ElementType | React.ReactNode | undefined
  ) => {
    if (!icon) return null
    if (React.isValidElement(icon)) return icon
    const IconComponent = icon as React.ElementType
    return <IconComponent />
  }

  const renderMenuItem = (item: SidebarItem) => {
    if (item.subItems && item.subItems.length > 0) {
      return (
        <Collapsible
          key={item.id}
          defaultOpen={item.defaultOpen}
          open={isCollapsibleOpen(item.id, item.defaultOpen)}
          onOpenChange={() => toggleCollapsible(item.id)}
          className="group/collapsible w-full">
          <SidebarMenuItem key={item.id}>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                className="w-full"
                tooltip={item.title}>
                {item.icon && renderIcon(item.icon)}
                <span className="group-data-[collapsible=icon]:hidden">
                  {item.title}
                </span>
                {item.badge && (
                  <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                )}
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.subItems.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.id}>
                    <SidebarMenuSubButton
                      asChild={!!subItem.url}
                      onClick={subItem.onClick}>
                      {subItem.url ? (
                        <a href={subItem.url}>
                          {subItem.icon && renderIcon(subItem.icon)}
                          <span className="group-data-[collapsible=icon]:hidden">
                            {subItem.title}
                          </span>
                          {subItem.badge && (
                            <SidebarMenuBadge>{subItem.badge}</SidebarMenuBadge>
                          )}
                        </a>
                      ) : (
                        <>
                          {subItem.icon && renderIcon(subItem.icon)}
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
            <a href={item.url}>
              {item.icon && renderIcon(item.icon)}
              <span className="group-data-[collapsible=icon]:hidden">
                {item.title}
              </span>
              {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
            </a>
          ) : (
            <>
              {item.icon && renderIcon(item.icon)}
              <span className="group-data-[collapsible=icon]:hidden">
                {item.title}
              </span>
              {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
            </>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <Sidebar
      variant="inset"
      collapsible="icon">
      {/* Render header */}
      {(config.header || config.headerConfig) && (
        <SidebarHeader>
          {typeof config.header === 'object' &&
          !React.isValidElement(config.header)
            ? renderHeaderFromConfig(config.header as SidebarHeaderConfig)
            : config.headerConfig
            ? renderHeaderFromConfig(config.headerConfig)
            : config.header}
        </SidebarHeader>
      )}
      <SidebarContent>
        {' '}
        {enableSearch && (
          <SearchForm
            onSearchAction={(query) => {
              setSearchQuery(query)
              searchSidebarItems(query)
            }}
            results={searchResults}
          />
        )}
        {config.groups.map((group) => (
          <SidebarGroup key={group.id}>
            {group.label && (
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>{group.items.map(renderMenuItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      {/* Render footer */}
      {(config.footer || config.footerConfig) && (
        <SidebarFooter>
          {typeof config.footer === 'object' &&
          !React.isValidElement(config.footer)
            ? renderFooterFromConfig(config.footer as SidebarFooterConfig)
            : config.footerConfig
            ? renderFooterFromConfig(config.footerConfig)
            : config.footer}
        </SidebarFooter>
      )}
      {/* Add the rail for resizing */}
      <SidebarRail />
    </Sidebar>
  )
}
