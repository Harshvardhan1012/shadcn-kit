import { SidebarProvider } from './../ui/sidebar'
import { type ReactNode } from 'react'

interface ClientSidebarProviderProps {
  defaultOpen?: boolean
  children: ReactNode
}

export function ClientSidebarProvider({
  defaultOpen = true,
  children,
}: ClientSidebarProviderProps) {
  return <SidebarProvider defaultOpen={defaultOpen}>{children}</SidebarProvider>
}
