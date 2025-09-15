import {
    useInfiniteQuery,
    useMutation,
    useQueries,
    useQuery,
    useQueryClient,
    type MutationFunction,
    type QueryFunction,
    type QueryKey,
    type UseInfiniteQueryOptions,
    type UseMutationOptions,
    type UseQueryOptions,
} from "@tanstack/react-query"
import API, { type ApiCallOptions } from "./apiClient"

// Generic reusable useQuery hook
export function useGenericQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey,
    queryFn,
    ...options,
  })
}

// Generic reusable useQueries function
export function useGenericQueries<TData = unknown, TError = Error>(
  queries: Array<{
    queryKey: unknown[]
    queryFn: () => Promise<TData>
    options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">
  }>
) {
  return useQueries({
    queries: queries.map(({ queryKey, queryFn, options = {} }) => ({
      queryKey,
      queryFn,
      ...options,
    })),
  })
}
// Generic reusable useInfiniteQuery hook
export function useGenericInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = number
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey, TPageParam>,
  options: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>,
    "queryKey" | "queryFn"
  >
) {
  return useInfiniteQuery({
    queryKey,
    queryFn,
    ...options,
  })
}

// Generic reusable useMutation hook
export function useGenericMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationFn: MutationFunction<TData, TVariables>,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    "mutationFn"
  >
) {
  return useMutation({
    mutationFn,
    ...options,
  })
}

// Generic reusable mutation hook with mutation key
export function useGenericMutationWithKey<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationKey: readonly string[],
  mutationFn: MutationFunction<TData, TVariables>,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    "mutationKey" | "mutationFn"
  >
) {
  return useMutation({
    mutationKey,
    mutationFn,
    ...options,
  })
}

// Factory function for creating typed mutation hooks
export function createGenericMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationFn: MutationFunction<TData, TVariables>,
  defaultOptions?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    "mutationFn"
  >
) {
  return (
    options?: Omit<
      UseMutationOptions<TData, TError, TVariables, TContext>,
      "mutationFn"
    >
  ) => {
    return useMutation({
      mutationFn,
      ...defaultOptions,
      ...options,
    })
  }
}

// Generic hook for multiple mutations (similar to useQueries but for mutations)
export function useGenericMutations<TData = unknown, TError = unknown>(
  mutations: Array<{
    mutationKey?: readonly string[]
    mutationFn: MutationFunction<TData, any>
    options?: Omit<
      UseMutationOptions<TData, TError, any, unknown>,
      "mutationKey" | "mutationFn"
    >
  }>
) {
  return mutations.map(({ mutationKey, mutationFn, options = {} }) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useMutation({
      ...(mutationKey && { mutationKey }),
      mutationFn,
      ...options,
    })
  )
}

// ============================================================================
// API Client Integrated Hooks
// ============================================================================

// API-integrated useQuery hook
export function useApiQuery<TData = unknown, TError = unknown>(
  queryKey: QueryKey,
  apiOptions: Omit<ApiCallOptions, "method"> & { method?: "GET" },
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await API.get<TData>(apiOptions.url, apiOptions)
      return response.data
    },
    ...options,
  })
}

// API-integrated useQueries hook
export function useApiQueries<TData = unknown, TError = unknown>(
  queries: Array<{
    queryKey: QueryKey
    apiOptions: Omit<ApiCallOptions, "method"> & { method?: "GET" }
    options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">
  }>
) {
  return useQueries({
    queries: queries.map(({ queryKey, apiOptions, options = {} }) => ({
      queryKey,
      queryFn: async () => {
        const response = await API.get<TData>(apiOptions.url, apiOptions)
        return response.data
      },
      ...options,
    })),
  })
}

// API-integrated useInfiniteQuery hook
export function useApiInfiniteQuery<TData = unknown, TError = unknown>(
  queryKey: QueryKey,
  apiOptions: Omit<ApiCallOptions, "method"> & { method?: "GET" },
  options: Omit<
    UseInfiniteQueryOptions<TData, TError>,
    "queryKey" | "queryFn"
  > & {
    getNextPageParam: (lastPage: TData, allPages: TData[]) => unknown
  }
) {
  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await API.get<TData>(apiOptions.url, {
        ...apiOptions,
        params: {
          ...apiOptions.params,
          page: pageParam,
        },
      })
      return response.data
    },
    ...options,
  })
}

