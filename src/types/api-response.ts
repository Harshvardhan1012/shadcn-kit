export interface IAPIResponse<T> {
  data: T
  message: string
  status: "success" | "error"
  meta: any
}


export interface IAPIError {
  status?: number
  statusText?: string
  data?: any
  headers?: Record<string, string>
  message: string
}