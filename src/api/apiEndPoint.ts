/**
 * API Endpoints Configuration
 * Centralized management of all API endpoints with type safety and consistency
 */

// API Endpoints organized by domain (no base URL - managed by apiClient)
export const apiPaths = {
  // User management endpoints
  users: {
    base: "/users",
    list: "/users",
    create: "/users",
    detail: (id: string | number) => `/users/${id}`,
    update: (id: string | number) => `/users/${id}`,
    delete: (id: string | number) => `/users/${id}`,
    search: "/users/search",
    bulk: "/users/bulk",
    avatar: (id: string | number) => `/users/${id}/avatar`,
    preferences: (id: string | number) => `/users/${id}/preferences`,
    permissions: (id: string | number) => `/users/${id}/permissions`,
    roles: (id: string | number) => `/users/${id}/roles`,
  },

  // Chart management endpoints
  charts: {
    base: "/charts",
    create: "/create",
    update: "/update",
    delete: "/delete",
    get: "/get",
    bulkUpdate: "/bulk-update",
  },

  // Card management endpoints
  cards: {
    base: "/cards",
    create: "/cards/create",
    update: "/cards/update",
    delete: "/cards/delete",
    get: "/cards/get",
    bulkUpdate: "/cards/bulk-update",
  },

  // Filter management endpoints
  filters: {
    base: "/filters",
    create: "/filters/create",
    update: "/filters/update",
    delete: "/filters/delete",
    get: "/filters/get",
    bulkUpdate: "/filters/bulk-update",
    execSp: (spName: string) => `/filters/exec/${spName}`,
  },

  // Stored procedure execution
  sp: {
    exec: (spName: string) => `/exec/${spName}`,
  },
} as const

// Query parameter configurations for common endpoints
export const queryParams = {
  // Pagination parameters
  pagination: {
    page: "page",
    limit: "limit",
    offset: "offset",
    size: "size",
  },

  // Sorting parameters
  sorting: {
    sortBy: "sort_by",
    sortOrder: "sort_order",
    orderBy: "order_by",
    direction: "direction",
  },

  // Filtering parameters
  filtering: {
    status: "status",
    category: "category",
    tag: "tag",
    dateFrom: "date_from",
    dateTo: "date_to",
    search: "q",
    query: "query",
  },

  // User-specific parameters
  users: {
    role: "role",
    active: "active",
    verified: "verified",
    department: "department",
  },

  // Post-specific parameters
  posts: {
    published: "published",
    author: "author",
    category: "category",
    featured: "featured",
  },

  // Media-specific parameters
  media: {
    type: "type",
    format: "format",
    size: "size",
    folder: "folder",
  },

  // Filter-specific parameters
  filters: {
    spName: "spName",
    columnKey: "columnKey",
    variant: "variant",
    enabled: "enabled",
  },

  // Chart-specific parameters
  charts: {
    chartKey: "chartKey",
    title: "title",
    spName: "spName",
  },

  ///add more params if needed
} as const

// Type-safe endpoint parameter validation
export interface EndpointParams {
  id?: string | number
  postId?: string | number
  commentId?: string | number
  reportId?: string
  [key: string]: any
}

// Query parameter builder utilities
export const queryParamUtils = {
  /**
   * Build query string from object
   */
  build: (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, String(v)))
        } else {
          searchParams.append(key, String(value))
        }
      }
    })

    const queryString = searchParams.toString()
    return queryString ? `?${queryString}` : ""
  },

  /**
   * Build pagination params
   */
  pagination: (page: number, limit: number) => ({
    [queryParams.pagination.page]: page,
    [queryParams.pagination.limit]: limit,
  }),

  /**
   * Build sorting params
   */
  sorting: (sortBy: string, direction: "asc" | "desc" = "asc") => ({
    [queryParams.sorting.sortBy]: sortBy,
    [queryParams.sorting.direction]: direction,
  }),

  /**
   * Build filtering params
   */
  filtering: (filters: Record<string, any>) => {
    const filterParams: Record<string, any> = {}

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        filterParams[key] = value
      }
    })

    return filterParams
  },

  /**
   * Combine multiple param objects
   */
  combine: (...paramObjects: Record<string, any>[]) => {
    return paramObjects.reduce((acc, params) => ({ ...acc, ...params }), {})
  },
}

