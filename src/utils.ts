import { Book, BookResponseData, NewBookRequest } from './types/types';
import dayjs from 'dayjs';

export const toBook = (book: BookResponseData): Book => {
    return {
        ...book,
        releaseDate: dayjs(book.releaseDate),
    };
};

export const toBookRequest = (book: Book): NewBookRequest => {
    return {
        ...book,
        releaseDate: book.releaseDate.format('YYYY-MM-DD'),
    };
};

export const transformReleaseDates = (responseData: BookResponseData[]): Book[] => {
    return responseData.map((bookData): Book => {
        return toBook(bookData);
    });
};
