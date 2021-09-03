import axios, {AxiosResponse} from 'axios';
import {Book, NewBookRequest} from './types/types';

export const BASE_URL = `http://localhost:8080`;

export const getAllBooks = async (): Promise<Book[]> => {
    const response: AxiosResponse<Book[]> = await axios.get(`${BASE_URL}/books`);

    return response.data;
};

export const getBook = async (isbn: string): Promise<Book> => {
    const response: AxiosResponse<Book> = await axios.get(`${BASE_URL}/books/${isbn}`);
    return response.data;
};

export const createNewBook = async (newBook: NewBookRequest): Promise<Book> => {
    const response: AxiosResponse<Book> = await axios.post(`${BASE_URL}/books`, newBook);
    return response.data;
};

export const deleteBook = async (isbn: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/books/${isbn}`);
};

export const updateBook = async (isbn: string, book: Book): Promise<Book> => {
    const bookResponse = await axios.put(`${BASE_URL}/books/${isbn}`, {
        ...book,
    });
    return bookResponse.data;
};
