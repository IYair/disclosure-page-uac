import { ReactNode } from 'react'

/*
Input: None
Output: TypeScript types, enums, and interfaces for the ICPC disclosure platform frontend
Return value: Provides type definitions and constants for use throughout the frontend application
Function: This file centralizes all shared types, enums, and interfaces used for exercises, notes, news, tickets, reports, 
and UI components. It defines the structure of data exchanged between frontend and backend, as well as UI-related enums for 
text sizes and tags. This ensures type safety, consistency, and easier maintenance across the project.
Variables: enumTextSizes, enumTextTags, Option, Tags, Categories, Difficulties, TimeLimit, MemoryLimit, TicketType, TicketStatus, 
TicketOperation, News, Note, DBImage, Exercise, Quote, AllTabs, IProfileTableItem, Ticket, Report, and response types.
Date: 28 - 05 - 2025
Author: Mario Fernando Landa López
*/

// Enum for Tailwind CSS text sizes used in the UI
export enum enumTextSizes {
  s128 = 'text-9xl',
  s96 = 'text-8xl',
  s72 = 'text-7xl',
  s60 = 'text-6xl',
  s48 = 'text-5xl',
  s36 = 'text-4xl',
  s30 = 'text-3xl',
  s24 = 'text-2xl',
  s20 = 'text-xl',
  s18 = 'text-lg',
  s17 = 'text-[17px]',
  s16 = 'text-base',
  s14 = 'text-sm',
  s13 = 'text-[13px]',
  s12 = 'text-xs',
  s10 = 'text-[10px]',
  s11 = 'text-[11px]',
  s9 = 'text-[9px]',
  s8 = 'text-[8px]',
  s7 = '[7px]'
}

// Enum for HTML tags used in text components
export enum enumTextTags {
  h1 = 'h1',
  h2 = 'h2',
  h3 = 'h3',
  h4 = 'h4',
  h5 = 'h5',
  h6 = 'h6',
  p = 'p',
  span = 'span',
  label = 'label',
  a = 'a',
  ul = 'ul',
  li = 'li',
  div = 'div'
}

// Type for ReactNode children
type typeReactNode = ReactNode

// Interface for components that accept ReactNode children
export interface IReactNode {
  children?: typeReactNode
}

// Basic error response structure from backend
export type TResponseBasicError = {
  Code: number
  ResponseMessage: string
  StatusCode: number
  Success: boolean
}

// Detailed error response structure from backend
export type TResponseError = {
  ErrorCode: number
  ErrorMessage: string
  PropertyName: string
  AttemptedValue?: { [key: string]: string } | string | number | boolean
}

// Generic API response interface for backend communication
export interface IApiResponse<E = {}> {
  data: any
  rows?: number // total records in the current page
  totalRows?: number // total records in the database
  currentPage?: number // current page number
  totalPageRecords?: number // total records in the current page
  totalAvailablePages?: number // total number of available pages
  error: boolean
  statusCode: number | undefined
  message: string
  errors: E | TResponseError | any
}

// Option type for select/dropdown components
export interface Option {
  label: string
  value: string
}

// Tag entity used for exercises, notes, etc.
export interface Tags {
  id: string
  name: string
  color: string
}

// Category entity for exercises and notes
export interface Categories {
  id: string
  name: string
}

// Difficulty entity for exercises
export interface Difficulties {
  id: string
  level: number
  name: string
}

// Time limit entity for exercises
export interface TimeLimit {
  id: string
  timeLimit: number
}

// Memory limit entity for exercises
export interface MemoryLimit {
  id: string
  memoryLimit: number
}

// Enum for ticket types (used in moderation and change tracking)
export enum TicketType {
  EXERCISE = 'exercise',
  NOTE = 'note',
  NEWS = 'news',
  UTILS = 'utils',
  USER = 'user'
}

// Enum for ticket status
export enum TicketStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

// Enum for ticket operations
export enum TicketOperation {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete'
}

// News entity structure
export interface News {
  index: number
  id: string
  title: string
  body: string
  created_by: string
  created_at: string
  imageId: {
    id: string
  }
}

// Note entity structure
export interface Note {
  id: string
  title: string
  body: string
  isVisible: boolean
  tags: Tags[]
  category: Categories
  commentId: {
    id: string
    body: string
  }
}

// Image entity structure for database images
export interface DBImage {
  id: string
  assetName: string
  data: Buffer
}

// Exercise entity structure
export interface Exercise {
  id: string
  title: string
  description: string
  category: Categories
  difficulty: Difficulties
  time: TimeLimit
  memoryId: MemoryLimit
  input: string
  output: string
  example_input: string
  example_output: string
  constraints: string
  clue: string
  tags: Tags[]
  solution: string
  author: string
}

// Quote entity for motivational or informational quotes
export interface Quote {
  phrase: string
  author: string
}

// Object containing all tab names for navigation and UI
export const AllTabs = {
  EXERCISES: 'Ejercicios',
  NOTES: 'Apuntes',
  NEWS: 'Noticias',
  REPORTS: 'Reportes',
  CHANGES: 'Cambios',
  CATEGORIES: 'Categoría',
  TAGS: 'Etiqueta',
  TIME: 'Tiempo',
  MEMORY: 'Memoria',
  DIFFICULTY: 'Dificultad',
  ACCOUNT: 'Cuentas'
}

// Interface for items displayed in the user profile table
export interface IProfileTableItem {
  color?: string
  tagName?: string
  level?: number
  index: number
  id: string
  title: string
}

// Ticket entity for tracking changes, moderation, and history
export interface Ticket {
  id: string
  itemType: TicketType
  commentId: {
    id: string
    body: string
  }
  operation: TicketOperation
  originalExerciseId: Exercise
  modifiedExerciseId: Exercise
  originalNoteId: Note
  modifiedNoteId: Note
  originalNewsId: News
  modifiedNewsId: News
  status: TicketStatus
}

// Report entity for reporting issues or content
export interface Report {
  id: string
  summary: string
  report: string
  itemType: TicketType
  note: Note
  excercise: Exercise
  news: News
}