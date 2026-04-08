import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, MOCK_USERS } from '../mock/data';

interface RegisteredUser extends User {
  password: string;
}

interface AuthState {
  user: User | null;
  registeredUsers: RegisteredUser[];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (fields: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      registeredUsers: [
        ...MOCK_USERS.map(u => ({ ...u, password: 'password' }))
      ],
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });

        // Simulate network latency
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const state = get();
        const foundUser = state.registeredUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (foundUser) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: _, ...userWithoutPassword } = foundUser;
          set({ user: userWithoutPassword, isAuthenticated: true, isLoading: false });
          return true;
        }

        set({ isLoading: false });
        return false;
      },

      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const state = get();
        const exists = state.registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase());

        if (exists) {
          set({ isLoading: false });
          return false;
        }

        if (email && password && name) {
          const newUser: RegisteredUser = {
            id: `u${Date.now()}`,
            name,
            email,
            password,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
            role: 'user',
            subscription: 'starter',
            storageUsed: 0,
            storageLimit: 250,
            bio: '',
            followers: 0,
          };
          
          set((s) => ({ 
            registeredUsers: [...s.registeredUsers, newUser],
            user: { ...newUser }, // Auto login after signup
            isAuthenticated: true, 
            isLoading: false 
          }));
          return true;
        }

        set({ isLoading: false });
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (fields: Partial<User>) => {
        set((state) => {
          if (!state.user) return {};
          const updatedUser = { ...state.user, ...fields };
          const updatedRegistered = state.registeredUsers.map((u) =>
            u.id === updatedUser.id ? { ...u, ...fields } : u
          );
          return { user: updatedUser, registeredUsers: updatedRegistered };
        });
      },
    }),
    {
      name: 'pixora_auth', // key in localStorage
      // Only persist user; derive isAuthenticated on rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!state.user;
          state.isLoading = false;
        }
      },
    }
  )
);
