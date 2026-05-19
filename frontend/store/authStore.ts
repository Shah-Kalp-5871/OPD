import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
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
        
        // Clear cookies across all potential paths to ensure complete deletion and prevent redirect loop
        const paths = ['/', '/opd', '/opd/'];
        paths.forEach(p => {
          document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${p};`;
          document.cookie = `user_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${p};`;
        });
        
        set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
