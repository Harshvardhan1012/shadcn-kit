'use client'

const Form = lazy(() =>
  import('@/components').then(module => ({ default: module.Form }))
);
import { AlertDialogDemo } from '@/components/Alert/AlertDialog'
import {
  DynamicSidebar,
  SidebarConfig,
} from '@/components/NavSideBar/DynamicSidebar'
import { useAlert } from '@/components/services/AlertService'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import {
  FormInput,
  Settings, ChartScatter,
  Table,
  ShowerHeadIcon,
  Component
} from 'lucide-react'
import { lazy, useState } from 'react'
import Folazy, rmPage from './form/page'

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
        id: 'Navigation',
        label: 'Navigation',
        items: [
          {
            id: 'Components',
            title: 'Components',
            icon: Component,
            defaultOpen: true,
            badge: 6,
            subItems: [
              {
                id: 'form',
                title: 'Form',
                icon: FormInput,
                component: Form,
                url: '/form',
                badge: 4,
              },
              {
                id: 'charts',
                title: 'Charts',
                icon: ChartScatter,
                url: '/charts',
              },
              {
                id: 'table',
                title: 'Table',
                url: '/table',
                icon: Table,
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
            id: 'JSON',
            icon: ShowerHeadIcon,
            title: 'Application',
            onClick: () => console.log('Application clicked'),
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
            showIf:() => {
              //function that will be return true or false might be async from context 
              return true
            }
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
