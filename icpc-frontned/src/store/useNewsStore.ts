import axios from 'axios';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { IApiResponse, TResponseBasicError, News } from '@/constants/types';
import useAuthStore from './useStore';

/*
Input: None
Output: Zustand store for managing news-related state and API calls
Return value: Provides actions and state for creating, updating, retrieving, searching, and deleting news articles
Function: Centralizes all logic for interacting with the backend news endpoints, including authentication, CRUD operations, and 
state management for news in the frontend application
Variables: createNews, updateNews, getNews, getNewsArticle, search, getCount, deleteNews, news, newsCount
Date: 28 - 05 - 2025
Author: Mario Fernando Landa López
*/

// Axios instance configured with the API base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL // Sets the API base URL
});

// Interface for creating or updating a news article
interface ICreateNews {
  title: string;
  imageId: string;
  body: string;
  userAuthor: string;
  role: string;
}

// State interface for the news store
interface NewsState {
  news: News[];
  newsCount: number; // Stores the total count of news articles
}

// Actions available in the news store
interface Actions {
  createNews: (news: ICreateNews) => Promise<IApiResponse | TResponseBasicError>;
  getNews: (limit?: number) => Promise<News[]>;
  getNewsArticle: (id: string) => Promise<News>;
  search: (query: string) => Promise<News[]>;
  getCount: () => Promise<number>; // Gets the total count of news articles
  deleteNews: (id: string) => Promise<IApiResponse | TResponseBasicError>;
  updateNews: (news: ICreateNews, id: string) => Promise<IApiResponse | TResponseBasicError>;
}

// Zustand store definition for news
const useNewsStore = create<Actions & NewsState>()(
  devtools(
    persist(
      (set, get) => ({
        news: [],
        newsCount: 0, // Initializes the news count to 0

        // Create a new news article (POST)
        createNews: async (news: ICreateNews) => {
          try {
            const response = await api.post('/api/v1/news', news, {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}` // Uses the authorization token
              }
            });
            if (response.status === 201) {
              return response.data;
            }
          } catch (error: any) {
            return error.response?.data || { error: 'Error creating news' }; // Handles errors
          }
        },

        // Update an existing news article (PATCH)
        updateNews: async (news: ICreateNews, id: string) => {
          try {
            const response = await api.patch(`/api/v1/news/${id}`, news, {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}` // Uses the authorization token
              }
            });
            if (response.status === 200) {
              return response.data;
            }
          } catch (error: any) {
            return error.response?.data || { error: 'Error updating news' }; // Handles errors
          }
        },

        // Get a list of news articles, optionally limited by a number
        getNews: async (limit: number = 0): Promise<News[]> => {
          try {
            const response = await api.get('/api/v1/news');
            const newsResponse = response.data.map((news: News, index: number) => {
              return { ...news, index }; // Adds an index to each news article
            });
            const limitedNews = limit > 0 ? newsResponse.slice(0, limit) : newsResponse; // Limits the news list if needed
            set(() => ({ news: limitedNews })); // Updates the state
            return limitedNews;
          } catch (error: any) {
            return error.response?.data || []; // Handles errors
          }
        },

        // Get a single news article by ID
        getNewsArticle: async (id: string): Promise<News> => {
          try {
            const response = await api.get(`/api/v1/news/${id}`);
            return { ...response.data, index: 0 }; // Returns the specific news article
          } catch (error: any) {
            throw error.response?.data || new Error('Error getting news article'); // Handles errors
          }
        },

        // Search news articles by query string
        search: async (query: string): Promise<News[]> => {
          try {
            const response = await api.post(`/api/v1/news/search/${query}`);
            return response.data;
          } catch (error: any) {
            console.error('Error searching news:', error);
            return []; // Returns an empty list on error
          }
        },

        // Get the total count of news articles
        getCount: async (): Promise<number> => {
          try {
            const response = await api.get('/api/v1/news/count');
            const count = response.data || 0;
            set(() => ({ newsCount: count })); // Updates the count in the state
            return count;
          } catch (error: any) {
            console.error('Error getting news count:', error);
            return 0;
          }
        },

        // Delete a news article by ID (DELETE)
        deleteNews: async (id: string) => {
          try {
            const response = await api.delete(`/api/v1/news/${id}/${useAuthStore.getState().user?.id}`, {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`
              }
            });
            return response.data;
          } catch (error: any) {
            return error.response.data;
          }
        }
      }),
      { name: 'news-store' } // Name for persistence
    )
  )
);

export default useNewsStore;
