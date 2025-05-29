import axios from 'axios'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Exercise, IApiResponse, TResponseBasicError, Tags } from '@/constants/types'
import useAuthStore from './useStore'

/*
Input: None
Output: Zustand store for managing exercise-related state and API calls
Return value: Provides actions and state for creating, updating, retrieving, searching, and deleting exercises
Function: Centralizes all logic for interacting with the backend exercise endpoints, including authentication, CRUD operations, 
and state management for exercises in the frontend application
Variables: createExcercise, updateExcercise, getExercise, getExerciseList, search, deleteExercise, getCount, log, excerciseCount
Date: 28 - 05 - 2025
Author: Mario Fernando Landa López
*/

// Axios instance configured with the API base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

// Interface for creating an exercise
interface ICreateExcercise {
  name: string
  category: { name: string; id: string }
  difficulty: { name: string; id: string }
  time: { value: number; id: string } | null
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

// Initial state for the exercise store
interface ExcerciseState {
  excerciseCount: number
}

// Actions available in the exercise store
interface Actions {
  createExcercise: (exercise: ICreateExcercise) => Promise<IApiResponse | TResponseBasicError>
  updateExcercise: (exercise: ICreateExcercise, id: string) => Promise<IApiResponse | TResponseBasicError>
  getExercise: (id: string) => Promise<Exercise>
  getExerciseList: (tags: Tags[], category?: string, difficulty?: string) => Promise<Exercise[]>
  search: (query: string) => Promise<Exercise[]>
  deleteExercise: (id: string) => Promise<IApiResponse | TResponseBasicError>
  getCount: () => Promise<number>
  log: (id: string) => Promise<IApiResponse | TResponseBasicError>
}

// Zustand store definition for exercises
const useExcerciseStore = create<Actions & ExcerciseState>()(
  devtools(
    persist(
      (set, get) => ({
        excerciseCount: 0,

        // Create a new exercise (POST)
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

        // Update an existing exercise (PATCH)
        updateExcercise: async (exercise: ICreateExcercise, id: string) => {
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

        // Get a single exercise by ID (GET)
        getExercise: async (id: string) => {
          try {
            const response = await api.get(`/api/v1/excercises/${id}`)
            return response.data
          } catch (error: any) {
            return error?.response?.data || { error: 'An unexpected error occurred' }
          }
        },

        // Get a list of exercises filtered by tags, category, and/or difficulty (POST)
        getExerciseList: async (tags: Tags[], category?: string, difficulty?: string) => {
          try {
            const response = await api.post('/api/v1/excercises/list', { tags, category, difficulty })
            return response.data
          } catch (error: any) {
            return error?.response?.data || []
          }
        },

        // Search exercises by query string (POST)
        search: async (query: string) => {
          try {
            const response = await api.post(`/api/v1/excercises/search/${query}`)
            return response.data
          } catch (error: any) {
            console.error('Error searching excercises:', error)
            return []
          }
        },

        // Get the total count of exercises (GET)
        getCount: async (): Promise<number> => {
          try {
            const response = await api.get('/api/v1/excercises/count')
            const count = response.data
            set(() => ({ excerciseCount: count }))
            return count
          } catch (error: any) {
            console.error('Error getting excercise count:', error)
            return 0
          }
        },

        // Delete an exercise by ID (DELETE)
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

        // Log a read or interaction with an exercise (POST)
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
