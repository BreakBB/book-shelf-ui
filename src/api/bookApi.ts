import {AxiosResponse} from 'axios';
import {Book, NewBookRequest} from '../types/types';
import apiClient from './apiClient';

export const getAllBooks = async (): Promise<Book[]> => {
    const response: AxiosResponse<Book[]> = await apiClient.get('/books');
    return response.data;
};

export const getBook = async (isbn: string): Promise<Book> => {
    const response: AxiosResponse<Book> = await apiClient.get(`/books/${isbn}`);
    return response.data;
};

export const createNewBook = async (newBook: NewBookRequest): Promise<Book> => {
    const response: AxiosResponse<Book> = await apiClient.post(`/books`, newBook);
    return response.data;
};

export const deleteBook = async (isbn: string): Promise<void> => {
    await apiClient.delete(`/books/${isbn}`);
};

export const updateBook = async (isbn: string, book: Book): Promise<Book> => {
    const bookResponse = await apiClient.put(`/books/${isbn}`, {
        ...book,
    });
    return bookResponse.data;
};
