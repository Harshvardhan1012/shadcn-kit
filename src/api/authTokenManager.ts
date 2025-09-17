export class AuthTokenManager {
  private static tokenKey = "authToken";
  private static refreshTokenKey = "refreshToken";

  static configure(tokenKey: string, refreshTokenKey: string) {
    this.tokenKey = tokenKey;
    this.refreshTokenKey = refreshTokenKey;
  }

  static getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  static setRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  static clearTokens(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }
}
