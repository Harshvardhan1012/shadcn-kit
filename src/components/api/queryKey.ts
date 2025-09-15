///store all the query Keys here for consistency

/**
 * Query Key Factory Pattern
 * This provides a consistent way to generate query keys throughout the application
 */

// Base query key factories
export const queryKeys = {
  // User-related queries
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.users.details(), id] as const,
    profile: () => [...queryKeys.users.all, "profile"] as const,
    preferences: (userId: string | number) =>
      [...queryKeys.users.detail(userId), "preferences"] as const,
  },
} as const

/**
 * Helper functions for common query key operations
 */

// Function to invalidate all queries for a specific entity
export const invalidateKeys = {
  users: queryKeys.users.all,
}

/**
 * Usage Examples:
 *
 * // Basic usage
 * useApiGet(queryKeys.users.lists(), '/api/users')
 *
 * // With filters
 * useApiGet(queryKeys.users.list({ status: 'active', role: 'admin' }), '/api/users')
 *
 * // Detail query
 * useApiGet(queryKeys.users.detail(userId), `/api/users/${userId}`)
 *
 * // Nested data
 * useApiGet(queryKeys.posts.comments(postId), `/api/posts/${postId}/comments`)
 *
 * // Invalidation in mutations
 * const createUser = useApiPost('/api/users', {}, {
 *   onSuccess: () => {
 *     queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
 *   }
 * })
 *
 * // Search with dynamic parameters
 * useApiGet(queryKeys.search.users(searchTerm, { role: 'admin' }), '/api/search/users')
 */

/**
 * Type helpers for better TypeScript support
 */
export type QueryKeyType = typeof queryKeys
export type UserQueryKeys = typeof queryKeys.users
