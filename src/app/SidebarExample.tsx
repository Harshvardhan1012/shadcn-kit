'use client'

import { AlertDialogDemo } from '@/components/Alert/AlertDialog'
import {
  DynamicSidebar,
  SidebarConfig,
} from '@/components/NavSideBar/DynamicSidebar'
import { useAlert } from '@/components/services/AlertService'
import { Input } from '@/components/ui/input'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import {
  BellRing,
  Calendar,
  CheckCircle,
  ClockFading,
  GitPullRequest,
  Home,
  Icon,
  Inbox,
  Settings,
  X,
} from 'lucide-react'
import { useState } from 'react'

interface MainLayoutProps {
  children: React.ReactNode
}

export function SidebarExample({ children }: MainLayoutProps) {
  const [open, setOpen] = useState(false)
  const { showAlert } = useAlert()

  const handleConfirmLogout = () => {
    setOpen(false)
    localStorage.removeItem('token')
    showAlert('default', 'Logged out', 'You have been logged out successfully.')
  }

  const sidebarConfig: SidebarConfig = {
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
    header: [
      {
        id: 'header',
        items: [
          {
            id: 'privacy',
            title: 'Privacy Policy',
            url: '/privacy',
            icon: Settings,
            onClick: () => console.log('Privacy Policy clicked'),
          },
        ],
      },
    ],
    footer: [
      {
        id: 'footer',
        items: [
          {
            id: 'terms',
            title: 'Terms of Service',
            icon: Settings,
            url: '/terms',
            onClick: () => console.log('Terms of Service clicked'),
          },
        ],
      },
    ],
  }

  return (
    <div className="flex h-full w-full rounded-sm">
      <DynamicSidebar config={sidebarConfig} />
      <SidebarInset>
        <nav className="flex items-center justify-between">
          <SidebarTrigger className="mr-2" />
          <div className="ml-auto">
            <Input
              type="text"
              placeholder="Search..."
              className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring"
            />
          </div>
        </nav>
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
