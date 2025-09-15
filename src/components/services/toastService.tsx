import { createContext, useContext, type ReactNode } from 'react'
import { toast } from 'sonner'

type AlertType = 'default' | 'destructive'

interface AlertState {
  id: number
  type: AlertType
  title: string
  description: string
}

interface AlertContextProps {
  showAlert: (type: AlertType, title: string, description: string) => void
  showSuccess: (title: string, description?: string) => void
  showError: (title: string, description?: string) => void
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined)

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const showAlert = (type: AlertType, title: string, description: string) => {
    if (type === 'destructive') {
      toast.error(title, {
        description,
        style: {
          '--normal-bg': 'var(--background)',
          '--normal-text':
            'light-dark(var(--color-red-600), var(--color-red-400))',
          '--normal-border':
            'light-dark(var(--color-red-600), var(--color-red-400))',
        } as React.CSSProperties,
      })
    } else {
      toast.success(title, {
        description,
        style: {
          '--normal-bg': 'var(--background)',
          '--normal-text':
            'light-dark(var(--color-green-600), var(--color-green-400))',
          '--normal-border':
            'light-dark(var(--color-green-600), var(--color-green-400))',
        } as React.CSSProperties,
      })
    }
  }

  const showSuccess = (title: string, description?: string) => {
    toast.success(title, {
      description,
      style: {
        '--normal-bg': 'var(--background)',
        '--normal-text':
          'light-dark(var(--color-green-600), var(--color-green-400))',
        '--normal-border':
          'light-dark(var(--color-green-600), var(--color-green-400))',
      } as React.CSSProperties,
    })
  }

  const showError = (title: string, description?: string) => {
    toast.error(title, {
      description,
      style: {
        '--normal-bg': 'var(--background)',
        '--normal-text':
          'light-dark(var(--color-red-600), var(--color-red-400))',
        '--normal-border':
          'light-dark(var(--color-red-600), var(--color-red-400))',
      } as React.CSSProperties,
    })
  }

  return (
    <AlertContext.Provider value={{ showAlert, showSuccess, showError }}>
      {children}
    </AlertContext.Provider>
  )
}

export const useAlert = () => {
  const context = useContext(AlertContext)
  if (!context) throw new Error('useAlert must be used within AlertProvider')
  return context
}

// Preserve the AlertState type for backwards compatibility
export type { AlertState, AlertType }
