import {
  BellRing,
  Calendar,
  CheckCircle,
  ClockFading,
  GitPullRequest,
  Home,
  Inbox,
  LogOut,
  Search,
  Settings,
  X,
} from 'lucide-react'
import { useState } from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { AlertDialogDemo } from './AlertDialog'

// Menu items.
const items = [
  {
    title: 'Home',
    url: '#',
    icon: Home,
  },
  {
    title: 'Inbox',
    url: '#',
    icon: Inbox,
  },
  {
    title: 'Calendar',
    url: '#',
    icon: Calendar,
  },
  {
    title: 'Search',
    url: '#',
    icon: Search,
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
  },
]

const subItems = [
  {
    icon: ClockFading,
    title: 'Pending',
    url: '#',
  },
  {
    icon: CheckCircle,
    title: 'Approved',
    url: '#',
  },
  {
    icon: X,
    title: 'Rejected',
    url: '#',
  },
  {
    icon: BellRing,
    title: 'Incoming',
    url: '#',
  },
]

export function AppSidebar() {
  const [open, setOpen] = useState(false)
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <GitPullRequest /> Requests
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {subItems.map((sub) => (
                    <SidebarMenuSubItem key={sub.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={sub.url}>
                          <sub.icon />
                          <span>{sub.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setOpen(true)}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      {open && (
        <AlertDialogDemo
          onCancel={() => setOpen(false)}
          openState={open}
          title="Logout"
          description="Are you sure you want to logout?"
          cancelText="Cancel"
          confirmText="Logout"
          onConfirm={() => {
            setOpen(false)
            localStorage.removeItem('token')
            window.location.href = '/login'
          }}
        />
      )}
    </Sidebar>
  )
}
