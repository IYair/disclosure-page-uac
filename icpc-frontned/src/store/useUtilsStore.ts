import axios from 'axios'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import {
  Tags,
  Categories,
  Difficulties,
  TimeLimit,
  MemoryLimit,
  IApiResponse,
  TResponseBasicError,
  DBImage,
  Quote,
  Ticket,
  Report
} from '@/constants/types'
import useAuthStore from './useStore'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

const quoteApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_QUOTE_URL
})

interface UtilsState {
  tags: Tags[]
  categories: Categories[]
  difficulty: Difficulties[]
  timeLimit: TimeLimit[]
  memoryLimit: MemoryLimit[]
  images: { [key: string]: DBImage }
  quote: Quote
  ticket: Ticket
}

interface Actions {
  getTags: () => Promise<Tags[]>
  createTag: ({ name, color }: { name: string; color: string }) => Promise<IApiResponse | TResponseBasicError>
  deleteTag: (id: string) => Promise<IApiResponse | TResponseBasicError>
  getCategories: () => Promise<Categories[]>
  getCategory: (id: string) => Promise<Categories>
  createCategory: ({ name, commentId }: { name: string; commentId: string }) => Promise<IApiResponse | TResponseBasicError>
  deleteCategory: (id: string) => Promise<IApiResponse | TResponseBasicError>
  getDifficulties: () => Promise<Difficulties[]>
  createDifficulty: ({ level, name }: { level: number; name: string }) => Promise<IApiResponse | TResponseBasicError>
  deleteDifficulty: (id: string) => Promise<IApiResponse | TResponseBasicError>
  getTimeLimit: () => Promise<TimeLimit[]>
  createTimeLimit: (time: number) => Promise<IApiResponse | TResponseBasicError>
  deleteTimeLimit: (id: string) => Promise<IApiResponse | TResponseBasicError>
  getMemoryLimit: () => Promise<MemoryLimit[]>
  createMemory: (memory: { value: number; id: string }) => Promise<IApiResponse | TResponseBasicError> // Nueva acción
  deleteMemoryLimit: (id: string) => Promise<IApiResponse | TResponseBasicError>
  createImage: (image: File) => Promise<IApiResponse | TResponseBasicError>
  updateImage: (image: File, id: string) => Promise<IApiResponse | TResponseBasicError>
  getDailyQuote: () => Promise<Quote>
  getTickets: () => Promise<Ticket[]>
  getPendingTickets: () => Promise<Ticket[]>
  getTicket: (id: string) => Promise<Ticket>
  getReports: () => Promise<Report[]>
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
        quote: { phrase: '', author: '' },
        ticket: null as unknown as Ticket,

        getTags: async (): Promise<Tags[]> => {
          try {
            const response = await api.get('/api/v1/tags')
            set(() => ({ tags: response.data }))
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        },

        createTag: async ({ name, color }): Promise<IApiResponse | TResponseBasicError> => {
          try {
            const response = await api.post(
              '/api/v1/tags',
              { name, color },
              {
                headers: {
                  Authorization: `Bearer ${useAuthStore.getState().token}`
                }
              }
            )

            // ✅ Actualiza el estado local con el nuevo tag
            if (response.data.statusCode === 201) {
              set(state => ({
                tags: [...state.tags, response.data.data] // Usa response.data.data
              }))
            }

            return response.data // Devuelve la respuesta completa
          } catch (error: any) {
            return error.response.data
          }
        },

        deleteTag: async (id: string): Promise<IApiResponse | TResponseBasicError> => {
          try {
            const response = await api.delete(`/api/v1/tags/${id}`, {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`
              }
            })
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

        deleteCategory: async (id: string): Promise<IApiResponse | TResponseBasicError> => {
          try {
            const response = await api.delete(`/api/v1/categories/${id}`, {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`
              }
            })
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

        createDifficulty: async ({ level, name }): Promise<IApiResponse | TResponseBasicError> => {
          try {
            const response = await api.post(
              '/api/v1/difficulty',
              { level, name },
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

        deleteDifficulty: async (id: string): Promise<IApiResponse | TResponseBasicError> => {
          try {
            const response = await api.delete(`/api/v1/difficulty/${id}`, {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`
              }
            })
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

        deleteTimeLimit: async (id: string): Promise<IApiResponse | TResponseBasicError> => {
          try {
            const response = await api.delete(`/api/v1/time/${id}`, {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`
              }
            })
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

        createMemory: async (memory: { value: number; id: string }): Promise<IApiResponse | TResponseBasicError> => {
          try {
            const response = await api.post(
              '/api/v1/memory',
              { value: memory.value, id: memory.id }, // Envía el objeto con value y id
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

        deleteMemoryLimit: async (id: string): Promise<IApiResponse | TResponseBasicError> => {
          try {
            const response = await api.delete(`/api/v1/memory/${id}`, {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`
              }
            })
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
        },

        updateImage: async (file: File, id: string): Promise<IApiResponse | TResponseBasicError> => {
          const fd = new FormData()
          fd.append('file', file)
          return await api.patch(`/api/v1/image/${id}`, fd, {
            headers: {
              Authorization: `Bearer ${useAuthStore.getState().token}`
            }
          })
        },

        getDailyQuote: async (): Promise<Quote> => {
          try {
            const response = await quoteApi.get('/')
            set(() => ({ quote: response.data }))
            return response.data
          } catch (error: any) {
            return {
              phrase: '',
              author: ''
            }
          }
        },

        getTickets: async (): Promise<Ticket[]> => {
          try {
            const response = await api.get('/api/v1/ticket')
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        },

        getPendingTickets: async (): Promise<Ticket[]> => {
          try {
            const response = await api.get('/api/v1/ticket/pending', {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`
              }
            })
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        },

        getTicket: async (id: string): Promise<Ticket> => {
          try {
            const response = await api.get(`/api/v1/ticket/${id}`)
            set(() => ({ ticket: response.data }))
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        },

        getReports: async (): Promise<Report[]> => {
          try {
            const response = await api.get('/api/v1/report', {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`
              }
            })
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        }
      }),
      {
        name: 'utils-store'
      }
    )
  )
)

export default useUtilsStore
