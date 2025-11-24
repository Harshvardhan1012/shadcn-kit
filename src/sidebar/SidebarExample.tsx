import { AlertDialogDemo } from '@/components/Alert/AlertDialog'
import { DynamicSidebar } from '@/components/NavSideBar/DynamicSidebar'
import { useAlert } from '@/components/services/toastService'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sidebarConfig } from './sidebarConfig'
import { AuthContext } from '@/context/AuthContext'

interface MainLayoutProps {
  children: React.ReactNode
}

export function SidebarExample({ children }: MainLayoutProps) {
  const [open, setOpen] = useState(false)
  const { loading } = useContext(AuthContext)
  const { showAlert } = useAlert()
  const navigate = useNavigate()

  const handleConfirmLogout = () => {
    setOpen(false)
    localStorage.removeItem('token')
    showAlert('default', 'Logged out', 'You have been logged out successfully.')
  }

  return (
    <div className="flex h-full w-full">
      <DynamicSidebar
        isLoading={loading}
        config={sidebarConfig}
      />
      <SidebarInset className="flex-1 overflow-auto !m-0 !p-0 !rounded-none !shadow-none">
        <nav className="flex items-center justify-between sticky top-0 z-10 bg-background border-b px-4 py-2">
          <SidebarTrigger className="mr-2" />
        </nav>
        <div className="flex-1">{children}</div>
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
