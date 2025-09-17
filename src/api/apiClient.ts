import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios"
import { AuthTokenManager } from "./authTokenManager"
import { type ApiError } from "@/types/response"

// Types and Interfaces
interface ApiCallOptions {
  url: string
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  data?: any
  params?: Record<string, any>
  headers?: Record<string, string>
  timeout?: number
  responseType?:
    | "json"
    | "blob"
    | "text"
    | "stream"
    | "document"
    | "arraybuffer"
  auth?: { username: string; password: string }
  token?: string
  signal?: AbortSignal
  onUploadProgress?: (progressEvent: any) => void
  onDownloadProgress?: (progressEvent: any) => void
}


let baseUrl = window.location.origin
if (baseUrl.includes("localhost")) {
  baseUrl = process.env.BASE_API_URL || "http://localhost:3000/api"
}

const apiClient: AxiosInstance = axios.create({
  timeout: 10000, // 10 seconds timeout
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor for adding auth tokens, logging, etc.
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (!config.headers.Authorization) {
      const token = AuthTokenManager.getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling responses and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response
  },
  async (error: AxiosError): Promise<never> => {
    // const { logout } = useContext(AuthContext)
    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401) {
      // Uncomment and implement token refresh logic as needed
      //   const refreshToken = AuthTokenManager.getRefreshToken()
      //   if (refreshToken && error.config) {
      //     try {
      //       // Attempt to refresh the token
      //       const refreshResponse = await axios.post("/auth/refresh", {
      //         refreshToken,
      //       })
      //       const newToken = refreshResponse.data.accessToken
      //       AuthTokenManager.setToken(newToken)
      //       // Retry the original request with new token
      //       error.config.headers.Authorization = `Bearer ${newToken}`
      //       return apiClient.request(error.config)
      //     } catch (refreshError) {
      //       // Refresh failed, clear tokens and redirect to login
      //       AuthTokenManager.clearTokens()
      //       console.error("Token refresh failed:", refreshError)
      //       // You might want to emit an event or redirect to login here
      //       window.location.href = "/login"
      //     }
      //   } else {
      //     // No refresh token available, clear storage
      //     AuthTokenManager.clearTokens()
      //   }
      // }
      // logout()
    }
    return Promise.reject(error)
  }
)

/**
 * Generic API call function
 */
async function apiCall<T = any>(
  options: ApiCallOptions
): Promise<AxiosResponse<T>> {
  try {
    const {
      url,
      method = "GET",
      data = null,
      params = null,
      headers = {},
      timeout = null,
      responseType = "json",
      auth = null,
      token = null,
      signal = null,
      onUploadProgress = null,
      onDownloadProgress = null,
    } = options

    // Prepare headers
    const requestHeaders: Record<string, string> = { ...headers }

    // Add authorization token if provided (this will override the interceptor)
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`
    }

    // Prepare request config
    const config: AxiosRequestConfig = {
      url,
      method: method.toUpperCase() as any,
      headers: requestHeaders,
      params,
      responseType,
    }

    // Add optional configurations
    if (timeout) config.timeout = timeout
    if (auth) config.auth = auth
    if (signal) config.signal = signal
    if (onUploadProgress) config.onUploadProgress = onUploadProgress
    if (onDownloadProgress) config.onDownloadProgress = onDownloadProgress

    // Add data for POST, PUT, PATCH requests
    if (["POST", "PUT", "PATCH"].includes(method.toUpperCase()) && data) {
      config.data = data
    }

    const response = await apiClient<T>(config)
    return response
  } catch (error) {
    // Enhanced error handling
    const axiosError = error as AxiosError

    if (axiosError.response) {
      // Server responded with error status
      const apiError: ApiError = {
        status: axiosError.response.status,
        statusText: axiosError.response.statusText,
        data: axiosError.response.data,
        headers: axiosError.response.headers as Record<string, string>,
        message:
          (axiosError.response.data as any)?.message || axiosError.message,
        type: "server_error",
      }
      throw apiError
    } else if (axiosError.request) {
      // Request was made but no response received
      const apiError: ApiError = {
        message: "No response received from server",
        type: "network_error",
        originalError: axiosError,
      }
      throw apiError
    } else {
      // Something else happened
      const apiError: ApiError = {
        message: axiosError.message,
        type: "request_error",
        originalError: axiosError,
      }
      throw apiError
    }
  }
}

// API class with convenience methods
class API {
  /**
   * GET request
   */
  static async get<T = any>(
    url: string,
    options: Omit<ApiCallOptions, "url" | "method"> = {}
  ): Promise<AxiosResponse<T>> {
    return apiCall<T>({ url, method: "GET", ...options })
  }

  /**
   * POST request
   */
  static async post<T = any>(
    url: string,
    data?: any,
    options: Omit<ApiCallOptions, "url" | "method" | "data"> = {}
  ): Promise<AxiosResponse<T>> {
    return apiCall<T>({ url, method: "POST", data, ...options })
  }

  /**
   * PUT request
   */
  static async put<T = any>(
    url: string,
    data?: any,
    options: Omit<ApiCallOptions, "url" | "method" | "data"> = {}
  ): Promise<AxiosResponse<T>> {
    return apiCall<T>({ url, method: "PUT", data, ...options })
  }

  /**
   * DELETE request
   */
  static async delete<T = any>(
    url: string,
    options: Omit<ApiCallOptions, "url" | "method"> = {}
  ): Promise<AxiosResponse<T>> {
    return apiCall<T>({ url, method: "DELETE", ...options })
  }

  /**
   * PATCH request
   */
  static async patch<T = any>(
    url: string,
    data?: any,
    options: Omit<ApiCallOptions, "url" | "method" | "data"> = {}
  ): Promise<AxiosResponse<T>> {
    return apiCall<T>({ url, method: "PATCH", data, ...options })
  }
}
// Export everything
export default API
export { apiCall, AuthTokenManager, type ApiCallOptions, type ApiError }