// Utility functions for endpoint management
export const endpointUtils = {
  /**
   * Build a parameterized endpoint URL
   */
  build: (template: string, params: Record<string, any>) => {
    return template.replace(
      /:([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      (match, paramName) => {
        return params[paramName] || match
      }
    )
  },

  /**
   * Get all endpoints for a specific domain
   */
  getDomainEndpoints: (domain: keyof typeof apiPaths) => {
    return apiPaths[domain]
  },

  /**
   * Validate endpoint exists
   */
  exists: (endpoint: string): boolean => {
    const flatEndpoints = Object.values(apiPaths).flat()
    return flatEndpoints.some((ep) =>
      typeof ep === "string"
        ? ep === endpoint
        : Object.values(ep as object).includes(endpoint)
    )
  },

  /**
   * Build complete URL with query parameters
   */
  withParams: (path: string, params?: Record<string, any>) => {
    if (!params || Object.keys(params).length === 0) {
      return path
    }
    return path + queryParamUtils.build(params)
  },
}

// Environment-specific endpoint overrides
export const getEnvironmentEndpoints = () => {
  const env = process.env.NODE_ENV || "development"

  const envOverrides = {
    development: {
      // Override specific endpoints for development
    },
    staging: {
      // Override specific endpoints for staging
    },
    production: {
      // Override specific endpoints for production
    },
  }

  return {
    ...apiPaths,
    ...envOverrides[env as keyof typeof envOverrides],
  }
}

// Export commonly used endpoint groups
export const userEndpoints = apiPaths.users
export const chartEndpoints = apiPaths.charts
export const cardEndpoints = apiPaths.cards
export const filterEndpoints = apiPaths.filters
export const spEndpoints = apiPaths.sp

/**
 * Usage Examples:
 *
 * // Basic usage
 * useApiGet(queryKeys.users.lists(), apiPaths.users.list)
 *
 * // With parameters
 * useApiGet(queryKeys.users.detail(123), apiPaths.users.detail(123))
 *
 * // With query parameters
 * const params = queryParamUtils.combine(
 *   queryParamUtils.pagination(1, 10),
 *   queryParamUtils.sorting('name', 'asc'),
 *   queryParamUtils.filtering({ status: 'active' })
 * )
 * useApiGet(
 *   queryKeys.users.list({ page: 1, limit: 10, status: 'active' }),
 *   apiPaths.users.list,
 *   { params }
 * )
 *
 * // Or use the utility to build URL with params
 * const urlWithParams = endpointUtils.withParams(apiPaths.users.list, {
 *   page: 1,
 *   limit: 10,
 *   status: 'active',
 *   sort_by: 'name',
 *   direction: 'asc'
 * })
 *
 * // Nested resources
 * useApiGet(
 *   queryKeys.posts.comments(postId),
 *   apiPaths.posts.comments.list(postId)
 * )
 *
 * // Mutations
 * const createUser = useApiPost(apiPaths.users.create)
 * const updateUser = useApiPut(apiPaths.users.update(userId))
 * const deleteUser = useApiDelete(apiPaths.users.delete(userId))
 *
 * // File upload
 * const uploadFile = useApiPost(apiPaths.media.upload, {
 *   headers: { 'Content-Type': 'multipart/form-data' }
 * })
 *
 * // Search with parameters
 * const searchParams = {
 *   [queryParams.filtering.search]: searchTerm,
 *   [queryParams.pagination.limit]: 10,
 *   [queryParams.users.role]: 'admin'
 * }
 * useApiGet(
 *   queryKeys.search.users(searchTerm),
 *   apiPaths.search.users,
 *   { params: searchParams }
 * )
 *
 * // Advanced filtering example
 * const advancedParams = queryParamUtils.combine(
 *   { [queryParams.filtering.status]: 'active' },
 *   { [queryParams.users.role]: 'admin' },
 *   { [queryParams.filtering.dateFrom]: '2024-01-01' },
 *   queryParamUtils.pagination(2, 25),
 *   queryParamUtils.sorting('created_at', 'desc')
 * )
 */

// Type exports for better TypeScript support
export type ApiPaths = typeof apiPaths
export type UserEndpoints = typeof apiPaths.users
export type QueryParams = typeof queryParams

// Default export
export default apiPaths
