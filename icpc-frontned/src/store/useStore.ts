import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import axios from 'axios'
import { IApiResponse, TResponseBasicError } from '@/constants/types'

/*
Input: None
Output: Zustand store for managing user authentication and user-related API calls
Return value: Provides actions and state for user login, logout, registration, profile management, and user CRUD operations
Function: Centralizes all logic for authentication and user management, including token handling, user session persistence, and API 
communication with the backend
Variables: login, logout, setError, createUser, getProfile, getUsers, deleteUser, updateUser, getUser, captcha, token, user, isLogged
Date: 28 - 05 - 2025
Author: Mario Fernando Landa López
*/

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

// Auth state interface for Zustand store
interface AuthState {
  token: string | null
  user: IUser | null
  isLogged: boolean
}

// Captcha response type
interface CaptchaResponse {
  message: string
  success: boolean
}

// Actions available in the auth store
interface Actions {
  login: (credentials: { username?: string; email?: string; password: string }) => Promise<void>
  setError: (error: string | null) => void
  createUser: (user: ICreateUser) => Promise<IApiResponse> | TResponseBasicError
  getProfile: () => Promise<IUser>
  getUsers: () => Promise<IUser[]>
  deleteUser: (id: string) => Promise<IApiResponse | TResponseBasicError>
  updateUser: (id: string, user: IUpdateUser) => Promise<IUser | TResponseBasicError>
  getUser: (id: string) => Promise<IUser>
  logout: () => void
  captcha: (token: string) => Promise<CaptchaResponse>
}

// Axios instance configured with the API base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

const useAuthStore = create<AuthState & Actions>()(
  devtools(
    persist(
      (set, get) => ({
        token: null,
        user: null,

        // Login action: authenticates user and stores token and user info
        login: async credentials => {
          const response = await api.post('/api/v1/auth/login', credentials)
          set(() => ({ token: response.data.token }))
          if (get().token !== null) {
            set(() => ({ isLogged: true, user: response.data.user }))
          }
        },

        // Logout action: clears user session and token
        logout: () => set(() => ({ isLogged: false, token: null, user: null })),

        // Set error state (currently a placeholder)
        setError: (error: string | null) => {},

        // Register a new user
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

        // Get the current user's profile
        getProfile: async (): Promise<IUser> => {
          const response = await api.get('/api/v1/auth/profile', {
            headers: {
              Authorization: `Bearer ${get().token}`
            }
          })
          set(() => ({ user: response.data }))
          return response.data
        },

        // Get all users (admin only)
        getUsers: async (): Promise<IUser[]> => {
          const response = await api.get('/api/v1/users', {
            headers: {
              Authorization: `Bearer ${get().token}`
            }
          })
          return response.data
        },

        // Delete a user by ID
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

        // Update a user by ID
        updateUser: async (id: string, user: IUpdateUser): Promise<IUser> => {
          try {
            const response = await api.patch(`/api/v1/users/${id}`, user, {
              headers: {
                Authorization: `Bearer ${get().token}`
              }
            })
            return response.data // Returns updated user data
          } catch (error: any) {
            // Throws error to be handled in the component
            throw error.response?.data || new Error('Error updating user')
          }
        },

        // Get a user by ID
        getUser: async (id: string): Promise<IUser> => {
          const response = await api.get(`/api/v1/users/${id}`, {
            headers: {
              Authorization: `Bearer ${get().token}`
            }
          })
          return response.data
        },

        // Validate captcha token
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