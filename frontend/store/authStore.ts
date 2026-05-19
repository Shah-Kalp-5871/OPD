import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  primaryBranchId?: string;
  branchAccess?: string[];
  permissions?: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token });
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('auth-storage');
        sessionStorage.clear();
        // Clear cookies (must match path used in login)
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/opd/;";
        document.cookie = "user_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/opd/;";
        set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
