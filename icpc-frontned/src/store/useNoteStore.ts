import axios from 'axios'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { IApiResponse, Note, TResponseBasicError, Tags } from '@/constants/types'
import useAuthStore from './useStore'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

interface ICreateNote {
  title: string
  category: { name: string; id: string }
  tags: Tags[]
  description: string
  body: string
  isVisible: boolean
  userAuthor: string
  role: string
}

interface NoteState {
  notes: Note[]
  notesCount: number
}

interface Actions {
  createNote: (note: any) => Promise<IApiResponse | TResponseBasicError>
  updateNote: (note: any, id:string) => Promise<IApiResponse | TResponseBasicError>
  getNote: (id: string) => Promise<Note>
  getList: (tags: Tags[], category?: string) => Promise<Note[]>
  search: (query: string) => Promise<Note[]>
  getCount: () => Promise<number>; // Acción para obtener el conteo
  deleteNote: (id: string) => Promise<IApiResponse | TResponseBasicError>
  log: (id: string) => Promise<IApiResponse | TResponseBasicError>
}

const useNoteStore = create<Actions & NoteState>()(
  devtools(
    persist(
      (set, get) => ({
        notes: [],
        notesCount: 0, // Inicializa el conteo en 0

        createNote: async (note: ICreateNote) => {
          try {
            const response = await api.post('/api/v1/notes', note, {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`
              }
            })
            if (response.status === 201) {
              return response.data
            }
          } catch (error: any) {
            return error.response.data
          }
        },

        updateNote: async (note: ICreateNote, id:string) => {
          try {
            const response = await api.patch(`/api/v1/note/${id}`, note, {
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

        getNote: async (id: string) => {
          try {
            const response = await api.get(`/api/v1/note/${id}`)

            if (response.status === 200) {
              return response.data
            }
          } catch (error: any) {
            return error.response.data
          }
        },

        getList: async (tags: Tags[], category?: string): Promise<Note[]> => {
          try {
            const response = await api.post('/api/v1/notes/list/', { tags, category })

            if (response.status === 201) {
              return response.data
            } else return []
          } catch (error: any) {
            return error.response.data
          }
        },

        search: async (query: string) => {
          try {
            const response = await api.post(`/api/v1/notes/search/${query}`)
            return response.data
          } catch (error: any) {
            console.error('Error searching notes:', error)
            return []
          }
        },
        getCount: async (): Promise<number> => {
          try {
            const response = await api.get('/api/v1/notes/count');
            const count = response.data
            set(() => ({ notesCount: count })); // Actualiza el conteo en el estado
            return count;
          } catch (error: any) {
            console.error('Error getting news count:', error);
            return 0; 
          }
        },

        deleteNote: async (id: string) => {
          try {
            const response = await api.delete(`/api/v1/note/${id}/${useAuthStore.getState().user?.id}`, {
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
            const response = await api.post(`/api/v1/notes/log/${id}`)
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        }
      }),
      { name: 'note-store' }
    )
  )
)

export default useNoteStore
