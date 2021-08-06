import axios, { AxiosResponse } from 'axios';
import { Book, BookResponseData, NewBookRequest } from './types/types';
import { toBook, toBookRequest, transformReleaseDates } from './utils';

export const BASE_URL = `http://localhost:8080`;

export const getAllBooks = async (): Promise<Book[]> => {
    const response: AxiosResponse<BookResponseData[]> = await axios.get(`${BASE_URL}/books`);

    return transformReleaseDates(response.data);
};

export const getBook = async (isbn: string): Promise<Book> => {
    const response: AxiosResponse<BookResponseData> = await axios.get(`${BASE_URL}/books/${isbn}`);

    return toBook(response.data);
};

export const createNewBook = async (newBook: NewBookRequest): Promise<Book> => {
    const axiosResponse: AxiosResponse<BookResponseData> = await axios.post(`${BASE_URL}/books`, newBook);
    return toBook(axiosResponse.data);
};

export const deleteBook = async (isbn: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/books/${isbn}`);
};

export const updateBook = async (isbn: string, book: Book, handleBookUpdate: (Book) => void): Promise<void> => {
    const bookResponse = await axios.put(`${BASE_URL}/books/${isbn}`, {
        ...toBookRequest(book),
    });
    handleBookUpdate(toBook(bookResponse.data));
};
