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

/*
Input: None
Output: Zustand store for managing utility state and API calls (tags, categories, difficulties, time/memory limits, images, quotes, tickets, reports)
Return value: Provides actions and state for CRUD operations and retrieval of utility data used throughout the frontend application
Function: Centralizes logic for interacting with backend endpoints related to tags, categories, difficulties, time/memory limits, 
images, quotes, tickets, and reports. Handles authentication, state management, and API communication for utility data.
Variables: getTags, hasPendingTicket, createTag, updateTag, deleteTag, getCategories, getCategory, createCategory, deleteCategory, 
getDifficulties, getDifficulty, createDifficulty, updateDifficulty, deleteDifficulty, getTimeLimit, createTimeLimit, updateTimeLimit, 
deleteTimeLimit, getMemoryLimit, getMemory, createMemory, updateMemory, deleteMemoryLimit, createImage, updateImage, getDailyQuote, 
getRandomFact, getTickets, getPendingTickets, getTicket, getReports, getOpenReports, getReport, closeReport, approveTicket, rejectTicket, 
createReport, tags, categories, difficulty, timeLimit, memoryLimit, images, quote, ticket
Date: 28 - 05 - 2025
Author: Mario Fernando Landa López
*/

// Axios instance for main API
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

// Axios instance for quote API
const quoteApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_QUOTE_URL
})

// State interface for utility data
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

// Actions available in the utility store
interface Actions {
  getTags: () => Promise<Tags[]>
  hasPendingTicket: (itemId: string, itemType: string) => Promise<boolean>
  createTag: ({ name, color }: { name: string; color: string }) => Promise<IApiResponse | TResponseBasicError>
  updateTag: (id: string, data: { name: string; color: string }) => Promise<IApiResponse | TResponseBasicError>
  deleteTag: (id: string) => Promise<IApiResponse | TResponseBasicError>
  getCategories: () => Promise<Categories[]>
  getCategory: (id: string) => Promise<Categories>
  createCategory: ({ name, commentId }: { name: string; commentId: string }) => Promise<IApiResponse | TResponseBasicError>
  deleteCategory: (id: string) => Promise<IApiResponse | TResponseBasicError>
  getDifficulties: () => Promise<Difficulties[]>
  getDifficulty: (id: string) => Promise<Difficulties>
  createDifficulty: ({ level, name }: { level: number; name: string }) => Promise<IApiResponse | TResponseBasicError>
  updateDifficulty: (id: string, data: { level: number; name: string }) => Promise<IApiResponse | TResponseBasicError>
  deleteDifficulty: (id: string) => Promise<IApiResponse | TResponseBasicError>
  getTimeLimit: () => Promise<TimeLimit[]>
  createTimeLimit: (time: number) => Promise<IApiResponse | TResponseBasicError>
  updateTimeLimit: (id: string, data: { timeLimit: number }) => Promise<IApiResponse | TResponseBasicError>
  deleteTimeLimit: (id: string) => Promise<IApiResponse | TResponseBasicError>
  getMemoryLimit: () => Promise<MemoryLimit[]>
  getMemory: (id: string) => Promise<MemoryLimit>
  createMemory: (memory: { value: number; id: string }) => Promise<IApiResponse | TResponseBasicError>
  updateMemory: (id: string, data: { value: number }) => Promise<IApiResponse | TResponseBasicError>
  deleteMemoryLimit: (id: string) => Promise<IApiResponse | TResponseBasicError>
  createImage: (image: File) => Promise<IApiResponse | TResponseBasicError>
  updateImage: (image: File, id: string) => Promise<IApiResponse | TResponseBasicError>
  getDailyQuote: () => Promise<Quote>
  getRandomFact: () => Promise<string>
  getTickets: () => Promise<Ticket[]>
  getPendingTickets: () => Promise<Ticket[]>
  getTicket: (id: string) => Promise<Ticket>
  getReports: () => Promise<Report[]>
  getOpenReports: () => Promise<Report[]>
  getReport: (id: string) => Promise<Report>
  closeReport: (id: string) => Promise<Report>
  updateCategory: (id: string, data: { name: string }) => Promise<IApiResponse | TResponseBasicError>
  approveTicket: (id: string) => Promise<IApiResponse>
  rejectTicket: (id: string) => Promise<IApiResponse>
  createReport: ({
    summary,
    report,
    itemType,
    itemId
  }: {
    summary: string
    report: string
    itemType: string
    itemId: string
  }) => Promise<IApiResponse | TResponseBasicError>
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

