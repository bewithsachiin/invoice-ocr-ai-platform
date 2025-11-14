import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from '@/types'
import { mockUser, mockClientUser } from '@/utils/mockData'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isHydrated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (user: Partial<User>) => void
  setHydrated: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,

      login: async (email: string, _password: string) => {
        // Mock login - in production, this would call the API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const user = email.includes('admin') ? mockUser : mockClientUser
        const token = 'mock-jwt-token-' + Math.random().toString(36).substring(7)

        set({
          user,
          token,
          isAuthenticated: true,
        })
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }))
      },

      setHydrated: () => {
        set({ isHydrated: true })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // This ensures that when the store rehydrates from localStorage,
        // it properly sets the isAuthenticated flag based on stored data
        if (state) {
          state.setHydrated()
        }
      },
    }
  )
)
