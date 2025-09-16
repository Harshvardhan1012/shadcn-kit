import { AxiosError } from "axios"
import { useAlert } from "../components/services/toastService"

export const useApiNotification = () => {
  const { showAlert, showError, showSuccess } = useAlert()

  const handleError = (error: unknown) => {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || error.message
      const errorStatus = error.response?.status

      // Log error to console for debugging
      console.error("API Error:", {
        status: errorStatus,
        message: errorMessage,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response?.data,
      })

      showError(`Error ${errorStatus || "Unknown"}`, errorMessage)
    } else if (error instanceof Error) {
      console.error("General Error:", error)
      showError("Error", error.message)
    } else {
      console.error("Unknown Error:", error)
      showError("Error", "An unknown error occurred")
    }
  }

  const handleSuccess = (data: { message?: string }) => {
    showSuccess("Success", data.message || "Operation successful")
  }

  return { handleError, handleSuccess, showAlert, showError, showSuccess }
}
