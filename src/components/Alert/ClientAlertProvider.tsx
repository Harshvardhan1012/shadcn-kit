'use client'

import { AlertProvider as OriginalAlertProvider } from '@/app/services/AlertService'
import { ReactNode } from 'react'

export function ClientAlertProvider({ children }: { children: ReactNode }) {
  return <OriginalAlertProvider>{children}</OriginalAlertProvider>
}