// API-integrated useMutation hook for POST requests
export function useApiMutation<
  TData = unknown,
  TError = unknown,
  TVariables = unknown
>(
  apiOptions: Omit<ApiCallOptions, "data">,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">
) {
  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const { method = "POST", url, ...restOptions } = apiOptions

      let response
      switch (method.toUpperCase()) {
        case "POST":
          response = await API.post<TData>(url, variables, restOptions)
          break
        case "PUT":
          response = await API.put<TData>(url, variables, restOptions)
          break
        case "PATCH":
          response = await API.patch<TData>(url, variables, restOptions)
          break
        case "DELETE":
          response = await API.delete<TData>(url, restOptions)
          break
        default:
          throw new Error(`Unsupported method: ${method}`)
      }

      return response.data
    },
    ...options,
  })
}

// API-integrated hook for multiple mutations
export function useApiMutations<TData = unknown, TError = unknown>(
  mutations: Array<{
    mutationKey?: readonly string[]
    apiOptions: Omit<ApiCallOptions, "data">
    options?: Omit<
      UseMutationOptions<TData, TError, any, unknown>,
      "mutationKey" | "mutationFn"
    >
  }>
) {
  return mutations.map(({ mutationKey, apiOptions, options = {} }) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useMutation({
      ...(mutationKey && { mutationKey }),
      mutationFn: async (variables: any) => {
        const { method = "POST", url, ...restOptions } = apiOptions

        let response
        switch (method.toUpperCase()) {
          case "POST":
            response = await API.post<TData>(url, variables, restOptions)
            break
          case "PUT":
            response = await API.put<TData>(url, variables, restOptions)
            break
          case "PATCH":
            response = await API.patch<TData>(url, variables, restOptions)
            break
          case "DELETE":
            response = await API.delete<TData>(url, restOptions)
            break
          default:
            throw new Error(`Unsupported method: ${method}`)
        }

        return response.data
      },
      ...options,
    })
  )
}

// Convenience hooks for specific HTTP methods
export function useApiGet<TData = unknown, TError = unknown>(
  queryKey: QueryKey,
  url: string,
  apiOptions?: Omit<ApiCallOptions, "url" | "method">,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">
) {
  return useApiQuery<TData, TError>(
    queryKey,
    { url, method: "GET", ...apiOptions },
    options
  )
}

export function useApiPost<
  TData = unknown,
  TError = unknown,
  TVariables = unknown
>(
  url: string,
  invalidateKeys?: QueryKey | QueryKey[],
  apiOptions?: Omit<ApiCallOptions, "url" | "method" | "data">,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">
) {
  const queryClient = useQueryClient()

  return useApiMutation<TData, TError, TVariables>(
    { url, method: "POST", ...apiOptions },
    {
      ...options,
      onSuccess: (data, variables, context) => {
        // Auto-invalidate specified query keys
        if (invalidateKeys) {
          if (Array.isArray(invalidateKeys[0])) {
            // Multiple query keys
            ;(invalidateKeys as QueryKey[]).forEach((key) => {
              queryClient.invalidateQueries({ queryKey: key })
            })
          } else {
            // Single query key
            queryClient.invalidateQueries({
              queryKey: invalidateKeys as QueryKey,
            })
          }
        }

        // Call user's onSuccess if provided
        options?.onSuccess?.(data, variables, context)
      },
    }
  )
}

export function useApiPut<
  TData = unknown,
  TError = unknown,
  TVariables = unknown
>(
  url: string,
  invalidateKeys?: QueryKey | QueryKey[], // Keys to invalidate on success
  apiOptions?: Omit<ApiCallOptions, "url" | "method" | "data">,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">
) {
  const queryClient = useQueryClient()

  return useApiMutation<TData, TError, TVariables>(
    { url, method: "PUT", ...apiOptions },
    {
      ...options,
      onSuccess: (data, variables, context) => {
        // Auto-invalidate specified query keys
        if (invalidateKeys) {
          if (Array.isArray(invalidateKeys[0])) {
            // Multiple query keys
            ;(invalidateKeys as QueryKey[]).forEach((key) => {
              queryClient.invalidateQueries({ queryKey: key })
            })
          } else {
            // Single query key
            queryClient.invalidateQueries({
              queryKey: invalidateKeys as QueryKey,
            })
          }
        }

        // Call user's onSuccess if provided
        options?.onSuccess?.(data, variables, context)
      },
    }
  )
}

