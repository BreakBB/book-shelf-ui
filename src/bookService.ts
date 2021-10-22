import axios, {AxiosResponse} from 'axios';
import {Book, NewBookRequest} from './types/types';

export const API_ROUTE = `/api`;

export const getAllBooks = async (): Promise<Book[]> => {
    const response: AxiosResponse<Book[]> = await axios.get(`${API_ROUTE}/books`);
    return response.data;
};

export const getBook = async (isbn: string): Promise<Book> => {
    const response: AxiosResponse<Book> = await axios.get(`${API_ROUTE}/books/${isbn}`);
    return response.data;
};

export const createNewBook = async (newBook: NewBookRequest): Promise<Book> => {
    const response: AxiosResponse<Book> = await axios.post(`${API_ROUTE}/books`, newBook);
    return response.data;
};

export const deleteBook = async (isbn: string): Promise<void> => {
    await axios.delete(`${API_ROUTE}/books/${isbn}`);
};

export const updateBook = async (isbn: string, book: Book): Promise<Book> => {
    const bookResponse = await axios.put(`${API_ROUTE}/books/${isbn}`, {
        ...book,
    });
    return bookResponse.data;
};
