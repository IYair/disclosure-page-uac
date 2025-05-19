import axios from 'axios'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Exercise, IApiResponse, TResponseBasicError, Tags } from '@/constants/types'
import useAuthStore from './useStore'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

// Interfaz para crear un ejercicio
interface ICreateExcercise {
  name: string
  category: { name: string, id: string }
  difficulty: { name: string, id: string }
  time: { value: number, id: string } | null;
  memoryId: string
  input: string
  output: string
  constraints: string
  clue: string
  tags: Tags[]
  author: string
  description: string
  example_input: string
  example_output: string
  solution: string
  isVisible: boolean
  userAuthor: string
  role: string
}

// Estado inicial
interface ExcerciseState {
  excerciseCount: number
}

interface Actions {
  createExcercise: (exercise: ICreateExcercise) => Promise<IApiResponse | TResponseBasicError>
  updateExcercise: (exercise: ICreateExcercise, id:string) => Promise<IApiResponse | TResponseBasicError>
  getExercise: (id: string) => Promise<Exercise>
  getExerciseList: (tags: Tags[], category?: string, difficulty?: string) => Promise<Exercise[]>
  search: (query: string) => Promise<Exercise[]>
  deleteExercise: (id: string) => Promise<IApiResponse | TResponseBasicError>
  getCount: () => Promise<number>
  log: (id: string) => Promise<IApiResponse | TResponseBasicError> 
}

const useExcerciseStore = create<Actions & ExcerciseState>()(
  devtools(
    persist(
      (set, get) => ({
        excerciseCount: 0, 

        createExcercise: async (excercise: ICreateExcercise) => {
          try {
            const response = await api.post('/api/v1/excercises', excercise, {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`
              }
            })
            if (response.status === 201) {
              return response.data
            }
            return { error: 'Unexpected response status' }
          } catch (error: any) {
            return error?.response?.data || { error: 'An unexpected error occurred' }
          }
        },
        
        updateExcercise: async (exercise: ICreateExcercise, id:string) => {
          try {
            const response = await api.patch(`/api/v1/excercises/${id}`, exercise, {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`
              }
            })
            if (response.status === 200) {
              return response.data
            }
          } catch (error: any) {
            return error.response.data
          }
        },

        getExercise: async (id: string) => {
          try {
            const response = await api.get(`/api/v1/excercises/${id}`)
            return response.data
          } catch (error: any) {
            return error?.response?.data || { error: 'An unexpected error occurred' }
          }
        },

        getExerciseList: async (tags: Tags[], category?: string, difficulty?: string) => {
          try {
            const response = await api.post('/api/v1/excercises/list', { tags, category, difficulty })
            return response.data
          } catch (error: any) {
            return error?.response?.data || []
          }
        },

        search: async (query: string) => {
          try {
            const response = await api.post(`/api/v1/excercises/search/${query}`)
            return response.data
          } catch (error: any) {
            console.error('Error searching excercises:', error)
            return []
          }
        },

        getCount: async (): Promise<number> => {
          try {
            const response = await api.get('/api/v1/excercises/count');
            const count = response.data
            set(() => ({ excerciseCount: count })) // Actualización del estado corregida
            return count
          } catch (error: any) {
            console.error('Error getting excercise count:', error)
            return 0
          }
        },
        
        deleteExercise: async (id: string) => {
          try {
            const response = await api.delete(`/api/v1/excercises/${id}/${useAuthStore.getState().user?.id}`, {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`
              }
            })
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        },

        log: async (id: string) => {
          try {
            const response = await api.post(`/api/v1/excercises/log/${id}`)
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        }
      }),
      { name: 'excercise-store' }
    )
  )
)

export default useExcerciseStore
