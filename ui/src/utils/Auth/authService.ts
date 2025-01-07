import { IUser } from "../../config/applicatonConfig";

class AuthService {
  private readonly USER_KEY = 'userInfo';

  setUser(user: IUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): IUser | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  clearAuth(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  isAuthenticated(): boolean {
    const cookies = document.cookie.split("; ");
    const authCookie = cookies.find(row => row.startsWith("AuthToken="))
    if(!!authCookie == false) this.clearAuth();
    return !!authCookie;
  }
}

export const authService = new AuthService(); 