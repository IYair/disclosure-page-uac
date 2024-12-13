import axios from 'axios'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { IApiResponse, Note, TResponseBasicError } from '@/constants/types'
import { Tags } from '@/constants/types'
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
}

interface Actions {
  createNote: (note: any) => Promise<IApiResponse | TResponseBasicError>
  getNote: (id: string) => Promise<Note>
  getList: (tags: Tags[], category?: string) => Promise<Note[]>
  search: (query: string) => Promise<Note[]>
}

const useNoteStore = create<Actions & NoteState>()(
  devtools(
    persist(
      (set, get) => ({
        notes: [],
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
            }
            else return [];
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
        }

      }),
      { name: 'note-store' }
    )
  )
)

export default useNoteStore