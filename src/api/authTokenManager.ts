export class AuthTokenManager {
  private static readonly TOKEN_KEY = "authToken"
  private static readonly REFRESH_TOKEN_KEY = "refreshToken"

  static getToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY)
    } catch (error) {
      console.warn("Unable to access localStorage for auth token:", error)
      return null
    }
  }

  static setToken(token: string): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, token)
    } catch (error) {
      console.warn("Unable to save auth token to localStorage:", error)
    }
  }

  static getRefreshToken(): string | null {
    try {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY)
    } catch (error) {
      console.warn("Unable to access localStorage for refresh token:", error)
      return null
    }
  }

  static setRefreshToken(token: string): void {
    try {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token)
    } catch (error) {
      console.warn("Unable to save refresh token to localStorage:", error)
    }
  }

  static clearTokens(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY)
      localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    } catch (error) {
      console.warn("Unable to clear tokens from localStorage:", error)
    }
  }
}