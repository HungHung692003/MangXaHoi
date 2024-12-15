import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useAuth = create(
  persist(
    (set, get) => ({
      user: undefined,
      setUser: (newUser) => set({ user: newUser })
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export { useAuth }
