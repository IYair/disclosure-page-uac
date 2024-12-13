import axios from 'axios'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Exercise, IApiResponse, TResponseBasicError } from '@/constants/types'
import { Tags } from '@/constants/types'
import useAuthStore from './useStore'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

interface ICreateExcercise {
  name: string
  category: { name: string, id: string }
  difficulty: { name: string, id: string }
  time: { value: number, id: string}
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

interface Actions {
  createExcercise: (exercise: ICreateExcercise) => Promise<IApiResponse | TResponseBasicError>
  getExercise: (id: string) => Promise<Exercise>
  getExerciseList: (tags: Tags[], category?: string, difficulty?: string) => Promise<Exercise[]>
  search: (query: string) => Promise<Exercise[]>

}

const useExcerciseStore = create<Actions>()(
  devtools(
    persist(
      () => ({
        createExcercise: async (exercise: ICreateExcercise) => {
          try {
            const response = await api.post('/api/v1/excercises', exercise, {
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

        getExercise: async (id: string) => {
          try {
            const response = await api.get(`/api/v1/excercises/${id}`)
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        },

        getExerciseList: async (tags: Tags[], category?: string, difficulty?: string) => {
          try {
            const response = await api.post('/api/v1/excercises/list', { tags, category, difficulty })
            return response.data
          } catch (error: any) {
            return error.response.data
          }
        },
        
        search: async (query: string) => {
          try {
            const response = await api.post(`/api/v1/excercises/search/${query}`)
            return response.data
          } catch (error: any) {
            console.error('Error searching exercises:', error)
            return []
          }
        }

      }),
      { name: 'exercise-store' }
    )
  )
)

export default useExcerciseStore