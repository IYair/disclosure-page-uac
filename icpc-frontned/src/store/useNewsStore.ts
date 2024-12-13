import axios from 'axios';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { IApiResponse, TResponseBasicError, News } from '@/constants/types';
import useAuthStore from './useStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL // Configura la URL base de la API
});

interface ICreateNews { // Interfaces para el estado y las acciones del store
  title: string;
  imageId: string;
  body: string;
  userAuthor: string;
  role: string;
}

interface NewsState {
  news: News[];
}

interface Actions {
  createNews: (news: ICreateNews) => Promise<IApiResponse | TResponseBasicError>
  getNews: (limit?: number) => Promise<News[]>
  getNewsArticle: (id: string) => Promise<News>
  search: (query: string) => Promise<News[]>
  
}

const useNewsStore = create<Actions & NewsState>()(
  devtools(
    persist(
      (set, get) => ({
        news: [],
        createNews: async (news: ICreateNews) => {
          try {
            const response = await api.post('/api/v1/news', news, {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}` // Usa el token de autorización
              }
            });
            if (response.status === 201) {
              return response.data;
            }
          } catch (error: any) {
            return error.response.data; // Maneja errores
          }
        },
        getNews: async (limit: number = 0): Promise<News[]> => {
          try {
            const response = await api.get('/api/v1/news');
            const newsResponse = response.data.map((news: News, index: number) => {
              return { ...news, index }; // Agrega un índice a cada noticia
            });
            const limitedNews = limit > 0 ? newsResponse.slice(0, limit) : newsResponse; // Limita las noticias según el parámetro
            set(() => ({ news: limitedNews })); // Actualiza el estado
            return limitedNews; // Retorna las noticias limitadas
          } catch (error: any) {
            return error.response.data; // Maneja errores
          }
        },
        getNewsArticle: async (id: string): Promise<News> => {
          try {
            const response = await api.get(`/api/v1/news/${id}`);
            return { ...response.data, index: 0 }; // Devuelve la noticia específica
          } catch (error: any) {
            return error.response.data; // Maneja errores
          }
        },
        search: async (query: string): Promise<News[]> => {
          try {
            const response = await api.post(`/api/v1/news/search/${query}`);
            return response.data;
          } catch (error: any) {
            if (error.response) {
              return error.response.data; // Maneja errores con respuesta del servidor
            } else {
              console.error('Error searching news:', error);
              return []; // Retorna una lista vacía en caso de error
            }
          }
        }
      }),
      { name: 'news-store' } // Nombre para persistencia
    )
  )
);

export default useNewsStore;
