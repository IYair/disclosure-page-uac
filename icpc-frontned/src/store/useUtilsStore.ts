import axios from 'axios'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Tags, Categories, Difficulties, TimeLimit, MemoryLimit, IApiResponse, TResponseBasicError, DBImage } from '@/constants/types'
import useAuthStore from './useStore'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

interface UtilsState {
  tags: Tags[]
  categories: Categories[]
  difficulty: Difficulties[]
  timeLimit: TimeLimit[]
  memoryLimit: MemoryLimit[]
  images: { [key: string]: DBImage }
}

interface Actions {
  getTags: () => Promise<Tags[]>
  getCategories: () => Promise<Categories[]>
  getCategory: (id: string) => Promise<Categories>
  createCategory: ({ name, commentId }: { name: string; commentId: string }) => Promise<IApiResponse | TResponseBasicError>
  getDifficulties: () => Promise<Difficulties[]>
  getTimeLimit: () => Promise<TimeLimit[]>
  createTimeLimit: (time: number) => Promise<IApiResponse | TResponseBasicError>
  getMemoryLimit: () => Promise<MemoryLimit[]>
  createImage: (image: File) => Promise<IApiResponse | TResponseBasicError>
}

const useUtilsStore = create<Actions & UtilsState>()(
  devtools(
    persist(
      (set, get) => ({
        tags: [] as Tags[],
        categories: [] as Categories[],
        difficulty: [] as Difficulties[],
        timeLimit: [] as TimeLimit[],
        memoryLimit: [] as MemoryLimit[],
        images: [] as unknown as { [key: string]: DBImage },

        getTags: async (): Promise<Tags[]> => {
          try {
            const response = await api.get('/api/v1/tags')
            set(() => ({ tags: response.data }))
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        },

        getCategories: async (): Promise<Categories[]> => {
          try {
            const response = await api.get('/api/v1/categories')
            set(() => ({ categories: response.data }))
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        },

        getCategory: async (id: string): Promise<Categories> => {
          try {
            const response = await api.get(`/api/v1/categories/${id}`)
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        },

        createCategory: async ({ name, commentId }): Promise<IApiResponse | TResponseBasicError> => {
          try {
            const response = await api.post(
              '/api/v1/categories',
              { name, commentId },
              {
                headers: {
                  Authorization: `Bearer ${useAuthStore.getState().token}`
                }
              }
            )
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        },

        getDifficulties: async (): Promise<Difficulties[]> => {
          try {
            const response = await api.get('/api/v1/difficulty')
            set(() => ({ difficulty: response.data }))
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        },

        getTimeLimit: async (): Promise<TimeLimit[]> => {
          try {
            const response = await api.get('/api/v1/time')
            set(() => ({ timeLimit: response.data }))
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        },

        createTimeLimit: async (time: number): Promise<IApiResponse | TResponseBasicError> => {
          try {
            const response = await api.post(
              '/api/v1/time',
              { timeLimit: time },
              {
                headers: {
                  Authorization: `Bearer ${useAuthStore.getState().token}`
                }
              }
            )
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        },
        getMemoryLimit: async (): Promise<MemoryLimit[]> => {
          try {
            const response = await api.get('/api/v1/memory')
            set(() => ({ memoryLimit: response.data }))
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        },

        createImage: async (file: File): Promise<IApiResponse | TResponseBasicError> => {
          const fd = new FormData()
          fd.append('file', file)
          return await api.post('/api/v1/image/upload', fd, {
            headers: {
              Authorization: `Bearer ${useAuthStore.getState().token}`
            }
          })
        }
      }),
      {
        name: 'utils-store'
      }
    )
  )
)

export default useUtilsStore
