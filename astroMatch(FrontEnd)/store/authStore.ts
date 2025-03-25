import { create } from "zustand"

interface AuthState {
  isLoginOpen: boolean
  isRegisterOpen: boolean
  isLoggedIn: boolean
  user: {
    username: string | null
    role: string | null
  }
  openLogin: () => void
  closeLogin: () => void
  openRegister: () => void
  closeRegister: () => void
  login: (username: string, role: string, token: string) => void
  logout: () => void
  checkAuth: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoginOpen: false,
  isRegisterOpen: false,
  isLoggedIn: false,
  user: {
    username: null,
    role: null,
  },
  openLogin: () => set({ isLoginOpen: true, isRegisterOpen: false }),
  closeLogin: () => set({ isLoginOpen: false }),
  openRegister: () => set({ isRegisterOpen: true, isLoginOpen: false }),
  closeRegister: () => set({ isRegisterOpen: false }),
  login: (username, role, token) => {
    localStorage.setItem("token", token)
    localStorage.setItem("username", username)
    localStorage.setItem("role", role)
    set({
      isLoggedIn: true,
      user: { username, role },
    })
  },
  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("role")
    set({
      isLoggedIn: false,
      user: { username: null, role: null },
    })
  },
  checkAuth: () => {
    const token = localStorage.getItem("token")
    const username = localStorage.getItem("username")
    const role = localStorage.getItem("role")

    if (token && username) {
      set({
        isLoggedIn: true,
        user: {
          username,
          role,
        },
      })
      return true
    }
    return false
  },
}))