export function useApiPatch<
  TData = unknown,
  TError = unknown,
  TVariables = unknown
>(
  url: string,
  invalidateKeys?: QueryKey | QueryKey[], // Keys to invalidate on success
  apiOptions?: Omit<ApiCallOptions, "url" | "method" | "data">,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">
) {
  const queryClient = useQueryClient()

  return useApiMutation<TData, TError, TVariables>(
    { url, method: "PATCH", ...apiOptions },
    {
      ...options,
      onSuccess: (data, variables, context) => {
        // Auto-invalidate specified query keys
        if (invalidateKeys) {
          if (Array.isArray(invalidateKeys[0])) {
            // Multiple query keys
            ;(invalidateKeys as QueryKey[]).forEach((key) => {
              queryClient.invalidateQueries({ queryKey: key })
            })
          } else {
            // Single query key
            queryClient.invalidateQueries({
              queryKey: invalidateKeys as QueryKey,
            })
          }
        }

        // Call user's onSuccess if provided
        options?.onSuccess?.(data, variables, context)
      },
    }
  )
}

export function useApiDelete<TData = unknown, TError = unknown>(
  url: string,
  invalidateKeys?: QueryKey | QueryKey[], // Keys to invalidate on success
  apiOptions?: Omit<ApiCallOptions, "url" | "method" | "data">,
  options?: Omit<UseMutationOptions<TData, TError, void>, "mutationFn">
) {
  const queryClient = useQueryClient()

  return useApiMutation<TData, TError, void>(
    { url, method: "DELETE", ...apiOptions },
    {
      ...options,
      onSuccess: (data, variables, context) => {
        // Auto-invalidate specified query keys
        if (invalidateKeys) {
          if (Array.isArray(invalidateKeys[0])) {
            // Multiple query keys
            ;(invalidateKeys as QueryKey[]).forEach((key) => {
              queryClient.invalidateQueries({ queryKey: key })
            })
          } else {
            // Single query key
            queryClient.invalidateQueries({
              queryKey: invalidateKeys as QueryKey,
            })
          }
        }

        // Call user's onSuccess if provided
        options?.onSuccess?.(data, variables, context)
      },
    }
  )
}

/**
 * Usage Examples:
 *
 * // Basic GET request
 * const { data, isLoading, error } = useApiGet(['users'], '/api/users')
 *
 * // GET with params
 * const { data } = useApiGet(
 *   ['users', 'filtered'],
 *   '/api/users',
 *   { params: { status: 'active', page: 1 } }
 * )
 *
 * // POST mutation with auto-invalidation
 * const createUser = useApiPost(
 *   '/api/users',
 *   {},
 *   {
 *     onSuccess: (data) => console.log('User created:', data),
 *     onError: (error) => console.error('Error:', error)
 *   },
 *   ['users'] // Invalidate users list after successful creation
 * )
 *
 * // PUT mutation with multiple invalidations
 * const updateUser = useApiPut(
 *   '/api/users/123',
 *   {},
 *   {
 *     onSuccess: (data) => console.log('User updated:', data),
 *   },
 *   [['users'], ['users', 'detail', 123]] // Invalidate both users list and specific user
 * )
 *
 * // DELETE with invalidation
 * const deleteUser = useApiDelete(
 *   '/api/users/123',
 *   {},
 *   {
 *     onSuccess: () => console.log('User deleted'),
 *   },
 *   ['users'] // Refresh users list after deletion
 * )
 *
 * // Usage with query keys from your queryKeys factory
 * import { queryKeys } from './queryKey'
 *
 * const createPost = useApiPost(
 *   apiPaths.posts.create,
 *   {},
 *   {
 *     onSuccess: (data) => toast.success('Post created!'),
 *   },
 *   [queryKeys.posts.lists(), queryKeys.posts.all] // Multiple invalidations
 * )
 *
 * // Multiple queries
 * const results = useApiQueries([
 *   { queryKey: ['users'], apiOptions: { url: '/api/users' } },
 *   { queryKey: ['posts'], apiOptions: { url: '/api/posts' } }
 * ])
 *
 * // Infinite query with pagination
 * const { data, fetchNextPage, hasNextPage } = useApiInfiniteQuery(
 *   ['posts'],
 *   { url: '/api/posts' },
 *   {
 *     getNextPageParam: (lastPage: any) => lastPage.nextPage,
 *   }
 * )
 */
