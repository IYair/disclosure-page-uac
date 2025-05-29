import axios from 'axios'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { IApiResponse, Note, TResponseBasicError, Tags } from '@/constants/types'
import useAuthStore from './useStore'

/*
Input: None
Output: Zustand store for managing note-related state and API calls
Return value: Provides actions and state for creating, updating, retrieving, searching, and deleting notes
Function: Centralizes all logic for interacting with the backend notes endpoints, including authentication, CRUD operations, and 
state management for notes in the frontend application
Variables: createNote, updateNote, getNote, getList, search, getCount, deleteNote, log, notes, notesCount
Date: 28 - 05 - 2025
Author: Mario Fernando Landa López
*/

// Axios instance configured with the API base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

// Interface for creating or updating a note
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

// State interface for the note store
interface NoteState {
  notes: Note[]
  notesCount: number
}

// Actions available in the note store
interface Actions {
  createNote: (note: any) => Promise<IApiResponse | TResponseBasicError>
  updateNote: (note: any, id: string) => Promise<IApiResponse | TResponseBasicError>
  getNote: (id: string) => Promise<Note>
  getList: (tags: Tags[], category?: string) => Promise<Note[]>
  search: (query: string) => Promise<Note[]>
  getCount: () => Promise<number>
  deleteNote: (id: string) => Promise<IApiResponse | TResponseBasicError>
  log: (id: string) => Promise<IApiResponse | TResponseBasicError>
}

// Zustand store definition for notes
const useNoteStore = create<Actions & NoteState>()(
  devtools(
    persist(
      (set, get) => ({
        notes: [],
        notesCount: 0, // Initializes the notes count to 0

        // Create a new note (POST)
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

        // Update an existing note (PATCH)
        updateNote: async (note: ICreateNote, id: string) => {
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

        // Get a single note by ID (GET)
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

        // Get a list of notes filtered by tags and/or category (POST)
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

        // Search notes by query string (POST)
        search: async (query: string) => {
          try {
            const response = await api.post(`/api/v1/notes/search/${query}`)
            return response.data
          } catch (error: any) {
            console.error('Error searching notes:', error)
            return []
          }
        },

        // Get the total count of notes (GET)
        getCount: async (): Promise<number> => {
          try {
            const response = await api.get('/api/v1/notes/count')
            const count = response.data
            set(() => ({ notesCount: count })) // Updates the count in the state
            return count
          } catch (error: any) {
            console.error('Error getting notes count:', error)
            return 0
          }
        },

        // Delete a note by ID (DELETE)
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

        // Log a read or interaction with a note (POST)
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