        hasPendingTicket: async (itemId: string, itemType: string): Promise<boolean> => {
          try {
            const response = await api.get(`/api/v1/ticket/hasPending/${itemId}/${itemType}`, {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`
              }
            })
            return response.data.hasPendingTicket
          } catch (error: any) {
            return false
          }
        },

        updateCategory: async (id: string, data: { name: string }): Promise<IApiResponse | TResponseBasicError> => {
          try {
            const response = await api.patch(`/api/v1/categories/${id}`, data, {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`
              }
            })
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

            // ✅ Updates local state with the new tag
            if (response.data.statusCode === 201) {
              set(state => ({
                tags: [...state.tags, response.data.data] // Uses response.data.data
              }))
            }

            return response.data // Returns the full response
          } catch (error: any) {
            return error.response.data
          }
        },

        updateTag: async (id: string, data: { name: string; color: string }): Promise<IApiResponse | TResponseBasicError> => {
          try {
            const response = await api.patch(`/api/v1/tags/${id}`, data, {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`
              }
            })
            return response.data
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

        getDifficulty: async (id: string): Promise<Difficulties> => {
          try {
            const response = await api.get(`/api/v1/difficulty/${id}`)
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

        updateDifficulty: async (id: string, data: { level: number; name: string }): Promise<IApiResponse | TResponseBasicError> => {
          try {
            const response = await api.patch(`/api/v1/difficulty/${id}`, data, {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`
              }
            })
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

        updateTimeLimit: async (id: string, data: { timeLimit: number }): Promise<IApiResponse | TResponseBasicError> => {
          // Adds this function
          try {
            const response = await api.patch(`/api/v1/time/${id}`, data, {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`
              }
            })
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

        getMemory: async (id: string): Promise<MemoryLimit> => {
          // Adds this function
          try {
            const response = await api.get(`/api/v1/memory/${id}`)
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        },

        createMemory: async (memory: { value: number; id: string }): Promise<IApiResponse | TResponseBasicError> => {
          try {
            const response = await api.post(
              '/api/v1/memory',
              { value: memory.value, id: memory.id }, // Sends the object with value and id
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

        updateMemory: async (id: string, data: { value: number }): Promise<IApiResponse | TResponseBasicError> => {
          // Adds this function
          try {
            const response = await api.patch(`/api/v1/memory/${id}`, data, {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`
              }
            })
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
          return await api.patch(`/api/v1/news/image/${id}`, fd, {
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

        getRandomFact: async (): Promise<string> => {
          try {
            const response = await api.get('/api/v1/facts')
            return response.data
          } catch (error: any) {
            return ''
          }
        },

        getTickets: async (): Promise<Ticket[]> => {
          try {
            const response = await api.get('/api/v1/ticket', {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`
              }
            })
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

        createReport: async ({
          summary,
          report,
          itemType,
          itemId
        }: {
          summary: string
          report: string
          itemType: string
          itemId: string
        }): Promise<IApiResponse | TResponseBasicError> => {
          try {
            const response = await api.post(
              '/api/v1/report',
              { summary, report, itemType, itemId },
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
        },

        getOpenReports: async (): Promise<Report[]> => {
          try {
            const response = await api.get('/api/v1/report/list', {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`
              }
            })
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        },

        getReport: async (id: string): Promise<Report> => {
          try {
            const response = await api.get(`/api/v1/report/${id}`, {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`
              }
            })
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        },

        closeReport: async (id: string) => {
          try {
            const response = await api.post(`/api/v1/report/${id}`, { user: useAuthStore.getState().user?.userName }, {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`
              }
            })
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        },

        approveTicket: async (id: string): Promise<IApiResponse> => {
          try {
            const response = await api.post(`/api/v1/ticket/approve/${id}`, {}, {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`
              }
            })
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        },

        rejectTicket: async (id: string): Promise<IApiResponse> => {
          try {
            const response = await api.post(`/api/v1/ticket/reject/${id}`, {}, {
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

// Quick usage: import useUtilsStore and destructure needed actions/state
// Example: const { getTags, tags } = useUtilsStore();

export default useUtilsStore
