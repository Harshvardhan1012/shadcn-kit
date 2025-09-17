export interface IAPIResponse<T> {
  data: T
  success: boolean
  message: string
  status: number
  meta: any
}


export interface ApiError {
  status?: number
  statusText?: string
  data?: any
  headers?: Record<string, string>
  message: string
  type: "server_error" | "network_error" | "request_error"
  originalError?: any
}