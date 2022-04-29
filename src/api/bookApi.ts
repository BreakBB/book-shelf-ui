import {AxiosResponse} from 'axios';
import {Book, NewBookRequest} from '../types/types';
import apiClient from './apiClient';

const bookApi = {
    getAllBooks: async (): Promise<Book[]> => {
        const response: AxiosResponse<Book[]> = await apiClient.get('/books');
        return response.data;
    },

    getBook: async (isbn: string): Promise<Book> => {
        const response: AxiosResponse<Book> = await apiClient.get(`/books/${isbn}`);
        return response.data;
    },

    createNewBook: async (newBook: NewBookRequest): Promise<Book> => {
        const response: AxiosResponse<Book> = await apiClient.post(`/books`, newBook);
        return response.data;
    },

    deleteBook: async (isbn: string): Promise<void> => {
        await apiClient.delete(`/books/${isbn}`);
    },

    updateBook: async (isbn: string, book: Book): Promise<Book> => {
        const bookResponse = await apiClient.put(`/books/${isbn}`, {
            ...book,
        });
        return bookResponse.data;
    },

    updateCover: async (isbn: string, cover: File): Promise<boolean> => {
        const formData = new FormData();
        formData.append('file', cover);
        try {
            await apiClient.post(`/covers/${isbn}`, formData);
            return true;
        } catch (e) {
            console.error('Failed to update cover', e);
        }
        return false;
    },
};

export default bookApi;
