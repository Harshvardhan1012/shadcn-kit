'use client'

import { useAlert } from '@/app/services/AlertService'
import { AlertDialogDemo } from '@/components/AlertDialog'
import { DynamicSidebar, SidebarConfig } from '@/components/DynamicSidebar'
import { Input } from '@/components/ui/input'
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
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface MainLayoutProps {
  children: React.ReactNode
}

export function SidebarExample({ children }: MainLayoutProps) {
  const [open, setOpen] = useState(false)
  const { showAlert } = useAlert()
  const pathname = usePathname()

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

  // Helper to generate breadcrumb from current path and sidebar config
  function getBreadcrumb() {
    // Flatten all sidebar items and subitems with their paths
    const items: Array<{ title: string; url?: string }> = []
    sidebarConfig.groups.forEach((group) => {
      group.items.forEach((item) => {
        items.push({ title: item.title, url: item.url })
        if (item.subItems) {
          item.subItems.forEach((sub) => {
            items.push({ title: sub.title, url: sub.url })
          })
        }
      })
    })
    // Find the breadcrumb path
    const segments = pathname.split('/').filter(Boolean)
    let currentUrl = ''
    const breadcrumb: Array<{ title: string; url?: string }> = []
    segments.forEach((seg) => {
      currentUrl += '/' + seg
      const match = items.find((i) => i.url === currentUrl)
      if (match) breadcrumb.push(match)
    })
    // Always add Home at the start
    return [
      { title: 'Home', url: '/' },
      ...breadcrumb.filter((b) => b.url !== '/'),
    ]
  }

  const breadcrumb = getBreadcrumb()

  return (
    <div className="flex h-full w-full rounded-sm">
      <DynamicSidebar config={sidebarConfig} />
      <SidebarInset>
        
      <nav className='flex  p-3 items-center justify-between'>
      <SidebarTrigger className="mr-2" />
          <div className="flex-1 flex items-center min-w-0">
            <nav className="flex items-center text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
              {breadcrumb.map((b, i) => (
                <span
                  key={b.url || b.title}
                  className="flex items-center">
                  {i > 0 && <span className="mx-2">/</span>}
                  {b.url && i !== breadcrumb.length - 1 ? (
                    <Link
                      href={b.url}
                      className="hover:underline text-gray-700">
                      {b.title}
                    </Link>
                  ) : (
                    <span className="text-gray-900 font-medium">{b.title}</span>
                  )}
                </span>
              ))}
            </nav>
          </div>
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
