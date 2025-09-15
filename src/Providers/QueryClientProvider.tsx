import { useApiNotification } from '@/components/api/apiHandler'
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
export const QueryClientWrapper = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { handleError, handleSuccess } = useApiNotification()

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          if (error && typeof error === 'object' && 'response' in error) {
            const status = (error as any).response?.status
            if (status >= 400 && status < 500) {
              return false
            }
          }
          return failureCount < 3
        },
      },
      mutations: {
        retry: false,
      },
    },
    mutationCache: new MutationCache({
      onSuccess: (data: any) => {
        console.log('Mutation Success:', data)
        handleSuccess(data)
      },
      onError: (error) => {
        console.error('Mutation Error:', error)
        handleError(error)
      },
    }),
    queryCache: new QueryCache({
      onError: (error) => {
        console.error('Query Error:', error)
        handleError(error)
      },
    }),
  })

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
