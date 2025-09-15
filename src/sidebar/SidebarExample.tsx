import { AlertDialogDemo } from '@/components/Alert/AlertDialog'
import { DynamicSidebar } from '@/components/NavSideBar/DynamicSidebar'
import { useAlert } from '@/components/services/toastService'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { useState } from 'react'
import { sidebarConfig } from './sidebarConfig'

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
