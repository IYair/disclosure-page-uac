import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import axios from 'axios'
import { IApiResponse, TResponseBasicError } from '@/constants/types'

// Define user and auth response types
export interface IUser {
  isAdmin: any
  id: string
  name: string
  lastName: string
  userName: string
  email: string
  role: string
}

interface ICreateUser {
  name: string
  lastName: string
  userName: string
  email: string
  password: string
  passwordVerify: string
  isAdmin: boolean
}

export interface IUpdateUser {
  name: string
  lastName: string
  userName: string
  email: string
  password?: string
  passwordVerify?: string
  role: string
  editorId: string
}

interface AuthState {
  token: string | null
  user: IUser | null
  isLogged: boolean
}

interface CaptchaResponse {
  message: string
  success: boolean
}

interface Actions {
  login: (credentials: { username?: string; email?: string; password: string }) => Promise<void> // Cambiar firma  logout: () => void
  setError: (error: string | null) => void
  createUser: (user: ICreateUser) => Promise<IApiResponse> | TResponseBasicError
  getProfile: () => Promise<IUser>
  getUsers: () => Promise<IUser[]>
  deleteUser: (id: string) => Promise<IApiResponse | TResponseBasicError>
  updateUser: (id: string, user: IUpdateUser) => Promise<IUser | TResponseBasicError>
  getUser: (id: string) => Promise<IUser>
  logout: () => void
  captcha: (token: string) => Promise<any>
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

const useAuthStore = create<AuthState & Actions>()(
  devtools(
    persist(
      (set, get) => ({
        token: null,
        user: null,

        login: async credentials => {
          const response = await api.post('/api/v1/auth/login', credentials)
          set(() => ({ token: response.data.token }))
          if (get().token !== null) {
            set(() => ({ isLogged: true, user: response.data.user }))
          }
        },

        logout: () => set(() => ({ isLogged: false, token: null, user: null })),

        setError: (error: string | null) => {}, // Add setError property

        createUser: async (user: ICreateUser) => {
          try {
            const response = await api.post('/api/v1/auth/register', user, {
              headers: {
                Authorization: `Bearer ${get().token}`
              }
            })
            if (response.status === 201) {
              return response.data
            }
          } catch (error: any) {
            return error.response.data
          }
        },

        isLogged: false,

        getProfile: async (): Promise<IUser> => {
          const response = await api.get('/api/v1/auth/profile', {
            headers: {
              Authorization: `Bearer ${get().token}`
            }
          })
          set(() => ({ user: response.data }))
          return response.data
        },

        getUsers: async (): Promise<IUser[]> => {
          const response = await api.get('/api/v1/users', {
            headers: {
              Authorization: `Bearer ${get().token}`
            }
          })
          return response.data
        },

        deleteUser: async (id: string): Promise<IApiResponse | TResponseBasicError> => {
          try {
            const response = await api.delete(`/api/v1/users/${id}/${get().user?.id}`, {
              headers: {
                Authorization: `Bearer ${get().token}`
              }
            })
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        },

        updateUser: async (id: string, user: IUpdateUser): Promise<IUser> => {
          try {
            const response = await api.patch(`/api/v1/users/${id}`, user, {
              headers: {
                Authorization: `Bearer ${get().token}`
              }
            })
            return response.data // Devuelve los datos actualizados
          } catch (error: any) {
            // Lanza el error para que sea manejado en el componente
            throw error.response?.data || new Error('Error al actualizar el usuario')
          }
        },

        getUser: async (id: string): Promise<IUser> => {
          const response = await api.get(`/api/v1/users/${id}`, {
            headers: {
              Authorization: `Bearer ${get().token}`
            }
          })
          return response.data
        },

        captcha: async (token: string): Promise<CaptchaResponse> => {
          try {
            const response = await api.post('/api/v1/auth/captcha', {
              token
            })
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        }
      }),
      {
        name: 'auth-storage'
      }
    )
  )
)

export default useAuthStore