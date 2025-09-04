'use client'

import { SidebarProvider } from './../ui/sidebar'
import { ReactNode } from 'react'

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
