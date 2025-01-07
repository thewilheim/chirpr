import { IUser } from "";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'AuthToken';
  private readonly USER_KEY = 'userInfo';

  setTokens(tokens: AuthTokens): void {
    document.cookie = `${this.TOKEN_KEY}=${tokens.accessToken}; path=/; secure; samesite=strict`;
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  getTokens(): AuthTokens | null {
    const cookies = document.cookie.split('; ');
    const authCookie = cookies.find(row => row.startsWith(`${this.TOKEN_KEY}=`));
    const refreshToken = localStorage.getItem('refreshToken');

    if (!authCookie || !refreshToken) return null;

    return {
      accessToken: authCookie.split('=')[1],
      refreshToken
    };
  }

  setUser(user: IUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): IUser | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  clearAuth(): void {
    document.cookie = `${this.TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    localStorage.removeItem('refreshToken');
    localStorage.removeItem(this.USER_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getTokens()?.accessToken;
  }
}

export const authService = new AuthService(); 