import { create } from 'zustand';

interface User {
  id: number;
  email?: string;
  provider?: string;
  name?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  setAuth: (user: User) => void;
  logout: () => void;
}

const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  setAuth: (user: User) => set({ isAuthenticated: true, user }),
  logout: () => set({ isAuthenticated: false, user: null }),
}))

export default useAuth;
