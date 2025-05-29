'use client'

import { useAlert } from '@/app/services/AlertService'
import { AlertDialogDemo } from '@/components/AlertDialog'
import { DynamicSidebar, SidebarConfig } from '@/components/DynamicSidebar'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import {
  BellRing,
  Calendar,
  CheckCircle,
  ClockFading,
  GitPullRequest,
  Home,
  Inbox,
  LogOut,
  Settings,
  User,
  X,
} from 'lucide-react'
import { useState } from 'react'

interface MainLayoutProps {
  children: React.ReactNode
}

export function SidebarExample({ children }: MainLayoutProps) {
  const [open, setOpen] = useState(false)
  const { showAlert } = useAlert()

  const handleLogout = () => {
    setOpen(true)
  }

  const handleConfirmLogout = () => {
    setOpen(false)
    localStorage.removeItem('token')
    showAlert('default', 'Logged out', 'You have been logged out successfully.')
  }

  const headerConfig = {
    logo: {
      text: 'MyApp',
    },
    user: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatarComponent: User,
    },
  }

  const footerConfig = {
    buttons: [
      {
        id: 'logout',
        label: 'Logout',
        icon: LogOut,
        variant: 'outline' as const,
        onClick: handleLogout,
      },
    ],
    className: 'p-0 m-0',
  }

  const sidebarConfig: SidebarConfig = {
    headerConfig: headerConfig,
    footerConfig: footerConfig,
    groups: [
      {
        id: 'main',
        label: 'Navigation',
        items: [
          {
            id: 'home',
            title: 'Home',
            icon: Home,
            url: '/',
          },
          {
            id: 'inbox',
            title: 'Inbox',
            icon: Inbox,
            url: '/inbox',
            badge: 3,
          },
          {
            id: 'calendar',
            title: 'Calendar',
            icon: Calendar,
            url: '/calendar',
          },
        ],
      },
      {
        id: 'features',
        label: 'Features',
        items: [
          {
            id: 'requests',
            title: 'Requests',
            icon: GitPullRequest,
            defaultOpen: true,
            badge: 6,
            subItems: [
              {
                id: 'pending',
                title: 'Pending',
                icon: ClockFading,
                url: '/requests/pending',
                badge: 4,
              },
              {
                id: 'approved',
                title: 'Approved',
                icon: CheckCircle,
                url: '/requests/approved',
              },
              {
                id: 'rejected',
                title: 'Rejected',
                icon: X,
                url: '/requests/rejected',
              },
              {
                id: 'incoming',
                title: 'Incoming',
                icon: BellRing,
                url: '/requests/incoming',
                badge: 2,
              },
            ],
          },
          {
            id: 'settings',
            title: 'Settings',
            icon: Settings,
            url: '/settings',
          },
        ],
      },
    ],
  }
  return (
    <div className="flex h-full w-full rounded-sm">
      <DynamicSidebar config={sidebarConfig} />
      <SidebarInset className="p-6 bg-background">
        <SidebarTrigger />
        <div>{children}</div>
      </SidebarInset>
      {open && (
        <AlertDialogDemo
          onCancel={() => setOpen(false)}
          openState={open}
          title="Logout"
          description="Are you sure you want to logout?"
          cancelText="Cancel"
          confirmText="Logout"
          onConfirm={handleConfirmLogout}
        />
      )}
    </div>
  )
}
