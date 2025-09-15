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

  // Posts-related queries
  posts: {
    all: ["posts"] as const,
    lists: () => [...queryKeys.posts.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.posts.lists(), { filters }] as const,
    details: () => [...queryKeys.posts.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.posts.details(), id] as const,
    comments: (postId: string | number) =>
      [...queryKeys.posts.detail(postId), "comments"] as const,
  },

  // Auth-related queries
  auth: {
    all: ["auth"] as const,
    user: () => [...queryKeys.auth.all, "user"] as const,
    permissions: () => [...queryKeys.auth.all, "permissions"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
  },

  // Analytics and reports
  analytics: {
    all: ["analytics"] as const,
    dashboard: () => [...queryKeys.analytics.all, "dashboard"] as const,
    reports: () => [...queryKeys.analytics.all, "reports"] as const,
    report: (reportId: string, params?: Record<string, any>) =>
      [
        ...queryKeys.analytics.reports(),
        reportId,
        ...(params ? [params] : []),
      ] as const,
  },

  // Settings and configuration
  settings: {
    all: ["settings"] as const,
    app: () => [...queryKeys.settings.all, "app"] as const,
    user: (userId: string | number) =>
      [...queryKeys.settings.all, "user", userId] as const,
    theme: () => [...queryKeys.settings.all, "theme"] as const,
  },

  // Search and filters
  search: {
    all: ["search"] as const,
    global: (query: string) =>
      [...queryKeys.search.all, "global", query] as const,
    users: (query: string, filters?: Record<string, any>) =>
      [
        ...queryKeys.search.all,
        "users",
        query,
        ...(filters ? [filters] : []),
      ] as const,
    posts: (query: string, filters?: Record<string, any>) =>
      [
        ...queryKeys.search.all,
        "posts",
        query,
        ...(filters ? [filters] : []),
      ] as const,
  },
} as const

/**
 * Helper functions for common query key operations
 */

// Function to invalidate all queries for a specific entity
export const invalidateKeys = {
  users: queryKeys.users.all,
  posts: queryKeys.posts.all,
  auth: queryKeys.auth.all,
  analytics: queryKeys.analytics.all,
  settings: queryKeys.settings.all,
  search: queryKeys.search.all,
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
export type PostQueryKeys = typeof queryKeys.posts
export type AuthQueryKeys = typeof queryKeys.auth
